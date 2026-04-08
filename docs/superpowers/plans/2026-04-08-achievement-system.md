# Achievement System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a 94-achievement system with sprout rewards, toast notifications, claim flow, and a new Achievements tab inside the Florist Card.

**Architecture:** Achievement definitions are static data (like species). An event-bus subscriber checks conditions after every game action. Unlocked achievements are stored in PlayerState with claim timestamps. The Florist Card gets a Passport/Achievements tab bar. Schema migration v9→v10 adds new stats fields and backfills from existing data.

**Tech Stack:** React 19, Zustand, Vitest, TypeScript, Tailwind CSS 4

---

### Task 1: Types & Constants

**Files:**
- Modify: `packages/shared/src/types/game.ts`
- Modify: `packages/shared/src/config/constants.ts`

- [ ] **Step 1: Add achievement types to `packages/shared/src/types/game.ts`**

After the existing `ShopPurchases` interface (line 74), add:

```ts
// ── Achievement system ──────────────────────────────────────────────
export interface AchievementReward {
  type: 'sprouts';
  amount: number;
}

export type AchievementCondition =
  | { type: 'species_unlocked'; target: number }
  | { type: 'species_by_rarity'; rarity: Rarity; target: number }
  | { type: 'species_by_collection'; collection: string; target: number }
  | { type: 'harvest_total'; target: number }
  | { type: 'harvest_by_rarity'; rarity: Rarity; target: number }
  | { type: 'total_watered'; target: number }
  | { type: 'sprouts_gained'; target: number }
  | { type: 'sprouts_spent'; target: number }
  | { type: 'streak'; target: number }
  | { type: 'combo'; level: 10 | 15 | 20; target: number }
  | { type: 'seed_packets'; tier: 'total' | 'common' | 'rare' | 'legendary'; target: number };

export interface AchievementDef {
  id: string;
  name: string;
  description: { en: string; th: string };
  rewards: AchievementReward[];
  condition: AchievementCondition;
}

export interface AchievementProgress {
  unlockedAt: string;   // ISO date
  claimedAt?: string;   // ISO date — undefined = unclaimed
}
```

- [ ] **Step 2: Extend `PlayerStats` interface**

In `PlayerStats` (line 76-84), add 3 new fields after `shopPurchases`:

```ts
export interface PlayerStats {
  totalPlanted: number;
  totalWatered: number;
  totalHarvested: number;
  driedLeavesGained: number;
  sproutsGained: number;
  sproutsSpent: number;
  shopPurchases: ShopPurchases;
  // Achievement tracking — new in schema v10
  harvestByRarity: { common: number; rare: number; legendary: number };
  comboCount: { combo10: number; combo15: number; combo20: number };
  seedPacketsOpened: { total: number; common: number; rare: number; legendary: number };
}
```

- [ ] **Step 3: Add `achievements` field to `PlayerState`**

In `PlayerState` (line 86-101), add after `dailyMissions`:

```ts
  achievements: Record<string, AchievementProgress>;
```

- [ ] **Step 4: Bump `schemaVersion` type literal**

Change `schemaVersion: 9` to `schemaVersion: 10` in `PlayerState`.

- [ ] **Step 5: Bump `SCHEMA_VERSION` constant**

In `packages/shared/src/config/constants.ts` line 1, change:

```ts
export const SCHEMA_VERSION = 10 as const;
```

- [ ] **Step 6: Export new types from shared package**

Ensure `AchievementDef`, `AchievementCondition`, `AchievementReward`, `AchievementProgress` are exported from the shared package's barrel file (if one exists) or directly importable.

- [ ] **Step 7: Commit**

```bash
git add packages/shared/src/types/game.ts packages/shared/src/config/constants.ts
git commit -m "feat(shared): add achievement types and bump schema to v10"
```

---

### Task 2: Schema Migration v9 → v10

**Files:**
- Modify: `apps/web/src/store/migrations.ts`
- Modify: `apps/web/src/store/initialState.ts`
- Test: `apps/web/tests/unit/gameStore.test.ts`

- [ ] **Step 1: Write failing test for migration**

Add to `apps/web/tests/unit/gameStore.test.ts`:

```ts
describe('migrate v9 → v10', () => {
  it('adds achievement fields and backfills harvestByRarity from collection', () => {
    const v9State = {
      ...createInitialState(),
      schemaVersion: 9,
      collection: [
        mockCollected({ speciesId: 0, rarity: 'common', count: 5 }),
        mockCollected({ speciesId: 1, rarity: 'common', count: 3 }),
        mockCollected({ speciesId: 100, rarity: 'rare', count: 2 }),
        mockCollected({ speciesId: 200, rarity: 'legendary', count: 1 }),
      ],
      stats: {
        totalPlanted: 10,
        totalWatered: 100,
        totalHarvested: 11,
        driedLeavesGained: 5,
        sproutsGained: 50,
        sproutsSpent: 20,
        shopPurchases: { common: 3, rare: 1, legendary: 0 },
      },
    };

    const migrated = migrate(v9State as unknown as { schemaVersion: number } & Record<string, unknown>);

    expect(migrated.schemaVersion).toBe(10);
    expect(migrated.achievements).toEqual({});
    expect(migrated.stats.harvestByRarity).toEqual({ common: 8, rare: 2, legendary: 1 });
    expect(migrated.stats.comboCount).toEqual({ combo10: 0, combo15: 0, combo20: 0 });
    expect(migrated.stats.seedPacketsOpened).toEqual({ total: 4, common: 3, rare: 1, legendary: 0 });
  });

  it('handles empty collection gracefully', () => {
    const v9State = {
      ...createInitialState(),
      schemaVersion: 9,
      collection: [],
      stats: {
        totalPlanted: 0, totalWatered: 0, totalHarvested: 0,
        driedLeavesGained: 0, sproutsGained: 0, sproutsSpent: 0,
        shopPurchases: { common: 0, rare: 0, legendary: 0 },
      },
    };

    const migrated = migrate(v9State as unknown as { schemaVersion: number } & Record<string, unknown>);

    expect(migrated.stats.harvestByRarity).toEqual({ common: 0, rare: 0, legendary: 0 });
    expect(migrated.stats.seedPacketsOpened).toEqual({ total: 0, common: 0, rare: 0, legendary: 0 });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/web && pnpm vitest run tests/unit/gameStore.test.ts --reporter=verbose`
Expected: FAIL — migration function doesn't exist yet.

- [ ] **Step 3: Add migration function in `apps/web/src/store/migrations.ts`**

Add the migration chain step (after line 19):

```ts
  if (s.schemaVersion === 9) s = migrateV9toV10(s);
```

Add the migration function at the end of file:

