import { beforeEach, describe, expect, it, vi } from 'vitest';
import { selectFloristCard, useGameStore, computeDrops } from '@/store/gameStore';
import { createInitialState } from '@/store/initialState';
import {
  MAX_WATER_DROPS, MAX_WATER_COST, MIN_WATER_COST, FIRST_FLORA_COST,
  DROP_REGEN_MS, PITY_THRESHOLD, PITY_POINTS_COMMON, PITY_POINTS_RARE, PITY_POINTS_LEGENDARY,
  SCHEMA_VERSION,
  CHECKIN_BASE_DROPS, CHECKIN_STREAK_BONUS_MAX,
  MISSION_MILESTONES, MISSION_MILESTONE_DROPS, MISSION_POINTS_PER, DAILY_MISSION_COUNT,
  SPROUT_HARVEST_COMMON, SPROUT_HARVEST_RARE, SPROUT_HARVEST_LEGENDARY,
  SPROUT_QUEST_REFRESH_COST, SPROUT_ALL_MISSIONS_BONUS,
  BOOSTER_COST_COMMON,
  type TreeInstance, type CollectedSpecies, type PlayerState, type DailyMission,
} from '@florify/shared';
import { SPECIES } from '@/data/species';
import { todayLocalDate } from '@/lib/time';
import { migrate } from '@/store/migrations';
import { pickDailyMissions } from '@/lib/missionPicker';

function resetStore() {
  useGameStore.setState({ state: createInitialState() });
  window.localStorage.clear();
}

function mockTree(overrides: Partial<TreeInstance> = {}): TreeInstance {
  return {
    id: 't-mock',
    seed: 1,
    speciesId: 0,
    rarity: 'common',
    requiredWaterings: 15,
    currentWaterings: 0,
    plantedAt: Date.now(),
    harvestedAt: null,
    ...overrides,
  };
}

function mockCollected(overrides: Partial<CollectedSpecies> = {}): CollectedSpecies {
  return {
    speciesId: 0,
    rarity: 'common',
    count: 1,
    totalWaterings: 15,
    firstHarvestedAt: Date.now(),
    lastHarvestedAt: Date.now(),
    ...overrides,
  };
}

describe('plantTree', () => {
  beforeEach(resetStore);

  it('creates an active tree with valid fields', () => {
    const tree = useGameStore.getState().plantTree();
    const active = useGameStore.getState().state.activeTree;
    expect(active?.id).toBe(tree.id);
    expect(tree.requiredWaterings).toBeGreaterThanOrEqual(FIRST_FLORA_COST);
    expect(tree.requiredWaterings).toBeLessThanOrEqual(MAX_WATER_COST);
    expect(tree.currentWaterings).toBe(0);
    expect(tree.harvestedAt).toBeNull();
    expect(['common', 'rare', 'legendary']).toContain(tree.rarity);
  });

  it('first-ever tree costs FIRST_FLORA_COST drops', () => {
    const tree = useGameStore.getState().plantTree();
    expect(tree.requiredWaterings).toBe(FIRST_FLORA_COST);
  });

  it('subsequent trees cost MIN_WATER_COST to MAX_WATER_COST drops', () => {
    // Simulate having already planted and harvested one tree
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        stats: { ...s.state.stats, totalPlanted: 1 },
        collection: [mockCollected()],
      },
    }));
    const tree = useGameStore.getState().plantTree();
    expect(tree.requiredWaterings).toBeGreaterThanOrEqual(MIN_WATER_COST);
    expect(tree.requiredWaterings).toBeLessThanOrEqual(MAX_WATER_COST);
  });

  it('increments totalPlanted', () => {
    useGameStore.getState().plantTree();
    expect(useGameStore.getState().state.stats.totalPlanted).toBe(1);
  });

  it('throws if an active tree already exists', () => {
    useGameStore.getState().plantTree();
    expect(() => useGameStore.getState().plantTree()).toThrow();
  });
});

describe('waterTree', () => {
  beforeEach(resetStore);

  it('returns { ok: false } when no active tree', () => {
    expect(useGameStore.getState().waterTree().ok).toBe(false);
  });

  it('first water succeeds and increments counter', () => {
    useGameStore.setState((s) => ({
      state: { ...s.state, activeTree: mockTree(), waterDrops: 10, lastDropRegenAt: Date.now() },
    }));
    const r = useGameStore.getState().waterTree();
    expect(r.ok).toBe(true);
    expect(r.harvested).toBeUndefined();
    expect(useGameStore.getState().state.activeTree?.currentWaterings).toBe(1);
    expect(useGameStore.getState().state.stats.totalWatered).toBe(1);
  });

  it('deducts 1 drop per water', () => {
    useGameStore.setState((s) => ({
      state: { ...s.state, activeTree: mockTree(), waterDrops: 10, lastDropRegenAt: Date.now() },
    }));
    useGameStore.getState().waterTree();
    expect(useGameStore.getState().state.waterDrops).toBe(9);
  });

  it('rejects water when 0 drops', () => {
    useGameStore.setState((s) => ({
      state: { ...s.state, activeTree: mockTree(), waterDrops: 0, lastDropRegenAt: Date.now() },
    }));
    const r = useGameStore.getState().waterTree();
    expect(r.ok).toBe(false);
  });

  it('rapid watering deducts correct number of drops', () => {
    useGameStore.setState((s) => ({
      state: { ...s.state, activeTree: mockTree({ requiredWaterings: 20 }), waterDrops: 10, lastDropRegenAt: Date.now() },
    }));
    for (let i = 0; i < 5; i++) {
      useGameStore.getState().waterTree();
    }
    expect(useGameStore.getState().state.waterDrops).toBe(5);
    expect(useGameStore.getState().state.activeTree?.currentWaterings).toBe(5);
  });

  it('reaching requiredWaterings triggers harvest', () => {
    useGameStore.setState((s) => ({
      state: { ...s.state, activeTree: mockTree({ requiredWaterings: 1 }), waterDrops: 5, lastDropRegenAt: Date.now() },
    }));
    const r = useGameStore.getState().waterTree();
    expect(r.ok).toBe(true);
    expect(r.harvested).toBeDefined();
    expect(r.harvested?.harvestedAt).not.toBeNull();
    const state = useGameStore.getState().state;
    expect(state.activeTree).toBeNull();
    expect(state.collection.length).toBe(1);
    expect(state.collection[0]!.speciesId).toBe(0);
    expect(state.collection[0]!.count).toBe(1);
    expect(state.stats.totalHarvested).toBe(1);
    expect(state.waterDrops).toBe(4);
  });

  it('harvested tree preserves speciesId + seed for replay', () => {
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        activeTree: mockTree({ requiredWaterings: 1, seed: 4242, speciesId: 7 }),
        waterDrops: 5,
        lastDropRegenAt: Date.now(),
      },
    }));
    const r = useGameStore.getState().waterTree();
    expect(r.harvested?.seed).toBe(4242);
    expect(r.harvested?.speciesId).toBe(7);
  });

  it('second harvest of same species increments count', () => {
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        activeTree: mockTree({ requiredWaterings: 1, speciesId: 5 }),
        collection: [mockCollected({ speciesId: 5, count: 2, totalWaterings: 30 })],
        waterDrops: 5,
        lastDropRegenAt: Date.now(),
      },
    }));
    useGameStore.getState().waterTree();
    const c = useGameStore.getState().state.collection;
    expect(c.length).toBe(1); // still 1 unique species
    expect(c[0]!.count).toBe(3);
    expect(c[0]!.totalWaterings).toBe(31); // 30 + 1 (requiredWaterings=1)
  });
});

