import type { BoosterTier, Rarity } from '@florify/shared';

/**
 * Rarity probability per booster pack tier. Each tier sums to 1.0.
 * Separate from RARITY_ROLL_WEIGHTS (used for planting) so the two
 * systems stay independently tuneable.
 */
export const BOOSTER_ROLL_WEIGHTS: Record<BoosterTier, Record<Rarity, number>> = {
  common:    { common: 0.80, rare: 0.15, legendary: 0.05 },
  rare:      { common: 0.30, rare: 0.60, legendary: 0.10 },
  legendary: { common: 0.05, rare: 0.45, legendary: 0.45 },
};
