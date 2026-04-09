import { create } from 'zustand';
import { nanoid } from 'nanoid';
import {
  BOOSTER_COST_COMMON,
  BOOSTER_COST_RARE,
  BOOSTER_COST_LEGENDARY,
  CHECKIN_BASE_DROPS,
  CHECKIN_STREAK_BONUS_MAX,
  DAILY_MISSION_COUNT,
  FIRST_FLORA_COST,
  MAX_WATER_COST,
  MAX_WATER_DROPS,
  MIN_WATER_COST,
  MISSION_MILESTONES,
  MISSION_MILESTONE_DROPS,
  MISSION_POINTS_PER,
  MISSION_POOL,
  PITY_POINTS_COMMON,
  PITY_POINTS_LEGENDARY,
  PITY_POINTS_RARE,
  PITY_THRESHOLD,
  SPROUT_ALL_MISSIONS_BONUS,
  SPROUT_HARVEST_COMMON,
  SPROUT_HARVEST_LEGENDARY,
  SPROUT_HARVEST_RARE,
  SPROUT_QUEST_REFRESH_COST,
  type BoosterTier,
  type CollectedSpecies,
  type MissionType,
  type PlayerState,
  type Rarity,
  type TreeInstance,
} from '@florify/shared';
import { DROP_REGEN_MS } from '@/lib/debug';
import { SPECIES, SPECIES_BY_RARITY } from '@/data/species';
import { RARITY_ROLL_WEIGHTS } from '@/data/rarityWeights';
import { BOOSTER_ROLL_WEIGHTS } from '@/data/boosterWeights';
import { ACHIEVEMENTS_BY_ID } from '@/data/achievements';
import { mulberry32, randInt, randPick, randSeed } from '@/engine/rng';
import { saveStore } from './saveStore';
import { scheduleSave, flushSave } from './debouncedSave';
import { createInitialState } from './initialState';
import { isYesterday, todayLocalDate } from '@/lib/time';
import { haptic } from '@/lib/haptics';
import { gameEventBus } from '@/lib/gameEventBus';
import { pickDailyMissions } from '@/lib/missionPicker';

/**
 * Florify game store.
 *
 * Single source of truth for player state; actions enforce the game
 * rules (water drops, one-active-tree, rarity distribution). Persistence
 * is fire-and-forget via `scheduleSave` — mutations are never blocked
 * on I/O. Tests clobber state directly via `useGameStore.setState` to
 * bypass drops and deterministically trigger harvest.
 */

export interface WaterResult {
  ok: boolean;
  harvested?: TreeInstance;
  pityPointsGained?: number;
  pityReward?: { speciesId: number; rarity: Rarity };
  sproutsGained?: number;
}

export type FloristRank = 'Seedling' | 'Apprentice' | 'Gardener' | 'Master' | 'Legend';

export interface FloristCardData {
  rank: FloristRank;
  speciesUnlocked: number;
  totalHarvested: number;
  currentStreak: number;
  longestStreak: number;
  rarityProgress: {
    common: { unlocked: number; total: number };
    rare: { unlocked: number; total: number };
    legendary: { unlocked: number; total: number };
  };
  startedAt: number;
  /** Passport serial derived from userId, e.g. "FL-3K2P-9XQ4". Stable across sessions. */
  serial: string;
  /** Display name — "Guest" until cloud auth lands. */
  displayName: string;
  /** Epoch ms when the passport snapshot was taken. Only present in shared links. */
  sharedAt?: number;
}

/**
 * Passport serial — first 8 alphanumeric chars of userId, uppercased
 * and dashed. Stable, not secret, safe to display on a shareable card.
 */
export function deriveSerial(userId: string): string {
  const cleaned = userId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const padded = (cleaned + 'XXXXXXXX').slice(0, 8);
  return `FL-${padded.slice(0, 4)}-${padded.slice(4, 8)}`;
}