describe('computeDrops', () => {
  it('regenerates drops based on elapsed time', () => {
    const now = Date.now();
    const state = {
      ...createInitialState(),
      waterDrops: 10,
      lastDropRegenAt: now - 3 * DROP_REGEN_MS,
    };
    vi.spyOn(Date, 'now').mockReturnValue(now);
    const { drops, regenAt } = computeDrops(state);
    expect(drops).toBe(13);
    expect(regenAt).toBe(state.lastDropRegenAt + 3 * DROP_REGEN_MS);
    vi.restoreAllMocks();
  });

  it('caps at MAX_WATER_DROPS', () => {
    const now = Date.now();
    const state = {
      ...createInitialState(),
      waterDrops: 48,
      lastDropRegenAt: now - 5 * DROP_REGEN_MS,
    };
    vi.spyOn(Date, 'now').mockReturnValue(now);
    const { drops } = computeDrops(state);
    expect(drops).toBe(MAX_WATER_DROPS);
    vi.restoreAllMocks();
  });

  it('handles future lastDropRegenAt gracefully', () => {
    const now = Date.now();
    const state = {
      ...createInitialState(),
      waterDrops: 10,
      lastDropRegenAt: now + 60_000,
    };
    vi.spyOn(Date, 'now').mockReturnValue(now);
    const { drops } = computeDrops(state);
    expect(drops).toBe(10);
    vi.restoreAllMocks();
  });
});

describe('canWater / waterDrops', () => {
  beforeEach(resetStore);

  it('canWater is false with no tree', () => {
    expect(useGameStore.getState().canWater()).toBe(false);
  });

  it('canWater is true when tree exists and drops > 0', () => {
    useGameStore.setState((s) => ({
      state: { ...s.state, activeTree: mockTree(), waterDrops: 5, lastDropRegenAt: Date.now() },
    }));
    expect(useGameStore.getState().canWater()).toBe(true);
  });

  it('canWater is false when drops are 0', () => {
    useGameStore.setState((s) => ({
      state: { ...s.state, activeTree: mockTree(), waterDrops: 0, lastDropRegenAt: Date.now() },
    }));
    expect(useGameStore.getState().canWater()).toBe(false);
  });

  it('waterDrops returns current computed count', () => {
    useGameStore.setState((s) => ({
      state: { ...s.state, waterDrops: 15, lastDropRegenAt: Date.now() },
    }));
    expect(useGameStore.getState().waterDrops()).toBe(15);
  });
});

describe('resetActiveTree', () => {
  beforeEach(resetStore);

  it('clears active tree, keeps collection', () => {
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        activeTree: mockTree({ currentWaterings: 2 }),
        collection: [mockCollected()],
      },
    }));
    useGameStore.getState().resetActiveTree();
    const state = useGameStore.getState().state;
    expect(state.activeTree).toBeNull();
    expect(state.collection.length).toBe(1);
  });

  it('is a no-op when no active tree', () => {
    const before = useGameStore.getState().state;
    useGameStore.getState().resetActiveTree();
    expect(useGameStore.getState().state).toBe(before);
  });
});

describe('checkinStreak', () => {
  beforeEach(resetStore);

  it('first checkin sets streak to 1', () => {
    useGameStore.getState().checkinStreak();
    const s = useGameStore.getState().state.streak;
    expect(s.currentStreak).toBe(1);
    expect(s.longestStreak).toBe(1);
    expect(s.lastCheckinDate).toBe(todayLocalDate());
  });

  it('same-day checkin is idempotent', () => {
    useGameStore.getState().checkinStreak();
    useGameStore.getState().checkinStreak();
    expect(useGameStore.getState().state.streak.currentStreak).toBe(1);
  });

  it('consecutive-day checkin increments', () => {
    // Set last checkin to yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = todayLocalDate(yesterday);
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        streak: { currentStreak: 3, longestStreak: 3, lastCheckinDate: yesterdayStr, lastRewardDate: '' },
      },
    }));
    useGameStore.getState().checkinStreak();
    const s = useGameStore.getState().state.streak;
    expect(s.currentStreak).toBe(4);
    expect(s.longestStreak).toBe(4);
  });

  it('skip-day resets streak to 1 but keeps longest', () => {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const stale = todayLocalDate(twoDaysAgo);
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        streak: { currentStreak: 5, longestStreak: 5, lastCheckinDate: stale, lastRewardDate: '' },
      },
    }));
    useGameStore.getState().checkinStreak();
    const s = useGameStore.getState().state.streak;
    expect(s.currentStreak).toBe(1);
    expect(s.longestStreak).toBe(5);
  });
});

describe('selectFloristCard', () => {
  beforeEach(resetStore);

  it('reports Seedling rank with 0 unlocked', () => {
    const card = selectFloristCard(useGameStore.getState().state);
    expect(card.rank).toBe('Seedling');
    expect(card.speciesUnlocked).toBe(0);
    expect(card.rarityProgress.common.total).toBe(SPECIES.filter(s => s.rarity === 'common').length);
  });

  it('counts unique species per rarity', () => {
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        collection: [
          mockCollected({ speciesId: 1, rarity: 'common', count: 2 }),
          mockCollected({ speciesId: 250, rarity: 'rare' }),
          mockCollected({ speciesId: 290, rarity: 'legendary' }),
        ],
        stats: { totalPlanted: 4, totalWatered: 20, totalHarvested: 4, driedLeavesGained: 0, sproutsGained: 0, sproutsSpent: 0, shopPurchases: { common: 0, rare: 0, legendary: 0 }, harvestByRarity: { common: 0, rare: 0, legendary: 0 }, comboCount: { combo10: 0, combo15: 0, combo20: 0 }, seedPacketsOpened: { total: 0, common: 0, rare: 0, legendary: 0 }, missionsCompleted: 0, allDailyMissionsCompleted: 0 },
      },
    }));
    const card = selectFloristCard(useGameStore.getState().state);
    expect(card.speciesUnlocked).toBe(3);
    expect(card.rarityProgress.common.unlocked).toBe(1);
    expect(card.rarityProgress.rare.unlocked).toBe(1);
    expect(card.rarityProgress.legendary.unlocked).toBe(1);
    expect(card.totalHarvested).toBe(4);
  });

  it('promotes rank at thresholds', () => {
    // 20 distinct species → Apprentice
    const collection = Array.from({ length: 20 }, (_, i) =>
      mockCollected({ speciesId: i, rarity: 'common', lastHarvestedAt: i + 1 }),
    );
    useGameStore.setState((s) => ({ state: { ...s.state, collection } }));
    expect(selectFloristCard(useGameStore.getState().state).rank).toBe('Apprentice');
  });

  it('returns a fresh object each call — callers must memoise', () => {
    const state = useGameStore.getState().state;
    const a = selectFloristCard(state);
    const b = selectFloristCard(state);
    expect(a).not.toBe(b); // different references by design
    expect(a).toEqual(b); // but structurally identical
  });
});

