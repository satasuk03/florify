import { nanoid } from 'nanoid';
import { MAX_WATER_DROPS, SCHEMA_VERSION, type PlayerState } from '@florify/shared';

export function createInitialState(): PlayerState {
  const now = Date.now();
  return {
    schemaVersion: SCHEMA_VERSION,
    userId: nanoid(),
    displayName: 'Guest',
    createdAt: now,
    updatedAt: now,
    waterDrops: MAX_WATER_DROPS,
    lastDropRegenAt: now,
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
      goldGained: 0,
      goldSpent: 0,
      cosmeticBoxesOpened: { character: 0, background: 0 },
    },
    streak: { currentStreak: 0, longestStreak: 0, lastCheckinDate: '', lastRewardDate: '' },
    pityPoints: 0,
    sprouts: 0,
    dailyMissions: {
      date: '',
      missions: [],
      claimedPoints: 0,
      claimedMilestones: [],
      allCompletedClaimed: false,
    },
    achievements: {},
    producer: {
      sproutLevel: 1,
      waterLevel: 1,
      lastClaimAt: now,
    },
    floraLevels: {},
    passportCustomization: {
      titleSource: { type: 'auto' },
      avatar: null,
    },
    gold: 0,
    characters: [],
    backgrounds: [],
    equippedCharacterId: null,
    equippedBackgroundId: null,
  };
}
