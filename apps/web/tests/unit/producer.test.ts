import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { useGameStore, computeProducer } from '@/store/gameStore';
import { createInitialState } from '@/store/initialState';
import {
  MAX_WATER_DROPS,
  PRODUCER_MAX_LEVEL,
  PRODUCER_PERIOD_MS,
  SPROUT_PRODUCER_UPGRADE_COST,
  SPROUT_PRODUCER_YIELD,
  WATER_PRODUCER_UPGRADE_COST,
  WATER_PRODUCER_YIELD,
  type PlayerState,
} from '@florify/shared';
import { migrate } from '@/store/migrations';

function resetStore() {
  useGameStore.setState({ state: createInitialState() });
  window.localStorage.clear();
}

function patchState(patch: Partial<PlayerState>) {
  const cur = useGameStore.getState().state;
  useGameStore.setState({ state: { ...cur, ...patch } });
}

describe('computeProducer', () => {
  beforeEach(resetStore);

  it('returns zero at the start of a fresh window', () => {
    const state = useGameStore.getState().state;
    // createInitialState seeds lastClaimAt = now, so elapsed ≈ 0
    const computed = computeProducer(state);
    expect(computed.sproutReady).toBe(0);
    expect(computed.waterReady).toBe(0);
    expect(computed.elapsedRatio).toBeLessThan(0.001);
    expect(computed.isFull).toBe(false);
  });

  it('half-fills after 12 hours at level 1', () => {
    const now = Date.now();
    vi.useFakeTimers();
    vi.setSystemTime(now);
    patchState({
      producer: { sproutLevel: 1, waterLevel: 1, lastClaimAt: now - PRODUCER_PERIOD_MS / 2 },
    });
    const computed = computeProducer(useGameStore.getState().state);
    expect(computed.elapsedRatio).toBeCloseTo(0.5, 3);
    expect(computed.sproutReady).toBe(Math.floor(SPROUT_PRODUCER_YIELD[0] * 0.5));
    expect(computed.waterReady).toBe(Math.floor(WATER_PRODUCER_YIELD[0] * 0.5));
    expect(computed.isFull).toBe(false);
    vi.useRealTimers();
  });

  it('fills exactly at 24 hours', () => {
    const now = Date.now();
    vi.useFakeTimers();
    vi.setSystemTime(now);
    patchState({
      producer: { sproutLevel: 1, waterLevel: 1, lastClaimAt: now - PRODUCER_PERIOD_MS },
    });
    const computed = computeProducer(useGameStore.getState().state);
    expect(computed.elapsedRatio).toBe(1);
    expect(computed.sproutReady).toBe(SPROUT_PRODUCER_YIELD[0]);
    expect(computed.waterReady).toBe(WATER_PRODUCER_YIELD[0]);
    expect(computed.isFull).toBe(true);
    expect(computed.nextFullAt).toBeNull();
    vi.useRealTimers();
  });

  it('clamps to cap after 48 hours (stop-at-cap behavior)', () => {
    const now = Date.now();
    vi.useFakeTimers();
    vi.setSystemTime(now);
    patchState({
      producer: { sproutLevel: 1, waterLevel: 1, lastClaimAt: now - PRODUCER_PERIOD_MS * 2 },
    });
    const computed = computeProducer(useGameStore.getState().state);
    expect(computed.sproutReady).toBe(SPROUT_PRODUCER_YIELD[0]);
    expect(computed.waterReady).toBe(WATER_PRODUCER_YIELD[0]);
    vi.useRealTimers();
  });

  it('scales yield with level', () => {
    const now = Date.now();
    vi.useFakeTimers();
    vi.setSystemTime(now);
    patchState({
      producer: { sproutLevel: 5, waterLevel: 3, lastClaimAt: now - PRODUCER_PERIOD_MS },
    });
    const computed = computeProducer(useGameStore.getState().state);
    expect(computed.sproutReady).toBe(SPROUT_PRODUCER_YIELD[4]); // level 5 → index 4
    expect(computed.waterReady).toBe(WATER_PRODUCER_YIELD[2]);   // level 3 → index 2
    expect(computed.sproutYield).toBe(SPROUT_PRODUCER_YIELD[4]);
    expect(computed.waterYield).toBe(WATER_PRODUCER_YIELD[2]);
    vi.useRealTimers();
  });
});