```ts
// v9 → v10: add achievement system — new stats fields + achievements map.
// Backfill harvestByRarity from collection, seedPacketsOpened from shopPurchases.
function migrateV9toV10(s: UnknownState): UnknownState {
  const stats = (s.stats ?? {}) as Record<string, unknown>;
  const shopPurchases = (stats.shopPurchases ?? { common: 0, rare: 0, legendary: 0 }) as {
    common: number; rare: number; legendary: number;
  };
  const collection = (s.collection ?? []) as Array<{ rarity: Rarity; count: number }>;

  // Backfill harvestByRarity by summing collection counts per rarity
  const harvestByRarity = { common: 0, rare: 0, legendary: 0 };
  for (const entry of collection) {
    if (entry.rarity in harvestByRarity) {
      harvestByRarity[entry.rarity] += entry.count;
    }
  }

  // Backfill seedPacketsOpened from shopPurchases (purchases = opens)
  const seedPacketsOpened = {
    total: shopPurchases.common + shopPurchases.rare + shopPurchases.legendary,
    common: shopPurchases.common,
    rare: shopPurchases.rare,
    legendary: shopPurchases.legendary,
  };

  return {
    ...s,
    schemaVersion: 10,
    achievements: {},
    stats: {
      ...stats,
      harvestByRarity,
      comboCount: { combo10: 0, combo15: 0, combo20: 0 },
      seedPacketsOpened,
    },
  };
}
```

- [ ] **Step 4: Update `createInitialState` in `apps/web/src/store/initialState.ts`**

Add the new fields to the initial stats and add `achievements`:

```ts
stats: {
  totalPlanted: 0, totalWatered: 0, totalHarvested: 0,
  driedLeavesGained: 0, sproutsGained: 0, sproutsSpent: 0,
  shopPurchases: { common: 0, rare: 0, legendary: 0 },
  harvestByRarity: { common: 0, rare: 0, legendary: 0 },
  comboCount: { combo10: 0, combo15: 0, combo20: 0 },
  seedPacketsOpened: { total: 0, common: 0, rare: 0, legendary: 0 },
},
// ...
achievements: {},
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd apps/web && pnpm vitest run tests/unit/gameStore.test.ts --reporter=verbose`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/store/migrations.ts apps/web/src/store/initialState.ts apps/web/tests/unit/gameStore.test.ts
git commit -m "feat: add schema migration v9→v10 with achievement fields and backfill"
```

---

### Task 3: Achievement Definitions

**Files:**
- Create: `apps/web/src/data/achievements.ts`

- [ ] **Step 1: Create achievement definitions file**

Create `apps/web/src/data/achievements.ts` with all 94 achievement definitions. The file exports a single `ACHIEVEMENTS` array and a `ACHIEVEMENTS_BY_ID` map.

```ts
import type { AchievementDef } from '@florify/shared';