// ── Water drop regeneration ──────────────────────────────────────────
// Pure function: computes current drop count from the stored baseline
// + elapsed time. Timestamp-based so it self-corrects after background
// tabs, sleep, or page refreshes without needing intervals.
export function computeDrops(state: PlayerState): { drops: number; regenAt: number } {
  // Guard against missing fields from un-migrated saves
  const baseDrops = state.waterDrops ?? MAX_WATER_DROPS;
  const baseRegen = state.lastDropRegenAt ?? Date.now();
  // If overflowed past cap (e.g. from mission rewards), no regen —
  // return current count as-is. Regen resumes once drops fall below cap.
  if (baseDrops >= MAX_WATER_DROPS) {
    return { drops: baseDrops, regenAt: baseRegen };
  }
  const elapsed = Date.now() - baseRegen;
  const gained = Math.max(0, Math.floor(elapsed / DROP_REGEN_MS));
  const drops = Math.min(baseDrops + gained, MAX_WATER_DROPS);
  // Advance the baseline so we don't re-grant the same drops later
  const regenAt = gained > 0
    ? baseRegen + gained * DROP_REGEN_MS
    : baseRegen;
  return { drops, regenAt };
}

export interface BoosterResult {
  speciesId: number;
  rarity: Rarity;
  isNew: boolean;
  pityPointsGained: number;
  pityReward?: { speciesId: number; rarity: Rarity };
  sproutsGained: number;
}

export interface GameStore {
  state: PlayerState;
  hydrated: boolean;

  // Derived — primitive returns only (objects would break useSyncExternalStore
  // equality checks; derive object shapes from raw state via useMemo instead).
  canWater: () => boolean;
  waterDrops: () => number;
  nextDropAt: () => number | null;
  uniqueSpeciesUnlocked: () => number;

  // Actions
  hydrate: () => Promise<void>;
  plantTree: () => TreeInstance;
  waterTree: () => WaterResult;
  resetActiveTree: () => void;
  checkinStreak: () => void;
  resetAllProgress: () => void;
  setDisplayName: (name: string) => void;
  replaceState: (next: PlayerState) => void;

  // Sprout currency / Shop
  openBooster: (tier: BoosterTier) => BoosterResult | null;

  // Daily missions
  ensureDailyMissions: () => void;
  trackMission: (type: MissionType, increment?: number) => void;
  claimMissions: () => { dropsAwarded: number };
  refreshMission: (index: number) => boolean;
  claimAllCompletedBonus: () => { sproutsAwarded: number };

  // Daily check-in
  canClaimCheckin: () => boolean;
  checkinDrops: () => { base: number; bonus: number; total: number };
  claimCheckin: () => { dropsAwarded: number; streakBonus: number };

  // Achievements
  claimAchievement: (id: string) => number;
  claimAllAchievements: () => number;
}

export const DISPLAY_NAME_MAX_LENGTH = 24;

/**
 * Pure derivation of the Florist Card passport data from player state.
 *
 * IMPORTANT: this is intentionally NOT a method on the store. Attaching
 * it as a selector (`useGameStore(s => s.selectFloristCard())`) creates
 * a fresh object reference on every call, which trips React's
 * "getServerSnapshot should be cached" warning during hydration AND
 * triggers an infinite render loop on the client — even with
 * `useShallow`, because the SSR snapshot path starts with an empty ref
 * cache. Consumers must derive it via `useMemo(() => selectFloristCard(state), [state])`.
 */
export function selectFloristCard(state: PlayerState): FloristCardData {
  let common = 0;
  let rare = 0;
  let legendary = 0;
  for (const c of state.collection) {
    if (c.rarity === 'common') common++;
    else if (c.rarity === 'rare') rare++;
    else legendary++;
  }
  const speciesUnlocked = state.collection.length;
  return {
    rank: deriveRank(speciesUnlocked),
    speciesUnlocked,
    totalHarvested: state.stats.totalHarvested,
    currentStreak: state.streak.currentStreak,
    longestStreak: state.streak.longestStreak,
    rarityProgress: {
      common: { unlocked: common, total: SPECIES_BY_RARITY.common.length },
      rare: { unlocked: rare, total: SPECIES_BY_RARITY.rare.length },
      legendary: { unlocked: legendary, total: SPECIES_BY_RARITY.legendary.length },
    },
    startedAt: state.createdAt,
    serial: deriveSerial(state.userId),
    displayName: state.displayName,
  };
}