describe('hydrate', () => {
  beforeEach(resetStore);

  it('restores saved state from localStorage and runs checkinStreak', async () => {
    const persisted = createInitialState();
    const customUserId = 'persisted-user-abc';
    await useGameStore.setState({
      state: { ...persisted, userId: customUserId, stats: { ...persisted.stats, totalPlanted: 42 } },
    });
    // Flush via direct save to localStorage
    const { saveStore } = await import('@/store/saveStore');
    await saveStore.save(useGameStore.getState().state);

    // Clobber in-memory state, then hydrate from localStorage
    useGameStore.setState({ state: createInitialState() });
    await useGameStore.getState().hydrate();

    const s = useGameStore.getState().state;
    expect(s.userId).toBe(customUserId);
    expect(s.stats.totalPlanted).toBe(42);
    expect(s.streak.currentStreak).toBe(1); // checkinStreak ran
  });

  it('leaves initial state intact when nothing saved', async () => {
    window.localStorage.clear();
    const initial = useGameStore.getState().state;
    await useGameStore.getState().hydrate();
    expect(useGameStore.getState().state.userId).toBe(initial.userId);
  });
});

describe('resetAllProgress', () => {
  beforeEach(resetStore);

  it('wipes active tree, collection, and stats', () => {
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        activeTree: mockTree(),
        collection: [mockCollected()],
        stats: { totalPlanted: 5, totalWatered: 10, totalHarvested: 2, driedLeavesGained: 0, sproutsGained: 0, sproutsSpent: 0, shopPurchases: { common: 0, rare: 0, legendary: 0 }, harvestByRarity: { common: 0, rare: 0, legendary: 0 }, comboCount: { combo10: 0, combo15: 0, combo20: 0 }, seedPacketsOpened: { total: 0, common: 0, rare: 0, legendary: 0 }, missionsCompleted: 0, allDailyMissionsCompleted: 0 },
      },
    }));
    useGameStore.getState().resetAllProgress();
    const s = useGameStore.getState().state;
    expect(s.activeTree).toBeNull();
    expect(s.collection).toEqual([]);
    expect(s.stats.totalPlanted).toBe(0);
    expect(s.waterDrops).toBe(MAX_WATER_DROPS);
  });
});

describe('migrate v2 → v3', () => {
  it('adds water drop fields and strips lastWateredAt from active tree', () => {
    const v2State = {
      schemaVersion: 2,
      userId: 'test-user',
      displayName: 'Guest',
      createdAt: 1000,
      updatedAt: 2000,
      activeTree: {
        id: 't1',
        seed: 42,
        speciesId: 5,
        rarity: 'common',
        requiredWaterings: 3,
        currentWaterings: 1,
        plantedAt: 1500,
        lastWateredAt: 1800,
        harvestedAt: null,
      },
      collection: [],
      stats: { totalPlanted: 1, totalWatered: 1, totalHarvested: 0, driedLeavesGained: 0, sproutsGained: 0, sproutsSpent: 0, shopPurchases: { common: 0, rare: 0, legendary: 0 } },
      streak: { currentStreak: 0, longestStreak: 0, lastCheckinDate: '' },
    };

    const result = migrate(v2State as unknown as { schemaVersion: number } & Record<string, unknown>);
    expect(result.schemaVersion).toBe(SCHEMA_VERSION); // migrates through v3 → v4 → v5
    expect(result.waterDrops).toBe(MAX_WATER_DROPS);
    expect(result.lastDropRegenAt).toBeGreaterThan(0);
    expect(result.activeTree).toBeDefined();
    // lastWateredAt should be stripped
    expect((result.activeTree as unknown as Record<string, unknown>)['lastWateredAt']).toBeUndefined();
  });

  it('handles v2 state with no active tree', () => {
    const v2State = {
      schemaVersion: 2,
      userId: 'test-user',
      displayName: 'Guest',
      createdAt: 1000,
      updatedAt: 2000,
      activeTree: null,
      collection: [],
      stats: { totalPlanted: 0, totalWatered: 0, totalHarvested: 0, driedLeavesGained: 0, sproutsGained: 0, sproutsSpent: 0, shopPurchases: { common: 0, rare: 0, legendary: 0 } },
      streak: { currentStreak: 0, longestStreak: 0, lastCheckinDate: '' },
    };

    const result = migrate(v2State as unknown as { schemaVersion: number } & Record<string, unknown>);
    expect(result.schemaVersion).toBe(SCHEMA_VERSION);
    expect(result.waterDrops).toBe(MAX_WATER_DROPS);
    expect(result.activeTree).toBeNull();
  });
});

