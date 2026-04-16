import type { Rarity } from '../types/game';

/**
 * Shared drop table for Character Box and Background Box. Each outcome
 * has an integer weight; weights sum to 100 so they double as percent
 * chances. `item` rows pull from the matching box type's catalog at
 * that rarity tier (allowing duplicates, stacked in inventory).
 *
 * Both box types currently share this table; the data structure is
 * kept flat so a future iteration can fork per box type without
 * reshaping callers.
 */
export type CosmeticBoxDrop =
  | { kind: 'item'; rarity: Rarity; weight: number }
  | { kind: 'gold'; amount: number; weight: number }
  | { kind: 'drops'; amount: number; weight: number };

export const COSMETIC_BOX_DROPS: readonly CosmeticBoxDrop[] = [
  { kind: 'item', rarity: 'common', weight: 30 },
  { kind: 'item', rarity: 'rare', weight: 6 },
  { kind: 'item', rarity: 'legendary', weight: 4 },
  { kind: 'gold', amount: 10, weight: 17 },
  { kind: 'gold', amount: 20, weight: 13 },
  { kind: 'gold', amount: 50, weight: 6 },
  { kind: 'drops', amount: 10, weight: 16 },
  { kind: 'drops', amount: 20, weight: 8 },
] as const;

export const COSMETIC_BOX_TOTAL_WEIGHT = COSMETIC_BOX_DROPS.reduce(
  (sum, d) => sum + d.weight,
  0,
);

/** Pick a drop from the shared table using `rng` (defaults to `Math.random`). */
export function rollCosmeticBoxDrop(rng: () => number = Math.random): CosmeticBoxDrop {
  const r = rng() * COSMETIC_BOX_TOTAL_WEIGHT;
  let acc = 0;
  for (const drop of COSMETIC_BOX_DROPS) {
    acc += drop.weight;
    if (r < acc) return drop;
  }
  return COSMETIC_BOX_DROPS[COSMETIC_BOX_DROPS.length - 1]!;
}