// ── Rarity roll ─────────────────────────────────────────────────────
// Weights come from `@/data/rarityWeights` so the Guide Book and the
// actual roll share a single source of truth.
function rollRarity(): Rarity {
  const r = Math.random();
  if (r < RARITY_ROLL_WEIGHTS.legendary) return 'legendary';
  if (r < RARITY_ROLL_WEIGHTS.legendary + RARITY_ROLL_WEIGHTS.rare) return 'rare';
  return 'common';
}

// ── Pity / Dried Leaves (🍂) ────────────────────────────────��───────
// ── Sprout gain per rarity ───────────────────────────────────────────
const SPROUT_GAIN: Record<Rarity, number> = {
  common: SPROUT_HARVEST_COMMON,
  rare: SPROUT_HARVEST_RARE,
  legendary: SPROUT_HARVEST_LEGENDARY,
};

// ── Booster cost per tier ───────────────────────────────────────────
const BOOSTER_COST: Record<BoosterTier, number> = {
  common: BOOSTER_COST_COMMON,
  rare: BOOSTER_COST_RARE,
  legendary: BOOSTER_COST_LEGENDARY,
};

const PITY_POINTS: Record<Rarity, number> = {
  common: PITY_POINTS_COMMON,
  rare: PITY_POINTS_RARE,
  legendary: PITY_POINTS_LEGENDARY,
};

/**
 * Roll for a pity reward species. Returns a species the player doesn't
 * own yet from the rolled rarity tier, or `null` if the tier is fully
 * collected (caller should treat as phantom duplicate).
 */
function rollBoosterRarity(tier: BoosterTier): Rarity {
  const weights = BOOSTER_ROLL_WEIGHTS[tier];
  const r = Math.random();
  if (r < weights.legendary) return 'legendary';
  if (r < weights.legendary + weights.rare) return 'rare';
  return 'common';
}

function rollPityReward(
  collectedIds: Set<number>,
): { speciesId: number; rarity: Rarity } | null {
  const rarity = rollRarity();
  const pool = SPECIES_BY_RARITY[rarity].filter((s) => !collectedIds.has(s.id));
  if (pool.length === 0) return null;
  const pick = pool[Math.floor(Math.random() * pool.length)]!;
  return { speciesId: pick.id, rarity };
}

export interface HarvestCollectionResult {
  collection: CollectedSpecies[];
  pityPoints: number;
  pityPointsGained: number;
  pityReward?: { speciesId: number; rarity: Rarity };
}

/**
 * Shared helper: upsert a species into the collection and handle pity
 * logic. Used by both waterTree (normal harvest) and openBooster (gacha).
 */