describe('pity / dried leaves (🍂)', () => {
  beforeEach(resetStore);

  it('duplicate common harvest gains +1 pity point', () => {
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        activeTree: mockTree({ requiredWaterings: 1, speciesId: 0, rarity: 'common' }),
        collection: [mockCollected({ speciesId: 0, rarity: 'common' })],
        waterDrops: 5,
        lastDropRegenAt: Date.now(),
        pityPoints: 0,
      },
    }));
    const r = useGameStore.getState().waterTree();
    expect(r.pityPointsGained).toBe(PITY_POINTS_COMMON);
    expect(useGameStore.getState().state.pityPoints).toBe(PITY_POINTS_COMMON);
  });

  it('duplicate rare harvest gains +3 pity points', () => {
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        activeTree: mockTree({ requiredWaterings: 1, speciesId: 200, rarity: 'rare' }),
        collection: [mockCollected({ speciesId: 200, rarity: 'rare' })],
        waterDrops: 5,
        lastDropRegenAt: Date.now(),
        pityPoints: 0,
      },
    }));
    const r = useGameStore.getState().waterTree();
    expect(r.pityPointsGained).toBe(PITY_POINTS_RARE);
    expect(useGameStore.getState().state.pityPoints).toBe(PITY_POINTS_RARE);
  });

  it('duplicate legendary harvest gains +10 pity points', () => {
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        activeTree: mockTree({ requiredWaterings: 1, speciesId: 280, rarity: 'legendary' }),
        collection: [mockCollected({ speciesId: 280, rarity: 'legendary' })],
        waterDrops: 5,
        lastDropRegenAt: Date.now(),
        pityPoints: 0,
      },
    }));
    const r = useGameStore.getState().waterTree();
    expect(r.pityPointsGained).toBe(PITY_POINTS_LEGENDARY);
    expect(useGameStore.getState().state.pityPoints).toBe(PITY_POINTS_LEGENDARY);
  });

  it('new species resets pity to 0', () => {
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        activeTree: mockTree({ requiredWaterings: 1, speciesId: 5, rarity: 'common' }),
        collection: [mockCollected({ speciesId: 0, rarity: 'common' })],
        waterDrops: 5,
        lastDropRegenAt: Date.now(),
        pityPoints: 50,
      },
    }));
    useGameStore.getState().waterTree();
    expect(useGameStore.getState().state.pityPoints).toBe(0);
  });

  it('reaching threshold grants a new species and resets to 0', () => {
    // Set up: 1 species in collection, pity at 99, harvest a common duplicate → 99 + 1 = 100
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        activeTree: mockTree({ requiredWaterings: 1, speciesId: 0, rarity: 'common' }),
        collection: [mockCollected({ speciesId: 0, rarity: 'common' })],
        waterDrops: 5,
        lastDropRegenAt: Date.now(),
        pityPoints: PITY_THRESHOLD - PITY_POINTS_COMMON,
      },
    }));
    const r = useGameStore.getState().waterTree();
    const state = useGameStore.getState().state;
    // Should have received a pity reward (new species)
    expect(r.pityReward).toBeDefined();
    expect(r.pityReward!.speciesId).not.toBe(0); // different from the one we already have
    expect(state.pityPoints).toBe(0);
    // Collection should have 2 unique species now (original + reward)
    expect(state.collection.length).toBe(2);
  });

  it('does not accumulate when collection is complete', () => {
    // Build a full collection
    const fullCollection = Array.from({ length: SPECIES.length }, (_, i) =>
      mockCollected({ speciesId: i, rarity: i < 200 ? 'common' : i < 280 ? 'rare' : 'legendary' }),
    );
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        activeTree: mockTree({ requiredWaterings: 1, speciesId: 0, rarity: 'common' }),
        collection: fullCollection,
        waterDrops: 5,
        lastDropRegenAt: Date.now(),
        pityPoints: 50,
      },
    }));
    useGameStore.getState().waterTree();
    // pityPoints should stay unchanged (no accumulation)
    expect(useGameStore.getState().state.pityPoints).toBe(50);
  });

  it('pity points accumulate across multiple harvests', () => {
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        activeTree: mockTree({ requiredWaterings: 1, speciesId: 0, rarity: 'common' }),
        collection: [mockCollected({ speciesId: 0, rarity: 'common' })],
        waterDrops: 10,
        lastDropRegenAt: Date.now(),
        pityPoints: 5,
      },
    }));
    useGameStore.getState().waterTree();
    expect(useGameStore.getState().state.pityPoints).toBe(5 + PITY_POINTS_COMMON);
  });
});

describe('migrate v4 → v5', () => {
  it('adds pityPoints field with value 0', () => {
    const v4State = {
      schemaVersion: 4,
      userId: 'test-user',
      displayName: 'Guest',
      createdAt: 1000,
      updatedAt: 2000,
      waterDrops: 20,
      lastDropRegenAt: 3000,
      activeTree: null,
      collection: [],
      stats: { totalPlanted: 0, totalWatered: 0, totalHarvested: 0, driedLeavesGained: 0, sproutsGained: 0, sproutsSpent: 0, shopPurchases: { common: 0, rare: 0, legendary: 0 } },
      streak: { currentStreak: 0, longestStreak: 0, lastCheckinDate: '' },
    };
    const result = migrate(v4State as unknown as { schemaVersion: number } & Record<string, unknown>);
    expect(result.schemaVersion).toBe(SCHEMA_VERSION);
    expect(result.pityPoints).toBe(0);
  });
});

describe('migrate v3 → v4', () => {
  it('aggregates TreeInstance[] collection into CollectedSpecies[]', () => {
    const v3State = {
      schemaVersion: 3,
      userId: 'test-user',
      displayName: 'Guest',
      createdAt: 1000,
      updatedAt: 2000,
      waterDrops: 20,
      lastDropRegenAt: 3000,
      activeTree: null,
      collection: [
        { id: 't1', seed: 1, speciesId: 5, rarity: 'common', requiredWaterings: 12, currentWaterings: 12, plantedAt: 1000, harvestedAt: 2000 },
        { id: 't2', seed: 2, speciesId: 5, rarity: 'common', requiredWaterings: 15, currentWaterings: 15, plantedAt: 2000, harvestedAt: 4000 },
        { id: 't3', seed: 3, speciesId: 10, rarity: 'rare', requiredWaterings: 20, currentWaterings: 20, plantedAt: 1500, harvestedAt: 3000 },
      ],
      stats: { totalPlanted: 3, totalWatered: 47, totalHarvested: 3, driedLeavesGained: 0, sproutsGained: 0, sproutsSpent: 0, shopPurchases: { common: 0, rare: 0, legendary: 0 } },
      streak: { currentStreak: 1, longestStreak: 1, lastCheckinDate: '2026-01-01' },
    };

    const result = migrate(v3State as unknown as { schemaVersion: number } & Record<string, unknown>);
    expect(result.schemaVersion).toBe(SCHEMA_VERSION);
    expect(result.collection.length).toBe(2); // 2 unique species

    // Sorted by lastHarvestedAt desc: speciesId 5 (4000) before speciesId 10 (3000)
    const first = result.collection[0]!;
    expect(first.speciesId).toBe(5);
    expect(first.count).toBe(2);
    expect(first.totalWaterings).toBe(27); // 12 + 15
    expect(first.firstHarvestedAt).toBe(2000);
    expect(first.lastHarvestedAt).toBe(4000);

    const second = result.collection[1]!;
    expect(second.speciesId).toBe(10);
    expect(second.count).toBe(1);
    expect(second.totalWaterings).toBe(20);
  });
});

// ── Daily Missions ─────────────────────────────────────────────────

