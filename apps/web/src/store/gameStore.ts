import { create } from 'zustand';
import { nanoid } from 'nanoid';
import {
  BOOSTER_COST_COMMON,
  BOOSTER_COST_RARE,
  BOOSTER_COST_LEGENDARY,
  COSMETIC_BOX_COST,
  CHECKIN_BASE_DROPS,
  CHECKIN_STREAK_BONUS_MAX,
  DAILY_MISSION_COUNT,
  FIRST_FLORA_COST,
  FLORA_LEVEL_CURVE,
  GOLD_HARVEST_COMMON,
  GOLD_HARVEST_RARE,
  GOLD_HARVEST_LEGENDARY,
  rollCosmeticBoxDrop,
  type CosmeticBoxDrop,
  type CosmeticType,
  type CollectedCosmetic,
  FLORA_MAX_LEVEL,
  MAX_PENDING_MERGES,
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
  PRODUCER_MAX_LEVEL,
  PRODUCER_PERIOD_MS,
  SPROUT_ALL_MISSIONS_BONUS,
  SPROUT_HARVEST_COMMON,
  SPROUT_HARVEST_LEGENDARY,
  SPROUT_HARVEST_RARE,
  SPROUT_PRODUCER_UPGRADE_COST,
  SPROUT_PRODUCER_YIELD,
  SPROUT_QUEST_REFRESH_COST,
  WATER_PRODUCER_UPGRADE_COST,
  WATER_PRODUCER_YIELD,
  type BoosterTier,
  type CollectedSpecies,
  type FloraLevelEntry,
  type Language,
  type MissionType,
  type PassportTitleSource,
  type PlayerState,
  type Rarity,
  type TreeInstance,
} from '@florify/shared';
import { DROP_REGEN_MS } from '@/lib/debug';
import { SPECIES, SPECIES_BY_ID, SPECIES_BY_RARITY } from '@/data/species';
import { CHARACTERS_BY_RARITY, CHARACTERS_BY_ID } from '@/data/characters';
import { BACKGROUNDS_BY_RARITY, BACKGROUNDS_BY_ID } from '@/data/backgrounds';
import { RARITY_ROLL_WEIGHTS } from '@/data/rarityWeights';
import { BOOSTER_ROLL_WEIGHTS } from '@/data/boosterWeights';
import { ACHIEVEMENTS_BY_ID } from '@/data/achievements';
import { mulberry32, randInt, randPick, randSeed } from '@/engine/rng';
import { saveStore } from './saveStore';
import { scheduleSave, flushSave } from './debouncedSave';
import { createInitialState } from './initialState';
import { isYesterday, todayLocalDate } from '@/lib/time';
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
  isNew?: boolean;
  pityPointsGained?: number;
  pityReward?: { speciesId: number; rarity: Rarity };
  sproutsGained?: number;
  goldGained?: number;
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
  /** Resolved title for the rank pill. Either the chosen achievement name
   *  or the auto-derived rank as fallback. */
  title: string;
  /** True iff the title should render with a metallic / rainbow treatment
   *  (set when the title source is a Legendary epithet). */
  titleShiny: boolean;
  /** Avatar spec or null for the 🌱 placeholder. */
  avatar: { speciesId: number; stage: 1 | 2 | 3 } | null;
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

// ── Producer accumulation ────────────────────────────────────────────
// Pure function mirroring `computeDrops`: derives current ready-to-claim
// counts from `lastClaimAt` + elapsed time. Both tracks fill at the same
// rate because cap === yield for every level, so a single elapsed ratio
// represents both — the UI exploits this with one shared gauge.
export interface ProducerComputed {
  sproutReady: number;       // whole sprouts ready to claim
  waterReady: number;        // whole waters ready to claim
  elapsedRatio: number;      // 0..1, clamped
  isFull: boolean;           // elapsedRatio >= 1
  sproutYield: number;       // current cap/yield for sprout track
  waterYield: number;        // current cap/yield for water track
  nextFullAt: number | null; // epoch ms when ratio will hit 1, null if already full
}

