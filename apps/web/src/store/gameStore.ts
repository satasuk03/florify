import { create } from 'zustand';
import { nanoid } from 'nanoid';
import {
  FIRST_FLORA_COST,
  MAX_WATER_COST,
  MAX_WATER_DROPS,
  MIN_WATER_COST,
  PITY_POINTS_COMMON,
  PITY_POINTS_LEGENDARY,
  PITY_POINTS_RARE,
  PITY_THRESHOLD,
  type CollectedSpecies,
  type PlayerState,
  type Rarity,
  type TreeInstance,
} from '@florify/shared';
import { DROP_REGEN_MS } from '@/lib/debug';
import { SPECIES, SPECIES_BY_RARITY } from '@/data/species';
import { RARITY_ROLL_WEIGHTS } from '@/data/rarityWeights';
import { mulberry32, randInt, randPick, randSeed } from '@/engine/rng';
import { saveStore } from './saveStore';
import { scheduleSave, flushSave } from './debouncedSave';
import { createInitialState } from './initialState';
import { isYesterday, todayLocalDate } from '@/lib/time';
import { haptic } from '@/lib/haptics';

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
  const elapsed = Date.now() - baseRegen;
  const gained = Math.max(0, Math.floor(elapsed / DROP_REGEN_MS));
  const drops = Math.min(baseDrops + gained, MAX_WATER_DROPS);
  // Advance the baseline so we don't re-grant the same drops later
  const regenAt = gained > 0
    ? baseRegen + gained * DROP_REGEN_MS
    : baseRegen;
  return { drops, regenAt };
}

export interface GameStore {
  state: PlayerState;

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
function rollPityReward(
  collectedIds: Set<number>,
): { speciesId: number; rarity: Rarity } | null {
  const rarity = rollRarity();
  const pool = SPECIES_BY_RARITY[rarity].filter((s) => !collectedIds.has(s.id));
  if (pool.length === 0) return null;
  const pick = pool[Math.floor(Math.random() * pool.length)]!;
  return { speciesId: pick.id, rarity };
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

function upsertCollection(
  collection: CollectedSpecies[],
  harvested: TreeInstance,
): CollectedSpecies[] {
  const now = harvested.harvestedAt!;
  const idx = collection.findIndex((c) => c.speciesId === harvested.speciesId);
  if (idx >= 0) {
    const existing = collection[idx]!;
    const updated: CollectedSpecies = {
      ...existing,
      count: existing.count + 1,
      totalWaterings: existing.totalWaterings + harvested.requiredWaterings,
      lastHarvestedAt: now,
    };
    // Move to front (most recent) and keep rest sorted
    return [updated, ...collection.slice(0, idx), ...collection.slice(idx + 1)];
  }
  // New species — prepend (most recent first)
  return [
    {
      speciesId: harvested.speciesId,
      rarity: harvested.rarity,
      count: 1,
      totalWaterings: harvested.requiredWaterings,
      firstHarvestedAt: now,
      lastHarvestedAt: now,
    },
    ...collection,
  ];
}

export const useGameStore = create<GameStore>((set, get) => ({
  state: createInitialState(),

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
      let collection = upsertCollection(s.collection, harvested);

      // ── Dried Leaves (🍂) pity accumulation ──────────────────────
      let pityPoints = s.pityPoints;
      let pityPointsGained = 0;
      let pityReward: { speciesId: number; rarity: Rarity } | undefined;

      if (collection.length < SPECIES.length) {
        if (!isDuplicate) {
          // New species from normal planting — reset pity
          pityPoints = 0;
        } else {
          // Duplicate — accumulate dried leaves
          const gained = PITY_POINTS[harvested.rarity];
          pityPoints += gained;
          pityPointsGained = gained;

          // Check threshold — enter roll loop
          const collectedIds = new Set(collection.map((c) => c.speciesId));
          for (let attempt = 0; attempt < 20 && pityPoints >= PITY_THRESHOLD; attempt++) {
            const reward = rollPityReward(collectedIds);
            if (reward) {
              collection = addPityRewardToCollection(collection, reward);
              collectedIds.add(reward.speciesId);
              pityReward = reward;
              pityPoints = 0;
              break;
            }
            // Tier fully collected — phantom duplicate, gain points for that tier
            pityPoints += PITY_POINTS[rollRarity()];
          }
        }
      }

      const next: PlayerState = {
        ...s,
        waterDrops: drops - 1,
        lastDropRegenAt: regenAt,
        activeTree: null,
        collection,
        pityPoints,
        stats: {
          ...s.stats,
          totalWatered: s.stats.totalWatered + 1,
          totalHarvested: s.stats.totalHarvested + 1,
        },
        updatedAt: now,
      };
      set({ state: next });
      scheduleSave(next);
      haptic('harvest');
      return { ok: true, harvested, pityPointsGained, pityReward };
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
      streak: { currentStreak, longestStreak, lastCheckinDate: today },
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
}));

// Tiny helper for tests / dev console
export const TOTAL_SPECIES_FOR_DEV = SPECIES.length;