describe('pickDailyMissions', () => {
  it('returns exactly DAILY_MISSION_COUNT missions', () => {
    const missions = pickDailyMissions('2026-04-07', 'user-abc');
    expect(missions.length).toBe(DAILY_MISSION_COUNT);
  });

  it('is deterministic — same inputs produce same output', () => {
    const a = pickDailyMissions('2026-04-07', 'user-abc');
    const b = pickDailyMissions('2026-04-07', 'user-abc');
    expect(a).toEqual(b);
  });

  it('produces different missions for different users', () => {
    const a = pickDailyMissions('2026-04-07', 'user-abc');
    const b = pickDailyMissions('2026-04-07', 'user-xyz');
    const aIds = a.map((m) => m.templateId);
    const bIds = b.map((m) => m.templateId);
    // Extremely unlikely to be identical — different seed
    expect(aIds).not.toEqual(bIds);
  });

  it('produces different missions for different dates', () => {
    const a = pickDailyMissions('2026-04-07', 'user-abc');
    const b = pickDailyMissions('2026-04-08', 'user-abc');
    const aIds = a.map((m) => m.templateId);
    const bIds = b.map((m) => m.templateId);
    expect(aIds).not.toEqual(bIds);
  });

  it('returns missions with all 5 unique templateIds', () => {
    const missions = pickDailyMissions('2026-04-07', 'user-abc');
    const ids = new Set(missions.map((m) => m.templateId));
    expect(ids.size).toBe(DAILY_MISSION_COUNT);
  });

  it('initializes progress=0 and completed=false', () => {
    const missions = pickDailyMissions('2026-04-07', 'user-abc');
    for (const m of missions) {
      expect(m.progress).toBe(0);
      expect(m.completed).toBe(false);
      expect(m.target).toBeGreaterThan(0);
    }
  });
});

describe('ensureDailyMissions', () => {
  beforeEach(resetStore);

  it('populates missions on first call', () => {
    useGameStore.getState().ensureDailyMissions();
    const dm = useGameStore.getState().state.dailyMissions;
    expect(dm.date).toBe(todayLocalDate());
    expect(dm.missions.length).toBe(DAILY_MISSION_COUNT);
    expect(dm.claimedPoints).toBe(0);
    expect(dm.claimedMilestones).toEqual([]);
  });

  it('is idempotent on the same day', () => {
    useGameStore.getState().ensureDailyMissions();
    const first = useGameStore.getState().state.dailyMissions.missions;
    useGameStore.getState().ensureDailyMissions();
    const second = useGameStore.getState().state.dailyMissions.missions;
    expect(first).toBe(second); // same reference — no mutation
  });

  it('resets missions when date changes', () => {
    useGameStore.getState().ensureDailyMissions();
    // Simulate yesterday's missions with progress
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        dailyMissions: {
          ...s.state.dailyMissions,
          date: '2026-01-01',
          claimedPoints: 30,
          claimedMilestones: [10, 20, 30],
        },
      },
    }));
    useGameStore.getState().ensureDailyMissions();
    const dm = useGameStore.getState().state.dailyMissions;
    expect(dm.date).toBe(todayLocalDate());
    expect(dm.claimedPoints).toBe(0);
    expect(dm.claimedMilestones).toEqual([]);
  });
});

describe('trackMission', () => {
  beforeEach(resetStore);

  function setupMissions() {
    useGameStore.getState().ensureDailyMissions();
  }

  it('increments progress for matching mission type', () => {
    setupMissions();
    const missions = useGameStore.getState().state.dailyMissions.missions;
    const waterMission = missions.find((m) => m.type === 'water');
    if (!waterMission) return; // skip if no water mission picked today

    useGameStore.getState().trackMission('water');
    const updated = useGameStore.getState().state.dailyMissions.missions.find(
      (m) => m.templateId === waterMission.templateId,
    )!;
    expect(updated.progress).toBe(1);
  });

  it('caps progress at target and sets completed=true', () => {
    setupMissions();
    // Manually set a mission with target=1 and progress=0
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        dailyMissions: {
          ...s.state.dailyMissions,
          missions: [
            { templateId: 'test_1', type: 'water', target: 1, progress: 0, completed: false },
          ],
        },
      },
    }));

    useGameStore.getState().trackMission('water');
    const m = useGameStore.getState().state.dailyMissions.missions[0]!;
    expect(m.progress).toBe(1);
    expect(m.completed).toBe(true);
  });

  it('does not over-increment past target', () => {
    setupMissions();
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        dailyMissions: {
          ...s.state.dailyMissions,
          missions: [
            { templateId: 'test_1', type: 'water', target: 2, progress: 0, completed: false },
          ],
        },
      },
    }));

    useGameStore.getState().trackMission('water');
    useGameStore.getState().trackMission('water');
    useGameStore.getState().trackMission('water'); // extra
    const m = useGameStore.getState().state.dailyMissions.missions[0]!;
    expect(m.progress).toBe(2);
    expect(m.completed).toBe(true);
  });

  it('is a no-op for non-matching mission types', () => {
    setupMissions();
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        dailyMissions: {
          ...s.state.dailyMissions,
          missions: [
            { templateId: 'test_1', type: 'plant', target: 2, progress: 0, completed: false },
          ],
        },
      },
    }));

    useGameStore.getState().trackMission('water');
    const m = useGameStore.getState().state.dailyMissions.missions[0]!;
    expect(m.progress).toBe(0);
  });
});

describe('visit quest via event bus', () => {
  beforeEach(resetStore);

  it('completes visit_floripedia mission when visit event is emitted', async () => {
    const { gameEventBus } = await import('@/lib/gameEventBus');
    const { initMissionSubscriber } = await import('@/store/missionSubscriber');

    const cleanup = initMissionSubscriber();

    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        dailyMissions: {
          date: todayLocalDate(),
          missions: [
            { templateId: 'visit_floripedia', type: 'visit_floripedia' as const, target: 1, progress: 0, completed: false },
          ],
          claimedPoints: 0,
          claimedMilestones: [],
          allCompletedClaimed: false,
        },
      },
    }));

    gameEventBus.emit({ type: 'visit' });

    const missions = useGameStore.getState().state.dailyMissions.missions;
    const visitMission = missions.find((m) => m.type === 'visit_floripedia');
    expect(visitMission).toBeDefined();
    expect(visitMission!.progress).toBe(1);
    expect(visitMission!.completed).toBe(true);

    cleanup();
  });
});

