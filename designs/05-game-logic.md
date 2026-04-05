# Step 05 — Game Logic (Zustand Store)

**Goal:** มี store ที่ expose actions `plantTree / waterTree / resetActiveTree / checkinStreak` โดยทำงานถูกต้องตาม rules ของเกม + persist อัตโนมัติ

**Estimated time:** 1 วัน

---

## 5.1 Store Shape

```ts
// src/store/gameStore.ts
import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { PlayerState, TreeInstance, Rarity } from '@/types/game';
import { SPECIES, SPECIES_BY_RARITY } from '@/data/species';
import { saveStore } from './saveStore';
import { scheduleSave } from './debouncedSave';
import { createInitialState } from './initialState';
import { mulberry32, randInt, randPick, randSeed } from '@/engine/rng';
import { COOLDOWN_MS, MIN_WATERINGS, MAX_WATERINGS } from '@/config/constants';
import { todayLocalDate, isYesterday } from '@/lib/time';

interface GameStore {
  state: PlayerState;
  // Derived/view helpers
  canWater: () => boolean;
  nextWaterAt: () => number | null;
  uniqueSpeciesUnlocked: () => number;

  // Actions
  hydrate: () => Promise<void>;
  plantTree: () => TreeInstance;
  waterTree: () => { ok: boolean; harvested?: TreeInstance; nextAvailableAt?: number };
  resetActiveTree: () => void;          // Shovel: ยกเลิกต้นปัจจุบัน (collection ไม่กระทบ)
  checkinStreak: () => void;            // call on app open
  resetAllProgress: () => void;         // danger zone — settings only
}

export const useGameStore = create<GameStore>((set, get) => ({
  state: createInitialState(),

  // ── Derived ───────────────────────────────
  canWater: () => {
    const t = get().state.activeTree;
    if (!t) return false;
    if (t.lastWateredAt === null) return true;
    return Date.now() - t.lastWateredAt >= COOLDOWN_MS;
  },
  nextWaterAt: () => {
    const t = get().state.activeTree;
    if (!t?.lastWateredAt) return null;
    return t.lastWateredAt + COOLDOWN_MS;
  },
  uniqueSpeciesUnlocked: () => {
    const ids = new Set(get().state.collection.map(t => t.speciesId));
    return ids.size;
  },

  // ── Hydrate on app start ──────────────────
  hydrate: async () => {
    const loaded = await saveStore.load();
    if (loaded) set({ state: loaded });
    get().checkinStreak();
  },

  // ── Plant ─────────────────────────────────
  plantTree: () => {
    const current = get().state;
    if (current.activeTree) throw new Error('Already have an active tree');

    const rarity = rollRarity();
    const species = randPick(mulberry32(randSeed()), SPECIES_BY_RARITY[rarity]);
    const seed = randSeed();
    const required = randInt(mulberry32(seed ^ 0xABCDEF), MIN_WATERINGS, MAX_WATERINGS);

    const tree: TreeInstance = {
      id: nanoid(),
      seed,
      speciesId: species.id,
      rarity,
      requiredWaterings: required,
      currentWaterings: 0,
      plantedAt: Date.now(),
      lastWateredAt: null,
      harvestedAt: null,
    };

    const next: PlayerState = {
      ...current,
      activeTree: tree,
      stats: { ...current.stats, totalPlanted: current.stats.totalPlanted + 1 },
      updatedAt: Date.now(),
    };
    set({ state: next });
    scheduleSave(next);
    return tree;
  },

  // ── Water ─────────────────────────────────
  waterTree: () => {
    const s = get().state;
    const tree = s.activeTree;
    if (!tree) return { ok: false };

    const now = Date.now();
    if (tree.lastWateredAt && now - tree.lastWateredAt < COOLDOWN_MS) {
      return { ok: false, nextAvailableAt: tree.lastWateredAt + COOLDOWN_MS };
    }

    const nextWaterings = tree.currentWaterings + 1;
    const isHarvest = nextWaterings >= tree.requiredWaterings;

    let next: PlayerState;
    let harvested: TreeInstance | undefined;

    if (isHarvest) {
      harvested = {
        ...tree,
        currentWaterings: nextWaterings,
        lastWateredAt: now,
        harvestedAt: now,
      };
      next = {
        ...s,
        activeTree: null,
        collection: [...s.collection, harvested],
        stats: {
          ...s.stats,
          totalWatered: s.stats.totalWatered + 1,
          totalHarvested: s.stats.totalHarvested + 1,
        },
        updatedAt: now,
      };
    } else {
      next = {
        ...s,
        activeTree: { ...tree, currentWaterings: nextWaterings, lastWateredAt: now },
        stats: { ...s.stats, totalWatered: s.stats.totalWatered + 1 },
        updatedAt: now,
      };
    }

    set({ state: next });
    scheduleSave(next);
    return { ok: true, harvested };
  },

  // ── Reset active tree (shovel) ────────────
  resetActiveTree: () => {
    const s = get().state;
    if (!s.activeTree) return;
    const next: PlayerState = { ...s, activeTree: null, updatedAt: Date.now() };
    set({ state: next });
    scheduleSave(next);
  },

  // ── Daily streak check-in ─────────────────
  checkinStreak: () => {
    const s = get().state;
    const today = todayLocalDate();                // 'YYYY-MM-DD'
    if (s.streak.lastCheckinDate === today) return;

    const isConsecutive = isYesterday(s.streak.lastCheckinDate, today);
    const currentStreak = isConsecutive ? s.streak.currentStreak + 1 : 1;
    const longestStreak = Math.max(s.streak.longestStreak, currentStreak);

    const next: PlayerState = {
      ...s,
      streak: { currentStreak, longestStreak, lastCheckinDate: today },
      updatedAt: Date.now(),
    };
    set({ state: next });
    scheduleSave(next);
  },

  // ── Danger: full reset ────────────────────
  resetAllProgress: () => {
    const next = createInitialState();
    set({ state: next });
    saveStore.save(next).catch(console.error);
  },
}));

// ── Rarity roll ───────────────────────────────
function rollRarity(): Rarity {
  const r = Math.random();
  if (r < 0.03) return 'legendary';
  if (r < 0.25) return 'rare';
  return 'common';
}
```

