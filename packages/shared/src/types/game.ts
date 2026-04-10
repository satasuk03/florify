export type Rarity = 'common' | 'rare' | 'legendary';
export type BoosterTier = 'common' | 'rare' | 'legendary';

// ── Daily Missions ─────────────────────────────────────────────────
export type MissionType =
  | 'water'
  | 'plant'
  | 'harvest'
  | 'harvest_rare'
  | 'harvest_legendary'
  | 'combo10'
  | 'combo15'
  | 'combo20'
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
  allCompletedClaimed: boolean;    // whether the 100🌱 bonus for 5/5 has been claimed today
}

// ── Game Event Bus ─────────────────────────────────────────────────
export type GameEvent =
  | { type: 'water' }
  | { type: 'plant' }
  | { type: 'harvest'; rarity: Rarity; isNew: boolean }
  | { type: 'combo'; level: number }
  | { type: 'visit' }
  | { type: 'share' }
  | { type: 'booster_open'; tier: BoosterTier; rarity: Rarity; isNew: boolean };

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
  lastRewardDate: string;      // 'YYYY-MM-DD' — last date check-in reward was claimed
}

export interface CollectedSpecies {
  speciesId: number;
  rarity: Rarity;
  count: number;                // how many times this species was harvested
  totalWaterings: number;       // cumulative waterings across all harvests
  firstHarvestedAt: number;     // epoch ms
  lastHarvestedAt: number;      // epoch ms
}

export interface ShopPurchases {
  common: number;
  rare: number;
  legendary: number;
}

// ── Achievement system ──────────────────────────────────────────────
export interface AchievementReward {
  type: 'sprouts';
  amount: number;
}

export type AchievementCondition =
  | { type: 'species_unlocked'; target: number }
  | { type: 'species_by_rarity'; rarity: Rarity; target: number }
  | { type: 'species_by_collection'; collection: string; target: number }
  | { type: 'harvest_total'; target: number }
  | { type: 'harvest_by_rarity'; rarity: Rarity; target: number }
  | { type: 'total_watered'; target: number }
  | { type: 'sprouts_gained'; target: number }
  | { type: 'sprouts_spent'; target: number }
  | { type: 'streak'; target: number }
  | { type: 'combo'; level: 10 | 15 | 20; target: number }
  | { type: 'seed_packets'; tier: 'total' | 'common' | 'rare' | 'legendary'; target: number }
  | { type: 'missions_completed'; target: number }
  | { type: 'all_daily_completed'; target: number };

export interface AchievementDef {
  id: string;
  name: string;
  description: { en: string; th: string };
  rewards: AchievementReward[];
  condition: AchievementCondition;
}

export interface AchievementProgress {
  unlockedAt: string;   // ISO date
  claimedAt?: string;   // ISO date — undefined = unclaimed
}

export interface PlayerStats {
  totalPlanted: number;
  totalWatered: number;
  totalHarvested: number;
  driedLeavesGained: number;
  sproutsGained: number;
  sproutsSpent: number;
  shopPurchases: ShopPurchases;
  harvestByRarity: { common: number; rare: number; legendary: number };
  comboCount: { combo10: number; combo15: number; combo20: number };
  seedPacketsOpened: { total: number; common: number; rare: number; legendary: number };
  missionsCompleted: number;
  allDailyMissionsCompleted: number;
}

export interface ProducerState {
  sproutLevel: number;         // 1..PRODUCER_MAX_LEVEL
  waterLevel: number;          // 1..PRODUCER_MAX_LEVEL
  lastClaimAt: number;         // epoch ms — start of current accumulation window
}

export interface PlayerState {
  schemaVersion: 11;
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
  sprouts: number;               // 🌱 currency — no cap
  dailyMissions: DailyMissionState;
  achievements: Record<string, AchievementProgress>;
  producer: ProducerState;       // idle reward machine — accumulates over 24h, claimed manually
}

export type Language = 'th' | 'en';

export interface Settings {
  language: Language;
  hasSeenWelcome: boolean;
}
