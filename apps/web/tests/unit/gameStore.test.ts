import { beforeEach, describe, expect, it } from 'vitest';
import { selectFloristCard, useGameStore } from '@/store/gameStore';
import { createInitialState } from '@/store/initialState';
import { COOLDOWN_MS, type TreeInstance } from '@florify/shared';
import { todayLocalDate } from '@/lib/time';

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
    requiredWaterings: 3,
    currentWaterings: 0,
    plantedAt: Date.now(),
    lastWateredAt: null,
    harvestedAt: null,
    ...overrides,
  };
}

describe('plantTree', () => {
  beforeEach(resetStore);

  it('creates an active tree with valid fields', () => {
    const tree = useGameStore.getState().plantTree();
    const active = useGameStore.getState().state.activeTree;
    expect(active?.id).toBe(tree.id);
    expect(tree.requiredWaterings).toBeGreaterThanOrEqual(1);
    expect(tree.requiredWaterings).toBeLessThanOrEqual(10);
    expect(tree.currentWaterings).toBe(0);
    expect(tree.lastWateredAt).toBeNull();
    expect(tree.harvestedAt).toBeNull();
    expect(['common', 'rare', 'legendary']).toContain(tree.rarity);
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
    useGameStore.setState((s) => ({ state: { ...s.state, activeTree: mockTree() } }));
    const r = useGameStore.getState().waterTree();
    expect(r.ok).toBe(true);
    expect(r.harvested).toBeUndefined();
    expect(useGameStore.getState().state.activeTree?.currentWaterings).toBe(1);
    expect(useGameStore.getState().state.stats.totalWatered).toBe(1);
  });

  it('rejects water during cooldown', () => {
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        activeTree: mockTree({ lastWateredAt: Date.now(), currentWaterings: 1 }),
      },
    }));
    const r = useGameStore.getState().waterTree();
    expect(r.ok).toBe(false);
    expect(r.nextAvailableAt).toBeDefined();
    expect(r.nextAvailableAt).toBeGreaterThan(Date.now());
  });

  it('allows water after cooldown elapsed', () => {
    const past = Date.now() - COOLDOWN_MS - 1000;
    useGameStore.setState((s) => ({
      state: { ...s.state, activeTree: mockTree({ lastWateredAt: past, currentWaterings: 1 }) },
    }));
    expect(useGameStore.getState().waterTree().ok).toBe(true);
    expect(useGameStore.getState().state.activeTree?.currentWaterings).toBe(2);
  });

  it('reaching requiredWaterings triggers harvest', () => {
    useGameStore.setState((s) => ({
      state: { ...s.state, activeTree: mockTree({ requiredWaterings: 1 }) },
    }));
    const r = useGameStore.getState().waterTree();
    expect(r.ok).toBe(true);
    expect(r.harvested).toBeDefined();
    expect(r.harvested?.harvestedAt).not.toBeNull();
    const state = useGameStore.getState().state;
    expect(state.activeTree).toBeNull();
    expect(state.collection.length).toBe(1);
    expect(state.stats.totalHarvested).toBe(1);
  });

  it('harvested tree preserves speciesId + seed for replay', () => {
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        activeTree: mockTree({ requiredWaterings: 1, seed: 4242, speciesId: 7 }),
      },
    }));
    const r = useGameStore.getState().waterTree();
    expect(r.harvested?.seed).toBe(4242);
    expect(r.harvested?.speciesId).toBe(7);
  });
});

describe('canWater / nextWaterAt', () => {
  beforeEach(resetStore);

  it('canWater is false with no tree', () => {
    expect(useGameStore.getState().canWater()).toBe(false);
  });

  it('canWater is true immediately after plant (lastWateredAt null)', () => {
    useGameStore.setState((s) => ({ state: { ...s.state, activeTree: mockTree() } }));
    expect(useGameStore.getState().canWater()).toBe(true);
    expect(useGameStore.getState().nextWaterAt()).toBeNull();
  });

  it('canWater is false during cooldown; nextWaterAt reflects the wait', () => {
    const wateredAt = Date.now();
    useGameStore.setState((s) => ({
      state: { ...s.state, activeTree: mockTree({ lastWateredAt: wateredAt }) },
    }));
    expect(useGameStore.getState().canWater()).toBe(false);
    expect(useGameStore.getState().nextWaterAt()).toBe(wateredAt + COOLDOWN_MS);
  });
});

describe('resetActiveTree', () => {
  beforeEach(resetStore);

  it('clears active tree, keeps collection', () => {
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        activeTree: mockTree({ currentWaterings: 2 }),
        collection: [mockTree({ id: 'c1', harvestedAt: Date.now() })],
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
          mockTree({ id: 'a', speciesId: 1, rarity: 'common', harvestedAt: 1 }),
          mockTree({ id: 'b', speciesId: 1, rarity: 'common', harvestedAt: 2 }), // dup
          mockTree({ id: 'c', speciesId: 250, rarity: 'rare', harvestedAt: 3 }),
          mockTree({ id: 'd', speciesId: 290, rarity: 'legendary', harvestedAt: 4 }),
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
      mockTree({ id: `t${i}`, speciesId: i, rarity: 'common', harvestedAt: i + 1 }),
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
        collection: [mockTree({ id: 'c1', harvestedAt: Date.now() })],
        stats: { totalPlanted: 5, totalWatered: 10, totalHarvested: 2 },
      },
    }));
    useGameStore.getState().resetAllProgress();
    const s = useGameStore.getState().state;
    expect(s.activeTree).toBeNull();
    expect(s.collection).toEqual([]);
    expect(s.stats.totalPlanted).toBe(0);
  });
});