export const ACHIEVEMENTS: readonly AchievementDef[] = [
  // ── Collection: Rank Milestones ────────────────────────────────────
  {
    id: 'collect_rank_1',
    name: '🌱 Seedling Steps',
    description: { en: 'Unlock 20 species', th: 'ปลดล็อค 20 สายพันธุ์' },
    rewards: [{ type: 'sprouts', amount: 50 }],
    condition: { type: 'species_unlocked', target: 20 },
  },
  {
    id: 'collect_rank_2',
    name: '📗 Apprentice Botanist',
    description: { en: 'Unlock 75 species', th: 'ปลดล็อค 75 สายพันธุ์' },
    rewards: [{ type: 'sprouts', amount: 200 }],
    condition: { type: 'species_unlocked', target: 75 },
  },
  {
    id: 'collect_rank_3',
    name: '🌳 Gardener\'s Pride',
    description: { en: 'Unlock 150 species', th: 'ปลดล็อค 150 สายพันธุ์' },
    rewards: [{ type: 'sprouts', amount: 500 }],
    condition: { type: 'species_unlocked', target: 150 },
  },
  {
    id: 'collect_rank_4',
    name: '👑 Master Cultivator',
    description: { en: 'Unlock 250 species', th: 'ปลดล็อค 250 สายพันธุ์' },
    rewards: [{ type: 'sprouts', amount: 1000 }],
    condition: { type: 'species_unlocked', target: 250 },
  },

  // ── Collection: Common ──────────────────────────────────────────────
  {
    id: 'collect_common_10',
    name: '🌼 Common Starter',
    description: { en: 'Collect 10 common species', th: 'สะสม 10 สายพันธุ์ธรรมดา' },
    rewards: [{ type: 'sprouts', amount: 20 }],
    condition: { type: 'species_by_rarity', rarity: 'common', target: 10 },
  },
  {
    id: 'collect_common_50',
    name: '🌼 Common Collector',
    description: { en: 'Collect 50 common species', th: 'สะสม 50 สายพันธุ์ธรรมดา' },
    rewards: [{ type: 'sprouts', amount: 100 }],
    condition: { type: 'species_by_rarity', rarity: 'common', target: 50 },
  },
  {
    id: 'collect_common_100',
    name: '🌼 Common Enthusiast',
    description: { en: 'Collect 100 common species', th: 'สะสม 100 สายพันธุ์ธรรมดา' },
    rewards: [{ type: 'sprouts', amount: 300 }],
    condition: { type: 'species_by_rarity', rarity: 'common', target: 100 },
  },
  {
    id: 'collect_common_200',
    name: '🌼 Common Completionist',
    description: { en: 'Collect 200 common species', th: 'สะสม 200 สายพันธุ์ธรรมดา' },
    rewards: [{ type: 'sprouts', amount: 1000 }],
    condition: { type: 'species_by_rarity', rarity: 'common', target: 200 },
  },

  // ── Collection: Rare ────────────────────────────────────────────────
  {
    id: 'collect_rare_10',
    name: '💎 Rare Finder',
    description: { en: 'Collect 10 rare species', th: 'สะสม 10 สายพันธุ์หายาก' },
    rewards: [{ type: 'sprouts', amount: 50 }],
    condition: { type: 'species_by_rarity', rarity: 'rare', target: 10 },
  },
  {
    id: 'collect_rare_50',
    name: '💎 Rare Connoisseur',
    description: { en: 'Collect 50 rare species', th: 'สะสม 50 สายพันธุ์หายาก' },
    rewards: [{ type: 'sprouts', amount: 300 }],
    condition: { type: 'species_by_rarity', rarity: 'rare', target: 50 },
  },

  // ── Collection: Legendary ───────────────────────────────────────────
  {
    id: 'collect_legend_5',
    name: '⭐ Lucky Star',
    description: { en: 'Collect 5 legendary species', th: 'สะสม 5 สายพันธุ์ตำนาน' },
    rewards: [{ type: 'sprouts', amount: 100 }],
    condition: { type: 'species_by_rarity', rarity: 'legendary', target: 5 },
  },
  {
    id: 'collect_legend_10',
    name: '⭐ Stargazer',
    description: { en: 'Collect 10 legendary species', th: 'สะสม 10 สายพันธุ์ตำนาน' },
    rewards: [{ type: 'sprouts', amount: 300 }],
    condition: { type: 'species_by_rarity', rarity: 'legendary', target: 10 },
  },
  {
    id: 'collect_legend_20',
    name: '⭐ Celestial Garden',
    description: { en: 'Collect 20 legendary species', th: 'สะสม 20 สายพันธุ์ตำนาน' },
    rewards: [{ type: 'sprouts', amount: 1000 }],
    condition: { type: 'species_by_rarity', rarity: 'legendary', target: 20 },
  },

  // ── Collection: Sets ────────────────────────────────────────────────
  {
    id: 'set_original_10',
    name: '🌸 Original Explorer',
    description: { en: 'Collect 10 Original flora', th: 'สะสม 10 ดอกไม้ Original' },
    rewards: [{ type: 'sprouts', amount: 20 }],
    condition: { type: 'species_by_collection', collection: 'original', target: 10 },
  },
  {
    id: 'set_original_50',
    name: '🌸 Original Collector',
    description: { en: 'Collect 50 Original flora', th: 'สะสม 50 ดอกไม้ Original' },
    rewards: [{ type: 'sprouts', amount: 100 }],
    condition: { type: 'species_by_collection', collection: 'original', target: 50 },
  },
  {
    id: 'set_original_100',
    name: '🌸 Original Enthusiast',
    description: { en: 'Collect 100 Original flora', th: 'สะสม 100 ดอกไม้ Original' },
    rewards: [{ type: 'sprouts', amount: 300 }],
    condition: { type: 'species_by_collection', collection: 'original', target: 100 },
  },
  {
    id: 'set_original_200',
    name: '🌸 Original Devotee',
    description: { en: 'Collect 200 Original flora', th: 'สะสม 200 ดอกไม้ Original' },
    rewards: [{ type: 'sprouts', amount: 1000 }],
    condition: { type: 'species_by_collection', collection: 'original', target: 200 },
  },
  {
    id: 'set_original_300',
    name: '🌸 Original Completionist',
    description: { en: 'Collect all 300 Original flora', th: 'สะสม 300 ดอกไม้ Original ครบ' },
    rewards: [{ type: 'sprouts', amount: 5000 }],
    condition: { type: 'species_by_collection', collection: 'original', target: 300 },
  },
  {
    id: 'set_chinese_5',
    name: '🏮 Chinese Garden Master',
    description: { en: 'Collect all 5 Chinese Garden flora', th: 'สะสม 5 ดอกไม้สวนจีนครบ' },
    rewards: [{ type: 'sprouts', amount: 500 }],
    condition: { type: 'species_by_collection', collection: 'chinese-garden', target: 5 },
  },
  {
    id: 'set_abyssal_10',
    name: '🌑 Abyssal Explorer',
    description: { en: 'Collect 10 Abyssal Garden flora', th: 'สะสม 10 ดอกไม้สวนเหว' },
    rewards: [{ type: 'sprouts', amount: 100 }],
    condition: { type: 'species_by_collection', collection: 'abyssal-garden', target: 10 },
  },
  {
    id: 'set_abyssal_20',
    name: '🌑 Abyssal Diver',
    description: { en: 'Collect 20 Abyssal Garden flora', th: 'สะสม 20 ดอกไม้สวนเหว' },
    rewards: [{ type: 'sprouts', amount: 300 }],
    condition: { type: 'species_by_collection', collection: 'abyssal-garden', target: 20 },
  },

  // ── Harvest: Total ──────────────────────────────────────────────────
  {
    id: 'harvest_total_10',
    name: '🌾 First Harvest',
    description: { en: 'Harvest 10 flora', th: 'เก็บเกี่ยว 10 ต้น' },
    rewards: [{ type: 'sprouts', amount: 10 }],
    condition: { type: 'harvest_total', target: 10 },
  },
  {
    id: 'harvest_total_50',
    name: '🌾 Budding Farmer',
    description: { en: 'Harvest 50 flora', th: 'เก็บเกี่ยว 50 ต้น' },
    rewards: [{ type: 'sprouts', amount: 50 }],
    condition: { type: 'harvest_total', target: 50 },
  },
  {
    id: 'harvest_total_100',
    name: '🌾 Harvest Moon',
    description: { en: 'Harvest 100 flora', th: 'เก็บเกี่ยว 100 ต้น' },
    rewards: [{ type: 'sprouts', amount: 100 }],
    condition: { type: 'harvest_total', target: 100 },
  },
  {
    id: 'harvest_total_200',
    name: '🌾 Golden Harvest',
    description: { en: 'Harvest 200 flora', th: 'เก็บเกี่ยว 200 ต้น' },
    rewards: [{ type: 'sprouts', amount: 200 }],
    condition: { type: 'harvest_total', target: 200 },
  },
  {
    id: 'harvest_total_500',
    name: '🌾 Harvest Festival',
    description: { en: 'Harvest 500 flora', th: 'เก็บเกี่ยว 500 ต้น' },
    rewards: [{ type: 'sprouts', amount: 500 }],
    condition: { type: 'harvest_total', target: 500 },
  },
  {
    id: 'harvest_total_1000',
    name: '🌾 Eternal Harvest',
    description: { en: 'Harvest 1,000 flora', th: 'เก็บเกี่ยว 1,000 ต้น' },
    rewards: [{ type: 'sprouts', amount: 1000 }],
    condition: { type: 'harvest_total', target: 1000 },
  },

  // ── Harvest: By Rarity (Common) ────────────────────────────────────
  ...([10, 50, 100, 200, 500, 1000] as const).map((n) => ({
    id: `harvest_common_${n}`,
    name: `🌼 Common Reaper ${n}`,
    description: { en: `Harvest ${n.toLocaleString()} common flora`, th: `เก็บเกี่ยวดอกไม้ธรรมดา ${n.toLocaleString()} ต้น` },
    rewards: [{ type: 'sprouts' as const, amount: n <= 10 ? 10 : n <= 50 ? 50 : n <= 100 ? 100 : n <= 200 ? 200 : n <= 500 ? 500 : 1000 }],
    condition: { type: 'harvest_by_rarity' as const, rarity: 'common' as const, target: n },
  })),

  // ── Harvest: By Rarity (Rare) ──────────────────────────────────────
  ...([10, 50, 100, 200, 500, 1000] as const).map((n) => ({
    id: `harvest_rare_${n}`,
    name: `💎 Rare Reaper ${n}`,
    description: { en: `Harvest ${n.toLocaleString()} rare flora`, th: `เก็บเกี่ยวดอกไม้หายาก ${n.toLocaleString()} ต้น` },
    rewards: [{ type: 'sprouts' as const, amount: n <= 10 ? 30 : n <= 50 ? 150 : n <= 100 ? 300 : n <= 200 ? 600 : n <= 500 ? 1500 : 3000 }],
    condition: { type: 'harvest_by_rarity' as const, rarity: 'rare' as const, target: n },
  })),

  // ── Harvest: By Rarity (Legendary) ─────────────────────────────────
  ...([10, 50, 100, 200, 500, 1000] as const).map((n) => ({
    id: `harvest_legend_${n}`,
    name: `⭐ Legend Reaper ${n}`,
    description: { en: `Harvest ${n.toLocaleString()} legendary flora`, th: `เก็บเกี่ยวดอกไม้ตำนาน ${n.toLocaleString()} ต้น` },
    rewards: [{ type: 'sprouts' as const, amount: n <= 10 ? 100 : n <= 50 ? 500 : n <= 100 ? 1000 : n <= 200 ? 2000 : n <= 500 ? 5000 : 10000 }],
    condition: { type: 'harvest_by_rarity' as const, rarity: 'legendary' as const, target: n },
  })),

  // ── Watering ────────────────────────────────────────────────────────
  {
    id: 'water_1000',
    name: '💧 Drizzle',
    description: { en: 'Water 1,000 times', th: 'รดน้ำ 1,000 ครั้ง' },
    rewards: [{ type: 'sprouts', amount: 50 }],
    condition: { type: 'total_watered', target: 1000 },
  },
  {
    id: 'water_5000',
    name: '💧 Steady Stream',
    description: { en: 'Water 5,000 times', th: 'รดน้ำ 5,000 ครั้ง' },
    rewards: [{ type: 'sprouts', amount: 200 }],
    condition: { type: 'total_watered', target: 5000 },
  },
  {
    id: 'water_10000',
    name: '💧 Rainfall',
    description: { en: 'Water 10,000 times', th: 'รดน้ำ 10,000 ครั้ง' },
    rewards: [{ type: 'sprouts', amount: 500 }],
    condition: { type: 'total_watered', target: 10000 },
  },
  {
    id: 'water_100000',
    name: '💧 Monsoon',
    description: { en: 'Water 100,000 times', th: 'รดน้ำ 100,000 ครั้ง' },
    rewards: [{ type: 'sprouts', amount: 2000 }],
    condition: { type: 'total_watered', target: 100000 },
  },
  {
    id: 'water_1000000',
    name: '💧 Ocean',
    description: { en: 'Water 1,000,000 times', th: 'รดน้ำ 1,000,000 ครั้ง' },
    rewards: [{ type: 'sprouts', amount: 10000 }],
    condition: { type: 'total_watered', target: 1000000 },
  },

  // ── Sprout Economy: Gained ──────────────────────────────────────────
  ...([500, 1000, 5000, 10000, 100000, 1000000] as const).map((n, i) => ({
    id: `sprout_gain_${n}`,
    name: ['🌱 Penny Sprout', '🌱 Growing Fund', '🌱 Sprouting Rich', '🌱 Sprout Baron', '🌱 Sprout Tycoon', '🌱 Sprout Mogul'][i],
    description: { en: `Earn ${n.toLocaleString()} sprouts total`, th: `ได้รับ 🌱 รวม ${n.toLocaleString()}` },
    rewards: [{ type: 'sprouts' as const, amount: [50, 100, 300, 500, 2000, 5000][i] }],
    condition: { type: 'sprouts_gained' as const, target: n },
  })),

  // ── Sprout Economy: Spent ───────────────────────────────────────────
  ...([500, 1000, 5000, 10000, 100000, 1000000] as const).map((n, i) => ({
    id: `sprout_spend_${n}`,
    name: ['💸 Window Shopper', '💸 Casual Buyer', '💸 Big Spender', '💸 Shopaholic', '💸 Sprout Whale', '💸 Sprout Overlord'][i],
    description: { en: `Spend ${n.toLocaleString()} sprouts total`, th: `ใช้ 🌱 รวม ${n.toLocaleString()}` },
    rewards: [{ type: 'sprouts' as const, amount: [50, 100, 300, 500, 2000, 5000][i] }],
    condition: { type: 'sprouts_spent' as const, target: n },
  })),

  // ── Streaks ─────────────────────────────────────────────────────────
  {
    id: 'streak_7',
    name: '🔥 Week Warrior',
    description: { en: '7-day streak', th: 'เข้าเล่นติดต่อกัน 7 วัน' },
    rewards: [{ type: 'sprouts', amount: 50 }],
    condition: { type: 'streak', target: 7 },
  },
  {
    id: 'streak_14',
    name: '🔥 Fortnight Flora',
    description: { en: '14-day streak', th: 'เข้าเล่นติดต่อกัน 14 วัน' },
    rewards: [{ type: 'sprouts', amount: 100 }],
    condition: { type: 'streak', target: 14 },
  },
  {
    id: 'streak_30',
    name: '🔥 Monthly Devotion',
    description: { en: '30-day streak', th: 'เข้าเล่นติดต่อกัน 30 วัน' },
    rewards: [{ type: 'sprouts', amount: 300 }],
    condition: { type: 'streak', target: 30 },
  },
  {
    id: 'streak_90',
    name: '🔥 Seasonal Spirit',
    description: { en: '90-day streak', th: 'เข้าเล่นติดต่อกัน 90 วัน' },
    rewards: [{ type: 'sprouts', amount: 1000 }],
    condition: { type: 'streak', target: 90 },
  },
  {
    id: 'streak_365',
    name: '🔥 Eternal Flame',
    description: { en: '365-day streak', th: 'เข้าเล่นติดต่อกัน 365 วัน' },
    rewards: [{ type: 'sprouts', amount: 5000 }],
    condition: { type: 'streak', target: 365 },
  },

  // ── Combos ──────────────────────────────────────────────────────────
  ...([10, 15, 20] as const).flatMap((level) =>
    ([100, 200, 500, 1000] as const).map((n, i) => ({
      id: `combo${level}_${n}`,
      name: `⚡ ${level === 10 ? 'Combo' : level === 15 ? 'Surge' : 'Thunder'} ${['Starter', 'Regular', 'Veteran', 'Master'][i]}`,
      description: {
        en: `Hit ${level}x combo ${n.toLocaleString()} times`,
        th: `ทำ Combo ${level}x สะสม ${n.toLocaleString()} ครั้ง`,
      },
      rewards: [{ type: 'sprouts' as const, amount:
        level === 10 ? [50, 100, 200, 500][i] :
        level === 15 ? [100, 200, 500, 1000][i] :
        [200, 500, 1000, 2000][i]
      }],
      condition: { type: 'combo' as const, level, target: n },
    }))
  ),

  // ── Seed Packets: Total ─────────────────────────────────────────────
  ...([1, 10, 50, 100, 500] as const).map((n, i) => ({
    id: `seedpacket_total_${n}`,
    name: ['🎁 First Unboxing', '🎁 Pack Opener', '🎁 Pack Enthusiast', '🎁 Pack Collector', '🎁 Pack Addict'][i],
    description: { en: `Open ${n.toLocaleString()} seed packet${n > 1 ? 's' : ''}`, th: `เปิดซองเมล็ดพันธุ์ ${n.toLocaleString()} ซอง` },
    rewards: [{ type: 'sprouts' as const, amount: [10, 50, 200, 500, 2000][i] }],
    condition: { type: 'seed_packets' as const, tier: 'total' as const, target: n },
  })),

  // ── Seed Packets: Common ────────────────────────────────────────────
  ...([1, 10, 50, 100] as const).map((n, i) => ({
    id: `seedpacket_common_${n}`,
    name: ['🌼 Common Unboxing', '🌼 Common Pack Fan', '🌼 Common Pack Pro', '🌼 Common Pack Master'][i],
    description: { en: `Open ${n.toLocaleString()} common packet${n > 1 ? 's' : ''}`, th: `เปิดซองธรรมดา ${n.toLocaleString()} ซอง` },
    rewards: [{ type: 'sprouts' as const, amount: [10, 50, 200, 500][i] }],
    condition: { type: 'seed_packets' as const, tier: 'common' as const, target: n },
  })),

  // ── Seed Packets: Rare ──────────────────────────────────────────────
  ...([1, 10, 50] as const).map((n, i) => ({
    id: `seedpacket_rare_${n}`,
    name: ['💎 Rare Unboxing', '💎 Rare Pack Fan', '💎 Rare Pack Pro'][i],
    description: { en: `Open ${n.toLocaleString()} rare packet${n > 1 ? 's' : ''}`, th: `เปิดซองหายาก ${n.toLocaleString()} ซอง` },
    rewards: [{ type: 'sprouts' as const, amount: [20, 100, 500][i] }],
    condition: { type: 'seed_packets' as const, tier: 'rare' as const, target: n },
  })),

  // ── Seed Packets: Legendary ─────────────────────────────────────────
  ...([1, 10, 50] as const).map((n, i) => ({
    id: `seedpacket_legendary_${n}`,
    name: ['⭐ Legendary Unboxing', '⭐ Legendary Pack Fan', '⭐ Legendary Pack Pro'][i],
    description: { en: `Open ${n.toLocaleString()} legendary packet${n > 1 ? 's' : ''}`, th: `เปิดซองตำนาน ${n.toLocaleString()} ซอง` },
    rewards: [{ type: 'sprouts' as const, amount: [50, 300, 1500][i] }],
    condition: { type: 'seed_packets' as const, tier: 'legendary' as const, target: n },
  })),
] as const;

