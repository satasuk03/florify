export type Rarity = 'common' | 'rare' | 'legendary';

export interface TreeInstance {
  id: string;                  // nanoid()
  seed: number;                // uint32 — deterministic geometry
  speciesId: number;           // 0..299
  rarity: Rarity;              // denormalized from species table
  requiredWaterings: number;   // 1..10 — fixed at plant time
  currentWaterings: number;    // 0..requiredWaterings
  plantedAt: number;           // epoch ms
  lastWateredAt: number | null;
  harvestedAt: number | null;  // null if not yet harvested
}

export interface StreakState {
  currentStreak: number;       // consecutive days
  longestStreak: number;
  lastCheckinDate: string;     // 'YYYY-MM-DD' in local timezone
}

export interface PlayerStats {
  totalPlanted: number;
  totalWatered: number;
  totalHarvested: number;
}

export interface PlayerState {
  schemaVersion: 1;
  userId: string;              // local nanoid; linked to a cloud account later
  createdAt: number;
  updatedAt: number;           // last-writer-wins for cloud sync
  activeTree: TreeInstance | null;
  collection: TreeInstance[];  // harvested, append-only
  stats: PlayerStats;
  streak: StreakState;
}

export interface Settings {
  sound: boolean;
  haptics: boolean;
  notifications: boolean;      // in-tab Notification API opt-in
}
