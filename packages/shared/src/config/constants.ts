export const SCHEMA_VERSION = 11 as const;
export const CHECKIN_BASE_DROPS = 30;
export const CHECKIN_STREAK_BONUS_MAX = 20;
export const MAX_WATER_DROPS = 50;
export const DROP_REGEN_MS = 2 * 60 * 1000;     // 2 minutes per drop
export const MIN_WATER_COST = 12;
export const MAX_WATER_COST = 25;
export const FIRST_FLORA_COST = 10;
export const TOTAL_SPECIES = 302;
export const PITY_THRESHOLD = 100;
export const PITY_POINTS_COMMON = 1;
export const PITY_POINTS_RARE = 3;
export const PITY_POINTS_LEGENDARY = 10;
export const SPROUT_HARVEST_COMMON = 1;
export const SPROUT_HARVEST_RARE = 3;
export const SPROUT_HARVEST_LEGENDARY = 10;
export const SPROUT_ALL_MISSIONS_BONUS = 100;
export const SPROUT_QUEST_REFRESH_COST = 10;
export const BOOSTER_COST_COMMON = 100;
export const BOOSTER_COST_RARE = 300;
export const BOOSTER_COST_LEGENDARY = 450;

// ── Producer (idle reward machine) ──────────────────────────────────
// Two independent upgrade tracks (sprout + water), single claim button.
// Both tracks share the same 24h cycle: cap === yield/24h, so the UI
// can show one gauge to represent elapsed time for both.
export const PRODUCER_PERIOD_MS = 24 * 60 * 60 * 1000;
export const PRODUCER_MAX_LEVEL = 11 as const;
// Indexed by `level - 1`. Level 1 = index 0 (free baseline, given at
// game start). Every level satisfies cap === yield.
export const SPROUT_PRODUCER_YIELD = [100, 105, 115, 130, 145, 165, 185, 210, 235, 265, 300] as const;
export const SPROUT_PRODUCER_UPGRADE_COST = [0, 50, 120, 250, 450, 750, 1150, 1700, 2500, 3600, 5000] as const;
export const WATER_PRODUCER_YIELD = [30, 32, 35, 39, 44, 50, 57, 65, 75, 87, 100] as const;
export const WATER_PRODUCER_UPGRADE_COST = [0, 60, 130, 230, 380, 600, 900, 1350, 2000, 2900, 4100] as const;

export const STORAGE_KEY = 'florify:v1:player';
export const SETTINGS_KEY = 'florify:v1:settings';
