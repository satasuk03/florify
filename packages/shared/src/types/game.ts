export type Rarity = 'common' | 'rare' | 'legendary';

export interface TreeInstance {
  id: string;                  // nanoid()
  seed: number;                // uint32 — deterministic geometry
  speciesId: number;           // 0..299
  rarity: Rarity;              // denormalized from species table
  requiredWaterings: number;   // 10..20 — drop cost, fixed at plant time
  currentWaterings: number;    // 0..requiredWaterings
  plantedAt: number;           // epoch ms
  harvestedAt: number | null;  // null if not yet harvested
}

export interface StreakState {
  currentStreak: number;       // consecutive days
  longestStreak: number;
  lastCheckinDate: string;     // 'YYYY-MM-DD' in local timezone
}

export interface CollectedSpecies {
  speciesId: number;
  rarity: Rarity;
  count: number;                // how many times this species was harvested
  totalWaterings: number;       // cumulative waterings across all harvests
  firstHarvestedAt: number;     // epoch ms
  lastHarvestedAt: number;      // epoch ms
}

export interface PlayerStats {
  totalPlanted: number;
  totalWatered: number;
  totalHarvested: number;
}

export interface PlayerState {
  schemaVersion: 4;
  userId: string;              // local nanoid; linked to a cloud account later
  displayName: string;         // user-editable; 'Guest' until renamed
  createdAt: number;
  updatedAt: number;           // last-writer-wins for cloud sync
  waterDrops: number;          // 0..MAX_WATER_DROPS — current drop count
  lastDropRegenAt: number;     // epoch ms — last regen sync point
  activeTree: TreeInstance | null;
  collection: CollectedSpecies[];  // aggregated per species, sorted by lastHarvestedAt desc
  stats: PlayerStats;
  streak: StreakState;
}

export type Language = 'th' | 'en';

export interface Settings {
  sound: boolean;
  haptics: boolean;
  notifications: boolean;      // in-tab Notification API opt-in
  language: Language;
}