describe('claimMissions', () => {
  beforeEach(resetStore);

  function setupWithCompletedMissions(count: number) {
    const missions: DailyMission[] = [];
    for (let i = 0; i < DAILY_MISSION_COUNT; i++) {
      missions.push({
        templateId: `test_${i}`,
        type: 'water',
        target: 1,
        progress: i < count ? 1 : 0,
        completed: i < count,
      });
    }
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        dailyMissions: {
          date: todayLocalDate(),
          missions,
          claimedPoints: 0,
          claimedMilestones: [],
          allCompletedClaimed: false,
        },
        waterDrops: 10,
        lastDropRegenAt: Date.now(),
      },
    }));
  }

  it('awards drops for reaching first milestone (1 completed = 10P)', () => {
    setupWithCompletedMissions(1);
    const { dropsAwarded } = useGameStore.getState().claimMissions();
    expect(dropsAwarded).toBe(MISSION_MILESTONE_DROPS[0]);
    expect(useGameStore.getState().state.dailyMissions.claimedMilestones).toContain(MISSION_MILESTONES[0]);
  });

  it('awards cumulative drops for multiple milestones', () => {
    setupWithCompletedMissions(3); // 30P → milestones at 10, 20, 30
    const { dropsAwarded } = useGameStore.getState().claimMissions();
    const expected = MISSION_MILESTONE_DROPS[0]! + MISSION_MILESTONE_DROPS[1]! + MISSION_MILESTONE_DROPS[2]!;
    expect(dropsAwarded).toBe(expected);
    expect(useGameStore.getState().state.dailyMissions.claimedMilestones.length).toBe(3);
  });

  it('returns 0 when no milestones are reached', () => {
    setupWithCompletedMissions(0);
    const { dropsAwarded } = useGameStore.getState().claimMissions();
    expect(dropsAwarded).toBe(0);
  });

  it('does not double-claim already claimed milestones', () => {
    setupWithCompletedMissions(2); // 20P → milestones at 10, 20
    useGameStore.getState().claimMissions();

    // Claim again — should get 0
    const { dropsAwarded } = useGameStore.getState().claimMissions();
    expect(dropsAwarded).toBe(0);
  });

  it('allows overflow past MAX_WATER_DROPS', () => {
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        waterDrops: MAX_WATER_DROPS,
        lastDropRegenAt: Date.now(),
        dailyMissions: {
          date: todayLocalDate(),
          missions: [
            { templateId: 'test_0', type: 'water', target: 1, progress: 1, completed: true },
          ],
          claimedPoints: 0,
          claimedMilestones: [],
          allCompletedClaimed: false,
        },
      },
    }));
    useGameStore.getState().claimMissions();
    expect(useGameStore.getState().state.waterDrops).toBe(MAX_WATER_DROPS + MISSION_MILESTONE_DROPS[0]!);
  });

  it('claims only newly reached milestones when called incrementally', () => {
    setupWithCompletedMissions(1);
    useGameStore.getState().claimMissions(); // claim 10P milestone

    // Complete 2 more missions → 30P total
    useGameStore.setState((s) => {
      const missions = s.state.dailyMissions.missions.map((m, i) =>
        i < 3 ? { ...m, progress: 1, completed: true } : m,
      );
      return {
        state: {
          ...s.state,
          dailyMissions: { ...s.state.dailyMissions, missions },
        },
      };
    });

    const { dropsAwarded } = useGameStore.getState().claimMissions();
    // Should only get drops for milestones 20P and 30P (10P already claimed)
    expect(dropsAwarded).toBe(MISSION_MILESTONE_DROPS[1]! + MISSION_MILESTONE_DROPS[2]!);
  });
});

// ── Daily Check-in ─────────────────────────────────────────────────

describe('canClaimCheckin', () => {
  beforeEach(resetStore);

  it('returns true when lastRewardDate is empty', () => {
    expect(useGameStore.getState().canClaimCheckin()).toBe(true);
  });

  it('returns false after claiming today', () => {
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        streak: { ...s.state.streak, lastRewardDate: todayLocalDate() },
      },
    }));
    expect(useGameStore.getState().canClaimCheckin()).toBe(false);
  });

  it('returns true when last reward was a different day', () => {
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        streak: { ...s.state.streak, lastRewardDate: '2026-01-01' },
      },
    }));
    expect(useGameStore.getState().canClaimCheckin()).toBe(true);
  });
});

describe('checkinDrops', () => {
  beforeEach(resetStore);

  it('returns base drops with no streak bonus at streak=0', () => {
    const { base, bonus, total } = useGameStore.getState().checkinDrops();
    expect(base).toBe(CHECKIN_BASE_DROPS);
    expect(bonus).toBe(0);
    expect(total).toBe(CHECKIN_BASE_DROPS);
  });

  it('returns base drops with no bonus at streak=1', () => {
    useGameStore.setState((s) => ({
      state: { ...s.state, streak: { ...s.state.streak, currentStreak: 1 } },
    }));
    const { bonus } = useGameStore.getState().checkinDrops();
    expect(bonus).toBe(0);
  });

  it('returns streak-1 bonus at streak=5', () => {
    useGameStore.setState((s) => ({
      state: { ...s.state, streak: { ...s.state.streak, currentStreak: 5 } },
    }));
    const { bonus, total } = useGameStore.getState().checkinDrops();
    expect(bonus).toBe(4);
    expect(total).toBe(CHECKIN_BASE_DROPS + 4);
  });

  it('caps bonus at CHECKIN_STREAK_BONUS_MAX', () => {
    useGameStore.setState((s) => ({
      state: { ...s.state, streak: { ...s.state.streak, currentStreak: 100 } },
    }));
    const { bonus } = useGameStore.getState().checkinDrops();
    expect(bonus).toBe(CHECKIN_STREAK_BONUS_MAX);
  });
});

describe('claimCheckin', () => {
  beforeEach(resetStore);

  it('awards drops and sets lastRewardDate', () => {
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        streak: { ...s.state.streak, currentStreak: 1, lastRewardDate: '' },
        waterDrops: 10,
        lastDropRegenAt: Date.now(),
      },
    }));
    const { dropsAwarded, streakBonus } = useGameStore.getState().claimCheckin();
    expect(dropsAwarded).toBe(CHECKIN_BASE_DROPS);
    expect(streakBonus).toBe(0);
    expect(useGameStore.getState().state.streak.lastRewardDate).toBe(todayLocalDate());
    expect(useGameStore.getState().state.waterDrops).toBe(10 + CHECKIN_BASE_DROPS);
  });

  it('prevents double-claim on the same day', () => {
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        streak: { ...s.state.streak, currentStreak: 1, lastRewardDate: '' },
        waterDrops: 10,
        lastDropRegenAt: Date.now(),
      },
    }));
    useGameStore.getState().claimCheckin();
    const { dropsAwarded } = useGameStore.getState().claimCheckin();
    expect(dropsAwarded).toBe(0);
  });

  it('includes streak bonus in drops awarded', () => {
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        streak: { ...s.state.streak, currentStreak: 10, lastRewardDate: '' },
        waterDrops: 5,
        lastDropRegenAt: Date.now(),
      },
    }));
    const { dropsAwarded, streakBonus } = useGameStore.getState().claimCheckin();
    expect(streakBonus).toBe(9); // streak 10 → bonus = min(9, 20) = 9
    expect(dropsAwarded).toBe(CHECKIN_BASE_DROPS + 9);
  });

  it('allows overflow past MAX_WATER_DROPS', () => {
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        streak: { ...s.state.streak, currentStreak: 1, lastRewardDate: '' },
        waterDrops: MAX_WATER_DROPS,
        lastDropRegenAt: Date.now(),
      },
    }));
    useGameStore.getState().claimCheckin();
    expect(useGameStore.getState().state.waterDrops).toBe(MAX_WATER_DROPS + CHECKIN_BASE_DROPS);
  });
});

// ── Migrations v5→v6, v6→v7 ───────────────────────────────────────