function applyHarvestToCollection(
  collection: CollectedSpecies[],
  speciesId: number,
  rarity: Rarity,
  waterings: number,
  currentPityPoints: number,
): HarvestCollectionResult {
  const now = Date.now();
  const isDuplicate = collection.some((c) => c.speciesId === speciesId);
  const entry: CollectedSpecies = {
    speciesId,
    rarity,
    count: 1,
    totalWaterings: waterings,
    firstHarvestedAt: now,
    lastHarvestedAt: now,
  };

  // Upsert
  const idx = collection.findIndex((c) => c.speciesId === speciesId);
  let updated: CollectedSpecies[];
  if (idx >= 0) {
    const existing = collection[idx]!;
    const merged: CollectedSpecies = {
      ...existing,
      count: existing.count + 1,
      totalWaterings: existing.totalWaterings + waterings,
      lastHarvestedAt: now,
    };
    updated = [merged, ...collection.slice(0, idx), ...collection.slice(idx + 1)];
  } else {
    updated = [entry, ...collection];
  }

  // Pity accumulation
  let pityPoints = currentPityPoints;
  let pityPointsGained = 0;
  let pityReward: { speciesId: number; rarity: Rarity } | undefined;

  if (updated.length < SPECIES.length) {
    if (!isDuplicate) {
      pityPoints = 0;
    } else {
      const gained = PITY_POINTS[rarity];
      pityPoints += gained;
      pityPointsGained = gained;

      const collectedIds = new Set(updated.map((c) => c.speciesId));
      for (let attempt = 0; attempt < 20 && pityPoints >= PITY_THRESHOLD; attempt++) {
        const reward = rollPityReward(collectedIds);
        if (reward) {
          updated = addPityRewardToCollection(updated, reward);
          collectedIds.add(reward.speciesId);
          pityReward = reward;
          pityPoints = 0;
          break;
        }
        pityPoints += PITY_POINTS[rollRarity()];
      }
    }
  }

  return { collection: updated, pityPoints, pityPointsGained, pityReward };
}

function addPityRewardToCollection(
  collection: CollectedSpecies[],
  reward: { speciesId: number; rarity: Rarity },
): CollectedSpecies[] {
  const now = Date.now();
  return [
    {
      speciesId: reward.speciesId,
      rarity: reward.rarity,
      count: 1,
      totalWaterings: 0,
      firstHarvestedAt: now,
      lastHarvestedAt: now,
    },
    ...collection,
  ];
}

function deriveRank(unlocked: number): FloristRank {
  if (unlocked >= 250) return 'Legend';
  if (unlocked >= 150) return 'Master';
  if (unlocked >= 75) return 'Gardener';
  if (unlocked >= 20) return 'Apprentice';
  return 'Seedling';
}


