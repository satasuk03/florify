import type { Rarity } from "@florify/shared";

/**
 * Roll probability per rarity tier. Single source of truth — the game
 * store's `rollRarity()` and the Guide Book's RaritySection both read
 * from here so the displayed odds and the actual odds can't drift.
 *
 * Must sum to 1.0.
 */
export const RARITY_ROLL_WEIGHTS: Record<Rarity, number> = {
  common: 0.88,
  rare: 0.09,
  legendary: 0.03,
};