/** Fast lookup by id. */
export const ACHIEVEMENTS_BY_ID = new Map(ACHIEVEMENTS.map((a) => [a.id, a]));
```

- [ ] **Step 2: Verify the file compiles**

Run: `cd apps/web && npx tsc --noEmit --pretty 2>&1 | head -30`
Expected: No errors related to achievements.ts

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/data/achievements.ts
git commit -m "feat: add 94 achievement definitions"
```

---

### Task 4: Achievement Checker Logic

**Files:**
- Create: `apps/web/src/store/achievementChecker.ts`
- Test: `apps/web/tests/unit/achievementChecker.test.ts`

- [ ] **Step 1: Write failing tests**

Create `apps/web/tests/unit/achievementChecker.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { checkAchievements } from '@/store/achievementChecker';
import { createInitialState } from '@/store/initialState';
import type { PlayerState } from '@florify/shared';

function stateWith(overrides: Partial<PlayerState>): PlayerState {
  return { ...createInitialState(), ...overrides } as PlayerState;
}

describe('checkAchievements', () => {
  it('returns empty array when no conditions are met', () => {
    const state = stateWith({});
    const unlocked = checkAchievements(state);
    expect(unlocked).toEqual([]);
  });

  it('unlocks species_unlocked achievement when collection reaches target', () => {
    const collection = Array.from({ length: 20 }, (_, i) => ({
      speciesId: i, rarity: 'common' as const, count: 1,
      totalWaterings: 10, firstHarvestedAt: 0, lastHarvestedAt: 0,
    }));
    const state = stateWith({ collection });
    const unlocked = checkAchievements(state);
    expect(unlocked.map((a) => a.id)).toContain('collect_rank_1');
  });

  it('skips already-unlocked achievements', () => {
    const collection = Array.from({ length: 20 }, (_, i) => ({
      speciesId: i, rarity: 'common' as const, count: 1,
      totalWaterings: 10, firstHarvestedAt: 0, lastHarvestedAt: 0,
    }));
    const state = stateWith({
      collection,
      achievements: { collect_rank_1: { unlockedAt: '2026-01-01' } },
    });
    const unlocked = checkAchievements(state);
    expect(unlocked.map((a) => a.id)).not.toContain('collect_rank_1');
  });

  it('unlocks harvest_by_rarity achievement', () => {
    const state = stateWith({
      stats: {
        ...createInitialState().stats,
        harvestByRarity: { common: 10, rare: 0, legendary: 0 },
      },
    });
    const unlocked = checkAchievements(state);
    expect(unlocked.map((a) => a.id)).toContain('harvest_common_10');
  });

  it('unlocks streak achievement based on longestStreak', () => {
    const state = stateWith({
      streak: { currentStreak: 3, longestStreak: 7, lastCheckinDate: '', lastRewardDate: '' },
    });
    const unlocked = checkAchievements(state);
    expect(unlocked.map((a) => a.id)).toContain('streak_7');
  });

  it('unlocks combo achievement', () => {
    const state = stateWith({
      stats: {
        ...createInitialState().stats,
        comboCount: { combo10: 100, combo15: 0, combo20: 0 },
      },
    });
    const unlocked = checkAchievements(state);
    expect(unlocked.map((a) => a.id)).toContain('combo10_100');
  });

  it('unlocks seed_packets achievement', () => {
    const state = stateWith({
      stats: {
        ...createInitialState().stats,
        seedPacketsOpened: { total: 1, common: 1, rare: 0, legendary: 0 },
      },
    });
    const unlocked = checkAchievements(state);
    expect(unlocked.map((a) => a.id)).toContain('seedpacket_total_1');
    expect(unlocked.map((a) => a.id)).toContain('seedpacket_common_1');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/web && pnpm vitest run tests/unit/achievementChecker.test.ts --reporter=verbose`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement achievement checker**