export const useGameStore = create<GameStore>((set, get) => ({
  state: createInitialState(),
  hydrated: false,

  // ── Derived selectors ─────────────────────────────────────────────
  canWater: () => {
    const s = get().state;
    if (!s.activeTree) return false;
    if (s.activeTree.currentWaterings >= s.activeTree.requiredWaterings) return false;
    return computeDrops(s).drops >= 1;
  },

  waterDrops: () => computeDrops(get().state).drops,

  nextDropAt: () => {
    const s = get().state;
    const { drops, regenAt } = computeDrops(s);
    if (drops >= MAX_WATER_DROPS) return null;
    return regenAt + DROP_REGEN_MS;
  },

  uniqueSpeciesUnlocked: () => get().state.collection.length,

  // ── Hydrate from localStorage on app start ────────────────────────
  hydrate: async () => {
    const loaded = await saveStore.load();
    if (loaded) set({ state: loaded });
    get().checkinStreak();
    get().ensureDailyMissions();
    set({ hydrated: true });
  },

  // ── Plant ─────────────────────────────────────────────────────────
  plantTree: () => {
    const current = get().state;
    if (current.activeTree) throw new Error('Already have an active tree');

    const rarity = rollRarity();
    const pool = SPECIES_BY_RARITY[rarity];
    const seed = randSeed();
    // Pick a species using a seed-derived RNG so the test on its own
    // doesn't need to mock Math.random for the pick itself.
    const pickRng = mulberry32(seed);
    const species = randPick(pickRng, pool);
    // Required waterings (drop cost) derived from seed so replay is
    // consistent. First-ever tree costs 10 drops for quick onboarding.
    const isFirstEver = current.stats.totalPlanted === 0 && current.collection.length === 0;
    const wateringsRng = mulberry32((seed ^ 0xabcdef) >>> 0);
    const required = isFirstEver ? FIRST_FLORA_COST : randInt(wateringsRng, MIN_WATER_COST, MAX_WATER_COST);

    const now = Date.now();
    const tree: TreeInstance = {
      id: nanoid(),
      seed,
      speciesId: species.id,
      rarity,
      requiredWaterings: required,
      currentWaterings: 0,
      plantedAt: now,
      harvestedAt: null,
    };

    const next: PlayerState = {
      ...current,
      activeTree: tree,
      stats: { ...current.stats, totalPlanted: current.stats.totalPlanted + 1 },
      updatedAt: now,
    };
    set({ state: next });
    scheduleSave(next);
    haptic('tap');
    gameEventBus.emit({ type: 'plant' });
    return tree;
  },

  // ── Water ─────────────────────────────────────────────────────────
  waterTree: (): WaterResult => {
    const s = get().state;
    const tree = s.activeTree;
    if (!tree) return { ok: false };

    // Sync regenerated drops
    const { drops, regenAt } = computeDrops(s);
    if (drops < 1) return { ok: false };

    const now = Date.now();
    const nextWaterings = tree.currentWaterings + 1;
    const isHarvest = nextWaterings >= tree.requiredWaterings;

    if (isHarvest) {
      const harvested: TreeInstance = {
        ...tree,
        currentWaterings: nextWaterings,
        harvestedAt: now,
      };
      const isDuplicate = s.collection.some((c) => c.speciesId === harvested.speciesId);
      const result = applyHarvestToCollection(
        s.collection, harvested.speciesId, harvested.rarity,
        harvested.requiredWaterings, s.pityPoints,
      );
      const sproutsGained = SPROUT_GAIN[harvested.rarity];

      const next: PlayerState = {
        ...s,
        waterDrops: drops - 1,
        lastDropRegenAt: regenAt,
        activeTree: null,
        collection: result.collection,
        pityPoints: result.pityPoints,
        sprouts: s.sprouts + sproutsGained,
        stats: {
          ...s.stats,
          totalWatered: s.stats.totalWatered + 1,
          totalHarvested: s.stats.totalHarvested + 1,
          driedLeavesGained: s.stats.driedLeavesGained + result.pityPointsGained,
          sproutsGained: s.stats.sproutsGained + sproutsGained,
          harvestByRarity: {
            ...s.stats.harvestByRarity,
            [harvested.rarity]: s.stats.harvestByRarity[harvested.rarity] + 1,
          },
        },
        updatedAt: now,
      };
      set({ state: next });
      scheduleSave(next);
      haptic('harvest');
      gameEventBus.emit({ type: 'water' });
      gameEventBus.emit({ type: 'harvest', rarity: harvested.rarity, isNew: !isDuplicate });
      return { ok: true, harvested, pityPointsGained: result.pityPointsGained, pityReward: result.pityReward, sproutsGained };
    }

    const next: PlayerState = {
      ...s,
      waterDrops: drops - 1,
      lastDropRegenAt: regenAt,
      activeTree: { ...tree, currentWaterings: nextWaterings },
      stats: { ...s.stats, totalWatered: s.stats.totalWatered + 1 },
      updatedAt: now,
    };
    set({ state: next });
    scheduleSave(next);
    haptic('water');
    gameEventBus.emit({ type: 'water' });
    return { ok: true };
  },

  // ── Reset active tree (shovel) ────────────────────────────────────
  resetActiveTree: () => {
    const s = get().state;
    if (!s.activeTree) return;
    const next: PlayerState = { ...s, activeTree: null, updatedAt: Date.now() };
    set({ state: next });
    scheduleSave(next);
  },

  // ── Daily streak check-in ─────────────────────────────────────────
  checkinStreak: () => {
    const s = get().state;
    const today = todayLocalDate();
    if (s.streak.lastCheckinDate === today) return;

    const consecutive = isYesterday(s.streak.lastCheckinDate, today);
    const currentStreak = consecutive ? s.streak.currentStreak + 1 : 1;
    const longestStreak = Math.max(s.streak.longestStreak, currentStreak);

    const next: PlayerState = {
      ...s,
      streak: { ...s.streak, currentStreak, longestStreak, lastCheckinDate: today },
      updatedAt: Date.now(),
    };
    set({ state: next });
    scheduleSave(next);
  },

  // ── Danger: full reset ────────────────────────────────────────────
  resetAllProgress: () => {
    const next = createInitialState();
    set({ state: next });
    saveStore.save(next).catch((err) => console.error('[resetAllProgress]', err));
  },

  // ── Rename account ────────────────────────────────────────────────
  // Trimmed and length-capped; blank input is treated as "Guest" rather
  // than silently ignored so the passport never shows an empty name.
  setDisplayName: (name: string) => {
    const trimmed = name.trim().slice(0, DISPLAY_NAME_MAX_LENGTH);
    const displayName = trimmed.length > 0 ? trimmed : 'Guest';
    const s = get().state;
    if (s.displayName === displayName) return;
    const next: PlayerState = { ...s, displayName, updatedAt: Date.now() };
    set({ state: next });
    scheduleSave(next);
  },

  // ── Replace entire state (used by import) ─────────────────────────
  // Bypasses the debounced save and writes synchronously so a reload
  // immediately after import sees the imported state, not the old one.
  replaceState: (next: PlayerState) => {
    const stamped: PlayerState = { ...next, updatedAt: Date.now() };
    set({ state: stamped });
    flushSave(stamped);
  },

  // ── Daily missions ───────────────────────────────────────────────

  ensureDailyMissions: () => {
    const s = get().state;
    const today = todayLocalDate();
    if (s.dailyMissions.date === today) return;

    const missions = pickDailyMissions(today, s.userId);
    const next: PlayerState = {
      ...s,
      dailyMissions: {
        date: today,
        missions,
        claimedPoints: 0,
        claimedMilestones: [],
        allCompletedClaimed: false,
      },
      updatedAt: Date.now(),
    };
    set({ state: next });
    scheduleSave(next);
  },

  trackMission: (type: MissionType, increment = 1) => {
    const s = get().state;
    const { missions } = s.dailyMissions;
    let changed = false;
    let newlyCompleted = 0;
    const updated = missions.map((m) => {
      if (m.type !== type || m.completed) return m;
      const progress = Math.min(m.progress + increment, m.target);
      changed = true;
      const completed = progress >= m.target;
      if (completed) newlyCompleted++;
      return { ...m, progress, completed };
    });
    if (!changed) return;
    const next: PlayerState = {
      ...s,
      dailyMissions: { ...s.dailyMissions, missions: updated },
      stats: newlyCompleted > 0
        ? { ...s.stats, missionsCompleted: s.stats.missionsCompleted + newlyCompleted }
        : s.stats,
      updatedAt: Date.now(),
    };
    set({ state: next });
    scheduleSave(next);
  },

  claimMissions: (): { dropsAwarded: number } => {
    const s = get().state;
    const { missions, claimedMilestones } = s.dailyMissions;

    // Total points from all completed missions
    const totalPoints = missions.filter((m) => m.completed).length * MISSION_POINTS_PER;

    // Find newly reachable milestones
    let dropsAwarded = 0;
    const newClaimed = [...claimedMilestones];
    for (let i = 0; i < MISSION_MILESTONES.length; i++) {
      const milestone = MISSION_MILESTONES[i]!;
      const drops = MISSION_MILESTONE_DROPS[i]!;
      if (totalPoints >= milestone && !claimedMilestones.includes(milestone)) {
        newClaimed.push(milestone);
        dropsAwarded += drops;
      }
    }
    if (dropsAwarded === 0) return { dropsAwarded: 0 };

    // Award drops — allow overflow past MAX_WATER_DROPS
    const { drops: currentDrops, regenAt } = computeDrops(s);
    const next: PlayerState = {
      ...s,
      waterDrops: currentDrops + dropsAwarded,
      lastDropRegenAt: regenAt,
      dailyMissions: {
        ...s.dailyMissions,
        claimedPoints: totalPoints,
        claimedMilestones: newClaimed,
      },
      updatedAt: Date.now(),
    };
    set({ state: next });
    scheduleSave(next);
    return { dropsAwarded };
  },

  refreshMission: (index: number): boolean => {
    const s = get().state;
    const { missions } = s.dailyMissions;
    if (s.sprouts < SPROUT_QUEST_REFRESH_COST) return false;
    const mission = missions[index];
    if (!mission || mission.completed) return false;

    // Pick a new mission not already in the current set
    const usedIds = new Set(missions.map((m) => m.templateId));
    const available = MISSION_POOL.filter((t) => !usedIds.has(t.id));
    if (available.length === 0) return false;
    const picked = available[Math.floor(Math.random() * available.length)]!;

    const updated = [...missions];
    updated[index] = {
      templateId: picked.id,
      type: picked.type,
      target: picked.target,
      progress: 0,
      completed: false,
    };

    const next: PlayerState = {
      ...s,
      sprouts: s.sprouts - SPROUT_QUEST_REFRESH_COST,
      stats: {
        ...s.stats,
        sproutsSpent: s.stats.sproutsSpent + SPROUT_QUEST_REFRESH_COST,
      },
      dailyMissions: { ...s.dailyMissions, missions: updated },
      updatedAt: Date.now(),
    };
    set({ state: next });
    scheduleSave(next);
    return true;
  },

  claimAllCompletedBonus: (): { sproutsAwarded: number } => {
    const s = get().state;
    const { missions, allCompletedClaimed } = s.dailyMissions;
    const allComplete = missions.length === DAILY_MISSION_COUNT
      && missions.every((m) => m.completed);
    if (!allComplete || allCompletedClaimed) return { sproutsAwarded: 0 };

    const next: PlayerState = {
      ...s,
      sprouts: s.sprouts + SPROUT_ALL_MISSIONS_BONUS,
      stats: {
        ...s.stats,
        sproutsGained: s.stats.sproutsGained + SPROUT_ALL_MISSIONS_BONUS,
        allDailyMissionsCompleted: s.stats.allDailyMissionsCompleted + 1,
      },
      dailyMissions: { ...s.dailyMissions, allCompletedClaimed: true },
      updatedAt: Date.now(),
    };
    set({ state: next });
    scheduleSave(next);
    return { sproutsAwarded: SPROUT_ALL_MISSIONS_BONUS };
  },

  // ── Booster packs ───────────────────────────────────────────────

  openBooster: (tier: BoosterTier): BoosterResult | null => {
    const s = get().state;
    const cost = BOOSTER_COST[tier];
    if (s.sprouts < cost) return null;

    const rarity = rollBoosterRarity(tier);
    const pool = SPECIES_BY_RARITY[rarity];
    const species = pool[Math.floor(Math.random() * pool.length)]!;
    const isNew = !s.collection.some((c) => c.speciesId === species.id);

    const result = applyHarvestToCollection(
      s.collection, species.id, rarity, 0, s.pityPoints,
    );
    const sproutsGained = SPROUT_GAIN[rarity];

    const next: PlayerState = {
      ...s,
      sprouts: s.sprouts - cost + sproutsGained,
      collection: result.collection,
      pityPoints: result.pityPoints,
      stats: {
        ...s.stats,
        totalHarvested: s.stats.totalHarvested + 1,
        driedLeavesGained: s.stats.driedLeavesGained + result.pityPointsGained,
        sproutsGained: s.stats.sproutsGained + sproutsGained,
        sproutsSpent: s.stats.sproutsSpent + cost,
        shopPurchases: {
          ...s.stats.shopPurchases,
          [tier]: s.stats.shopPurchases[tier] + 1,
        },
        harvestByRarity: {
          ...s.stats.harvestByRarity,
          [rarity]: s.stats.harvestByRarity[rarity] + 1,
        },
        seedPacketsOpened: {
          ...s.stats.seedPacketsOpened,
          total: s.stats.seedPacketsOpened.total + 1,
          [tier]: s.stats.seedPacketsOpened[tier] + 1,
        },
      },
      updatedAt: Date.now(),
    };
    set({ state: next });
    scheduleSave(next);
    gameEventBus.emit({ type: 'booster_open', tier, rarity, isNew });
    return {
      speciesId: species.id,
      rarity,
      isNew,
      pityPointsGained: result.pityPointsGained,
      pityReward: result.pityReward,
      sproutsGained,
    };
  },

  // ── Daily check-in ───────────────────────────────────────────────

  canClaimCheckin: () => {
    const s = get().state;
    return s.streak.lastRewardDate !== todayLocalDate();
  },

  checkinDrops: () => {
    const s = get().state;
    const bonus = Math.min(Math.max(s.streak.currentStreak - 1, 0), CHECKIN_STREAK_BONUS_MAX);
    const base = CHECKIN_BASE_DROPS;
    return { base, bonus, total: base + bonus };
  },

  claimCheckin: (): { dropsAwarded: number; streakBonus: number } => {
    const s = get().state;
    const today = todayLocalDate();
    if (s.streak.lastRewardDate === today) return { dropsAwarded: 0, streakBonus: 0 };

    const bonus = Math.min(Math.max(s.streak.currentStreak - 1, 0), CHECKIN_STREAK_BONUS_MAX);
    const dropsAwarded = CHECKIN_BASE_DROPS + bonus;
    const { drops: currentDrops, regenAt } = computeDrops(s);

    const next: PlayerState = {
      ...s,
      waterDrops: currentDrops + dropsAwarded,
      lastDropRegenAt: regenAt,
      streak: { ...s.streak, lastRewardDate: today },
      updatedAt: Date.now(),
    };
    set({ state: next });
    scheduleSave(next);
    return { dropsAwarded, streakBonus: bonus };
  },

  // ── Achievements ────────────────────────────────────────────────────

  claimAchievement: (id): number => {
    const s = get().state;
    const entry = s.achievements[id];
    if (!entry || entry.claimedAt) return 0;

    const def = ACHIEVEMENTS_BY_ID.get(id);
    if (!def) return 0;

    let sproutsAwarded = 0;
    for (const reward of def.rewards) {
      if (reward.type === 'sprouts') sproutsAwarded += reward.amount;
    }

    const next: PlayerState = {
      ...s,
      sprouts: s.sprouts + sproutsAwarded,
      stats: { ...s.stats, sproutsGained: s.stats.sproutsGained + sproutsAwarded },
      achievements: {
        ...s.achievements,
        [id]: { ...entry, claimedAt: new Date().toISOString() },
      },
      updatedAt: Date.now(),
    };
    set({ state: next });
    scheduleSave(next);
    return sproutsAwarded;
  },

  claimAllAchievements: (): number => {
    const s = get().state;
    let totalSprouts = 0;
    const updatedAchievements = { ...s.achievements };

    for (const [id, entry] of Object.entries(s.achievements)) {
      if (entry.claimedAt) continue;
      const def = ACHIEVEMENTS_BY_ID.get(id);
      if (!def) continue;
      for (const reward of def.rewards) {
        if (reward.type === 'sprouts') totalSprouts += reward.amount;
      }
      updatedAchievements[id] = { ...entry, claimedAt: new Date().toISOString() };
    }

    if (totalSprouts === 0) return 0;

    const next: PlayerState = {
      ...s,
      sprouts: s.sprouts + totalSprouts,
      stats: { ...s.stats, sproutsGained: s.stats.sproutsGained + totalSprouts },
      achievements: updatedAchievements,
      updatedAt: Date.now(),
    };
    set({ state: next });
    scheduleSave(next);
    return totalSprouts;
  },
}));

// Tiny helper for tests / dev console
export const TOTAL_SPECIES_FOR_DEV = SPECIES.length;
