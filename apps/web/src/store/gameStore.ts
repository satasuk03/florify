import { create } from 'zustand';
import { nanoid } from 'nanoid';
import {
  MAX_WATERINGS,
  MIN_WATERINGS,
  TOTAL_SPECIES,
  type PlayerState,
  type Rarity,
  type TreeInstance,
} from '@florify/shared';
import { COOLDOWN_MS } from '@/lib/debug';
import { SPECIES_BY_RARITY } from '@/data/species';
import { mulberry32, randInt, randPick, randSeed } from '@/engine/rng';
import { saveStore } from './saveStore';
import { scheduleSave } from './debouncedSave';
import { createInitialState } from './initialState';
import { isYesterday, todayLocalDate } from '@/lib/time';
import { haptic } from '@/lib/haptics';
import { cancelCooldownNotification, scheduleCooldownNotification } from '@/lib/notifications';

/**
 * Florify game store.
 *
 * Single source of truth for player state; actions enforce the game
 * rules (cooldown, one-active-tree, rarity distribution). Persistence
 * is fire-and-forget via `scheduleSave` — mutations are never blocked
 * on I/O. Tests clobber state directly via `useGameStore.setState` to
 * bypass cooldowns and deterministically trigger harvest.
 */

export interface WaterResult {
  ok: boolean;
  harvested?: TreeInstance;
  nextAvailableAt?: number;
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

export interface GameStore {
  state: PlayerState;

  // Derived — primitive returns only (objects would break useSyncExternalStore
  // equality checks; derive object shapes from raw state via useMemo instead).
  canWater: () => boolean;
  nextWaterAt: () => number | null;
  uniqueSpeciesUnlocked: () => number;

  // Actions
  hydrate: () => Promise<void>;
  plantTree: () => TreeInstance;
  waterTree: () => WaterResult;
  resetActiveTree: () => void;
  checkinStreak: () => void;
  resetAllProgress: () => void;
}

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
  const rarityByIdSeen = new Map<number, Rarity>();
  for (const t of state.collection) {
    if (!rarityByIdSeen.has(t.speciesId)) rarityByIdSeen.set(t.speciesId, t.rarity);
  }
  let common = 0;
  let rare = 0;
  let legendary = 0;
  for (const r of rarityByIdSeen.values()) {
    if (r === 'common') common++;
    else if (r === 'rare') rare++;
    else legendary++;
  }
  const speciesUnlocked = rarityByIdSeen.size;
  return {
    rank: deriveRank(speciesUnlocked),
    speciesUnlocked,
    totalHarvested: state.stats.totalHarvested,
    currentStreak: state.streak.currentStreak,
    longestStreak: state.streak.longestStreak,
    rarityProgress: {
      common: { unlocked: common, total: 200 },
      rare: { unlocked: rare, total: 80 },
      legendary: { unlocked: legendary, total: 20 },
    },
    startedAt: state.createdAt,
    serial: deriveSerial(state.userId),
    displayName: 'Guest',
  };
}

// ── Rarity roll ─────────────────────────────────────────────────────
// 3% legendary, 22% rare, 75% common (sums to 100%)
function rollRarity(): Rarity {
  const r = Math.random();
  if (r < 0.03) return 'legendary';
  if (r < 0.25) return 'rare';
  return 'common';
}

function distinctSpeciesIds(collection: readonly TreeInstance[]): Set<number> {
  const set = new Set<number>();
  for (const t of collection) set.add(t.speciesId);
  return set;
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

  // ── Derived selectors ─────────────────────────────────────────────
  canWater: () => {
    const t = get().state.activeTree;
    if (!t) return false;
    if (t.lastWateredAt === null) return true;
    return Date.now() - t.lastWateredAt >= COOLDOWN_MS;
  },

  nextWaterAt: () => {
    const t = get().state.activeTree;
    if (!t || t.lastWateredAt === null) return null;
    return t.lastWateredAt + COOLDOWN_MS;
  },

  uniqueSpeciesUnlocked: () => distinctSpeciesIds(get().state.collection).size,

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
    // Required waterings 1..10, derived from seed so replay is consistent.
    // First-ever tree is guaranteed 1 watering so new players see a harvest
    // immediately — avoids a slow onboarding through multiple cooldowns.
    const isFirstEver = current.stats.totalPlanted === 0 && current.collection.length === 0;
    const wateringsRng = mulberry32((seed ^ 0xabcdef) >>> 0);
    const required = isFirstEver ? 1 : randInt(wateringsRng, MIN_WATERINGS, MAX_WATERINGS);

    const now = Date.now();
    const tree: TreeInstance = {
      id: nanoid(),
      seed,
      speciesId: species.id,
      rarity,
      requiredWaterings: required,
      currentWaterings: 0,
      plantedAt: now,
      lastWateredAt: null,
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

    const now = Date.now();
    if (tree.lastWateredAt !== null && now - tree.lastWateredAt < COOLDOWN_MS) {
      return { ok: false, nextAvailableAt: tree.lastWateredAt + COOLDOWN_MS };
    }

    const nextWaterings = tree.currentWaterings + 1;
    const isHarvest = nextWaterings >= tree.requiredWaterings;

    if (isHarvest) {
      const harvested: TreeInstance = {
        ...tree,
        currentWaterings: nextWaterings,
        lastWateredAt: now,
        harvestedAt: now,
      };
      const next: PlayerState = {
        ...s,
        activeTree: null,
        collection: [...s.collection, harvested],
        stats: {
          ...s.stats,
          totalWatered: s.stats.totalWatered + 1,
          totalHarvested: s.stats.totalHarvested + 1,
        },
        updatedAt: now,
      };
      set({ state: next });
      scheduleSave(next);
      cancelCooldownNotification();
      haptic('harvest');
      return { ok: true, harvested };
    }

    const next: PlayerState = {
      ...s,
      activeTree: { ...tree, currentWaterings: nextWaterings, lastWateredAt: now },
      stats: { ...s.stats, totalWatered: s.stats.totalWatered + 1 },
      updatedAt: now,
    };
    set({ state: next });
    scheduleSave(next);
    scheduleCooldownNotification(now + COOLDOWN_MS);
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
    cancelCooldownNotification();
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
}));

// Tiny helper for tests / dev console
export const TOTAL_SPECIES_FOR_DEV = TOTAL_SPECIES;
