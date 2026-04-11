import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore, canMergeFloraLevel } from '@/store/gameStore';
import { createInitialState } from '@/store/initialState';
import { PITY_THRESHOLD } from '@florify/shared';

function reset() {
  useGameStore.setState({ state: createInitialState(), hydrated: true });
}

describe('Flora Level — harvest hook', () => {
  beforeEach(reset);

  it('grants Lv 1 with 0 pending on a fresh species (first harvest)', () => {
    useGameStore.getState().plantTree();
    const s = useGameStore.getState();
    s.state.activeTree!.requiredWaterings = 1;
    useGameStore.setState({ state: { ...s.state } });
    const result = useGameStore.getState().waterTree();
    expect(result.harvested).toBeTruthy();
    const speciesId = result.harvested!.speciesId;
    expect(useGameStore.getState().state.floraLevels[speciesId]).toEqual({
      level: 1,
      pendingMerges: 0,
    });
  });

  it('increments pendingMerges on a duplicate harvest', () => {
    useGameStore.setState({
      state: {
        ...createInitialState(),
        collection: [
          {
            speciesId: 0,
            rarity: 'common',
            count: 1,
            totalWaterings: 10,
            firstHarvestedAt: 1,
            lastHarvestedAt: 1,
          },
        ],
        floraLevels: { 0: { level: 1, pendingMerges: 0 } },
      },
      hydrated: true,
    });
    useGameStore.getState().plantTree();
    const s = useGameStore.getState();
    s.state.activeTree!.requiredWaterings = 1;
    s.state.activeTree!.speciesId = 0;
    s.state.activeTree!.rarity = 'common';
    useGameStore.setState({ state: { ...s.state } });
    useGameStore.getState().waterTree();
    expect(useGameStore.getState().state.floraLevels[0]).toEqual({
      level: 1,
      pendingMerges: 1,
    });
  });

  it('caps pendingMerges at MAX_PENDING_MERGES', () => {
    useGameStore.setState({
      state: {
        ...createInitialState(),
        collection: [
          {
            speciesId: 0,
            rarity: 'common',
            count: 1,
            totalWaterings: 10,
            firstHarvestedAt: 1,
            lastHarvestedAt: 1,
          },
        ],
        floraLevels: { 0: { level: 1, pendingMerges: 6 } },
      },
      hydrated: true,
    });
    useGameStore.getState().plantTree();
    const s = useGameStore.getState();
    s.state.activeTree!.requiredWaterings = 1;
    s.state.activeTree!.speciesId = 0;
    s.state.activeTree!.rarity = 'common';
    useGameStore.setState({ state: { ...s.state } });
    useGameStore.getState().waterTree();
    expect(useGameStore.getState().state.floraLevels[0]!.pendingMerges).toBe(6);
  });

  it('does not touch pending when harvesting a Lv 5 species', () => {
    useGameStore.setState({
      state: {
        ...createInitialState(),
        collection: [
          {
            speciesId: 0,
            rarity: 'common',
            count: 1,
            totalWaterings: 10,
            firstHarvestedAt: 1,
            lastHarvestedAt: 1,
          },
        ],
        floraLevels: { 0: { level: 5, pendingMerges: 0 } },
      },
      hydrated: true,
    });
    useGameStore.getState().plantTree();
    const s = useGameStore.getState();
    s.state.activeTree!.requiredWaterings = 1;
    s.state.activeTree!.speciesId = 0;
    s.state.activeTree!.rarity = 'common';
    useGameStore.setState({ state: { ...s.state } });
    useGameStore.getState().waterTree();
    expect(useGameStore.getState().state.floraLevels[0]).toEqual({
      level: 5,
      pendingMerges: 0,
    });
  });

  it('seeds floraLevels Lv 1 for a pity-rewarded species', () => {
    // Seed pityPoints at PITY_THRESHOLD so the next duplicate immediately triggers a reward.
    const collection = [
      {
        speciesId: 0,
        rarity: 'common' as const,
        count: 1,
        totalWaterings: 10,
        firstHarvestedAt: 1,
        lastHarvestedAt: 1,
      },
    ];
    useGameStore.setState({
      state: {
        ...createInitialState(),
        collection,
        floraLevels: { 0: { level: 1, pendingMerges: 0 } },
        pityPoints: PITY_THRESHOLD, // at threshold — next duplicate triggers immediate reward
      },
      hydrated: true,
    });
    useGameStore.getState().plantTree();
    const s = useGameStore.getState();
    s.state.activeTree!.requiredWaterings = 1;
    s.state.activeTree!.speciesId = 0;
    s.state.activeTree!.rarity = 'common';
    useGameStore.setState({ state: { ...s.state } });
    const result = useGameStore.getState().waterTree();

    // If pity fired, the new species must have a floraLevels entry seeded at Lv 1.
    if (result.pityReward) {
      const rewardId = result.pityReward.speciesId;
      expect(useGameStore.getState().state.floraLevels[rewardId]).toEqual({
        level: 1,
        pendingMerges: 0,
      });
    } else {
      // Pity didn't fire — test setup failed to trigger the condition.
      throw new Error('Test setup failed to trigger pity reward — pityPoints seed may be insufficient.');
    }
  });
});

