import { nanoid } from 'nanoid';
import { SCHEMA_VERSION, type PlayerState } from '@florify/shared';

export function createInitialState(): PlayerState {
  const now = Date.now();
  return {
    schemaVersion: SCHEMA_VERSION,
    userId: nanoid(),
    createdAt: now,
    updatedAt: now,
    activeTree: null,
    collection: [],
    stats: { totalPlanted: 0, totalWatered: 0, totalHarvested: 0 },
    streak: { currentStreak: 0, longestStreak: 0, lastCheckinDate: '' },
  };
}