Create `apps/web/src/store/achievementChecker.ts`:

```ts
import type { AchievementDef, PlayerState } from '@florify/shared';
import { ACHIEVEMENTS } from '@/data/achievements';
import { SPECIES } from '@/data/species';

/**
 * Evaluate all achievement conditions against current player state.
 * Returns the list of AchievementDefs that are newly met (not yet in state.achievements).
 * Pure function — does not mutate state.
 */
export function checkAchievements(state: PlayerState): AchievementDef[] {
  const newly: AchievementDef[] = [];

  for (const def of ACHIEVEMENTS) {
    // Skip already unlocked
    if (state.achievements[def.id]) continue;
    if (evaluateCondition(def.condition, state)) {
      newly.push(def);
    }
  }

  return newly;
}

function evaluateCondition(cond: AchievementDef['condition'], state: PlayerState): boolean {
  switch (cond.type) {
    case 'species_unlocked':
      return state.collection.length >= cond.target;

    case 'species_by_rarity':
      return state.collection.filter((s) => s.rarity === cond.rarity).length >= cond.target;

    case 'species_by_collection': {
      const speciesInCollection = new Set(
        SPECIES.filter((s) => s.collection === cond.collection).map((s) => s.id),
      );
      return state.collection.filter((s) => speciesInCollection.has(s.speciesId)).length >= cond.target;
    }

    case 'harvest_total':
      return state.stats.totalHarvested >= cond.target;

    case 'harvest_by_rarity':
      return state.stats.harvestByRarity[cond.rarity] >= cond.target;

    case 'total_watered':
      return state.stats.totalWatered >= cond.target;

    case 'sprouts_gained':
      return state.stats.sproutsGained >= cond.target;

    case 'sprouts_spent':
      return state.stats.sproutsSpent >= cond.target;

    case 'streak':
      return state.streak.longestStreak >= cond.target;

    case 'combo': {
      const key = `combo${cond.level}` as keyof typeof state.stats.comboCount;
      return state.stats.comboCount[key] >= cond.target;
    }

    case 'seed_packets':
      return state.stats.seedPacketsOpened[cond.tier] >= cond.target;

    default:
      return false;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd apps/web && pnpm vitest run tests/unit/achievementChecker.test.ts --reporter=verbose`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/store/achievementChecker.ts apps/web/tests/unit/achievementChecker.test.ts
