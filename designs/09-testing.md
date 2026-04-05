# Step 09 — Testing & Quality

**Goal:** มี test suite ที่ครอบคลุม core logic + smoke e2e + deterministic tests สำหรับ tree gen

**Estimated time:** 1 วัน

---

## 9.1 Test Layers

| Layer | Tool | Target |
|---|---|---|
| Unit | Vitest | rng, lsystem, turtle, treeBuilder, gameStore, migrations, time helpers |
| Component | Vitest + RTL | Button, CountdownTimer, RarityBadge, ResetConfirmDialog |
| Integration | Vitest | gameStore ↔ saveStore round-trip, migration |
| E2E smoke | Playwright | plant → water → harvest happy path |
| Visual | Screenshot diff | (optional) tree render regression |

## 9.2 Vitest Config

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      thresholds: { lines: 75, functions: 75, statements: 75, branches: 70 },
    },
  },
});
```

`tests/setup.ts`:
```ts
import '@testing-library/jest-dom';
// Mock Three.js heavy modules ถ้าจำเป็น
```

## 9.3 Key Unit Tests

### `tests/unit/rng.test.ts`
```ts
import { mulberry32 } from '@/engine/rng';

describe('mulberry32', () => {
  it('is deterministic', () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    for (let i = 0; i < 100; i++) expect(a()).toBe(b());
  });
  it('differs for different seed', () => {
    const a = mulberry32(1), b = mulberry32(2);
    expect(a()).not.toBe(b());
  });
  it('stays in [0,1)', () => {
    const r = mulberry32(123);
    for (let i = 0; i < 1000; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});
```

### `tests/unit/treeBuilder.test.ts`
```ts
describe('buildTree determinism', () => {
  it('same (species, seed) → identical geometry counts', () => {
    const a = buildTree(0, 12345);
    const b = buildTree(0, 12345);
    expect(a.leafPositions.length).toBe(b.leafPositions.length);
    expect(a.leafPositions).toEqual(b.leafPositions);
  });
  it('different seeds → different geometry', () => {
    const a = buildTree(0, 1);
    const b = buildTree(0, 999);
    expect(a.leafPositions).not.toEqual(b.leafPositions);
  });
  it('all 300 species build without error', () => {
    for (let i = 0; i < 300; i++) expect(() => buildTree(i, 1)).not.toThrow();
  });
});
```

### `tests/unit/gameStore.test.ts`
```ts
import { useGameStore } from '@/store/gameStore';

beforeEach(() => {
  localStorage.clear();
  useGameStore.getState().resetAllProgress();
});

describe('plant', () => {
  it('creates active tree', () => {
    const tree = useGameStore.getState().plantTree();
    expect(useGameStore.getState().state.activeTree?.id).toBe(tree.id);
    expect(tree.requiredWaterings).toBeGreaterThanOrEqual(1);
    expect(tree.requiredWaterings).toBeLessThanOrEqual(10);
  });
  it('throws if active tree exists', () => {
    useGameStore.getState().plantTree();
    expect(() => useGameStore.getState().plantTree()).toThrow();
  });
});

describe('water', () => {
  it('first water always succeeds', () => {
    useGameStore.getState().plantTree();
    expect(useGameStore.getState().waterTree().ok).toBe(true);
  });
  it('water during cooldown rejected', () => {
    useGameStore.getState().plantTree();
    useGameStore.getState().waterTree();
    const r = useGameStore.getState().waterTree();
    expect(r.ok).toBe(false);
    expect(r.nextAvailableAt).toBeDefined();
  });
  it('filling to required triggers harvest', () => {
    // Set up deterministic tree with requiredWaterings = 1
    useGameStore.setState(s => ({
      state: {
        ...s.state,
        activeTree: {
          id: 't1', seed: 1, speciesId: 0, rarity: 'common',
          requiredWaterings: 1, currentWaterings: 0,
          plantedAt: Date.now(), lastWateredAt: null, harvestedAt: null,
        },
      },
    }));
    const r = useGameStore.getState().waterTree();
    expect(r.ok).toBe(true);
    expect(r.harvested).toBeDefined();
    expect(useGameStore.getState().state.activeTree).toBeNull();
    expect(useGameStore.getState().state.collection.length).toBe(1);
  });
});

describe('resetActiveTree', () => {
  it('clears active tree, keeps collection', () => {
    useGameStore.getState().plantTree();
    // harvest one to seed collection
    useGameStore.setState(s => ({
      state: { ...s.state, collection: [/* mock tree */] as any },
    }));
    useGameStore.getState().resetActiveTree();
    expect(useGameStore.getState().state.activeTree).toBeNull();
    expect(useGameStore.getState().state.collection.length).toBe(1);
  });
});
```

### `tests/unit/saveStore.test.ts`
```ts
describe('LocalSaveStore', () => {
  it('round-trip save → load', async () => {
    const store = new LocalSaveStore();
    const state = createInitialState();
    await store.save(state);
    const loaded = await store.load();
    expect(loaded?.userId).toBe(state.userId);
  });
  it('returns null when no save', async () => {
    localStorage.clear();
    expect(await new LocalSaveStore().load()).toBeNull();
  });
});
```

### `tests/unit/streak.test.ts`
```ts
describe('checkinStreak', () => {
  it('first checkin sets streak=1', () => {
    useGameStore.getState().checkinStreak();
    expect(useGameStore.getState().state.streak.currentStreak).toBe(1);
  });
  it('consecutive day increments', () => {
    useGameStore.setState(s => ({ state: {
      ...s.state,
      streak: { currentStreak: 3, longestStreak: 3, lastCheckinDate: /* yesterday */ },
    }}));
    useGameStore.getState().checkinStreak();
    expect(useGameStore.getState().state.streak.currentStreak).toBe(4);
  });
  it('skip day resets to 1', () => {
    // lastCheckinDate = 3 days ago
    useGameStore.getState().checkinStreak();
    expect(useGameStore.getState().state.streak.currentStreak).toBe(1);
  });
});
```

## 9.4 E2E Smoke (Playwright)

```ts
// tests/e2e/happy-path.spec.ts
import { test, expect } from '@playwright/test';

test('plant → water → harvest flow', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  // Plant
  await page.getByRole('button', { name: /เริ่มปลูก/ }).click();
  await expect(page.getByRole('button', { name: /รดน้ำ/ })).toBeVisible();

  // Force tree to require only 1 watering for test speed
  await page.evaluate(() => {
    const store = (window as any).__gameStore;
    store.setState((s: any) => ({
      state: { ...s.state, activeTree: { ...s.state.activeTree, requiredWaterings: 1 } },
    }));
  });

  // Water → harvest
  await page.getByRole('button', { name: /รดน้ำ/ }).click();
  await expect(page.getByRole('button', { name: /เริ่มปลูก/ })).toBeVisible();

  // Gallery shows 1 tree
  await page.locator('[aria-label="Gallery"]').click();
  await expect(page.getByText(/1\s*\/\s*300/)).toBeVisible();
});
```

Expose store สำหรับ test ใน dev build:
```ts
// src/main.tsx (dev only)
if (import.meta.env.DEV) (window as any).__gameStore = useGameStore;
```

## 9.5 CI

`.github/workflows/ci.yml` (optional):
```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter @florify/web lint
      - run: pnpm --filter @florify/web test
      - run: pnpm --filter @florify/web build
      - run: pnpm --filter @florify/web exec playwright install --with-deps
      - run: pnpm --filter @florify/web exec playwright test
```

## 9.6 Manual Test Checklist (pre-launch)

- [ ] Plant → refresh → active tree ยังอยู่
- [ ] Water ระหว่าง cooldown → ปุ่ม disabled + countdown แสดง
- [ ] Harvest → ต้นเข้า Gallery → gallery count +1
- [ ] Unique species counter ถูกต้อง (ปลูก common ซ้ำ 2 ต้น → ยังนับ 1 species)
- [ ] Shovel reset → active หายไป, collection ไม่กระทบ
- [ ] Open/close app → streak update ถูก
- [ ] Gallery detail view → orbit + zoom ทำงาน
- [ ] Offline mode (airplane mode) → เล่นต่อได้
- [ ] iOS Safari add-to-home-screen → standalone mode ไม่มี URL bar
- [ ] Lighthouse PWA ≥ 90, Performance ≥ 80 (mobile)

## ✅ Definition of Done
- [ ] `pnpm --filter @florify/web test` ผ่านทั้งหมด
- [ ] Coverage ≥ 75% lines บน core modules (engine/, store/)
- [ ] `pnpm --filter @florify/web exec playwright test` ผ่าน happy path
- [ ] 300 species build ได้ไม่มี error
- [ ] Manual checklist ผ่านทุกข้อ

ถัดไป → [`10-cloud-sync.md`](./10-cloud-sync.md)