describe('claimProducer', () => {
  beforeEach(resetStore);
  afterEach(() => vi.useRealTimers());

  it('grants rewards when full and resets the window', () => {
    const now = Date.now();
    vi.useFakeTimers();
    vi.setSystemTime(now);
    patchState({
      sprouts: 0,
      waterDrops: 10,
      lastDropRegenAt: now,
      producer: { sproutLevel: 1, waterLevel: 1, lastClaimAt: now - PRODUCER_PERIOD_MS },
    });
    const result = useGameStore.getState().claimProducer();
    expect(result.sprouts).toBe(SPROUT_PRODUCER_YIELD[0]);
    expect(result.waters).toBe(WATER_PRODUCER_YIELD[0]);

    const s = useGameStore.getState().state;
    expect(s.sprouts).toBe(SPROUT_PRODUCER_YIELD[0]);
    expect(s.waterDrops).toBe(10 + WATER_PRODUCER_YIELD[0]);
    expect(s.producer.lastClaimAt).toBe(now);
    expect(s.stats.sproutsGained).toBe(SPROUT_PRODUCER_YIELD[0]);
  });

  it('allows water to overflow past MAX_WATER_DROPS', () => {
    const now = Date.now();
    vi.useFakeTimers();
    vi.setSystemTime(now);
    patchState({
      sprouts: 0,
      waterDrops: MAX_WATER_DROPS,
      lastDropRegenAt: now,
      producer: { sproutLevel: 1, waterLevel: 1, lastClaimAt: now - PRODUCER_PERIOD_MS },
    });
    useGameStore.getState().claimProducer();
    const s = useGameStore.getState().state;
    expect(s.waterDrops).toBe(MAX_WATER_DROPS + WATER_PRODUCER_YIELD[0]);
  });

  it('is a no-op at ratio=0 (no partial window burned)', () => {
    const now = Date.now();
    vi.useFakeTimers();
    vi.setSystemTime(now);
    const originalClaimAt = now;
    patchState({
      sprouts: 0,
      producer: { sproutLevel: 1, waterLevel: 1, lastClaimAt: originalClaimAt },
    });
    const result = useGameStore.getState().claimProducer();
    expect(result.sprouts).toBe(0);
    expect(result.waters).toBe(0);
    const s = useGameStore.getState().state;
    expect(s.producer.lastClaimAt).toBe(originalClaimAt);
  });
});

describe('upgradeProducer', () => {
  beforeEach(resetStore);
  afterEach(() => vi.useRealTimers());

  it('rejects upgrade with insufficient sprouts', () => {
    patchState({ sprouts: 10 });
    const result = useGameStore.getState().upgradeProducer('sprout');
    expect(result.ok).toBe(false);
    expect(useGameStore.getState().state.producer.sproutLevel).toBe(1);
  });

  it('upgrades sprout track and deducts cost', () => {
    patchState({ sprouts: 1000 });
    const cost = SPROUT_PRODUCER_UPGRADE_COST[1]; // L2 cost
    const result = useGameStore.getState().upgradeProducer('sprout');
    expect(result.ok).toBe(true);
    const s = useGameStore.getState().state;
    expect(s.producer.sproutLevel).toBe(2);
    expect(s.sprouts).toBe(1000 - cost);
    expect(s.stats.sproutsSpent).toBe(cost);
  });

  it('upgrades water track independently of sprout level', () => {
    patchState({ sprouts: 1000 });
    useGameStore.getState().upgradeProducer('water');
    const s = useGameStore.getState().state;
    expect(s.producer.waterLevel).toBe(2);
    expect(s.producer.sproutLevel).toBe(1);
    expect(s.sprouts).toBe(1000 - WATER_PRODUCER_UPGRADE_COST[1]);
  });

  it('claims pending rewards before upgrading (claim-first semantics)', () => {
    const now = Date.now();
    vi.useFakeTimers();
    vi.setSystemTime(now);
    patchState({
      sprouts: 1000,
      waterDrops: 10,
      lastDropRegenAt: now,
      producer: { sproutLevel: 1, waterLevel: 1, lastClaimAt: now - PRODUCER_PERIOD_MS },
    });
    // Before upgrade: 100 sprouts + 30 waters ready. Upgrading sprout to L2
    // should grant the pending rewards, then deduct the 50 upgrade cost.
    const cost = SPROUT_PRODUCER_UPGRADE_COST[1];
    useGameStore.getState().upgradeProducer('sprout');
    const s = useGameStore.getState().state;
    expect(s.producer.sproutLevel).toBe(2);
    expect(s.sprouts).toBe(1000 + SPROUT_PRODUCER_YIELD[0] - cost);
    expect(s.waterDrops).toBe(10 + WATER_PRODUCER_YIELD[0]);
    expect(s.producer.lastClaimAt).toBe(now);
  });

  it('rejects upgrade at max level', () => {
    patchState({
      sprouts: 100000,
      producer: { sproutLevel: PRODUCER_MAX_LEVEL, waterLevel: 1, lastClaimAt: Date.now() },
    });
    const result = useGameStore.getState().upgradeProducer('sprout');
    expect(result.ok).toBe(false);
    expect(useGameStore.getState().state.producer.sproutLevel).toBe(PRODUCER_MAX_LEVEL);
  });
});

describe('migration v10 → v11', () => {
  it('seeds producer field on old saves with default L1 and fresh claim window', () => {
    const oldSave = {
      schemaVersion: 10,
      userId: 'test',
      displayName: 'Test',
      createdAt: 0,
      updatedAt: 0,
      waterDrops: 50,
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
      sprouts: 100,
      dailyMissions: { date: '', missions: [], claimedPoints: 0, claimedMilestones: [], allCompletedClaimed: false },
      achievements: {},
    };
    const before = Date.now();
    const migrated = migrate(oldSave as any);
    const after = Date.now();

    expect(migrated.schemaVersion).toBe(11);
    expect(migrated.producer).toBeDefined();
    expect(migrated.producer.sproutLevel).toBe(1);
    expect(migrated.producer.waterLevel).toBe(1);
    expect(migrated.producer.lastClaimAt).toBeGreaterThanOrEqual(before);
    expect(migrated.producer.lastClaimAt).toBeLessThanOrEqual(after);
    // Existing fields untouched
    expect(migrated.sprouts).toBe(100);
    expect(migrated.waterDrops).toBe(50);
  });
});