## 5.2 Time Helpers (`src/lib/time.ts`)

```ts
export function todayLocalDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function isYesterday(prevDateStr: string, todayStr: string): boolean {
  if (!prevDateStr) return false;
  const today = new Date(todayStr + 'T00:00:00');
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const y = yesterday.getFullYear();
  const m = String(yesterday.getMonth() + 1).padStart(2, '0');
  const d = String(yesterday.getDate()).padStart(2, '0');
  return prevDateStr === `${y}-${m}-${d}`;
}

export function formatDuration(ms: number): string {
  if (ms <= 0) return 'Ready';
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
```

## 5.3 Usage in React Component (preview)

```tsx
import { useGameStore } from '@/store/gameStore';

function WaterButton() {
  const tree = useGameStore(s => s.state.activeTree);
  const canWater = useGameStore(s => s.canWater());
  const nextAt = useGameStore(s => s.nextWaterAt());
  const water = useGameStore(s => s.waterTree);

  if (!tree) return null;
  if (canWater) return <button onClick={() => water()}>รดน้ำ</button>;
  return <CountdownTimer until={nextAt!} />;
}
```

## 5.4 Auto-persist Strategy

- `scheduleSave` debounces writes 500 ms
- เขียน localStorage sync (fast, <1ms สำหรับ 60 KB)
- ตอน `beforeunload` → flush pending save immediately:
```ts
// src/main.tsx
window.addEventListener('beforeunload', () => {
  const state = useGameStore.getState().state;
  saveStore.save(state);
});
```

## 5.5 Edge Cases ที่ต้อง handle

| Case | Behavior |
|---|---|
| User กดรดน้ำรัวๆ | State มี debounce? → ไม่, แต่ `canWater()` จะ false หลังกดครั้งแรก → UI ปิดปุ่ม |
| ปิดแอปแล้วเปิดใหม่ระหว่าง cooldown | `lastWateredAt` เก็บใน save → re-calc เมื่อ hydrate |
| Corrupt save | `migrate` ล้มเหลว → fallback to `createInitialState()` + warn toast |
| Plant ตอนมี activeTree | throw error → UI ไม่ควรให้กดปุ่ม plant ถ้า activeTree != null |
| Reset active tree ตอนรดไปแล้ว 5 ครั้ง | ลบทิ้งไปเลย (ไม่เก็บใน collection) — stats.totalPlanted ไม่ลด |
| เปลี่ยน timezone | Streak อิง local date string → ถ้า user ข้ามเขต อาจเสียวัน (MVP ยอมรับ) |

## 5.6 Test Cases (step 09)

```ts
describe('gameStore', () => {
  it('plant creates active tree with valid fields', ...)
  it('water increments currentWaterings', ...)
  it('water during cooldown is rejected', ...)
  it('water fills to requiredWaterings triggers harvest', ...)
  it('harvest moves tree to collection and clears active', ...)
  it('resetActiveTree clears without affecting collection', ...)
  it('streak increments on consecutive days', ...)
  it('streak resets after skip day', ...)
});
```

## ✅ Definition of Done
- [ ] `useGameStore` expose state + 5 actions
- [ ] Hydrate from localStorage ตอน app start
- [ ] Plant → Water → Harvest flow ทำงาน end-to-end
- [ ] Cooldown 30 นาทีบังคับ
- [ ] `resetActiveTree` ลบแค่ active (collection คงเดิม)
- [ ] `checkinStreak` ทำงานถูกต้อง (today/yesterday/skip)
- [ ] Save persist อัตโนมัติ + flush on beforeunload
- [ ] Unit tests ครบ (step 09)

ถัดไป → [`06-rendering.md`](./06-rendering.md)