git commit -m "feat: add achievement checker with condition evaluation"
```

---

### Task 5: Achievement Subscriber & Store Actions

**Files:**
- Create: `apps/web/src/store/achievementSubscriber.ts`
- Modify: `apps/web/src/store/gameStore.ts`
- Modify: `apps/web/src/store/StoreHydrator.tsx`

- [ ] **Step 1: Add `claimAchievement` and `claimAllAchievements` actions to `GameStore` interface**

In `apps/web/src/store/gameStore.ts`, add to the `GameStore` interface (after line 163):

```ts
  // Achievements
  claimAchievement: (id: string) => number;           // returns sprouts awarded
  claimAllAchievements: () => number;                  // returns total sprouts awarded
```

- [ ] **Step 2: Implement the actions in the store**

In the `create<GameStore>()` body, add the implementations:

```ts
    claimAchievement: (id) => {
      const s = get().state;
      const entry = s.achievements[id];
      if (!entry || entry.claimedAt) return 0;

      const def = ACHIEVEMENTS_BY_ID.get(id);
      if (!def) return 0;

      let sproutsAwarded = 0;
      for (const reward of def.rewards) {
        if (reward.type === 'sprouts') sproutsAwarded += reward.amount;
      }

      const next: PlayerState = {
        ...s,
        sprouts: s.sprouts + sproutsAwarded,
        stats: { ...s.stats, sproutsGained: s.stats.sproutsGained + sproutsAwarded },
        achievements: {
          ...s.achievements,
          [id]: { ...entry, claimedAt: new Date().toISOString() },
        },
        updatedAt: Date.now(),
      };
      set({ state: next });
      scheduleSave(next);
      return sproutsAwarded;
    },

    claimAllAchievements: () => {
      const s = get().state;
      let totalSprouts = 0;
      const updatedAchievements = { ...s.achievements };

      for (const [id, entry] of Object.entries(s.achievements)) {
        if (entry.claimedAt) continue;
        const def = ACHIEVEMENTS_BY_ID.get(id);
        if (!def) continue;
        for (const reward of def.rewards) {
          if (reward.type === 'sprouts') totalSprouts += reward.amount;
        }
        updatedAchievements[id] = { ...entry, claimedAt: new Date().toISOString() };
      }

      if (totalSprouts === 0) return 0;

      const next: PlayerState = {
        ...s,
        sprouts: s.sprouts + totalSprouts,
        stats: { ...s.stats, sproutsGained: s.stats.sproutsGained + totalSprouts },
        achievements: updatedAchievements,
        updatedAt: Date.now(),
      };
      set({ state: next });
      scheduleSave(next);
      return totalSprouts;
    },
```

Add import at top of gameStore.ts:

```ts
import { ACHIEVEMENTS_BY_ID } from '@/data/achievements';
```

- [ ] **Step 3: Create achievement subscriber**

Create `apps/web/src/store/achievementSubscriber.ts`:

```ts
import type { GameEvent } from '@florify/shared';
import { gameEventBus } from '@/lib/gameEventBus';
import { useGameStore } from './gameStore';
import { checkAchievements } from './achievementChecker';
import { toast } from '@/lib/toast';

/**
 * Subscribes to game events and checks for newly unlocked achievements.
 * Mirrors the pattern of missionSubscriber.ts.
 */

function handleEvent(_event: GameEvent) {
  const store = useGameStore.getState();
  const state = store.state;

  const newlyUnlocked = checkAchievements(state);
  if (newlyUnlocked.length === 0) return;

  // Mark all newly unlocked achievements in state
  const now = new Date().toISOString();
  const updatedAchievements = { ...state.achievements };
  for (const def of newlyUnlocked) {
    updatedAchievements[def.id] = { unlockedAt: now };
  }

  const next = { ...state, achievements: updatedAchievements, updatedAt: Date.now() };
  useGameStore.setState({ state: next });

  // Fire toast
  if (newlyUnlocked.length === 1) {
    toast(`🏆 ${newlyUnlocked[0].name}`);
  } else {
    toast(`🏆 ${newlyUnlocked.length} achievements unlocked!`);
  }
}

let initialized = false;

export function initAchievementSubscriber(): () => void {
  if (initialized) return () => {};
  initialized = true;
  gameEventBus.on(handleEvent);
  return () => {
    gameEventBus.off(handleEvent);
    initialized = false;
  };
}
```

- [ ] **Step 4: Wire up subscriber in `StoreHydrator.tsx`**

In `apps/web/src/store/StoreHydrator.tsx`, add import:

```ts
import { initAchievementSubscriber } from './achievementSubscriber';
```

Add useEffect after the mission subscriber init (after line 33):

```ts
  // Initialize achievement event subscriber (once).
  useEffect(() => {
    const cleanup = initAchievementSubscriber();
    return cleanup;
  }, []);
