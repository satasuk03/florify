import { beforeEach, describe, expect, it, vi } from 'vitest';
import { selectFloristCard, useGameStore, computeDrops } from '@/store/gameStore';
import { createInitialState } from '@/store/initialState';
import { MAX_WATER_DROPS, MAX_WATER_COST, MIN_WATER_COST, FIRST_FLORA_COST, DROP_REGEN_MS, type TreeInstance, type CollectedSpecies, type PlayerState } from '@florify/shared';
import { todayLocalDate } from '@/lib/time';
import { migrate } from '@/store/migrations';

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
      waterDrops: 28,
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
        streak: { currentStreak: 3, longestStreak: 3, lastCheckinDate: yesterdayStr },
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
        streak: { currentStreak: 5, longestStreak: 5, lastCheckinDate: stale },
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
    expect(card.rarityProgress.common.total).toBe(200);
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
        stats: { totalPlanted: 4, totalWatered: 20, totalHarvested: 4 },
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
        stats: { totalPlanted: 5, totalWatered: 10, totalHarvested: 2 },
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
      stats: { totalPlanted: 1, totalWatered: 1, totalHarvested: 0 },
      streak: { currentStreak: 0, longestStreak: 0, lastCheckinDate: '' },
    };

    const result = migrate(v2State as unknown as { schemaVersion: number } & Record<string, unknown>);
    expect(result.schemaVersion).toBe(4); // migrates through v3 → v4
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
      stats: { totalPlanted: 0, totalWatered: 0, totalHarvested: 0 },
      streak: { currentStreak: 0, longestStreak: 0, lastCheckinDate: '' },
    };

    const result = migrate(v2State as unknown as { schemaVersion: number } & Record<string, unknown>);
    expect(result.schemaVersion).toBe(4);
    expect(result.waterDrops).toBe(MAX_WATER_DROPS);
    expect(result.activeTree).toBeNull();
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
      stats: { totalPlanted: 3, totalWatered: 47, totalHarvested: 3 },
      streak: { currentStreak: 1, longestStreak: 1, lastCheckinDate: '2026-01-01' },
    };

    const result = migrate(v3State as unknown as { schemaVersion: number } & Record<string, unknown>);
    expect(result.schemaVersion).toBe(4);
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