export function computeProducer(state: PlayerState): ProducerComputed {
  const p = state.producer;
  const sproutYield = SPROUT_PRODUCER_YIELD[p.sproutLevel - 1] ?? SPROUT_PRODUCER_YIELD[0]!;
  const waterYield = WATER_PRODUCER_YIELD[p.waterLevel - 1] ?? WATER_PRODUCER_YIELD[0]!;
  const elapsed = Math.max(0, Date.now() - p.lastClaimAt);
  const ratio = Math.min(1, elapsed / PRODUCER_PERIOD_MS);
  return {
    sproutReady: Math.floor(sproutYield * ratio),
    waterReady: Math.floor(waterYield * ratio),
    elapsedRatio: ratio,
    isFull: ratio >= 1,
    sproutYield,
    waterYield,
    nextFullAt: ratio >= 1 ? null : p.lastClaimAt + PRODUCER_PERIOD_MS,
  };
}

export interface BoosterResult {
  speciesId: number;
  rarity: Rarity;
  isNew: boolean;
  pityPointsGained: number;
  pityReward?: { speciesId: number; rarity: Rarity };
  sproutsGained: number;
}

export interface CosmeticBoxResult {
  type: CosmeticType;
  drop: CosmeticBoxDrop;                          // raw roll for UI / analytics
  item?: { id: number; rarity: Rarity; isNew: boolean };
  goldAmount?: number;                            // set when drop.kind === 'gold'
  dropsAmount?: number;                           // set when drop.kind === 'drops'
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
  setPassportTitle: (source: PassportTitleSource) => void;
  setPassportAvatar: (avatar: { speciesId: number; stage: 1 | 2 | 3 } | null) => void;
  mergeFloraLevel: (speciesId: number) => void;
  replaceState: (next: PlayerState) => void;

  // Sprout currency / Shop
  openBooster: (tier: BoosterTier) => BoosterResult | null;

  // Gold currency / Cosmetic boxes
  openCosmeticBox: (type: CosmeticType) => CosmeticBoxResult | null;
  equipCharacter: (id: number | null) => void;
  equipBackground: (id: number | null) => void;

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