```

- [ ] **Step 5: Update game actions to track new stats**

In `gameStore.ts`, update the `waterTree` action — where harvest happens, increment `harvestByRarity`:

After the line that increments `totalHarvested`, add:

```ts
harvestByRarity: {
  ...s.stats.harvestByRarity,
  [tree.rarity]: s.stats.harvestByRarity[tree.rarity] + 1,
},
```

In the `openBooster` action, increment `seedPacketsOpened`:

```ts
seedPacketsOpened: {
  ...s.stats.seedPacketsOpened,
  total: s.stats.seedPacketsOpened.total + 1,
  [tier]: s.stats.seedPacketsOpened[tier] + 1,
},
```

In `ActionButton.tsx` (or the combo event handler), increment `comboCount` in state when combo events fire. The cleanest place is the achievement subscriber itself — read the combo level from the event and update comboCount:

In `achievementSubscriber.ts`, update `handleEvent`:

```ts
function handleEvent(event: GameEvent) {
  const store = useGameStore.getState();
  let state = store.state;

  // Track combo counts
  if (event.type === 'combo') {
    const level = event.level as 10 | 15 | 20;
    const key = `combo${level}` as keyof typeof state.stats.comboCount;
    if (key in state.stats.comboCount) {
      state = {
        ...state,
        stats: {
          ...state.stats,
          comboCount: {
            ...state.stats.comboCount,
            [key]: state.stats.comboCount[key] + 1,
          },
        },
      };
    }
  }

  const newlyUnlocked = checkAchievements(state);

  if (newlyUnlocked.length > 0) {
    const now = new Date().toISOString();
    const updatedAchievements = { ...state.achievements };
    for (const def of newlyUnlocked) {
      updatedAchievements[def.id] = { unlockedAt: now };
    }
    state = { ...state, achievements: updatedAchievements, updatedAt: Date.now() };
  }

  // Only update store if state changed
  if (state !== store.state) {
    useGameStore.setState({ state });
  }

  // Fire toast after state update
  if (newlyUnlocked.length === 1) {
    toast(`🏆 ${newlyUnlocked[0].name}`);
  } else if (newlyUnlocked.length > 1) {
    toast(`🏆 ${newlyUnlocked.length} achievements unlocked!`);
  }
}
```

- [ ] **Step 6: Verify all existing tests still pass**

Run: `cd apps/web && pnpm vitest run --reporter=verbose`
Expected: All existing tests pass.

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/store/achievementSubscriber.ts apps/web/src/store/achievementChecker.ts apps/web/src/store/gameStore.ts apps/web/src/store/StoreHydrator.tsx
git commit -m "feat: add achievement subscriber, claim actions, and stat tracking"
```

---

### Task 6: Achievement UI — Tab Bar in Florist Card

**Files:**
- Modify: `apps/web/src/components/florist-card/FloristCardSheet.tsx`
- Create: `apps/web/src/components/florist-card/AchievementsTab.tsx`

- [ ] **Step 1: Add tab state to FloristCardSheet**

In `FloristCardSheet.tsx`, add a tab state:

```ts
const [activeTab, setActiveTab] = useState<'passport' | 'achievements'>('passport');
```

Reset it in the `open !== prevOpen` block:

```ts
if (open) {
  setSheet({ phase: "viewing" });
  setActiveTab('passport');
}
```

- [ ] **Step 2: Add tab bar UI**

Replace the existing `<h2>` header (line 174) with a tab bar:

```tsx
<div className="flex items-center justify-between mb-4">
  <div className="flex gap-1 bg-cream-100 rounded-xl p-1">
    <button
      onClick={() => setActiveTab('passport')}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        activeTab === 'passport'
          ? 'bg-white text-ink-900 shadow-sm'
          : 'text-ink-500 hover:text-ink-700'
      }`}
    >
      Passport
    </button>
    <button
      onClick={() => setActiveTab('achievements')}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors relative ${
        activeTab === 'achievements'
          ? 'bg-white text-ink-900 shadow-sm'
          : 'text-ink-500 hover:text-ink-700'
      }`}
    >
      🏆 Achievements
      {unclaimedCount > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
          {unclaimedCount}
        </span>
      )}
    </button>
  </div>
  <button
    onClick={onClose}
    aria-label="Close"
    className="text-ink-500 text-2xl leading-none w-10 h-10 flex items-center justify-center hover:bg-cream-100 rounded-full transition-colors"
  >
    ✕
  </button>
</div>
```

Add `unclaimedCount` derivation:

```ts
const unclaimedCount = useMemo(() => {
  return Object.values(state.achievements).filter((a) => !a.claimedAt).length;
}, [state.achievements]);
```

- [ ] **Step 3: Conditionally render content based on tab**

Replace the passport content + buttons with conditional rendering:

```tsx
{activeTab === 'passport' ? (
  <>
    <div className="flex justify-center mb-5">
      <PassportCard data={data} maxWidth={cardWidth} />
    </div>
    {/* existing share buttons */}
  </>
) : (
  <AchievementsTab />
)}
```

- [ ] **Step 4: Create AchievementsTab component**

Create `apps/web/src/components/florist-card/AchievementsTab.tsx`:

