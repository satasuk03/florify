export type Rarity = 'common' | 'rare' | 'legendary';

// ── Daily Missions ─────────────────────────────────────────────────
export type MissionType =
  | 'water'
  | 'plant'
  | 'harvest'
  | 'harvest_rare'
  | 'visit_gallery'
  | 'visit_floripedia'
  | 'share_florist_card';

export interface DailyMission {
  templateId: string;     // references MissionTemplate.id
  type: MissionType;
  target: number;
  progress: number;       // 0..target
  completed: boolean;     // progress >= target
}

export interface DailyMissionState {
  date: string;                    // 'YYYY-MM-DD'
  missions: DailyMission[];        // always length 5
  claimedPoints: number;           // 0-50
  claimedMilestones: number[];     // subset of [10,20,30,40,50]
}

// ── Game Event Bus ─────────────────────────────────────────────────
export type GameEvent =
  | { type: 'water' }
  | { type: 'plant' }
  | { type: 'harvest'; rarity: Rarity; isNew: boolean }
  | { type: 'visit'; screen: 'gallery' | 'floripedia' }
  | { type: 'share' };

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
  schemaVersion: 6;
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
  pityPoints: number;            // 0..PITY_THRESHOLD — dried leaves (🍂) accumulated from duplicates
  dailyMissions: DailyMissionState;
}

export type Language = 'th' | 'en';

export interface Settings {
  sound: boolean;
  haptics: boolean;
  notifications: boolean;      // in-tab Notification API opt-in
  language: Language;
  hasSeenWelcome: boolean;
}