describe('Flora Level — mergeFloraLevel action', () => {
  beforeEach(reset);

  function seed(entry: { level: 1 | 2 | 3 | 4 | 5; pendingMerges: number }) {
    useGameStore.setState({
      state: {
        ...createInitialState(),
        floraLevels: { 42: entry },
      },
      hydrated: true,
    });
  }

  it('is a no-op when no pending merges', () => {
    seed({ level: 1, pendingMerges: 0 });
    useGameStore.getState().mergeFloraLevel(42);
    expect(useGameStore.getState().state.floraLevels[42]).toEqual({
      level: 1,
      pendingMerges: 0,
    });
  });

  it('advances Lv 1 → 2 when pending = 1', () => {
    seed({ level: 1, pendingMerges: 1 });
    useGameStore.getState().mergeFloraLevel(42);
    expect(useGameStore.getState().state.floraLevels[42]).toEqual({
      level: 2,
      pendingMerges: 0,
    });
  });

  it('drains to Lv 5 in one call with 6 pending from Lv 1', () => {
    seed({ level: 1, pendingMerges: 6 });
    useGameStore.getState().mergeFloraLevel(42);
    expect(useGameStore.getState().state.floraLevels[42]).toEqual({
      level: 5,
      pendingMerges: 0,
    });
  });

  it('leaves remainder when pending is not enough for the next level', () => {
    // Curve is [1, 1, 2, 2]. At Lv 3, cost to Lv 4 is 2; 1 pending is short.
    seed({ level: 3, pendingMerges: 1 });
    useGameStore.getState().mergeFloraLevel(42);
    expect(useGameStore.getState().state.floraLevels[42]).toEqual({
      level: 3,
      pendingMerges: 1,
    });
  });

  it('is a no-op when already at Lv 5', () => {
    seed({ level: 5, pendingMerges: 0 });
    useGameStore.getState().mergeFloraLevel(42);
    expect(useGameStore.getState().state.floraLevels[42]).toEqual({
      level: 5,
      pendingMerges: 0,
    });
  });

  it('is a no-op when the species has no flora level entry', () => {
    useGameStore.getState().mergeFloraLevel(999);
    expect(useGameStore.getState().state.floraLevels[999]).toBeUndefined();
  });
});

describe('canMergeFloraLevel', () => {
  it('returns false for undefined entry', () => {
    expect(canMergeFloraLevel(undefined)).toBe(false);
  });

  it('returns false at Lv 5 (max)', () => {
    expect(canMergeFloraLevel({ level: 5, pendingMerges: 10 })).toBe(false);
  });

  it('returns false when pendingMerges is below curve cost', () => {
    // Lv 3 → Lv 4 cost is 2; 1 pending is not enough.
    expect(canMergeFloraLevel({ level: 3, pendingMerges: 1 })).toBe(false);
  });

  it('returns false when pendingMerges is zero', () => {
    expect(canMergeFloraLevel({ level: 1, pendingMerges: 0 })).toBe(false);
  });

  it('returns true when pendingMerges equals curve cost', () => {
    // Lv 1 → Lv 2 cost is 1.
    expect(canMergeFloraLevel({ level: 1, pendingMerges: 1 })).toBe(true);
  });

  it('returns true when pendingMerges exceeds curve cost', () => {
    // Lv 3 → Lv 4 cost is 2; 3 pending is enough.
    expect(canMergeFloraLevel({ level: 3, pendingMerges: 3 })).toBe(true);
  });
});