describe('migrate v5 → v6', () => {
  it('adds empty dailyMissions state', () => {
    const v5State = {
      schemaVersion: 5,
      userId: 'test-user',
      displayName: 'Guest',
      createdAt: 1000,
      updatedAt: 2000,
      waterDrops: 20,
      lastDropRegenAt: 3000,
      activeTree: null,
      collection: [],
      stats: { totalPlanted: 0, totalWatered: 0, totalHarvested: 0, driedLeavesGained: 0, sproutsGained: 0, sproutsSpent: 0, shopPurchases: { common: 0, rare: 0, legendary: 0 } },
      streak: { currentStreak: 2, longestStreak: 5, lastCheckinDate: '2026-04-06' },
      pityPoints: 0,
    };
    const result = migrate(v5State as unknown as { schemaVersion: number } & Record<string, unknown>);
    expect(result.schemaVersion).toBe(SCHEMA_VERSION);
    expect(result.dailyMissions).toEqual({
      date: '',
      missions: [],
      claimedPoints: 0,
      claimedMilestones: [],
      allCompletedClaimed: false,
    });
  });
});

describe('migrate v6 → v7', () => {
  it('adds lastRewardDate to streak', () => {
    const v6State = {
      schemaVersion: 6,
      userId: 'test-user',
      displayName: 'Guest',
      createdAt: 1000,
      updatedAt: 2000,
      waterDrops: 20,
      lastDropRegenAt: 3000,
      activeTree: null,
      collection: [],
      stats: { totalPlanted: 0, totalWatered: 0, totalHarvested: 0, driedLeavesGained: 0, sproutsGained: 0, sproutsSpent: 0, shopPurchases: { common: 0, rare: 0, legendary: 0 } },
      streak: { currentStreak: 3, longestStreak: 5, lastCheckinDate: '2026-04-06' },
      pityPoints: 0,
      dailyMissions: { date: '', missions: [], claimedPoints: 0, claimedMilestones: [] },
    };
    const result = migrate(v6State as unknown as { schemaVersion: number } & Record<string, unknown>);
    expect(result.schemaVersion).toBe(SCHEMA_VERSION);
    expect(result.streak.lastRewardDate).toBe('');
    // Existing streak fields preserved
    expect(result.streak.currentStreak).toBe(3);
    expect(result.streak.longestStreak).toBe(5);
    // v7→v8 also applied
    expect(result.sprouts).toBe(0);
    expect(result.dailyMissions.allCompletedClaimed).toBe(false);
  });
});

describe('migrate v7 → v8', () => {
  it('adds sprouts and allCompletedClaimed', () => {
    const v7State = {
      schemaVersion: 7,
      userId: 'test-user',
      displayName: 'Guest',
      createdAt: 1000,
      updatedAt: 2000,
      waterDrops: 20,
      lastDropRegenAt: 3000,
      activeTree: null,
      collection: [],
      stats: { totalPlanted: 5, totalWatered: 100, totalHarvested: 5, driedLeavesGained: 0, sproutsGained: 0, sproutsSpent: 0, shopPurchases: { common: 0, rare: 0, legendary: 0 } },
      streak: { currentStreak: 3, longestStreak: 5, lastCheckinDate: '2026-04-06', lastRewardDate: '2026-04-06' },
      pityPoints: 42,
      dailyMissions: { date: '2026-04-06', missions: [], claimedPoints: 20, claimedMilestones: [10, 20] },
    };
    const result = migrate(v7State as unknown as { schemaVersion: number } & Record<string, unknown>);
    expect(result.schemaVersion).toBe(SCHEMA_VERSION);
    expect(result.sprouts).toBe(0);
    expect(result.dailyMissions.allCompletedClaimed).toBe(false);
    // Existing fields preserved
    expect(result.pityPoints).toBe(42);
    expect(result.dailyMissions.claimedPoints).toBe(20);
  });
});

describe('migrate v8 → v9', () => {
  it('adds lifetime stats fields with zero defaults', () => {
    const v8State = {
      schemaVersion: 8,
      userId: 'test',
      displayName: 'Guest',
      createdAt: 0,
      updatedAt: 0,
      waterDrops: MAX_WATER_DROPS,
      lastDropRegenAt: 0,
      activeTree: null,
      collection: [],
      stats: { totalPlanted: 10, totalWatered: 50, totalHarvested: 8 },
      streak: { currentStreak: 1, longestStreak: 3, lastCheckinDate: '2026-04-06', lastRewardDate: '2026-04-06' },
      pityPoints: 15,
      sprouts: 200,
      dailyMissions: { date: '2026-04-06', missions: [], claimedPoints: 0, claimedMilestones: [], allCompletedClaimed: false },
    };
    const result = migrate(v8State as unknown as { schemaVersion: number } & Record<string, unknown>);
    expect(result.schemaVersion).toBe(SCHEMA_VERSION);
    expect(result.stats.driedLeavesGained).toBe(0);
    expect(result.stats.sproutsGained).toBe(0);
    expect(result.stats.sproutsSpent).toBe(0);
    expect(result.stats.shopPurchases).toEqual({ common: 0, rare: 0, legendary: 0 });
    // Existing fields preserved
    expect(result.stats.totalPlanted).toBe(10);
    expect(result.stats.totalHarvested).toBe(8);
    expect(result.sprouts).toBe(200);
  });
});

describe('setPassportTitle / setPassportAvatar', () => {
  beforeEach(resetStore);

  it('sets and clears the custom title', () => {
    useGameStore.getState().setPassportTitle('collect_rank_1');
    expect(useGameStore.getState().state.passportCustomization.titleAchievementId)
      .toBe('collect_rank_1');
    useGameStore.getState().setPassportTitle(null);
    expect(useGameStore.getState().state.passportCustomization.titleAchievementId)
      .toBeNull();
  });

  it('sets and clears the avatar', () => {
    useGameStore.getState().setPassportAvatar({ speciesId: 5, stage: 3 });
    expect(useGameStore.getState().state.passportCustomization.avatar)
      .toEqual({ speciesId: 5, stage: 3 });
    useGameStore.getState().setPassportAvatar(null);
    expect(useGameStore.getState().state.passportCustomization.avatar).toBeNull();
  });

  it('resetAllProgress clears passportCustomization back to defaults', () => {
    const store = useGameStore.getState();
    store.setPassportTitle('collect_rank_1');
    store.setPassportAvatar({ speciesId: 5, stage: 3 });
    store.resetAllProgress();
    expect(useGameStore.getState().state.passportCustomization).toEqual({
      titleAchievementId: null,
      avatar: null,
    });
  });
});