  // Producer (idle reward machine)
  producerState: () => ProducerComputed;
  claimProducer: () => { sprouts: number; waters: number };
  upgradeProducer: (track: 'sprout' | 'water') => { ok: boolean; cost?: number };
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

function resolveTitleAndShiny(
  state: PlayerState,
  lang: Language,
  rank: string,
): { title: string; titleShiny: boolean } {
  const source = state.passportCustomization.titleSource;
  switch (source.type) {
    case 'auto':
      return { title: rank, titleShiny: false };
    case 'achievement': {
      const ach = ACHIEVEMENTS_BY_ID.get(source.id);
      return { title: ach?.name ?? rank, titleShiny: false };
    }
    case 'epithet': {
      const sp = SPECIES_BY_ID[source.speciesId];
      const ep = sp?.epithet?.[lang];
      return ep
        ? { title: ep, titleShiny: true }
        : { title: rank, titleShiny: false };
    }
  }
}

export function selectFloristCard(state: PlayerState, lang: Language = 'th'): FloristCardData {
  let common = 0;
  let rare = 0;
  let legendary = 0;
  for (const c of state.collection) {
    if (c.rarity === 'common') common++;
    else if (c.rarity === 'rare') rare++;
    else legendary++;
  }
  const speciesUnlocked = state.collection.length;
  const rank = deriveRank(speciesUnlocked);

  const { title, titleShiny } = resolveTitleAndShiny(state, lang, rank);

  return {
    rank,
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
    title,
    titleShiny,
    avatar: state.passportCustomization.avatar,
  };
}

/** Returns true iff `mergeFloraLevel` would advance at least one level. */
export function canMergeFloraLevel(entry: FloraLevelEntry | undefined): boolean {
  if (!entry || entry.level >= FLORA_MAX_LEVEL) return false;
  const cost = FLORA_LEVEL_CURVE[entry.level - 1];
  return cost !== undefined && entry.pendingMerges >= cost;
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

const GOLD_GAIN: Record<Rarity, number> = {
  common: GOLD_HARVEST_COMMON,
  rare: GOLD_HARVEST_RARE,
  legendary: GOLD_HARVEST_LEGENDARY,
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
  floraLevels: Record<number, FloraLevelEntry>;
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
  floraLevels: Record<number, FloraLevelEntry>,
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

  // Flora level update
  const nextFloraLevels = { ...floraLevels };
  const existingFL = nextFloraLevels[speciesId];
  if (!existingFL) {
    // First harvest — unlock at Lv 1.
    nextFloraLevels[speciesId] = { level: 1, pendingMerges: 0 };
  } else if (existingFL.level < FLORA_MAX_LEVEL) {
    nextFloraLevels[speciesId] = {
      level: existingFL.level,
      pendingMerges: Math.min(existingFL.pendingMerges + 1, MAX_PENDING_MERGES),
    };
  }
  // else: already at max level. Leave untouched.

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
          // The pity reward is always a brand-new species (filtered via collectedIds),
          // so it has no prior floraLevels entry — seed one now.
          nextFloraLevels[reward.speciesId] = { level: 1, pendingMerges: 0 };
          collectedIds.add(reward.speciesId);
          pityReward = reward;
          pityPoints = 0;
          break;
        }
        pityPoints += PITY_POINTS[rollRarity()];
      }
    }
  }

  return { collection: updated, floraLevels: nextFloraLevels, pityPoints, pityPointsGained, pityReward };
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
    if (loaded) {
      // Defensive backfill — a save persisted during mid-flight schema
      // changes can arrive with its version marked current but the new
      // fields undefined. Treat missing cosmetic fields as empty.
      const patched: PlayerState = {
        ...loaded,
        gold: loaded.gold ?? 0,
        characters: loaded.characters ?? [],
        backgrounds: loaded.backgrounds ?? [],
        equippedCharacterId: loaded.equippedCharacterId ?? null,
        equippedBackgroundId: loaded.equippedBackgroundId ?? null,
        stats: {
          ...loaded.stats,
          goldGained: loaded.stats?.goldGained ?? 0,
          goldSpent: loaded.stats?.goldSpent ?? 0,
          cosmeticBoxesOpened: loaded.stats?.cosmeticBoxesOpened ?? { character: 0, background: 0 },
        },
      };
      set({ state: patched });
    }
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
        s.collection, s.floraLevels, harvested.speciesId, harvested.rarity,
        harvested.requiredWaterings, s.pityPoints,
      );
      const sproutsGained = SPROUT_GAIN[harvested.rarity];
      const goldGained = GOLD_GAIN[harvested.rarity];

      const next: PlayerState = {
        ...s,
        waterDrops: drops - 1,
        lastDropRegenAt: regenAt,
        activeTree: null,
        collection: result.collection,
        floraLevels: result.floraLevels,
        pityPoints: result.pityPoints,
        sprouts: s.sprouts + sproutsGained,
        gold: s.gold + goldGained,
        stats: {
          ...s.stats,
          totalWatered: s.stats.totalWatered + 1,
          totalHarvested: s.stats.totalHarvested + 1,
          driedLeavesGained: s.stats.driedLeavesGained + result.pityPointsGained,
          sproutsGained: s.stats.sproutsGained + sproutsGained,
          goldGained: s.stats.goldGained + goldGained,
          harvestByRarity: {
            ...s.stats.harvestByRarity,
            [harvested.rarity]: s.stats.harvestByRarity[harvested.rarity] + 1,
          },
        },
        updatedAt: now,
      };
      set({ state: next });
      scheduleSave(next);
  
      gameEventBus.emit({ type: 'water' });
      gameEventBus.emit({ type: 'harvest', rarity: harvested.rarity, isNew: !isDuplicate });
      return { ok: true, harvested, isNew: !isDuplicate, pityPointsGained: result.pityPointsGained, pityReward: result.pityReward, sproutsGained, goldGained };
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

  // ── Passport customization ────────────────────────────────────────
  // No validation: the customize UI only offers claimed achievements
  // and unlocked species, so any value passed here is assumed valid.
  // Render-time fallback in selectFloristCard / buildLayout handles
  // stale ids gracefully.
  mergeFloraLevel: (speciesId) => {
    const state = get().state;
    const entry = state.floraLevels[speciesId];
    if (!entry || entry.level >= FLORA_MAX_LEVEL || entry.pendingMerges === 0) return;

    let level: number = entry.level;
    let pendingMerges = entry.pendingMerges;
    while (level < FLORA_MAX_LEVEL) {
      const cost = FLORA_LEVEL_CURVE[level - 1];
      if (cost === undefined || pendingMerges < cost) break;
      pendingMerges -= cost;
      level += 1;
    }
    const next: PlayerState = {
      ...state,
      updatedAt: Date.now(),
      floraLevels: {
        ...state.floraLevels,
        [speciesId]: {
          level: level as FloraLevelEntry['level'],
          pendingMerges,
        },
      },
    };
    set({ state: next });
    scheduleSave(next);
  },

  setPassportTitle: (source) => {
    const state = get().state;
    const next: PlayerState = {
      ...state,
      updatedAt: Date.now(),
      passportCustomization: {
        ...state.passportCustomization,
        titleSource: source,
      },
    };
    set({ state: next });
    scheduleSave(next);
  },

  setPassportAvatar: (avatar) => {
    const s = get().state;
    const current = s.passportCustomization.avatar;
    if (
      current === avatar ||
      (current &&
        avatar &&
        current.speciesId === avatar.speciesId &&
        current.stage === avatar.stage)
    ) {
      return;
    }
    const next: PlayerState = {
      ...s,
      updatedAt: Date.now(),
      passportCustomization: {
        ...s.passportCustomization,
        avatar,
      },
    };
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
      s.collection, s.floraLevels, species.id, rarity, 0, s.pityPoints,
    );
    const sproutsGained = SPROUT_GAIN[rarity];

    const next: PlayerState = {
      ...s,
      sprouts: s.sprouts - cost + sproutsGained,
      collection: result.collection,
      floraLevels: result.floraLevels,
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

  // ── Producer (idle reward machine) ──────────────────────────────────

  producerState: () => computeProducer(get().state),

  claimProducer: (): { sprouts: number; waters: number } => {
    const s = get().state;
    const ready = computeProducer(s);
    if (ready.sproutReady === 0 && ready.waterReady === 0) {
      return { sprouts: 0, waters: 0 };
    }
    // Water claim is allowed to push drops above MAX_WATER_DROPS — the
    // existing computeDrops has a short-circuit at line 108 that handles
    // the overflow bucket correctly (regen pauses until drops drop below cap).
    const { drops: currentDrops, regenAt } = computeDrops(s);
    const now = Date.now();
    const next: PlayerState = {
      ...s,
      sprouts: s.sprouts + ready.sproutReady,
      waterDrops: currentDrops + ready.waterReady,
      lastDropRegenAt: regenAt,
      stats: {
        ...s.stats,
        sproutsGained: s.stats.sproutsGained + ready.sproutReady,
      },
      producer: { ...s.producer, lastClaimAt: now },
      updatedAt: now,
    };
    set({ state: next });
    scheduleSave(next);
    return { sprouts: ready.sproutReady, waters: ready.waterReady };
  },

  upgradeProducer: (track: 'sprout' | 'water'): { ok: boolean; cost?: number } => {
    const s = get().state;
    const currentLevel = track === 'sprout' ? s.producer.sproutLevel : s.producer.waterLevel;
    if (currentLevel >= PRODUCER_MAX_LEVEL) return { ok: false };

    const nextLevel = currentLevel + 1;
    const cost = (track === 'sprout' ? SPROUT_PRODUCER_UPGRADE_COST : WATER_PRODUCER_UPGRADE_COST)[nextLevel - 1];
    if (cost === undefined) return { ok: false };
    if (s.sprouts < cost) return { ok: false, cost };

    // Claim-first semantics: if there are pending rewards when the player
    // upgrades, grant them at the old yield so they don't evaporate when
    // lastClaimAt resets. Simpler than trying to preserve a partial window
    // across two different yield values.
    const ready = computeProducer(s);
    const { drops: currentDrops, regenAt } = computeDrops(s);
    const now = Date.now();

    const nextProducer = {
      ...s.producer,
      sproutLevel: track === 'sprout' ? nextLevel : s.producer.sproutLevel,
      waterLevel: track === 'water' ? nextLevel : s.producer.waterLevel,
      lastClaimAt: now,
    };

    const next: PlayerState = {
      ...s,
      sprouts: s.sprouts + ready.sproutReady - cost,
      waterDrops: currentDrops + ready.waterReady,
      lastDropRegenAt: regenAt,
      stats: {
        ...s.stats,
        sproutsGained: s.stats.sproutsGained + ready.sproutReady,
        sproutsSpent: s.stats.sproutsSpent + cost,
      },
      producer: nextProducer,
      updatedAt: now,
    };
    set({ state: next });
    scheduleSave(next);
    return { ok: true, cost };
  },

  // ── Cosmetic boxes (characters + backgrounds) ────────────────────
  openCosmeticBox: (type: CosmeticType): CosmeticBoxResult | null => {
    const s = get().state;
    if (s.gold < COSMETIC_BOX_COST) return null;

    const drop = rollCosmeticBoxDrop();
    const now = Date.now();

    let gold = s.gold - COSMETIC_BOX_COST;
    let waterDrops = s.waterDrops;
    let characters = s.characters;
    let backgrounds = s.backgrounds;
    let itemResult: CosmeticBoxResult['item'];
    let goldAmount = 0;
    let dropsAmount = 0;

    if (drop.kind === 'item') {
      const pool = type === 'character'
        ? CHARACTERS_BY_RARITY[drop.rarity]
        : BACKGROUNDS_BY_RARITY[drop.rarity];
      if (pool.length === 0) {
        // Fallback: pool empty at this tier → convert to gold consolation
        // so the box never returns "nothing". 20 gold is middle of the
        // gold consolation band.
        gold += 20;
        itemResult = undefined;
        goldAmount = 20;
      } else {
        const picked = pool[Math.floor(Math.random() * pool.length)]!;
        const inv = type === 'character' ? characters : backgrounds;
        const idx = inv.findIndex((c) => c.id === picked.id);
        const isNew = idx < 0;
        const nextInv: CollectedCosmetic[] = isNew
          ? [{ id: picked.id, count: 1, firstObtainedAt: now }, ...inv]
          : inv.map((c, i) => i === idx ? { ...c, count: c.count + 1 } : c);
        if (type === 'character') characters = nextInv;
        else backgrounds = nextInv;
        itemResult = { id: picked.id, rarity: drop.rarity, isNew };
      }
    } else if (drop.kind === 'gold') {
      gold += drop.amount;
      goldAmount = drop.amount;
    } else {
      // drops — allowed to exceed MAX_WATER_DROPS per product direction.
      // Regen math in computeDrops clamps to the cap going forward, so
      // the overflow effectively pauses regen until it's spent down.
      waterDrops = s.waterDrops + drop.amount;
      dropsAmount = drop.amount;
    }

    const next: PlayerState = {
      ...s,
      gold,
      waterDrops,
      characters,
      backgrounds,
      stats: {
        ...s.stats,
        goldSpent: s.stats.goldSpent + COSMETIC_BOX_COST,
        goldGained: s.stats.goldGained + goldAmount,
        cosmeticBoxesOpened: {
          ...s.stats.cosmeticBoxesOpened,
          [type]: s.stats.cosmeticBoxesOpened[type] + 1,
        },
      },
      updatedAt: now,
    };
    set({ state: next });
    scheduleSave(next);

    return {
      type,
      drop,
      item: itemResult,
      goldAmount: goldAmount || undefined,
      dropsAmount: dropsAmount || undefined,
    };
  },

  equipCharacter: (id: number | null) => {
    const s = get().state;
    if (id !== null && !s.characters.some((c) => c.id === id)) return;
    if (id !== null && !CHARACTERS_BY_ID[id]) return;
    const next: PlayerState = { ...s, equippedCharacterId: id, updatedAt: Date.now() };
    set({ state: next });
    scheduleSave(next);
  },

  equipBackground: (id: number | null) => {
    const s = get().state;
    if (id !== null && !s.backgrounds.some((b) => b.id === id)) return;
    if (id !== null && !BACKGROUNDS_BY_ID[id]) return;
    const next: PlayerState = { ...s, equippedBackgroundId: id, updatedAt: Date.now() };
    set({ state: next });
    scheduleSave(next);
  },
}));

// Tiny helper for tests / dev console
export const TOTAL_SPECIES_FOR_DEV = SPECIES.length;
