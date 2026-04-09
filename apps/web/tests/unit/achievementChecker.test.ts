import { describe, expect, it } from 'vitest';
import { checkAchievements } from '@/store/achievementChecker';
import { createInitialState } from '@/store/initialState';
import type { PlayerState } from '@florify/shared';

function stateWith(overrides: Partial<PlayerState>): PlayerState {
  return { ...createInitialState(), ...overrides } as PlayerState;
}

function mockCollection(count: number, rarity: 'common' | 'rare' | 'legendary' = 'common') {
  return Array.from({ length: count }, (_, i) => ({
    speciesId: rarity === 'common' ? i : rarity === 'rare' ? 100 + i : 200 + i,
    rarity,
    count: 1,
    totalWaterings: 10,
    firstHarvestedAt: 0,
    lastHarvestedAt: 0,
  }));
}

describe('checkAchievements', () => {
  it('returns empty array when no conditions are met', () => {
    const state = stateWith({});
    const unlocked = checkAchievements(state);
    expect(unlocked).toEqual([]);
  });

  it('unlocks species_unlocked achievement when collection reaches target', () => {
    const state = stateWith({ collection: mockCollection(20) });
    const unlocked = checkAchievements(state);
    expect(unlocked.map((a) => a.id)).toContain('collect_rank_1');
  });

  it('skips already-unlocked achievements', () => {
    const state = stateWith({
      collection: mockCollection(20),
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

  it('unlocks multiple achievements at once', () => {
    const state = stateWith({
      collection: mockCollection(20),
      stats: {
        ...createInitialState().stats,
        totalHarvested: 10,
        harvestByRarity: { common: 10, rare: 0, legendary: 0 },
      },
    });
    const ids = checkAchievements(state).map((a) => a.id);
    expect(ids).toContain('collect_rank_1');
    expect(ids).toContain('collect_common_10');
    expect(ids).toContain('harvest_total_10');
    expect(ids).toContain('harvest_common_10');
  });

  it('unlocks species_by_rarity for rare collection', () => {
    const state = stateWith({
      collection: mockCollection(10, 'rare'),
    });
    const ids = checkAchievements(state).map((a) => a.id);
    expect(ids).toContain('collect_rare_10');
  });

  it('unlocks watering achievement', () => {
    const state = stateWith({
      stats: {
        ...createInitialState().stats,
        totalWatered: 1000,
      },
    });
    const ids = checkAchievements(state).map((a) => a.id);
    expect(ids).toContain('water_1000');
  });

  it('unlocks sprouts_gained achievement', () => {
    const state = stateWith({
      stats: {
        ...createInitialState().stats,
        sproutsGained: 500,
      },
    });
    const ids = checkAchievements(state).map((a) => a.id);
    expect(ids).toContain('sprout_gain_500');
  });

  it('unlocks sprouts_spent achievement', () => {
    const state = stateWith({
      stats: {
        ...createInitialState().stats,
        sproutsSpent: 500,
      },
    });
    const ids = checkAchievements(state).map((a) => a.id);
    expect(ids).toContain('sprout_spend_500');
  });
});