```tsx
'use client';

import { useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { ACHIEVEMENTS } from '@/data/achievements';
import { SPECIES } from '@/data/species';
import type { AchievementDef } from '@florify/shared';
import { useLanguage } from '@/i18n/useT';

const CATEGORIES: { label: string; filter: (d: AchievementDef) => boolean }[] = [
  { label: '🌿 Collection', filter: (d) => d.id.startsWith('collect_') || d.id.startsWith('set_') },
  { label: '🌾 Harvest', filter: (d) => d.id.startsWith('harvest_') },
  { label: '💧 Watering', filter: (d) => d.id.startsWith('water_') },
  { label: '🌱 Sprouts', filter: (d) => d.id.startsWith('sprout_') },
  { label: '🔥 Streaks', filter: (d) => d.id.startsWith('streak_') },
  { label: '⚡ Combos', filter: (d) => d.id.startsWith('combo') },
  { label: '🎁 Seed Packets', filter: (d) => d.id.startsWith('seedpacket_') },
];

export function AchievementsTab() {
  const state = useGameStore((s) => s.state);
  const claimAchievement = useGameStore((s) => s.claimAchievement);
  const claimAllAchievements = useGameStore((s) => s.claimAllAchievements);
  const lang = useLanguage();

  const unclaimedCount = useMemo(
    () => Object.values(state.achievements).filter((a) => !a.claimedAt).length,
    [state.achievements],
  );

  const totalUnlocked = Object.keys(state.achievements).length;

  return (
    <div className="space-y-4">
      {/* Header stats */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-500">
          {totalUnlocked}/{ACHIEVEMENTS.length} unlocked
        </p>
        {unclaimedCount > 1 && (
          <button
            onClick={() => claimAllAchievements()}
            className="text-sm font-medium text-leaf-600 hover:text-leaf-700 transition-colors"
          >
            Claim All ({unclaimedCount})
          </button>
        )}
      </div>

      {/* Categories */}
      {CATEGORIES.map((cat) => {
        const defs = ACHIEVEMENTS.filter(cat.filter);
        return (
          <div key={cat.label}>
            <h3 className="text-sm font-semibold text-ink-700 mb-2">{cat.label}</h3>
            <div className="space-y-2">
              {defs.map((def) => (
                <AchievementRow
                  key={def.id}
                  def={def}
                  progress={state.achievements[def.id]}
                  state={state}
                  lang={lang}
                  onClaim={() => claimAchievement(def.id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AchievementRow({
  def,
  progress,
  state,
  lang,
  onClaim,
}: {
  def: AchievementDef;
  progress?: { unlockedAt: string; claimedAt?: string };
  state: import('@florify/shared').PlayerState;
  lang: 'th' | 'en';
  onClaim: () => void;
}) {
  const isUnlocked = !!progress;
  const isClaimed = !!progress?.claimedAt;
  const currentValue = getProgress(def.condition, state);
  const target = getTarget(def.condition);
  const pct = Math.min(100, Math.round((currentValue / target) * 100));

  return (
    <div
      className={`rounded-xl p-3 transition-colors ${
        isClaimed
          ? 'bg-cream-100/50 opacity-60'
          : isUnlocked
            ? 'bg-leaf-50 ring-1 ring-leaf-200'
            : 'bg-cream-100'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${isUnlocked ? 'text-ink-900' : 'text-ink-500'}`}>
            {def.name}
          </p>
          <p className="text-xs text-ink-400 truncate">{def.description[lang]}</p>
        </div>
        <div className="flex-shrink-0">
          {isClaimed ? (
            <span className="text-xs text-ink-400">✅</span>
          ) : isUnlocked ? (
            <button
              onClick={onClaim}
              className="text-xs font-semibold bg-leaf-500 text-white px-3 py-1 rounded-lg hover:bg-leaf-600 transition-colors"
            >
              🌱 {def.rewards.reduce((sum, r) => sum + (r.type === 'sprouts' ? r.amount : 0), 0)}
            </button>
          ) : (
            <span className="text-xs text-ink-400">
              🌱 {def.rewards.reduce((sum, r) => sum + (r.type === 'sprouts' ? r.amount : 0), 0)}
            </span>
          )}
        </div>
      </div>
      {/* Progress bar for locked achievements */}
      {!isUnlocked && (
        <div className="mt-2">
          <div className="h-1.5 bg-cream-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-leaf-400 rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[10px] text-ink-400 mt-0.5 text-right">
            {currentValue.toLocaleString()}/{target.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}

function getTarget(cond: AchievementDef['condition']): number {
  return cond.target;
}

function getProgress(cond: AchievementDef['condition'], state: import('@florify/shared').PlayerState): number {
  switch (cond.type) {
    case 'species_unlocked':
      return state.collection.length;
    case 'species_by_rarity':
      return state.collection.filter((s) => s.rarity === cond.rarity).length;
    case 'species_by_collection': {
      const ids = new Set(
        SPECIES.filter((s) => s.collection === cond.collection).map((s) => s.id),
      );
      return state.collection.filter((s) => ids.has(s.speciesId)).length;
    }
    case 'harvest_total':
      return state.stats.totalHarvested;
    case 'harvest_by_rarity':
      return state.stats.harvestByRarity[cond.rarity];
    case 'total_watered':
      return state.stats.totalWatered;
    case 'sprouts_gained':
      return state.stats.sproutsGained;
    case 'sprouts_spent':
      return state.stats.sproutsSpent;
    case 'streak':
      return state.streak.longestStreak;
    case 'combo': {
      const key = `combo${cond.level}` as keyof typeof state.stats.comboCount;
      return state.stats.comboCount[key];
    }
    case 'seed_packets':
      return state.stats.seedPacketsOpened[cond.tier];
    default:
      return 0;
  }
}
```

- [ ] **Step 5: Verify the app compiles and renders**

Run: `cd apps/web && npx tsc --noEmit --pretty 2>&1 | head -30`
Expected: No type errors.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/components/florist-card/FloristCardSheet.tsx apps/web/src/components/florist-card/AchievementsTab.tsx
git commit -m "feat: add achievement tab UI in Florist Card with claim flow"
```

---

### Task 7: Retroactive Unlock on First Load

**Files:**
- Modify: `apps/web/src/store/StoreHydrator.tsx`

- [ ] **Step 1: Add retroactive check after hydration**

In `StoreHydrator.tsx`, after the hydrate effect, add a one-time retroactive achievement check:

```ts
import { checkAchievements } from './achievementChecker';
import { scheduleSave } from './debouncedSave';
```

Add a new effect:

```ts
  // Retroactive achievement unlock — runs once after hydration.
  const hydrated = useGameStore((s) => s.hydrated);
  useEffect(() => {
    if (!hydrated) return;
    const state = useGameStore.getState().state;
    const newlyUnlocked = checkAchievements(state);
    if (newlyUnlocked.length === 0) return;

    const now = new Date().toISOString();
    const updatedAchievements = { ...state.achievements };
    for (const def of newlyUnlocked) {
      updatedAchievements[def.id] = { unlockedAt: now };
    }

    const next = { ...state, achievements: updatedAchievements, updatedAt: Date.now() };
    useGameStore.setState({ state: next });
    scheduleSave(next);

    // Don't toast on retroactive — could be dozens
    // Badge dot on achievements tab will indicate unclaimed
  }, [hydrated]);
```

- [ ] **Step 2: Verify existing tests still pass**

Run: `cd apps/web && pnpm vitest run --reporter=verbose`
Expected: All tests pass.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/store/StoreHydrator.tsx
git commit -m "feat: retroactive achievement unlock on first load after migration"
```

---

### Task 8: Final Integration & Smoke Test

**Files:**
- All modified files

- [ ] **Step 1: Run full test suite**

Run: `cd apps/web && pnpm vitest run --reporter=verbose`
Expected: All tests pass.

- [ ] **Step 2: Run TypeScript check**

Run: `cd apps/web && npx tsc --noEmit --pretty`
Expected: No errors.

- [ ] **Step 3: Run dev server and manually verify**

Run: `cd apps/web && pnpm dev`

Manual checks:
1. Open app → Florist Card → see Passport | Achievements tabs
2. Achievements tab shows all 94 achievements with correct categories
3. Progress bars show current progress for locked achievements
4. Already-met achievements (retroactive) show as unlocked with "Claim" button
5. Click "Claim" → sprouts awarded, achievement marked as claimed
6. "Claim All" button works when multiple unclaimed exist
7. Plant + water + harvest → check if achievement toast fires
8. Combo tapping → verify combo count increments

- [ ] **Step 4: Commit any fixes found during smoke test**

```bash
git add -A
git commit -m "fix: address issues found during achievement system smoke test"
```

- [ ] **Step 5: Final commit — done**

If no fixes needed, all previous commits cover the implementation.