describe('migrate v11 → v12', () => {
  it('adds default passportCustomization to a v11 save', () => {
    const v11State = {
      schemaVersion: 11,
      userId: 'test',
      displayName: 'Guest',
      createdAt: 0,
      updatedAt: 0,
      waterDrops: MAX_WATER_DROPS,
      lastDropRegenAt: 0,
      activeTree: null,
      collection: [],
      stats: {
        totalPlanted: 0, totalWatered: 0, totalHarvested: 0,
        driedLeavesGained: 0, sproutsGained: 0, sproutsSpent: 0,
        shopPurchases: { common: 0, rare: 0, legendary: 0 },
        harvestByRarity: { common: 0, rare: 0, legendary: 0 },
        comboCount: { combo10: 0, combo15: 0, combo20: 0 },
        seedPacketsOpened: { total: 0, common: 0, rare: 0, legendary: 0 },
        missionsCompleted: 0,
        allDailyMissionsCompleted: 0,
      },
      streak: { currentStreak: 0, longestStreak: 0, lastCheckinDate: '', lastRewardDate: '' },
      pityPoints: 0,
      sprouts: 0,
      dailyMissions: { date: '', missions: [], claimedPoints: 0, claimedMilestones: [], allCompletedClaimed: false },
      achievements: {},
      producer: { sproutLevel: 1, waterLevel: 1, lastClaimAt: 0 },
    };
    const result = migrate(v11State as unknown as { schemaVersion: number } & Record<string, unknown>);
    expect(result.schemaVersion).toBe(SCHEMA_VERSION);
    expect(result.passportCustomization).toEqual({
      titleAchievementId: null,
      avatar: null,
    });
  });
});

// ── Sprout currency ────────────────────────────────────────────────

describe('sprout awarding on harvest', () => {
  beforeEach(resetStore);

  it('awards 1 sprout for common harvest', () => {
    const tree = mockTree({ rarity: 'common', requiredWaterings: 1, currentWaterings: 0, speciesId: 0 });
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        activeTree: tree,
        waterDrops: 5,
        lastDropRegenAt: Date.now(),
        sprouts: 10,
      },
    }));
    const result = useGameStore.getState().waterTree();
    expect(result.ok).toBe(true);
    expect(result.sproutsGained).toBe(SPROUT_HARVEST_COMMON);
    expect(useGameStore.getState().state.sprouts).toBe(10 + SPROUT_HARVEST_COMMON);
  });

  it('awards 3 sprouts for rare harvest', () => {
    const tree = mockTree({ rarity: 'rare', requiredWaterings: 1, currentWaterings: 0, speciesId: 1 });
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        activeTree: tree,
        waterDrops: 5,
        lastDropRegenAt: Date.now(),
        sprouts: 0,
      },
    }));
    const result = useGameStore.getState().waterTree();
    expect(result.sproutsGained).toBe(SPROUT_HARVEST_RARE);
  });

  it('awards 10 sprouts for legendary harvest', () => {
    const tree = mockTree({ rarity: 'legendary', requiredWaterings: 1, currentWaterings: 0, speciesId: 2 });
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        activeTree: tree,
        waterDrops: 5,
        lastDropRegenAt: Date.now(),
        sprouts: 0,
      },
    }));
    const result = useGameStore.getState().waterTree();
    expect(result.sproutsGained).toBe(SPROUT_HARVEST_LEGENDARY);
  });
});

describe('openBooster', () => {
  beforeEach(resetStore);

  it('returns null if insufficient sprouts', () => {
    useGameStore.setState((s) => ({
      state: { ...s.state, sprouts: 50 },
    }));
    const result = useGameStore.getState().openBooster('common');
    expect(result).toBeNull();
  });

  it('deducts cost and returns a species', () => {
    useGameStore.setState((s) => ({
      state: { ...s.state, sprouts: BOOSTER_COST_COMMON + 50 },
    }));
    const result = useGameStore.getState().openBooster('common');
    expect(result).not.toBeNull();
    expect(result!.speciesId).toBeGreaterThanOrEqual(0);
    // Sprouts should be: initial - cost + gain
    const state = useGameStore.getState().state;
    expect(state.sprouts).toBeLessThanOrEqual(BOOSTER_COST_COMMON + 50);
  });
});

describe('refreshMission', () => {
  beforeEach(resetStore);

  it('replaces an incomplete mission for 10 sprouts', () => {
    const missions: DailyMission[] = [
      { templateId: 'water_100', type: 'water', target: 100, progress: 5, completed: false },
      { templateId: 'plant_10', type: 'plant', target: 10, progress: 0, completed: false },
    ];
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        sprouts: 20,
        dailyMissions: { date: todayLocalDate(), missions, claimedPoints: 0, claimedMilestones: [], allCompletedClaimed: false },
      },
    }));
    const ok = useGameStore.getState().refreshMission(0);
    expect(ok).toBe(true);
    const state = useGameStore.getState().state;
    expect(state.sprouts).toBe(20 - SPROUT_QUEST_REFRESH_COST);
    expect(state.dailyMissions.missions[0]!.templateId).not.toBe('water_100');
    expect(state.dailyMissions.missions[0]!.progress).toBe(0);
  });

  it('refuses to refresh a completed mission', () => {
    const missions: DailyMission[] = [
      { templateId: 'water_100', type: 'water', target: 100, progress: 100, completed: true },
    ];
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        sprouts: 20,
        dailyMissions: { date: todayLocalDate(), missions, claimedPoints: 0, claimedMilestones: [], allCompletedClaimed: false },
      },
    }));
    const ok = useGameStore.getState().refreshMission(0);
    expect(ok).toBe(false);
  });
});

describe('claimAllCompletedBonus', () => {
  beforeEach(resetStore);

  it('awards 100 sprouts when all 5 missions complete', () => {
    const missions: DailyMission[] = Array.from({ length: DAILY_MISSION_COUNT }, (_, i) => ({
      templateId: `test_${i}`,
      type: 'water' as const,
      target: 1,
      progress: 1,
      completed: true,
    }));
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        sprouts: 50,
        dailyMissions: { date: todayLocalDate(), missions, claimedPoints: 0, claimedMilestones: [], allCompletedClaimed: false },
      },
    }));
    const { sproutsAwarded } = useGameStore.getState().claimAllCompletedBonus();
    expect(sproutsAwarded).toBe(SPROUT_ALL_MISSIONS_BONUS);
    expect(useGameStore.getState().state.sprouts).toBe(50 + SPROUT_ALL_MISSIONS_BONUS);
    expect(useGameStore.getState().state.dailyMissions.allCompletedClaimed).toBe(true);
  });

  it('does not double-claim', () => {
    const missions: DailyMission[] = Array.from({ length: DAILY_MISSION_COUNT }, (_, i) => ({
      templateId: `test_${i}`,
      type: 'water' as const,
      target: 1,
      progress: 1,
      completed: true,
    }));
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        sprouts: 50,
        dailyMissions: { date: todayLocalDate(), missions, claimedPoints: 0, claimedMilestones: [], allCompletedClaimed: true },
      },
    }));
    const { sproutsAwarded } = useGameStore.getState().claimAllCompletedBonus();
    expect(sproutsAwarded).toBe(0);
  });
});
