import type { Rarity } from '@florify/shared';
import { FLORA_NAMES } from './floraNames';

/**
 * The 300-species catalogue.
 *
 * `speciesId` is a stable integer key (0..299) that lives in save data.
 * It indexes directly into `FLORA_NAMES`, which is the folder name under
 * `public/floras/` that holds the three growth-stage images.
 */

export interface SpeciesDef {
  readonly id: number;
  readonly name: string;   // display name, e.g. "Sunleaf"
  readonly folder: string; // matches /public/floras/{folder}/
  readonly rarity: Rarity;
}

function rarityFor(id: number): Rarity {
  if (id < 200) return 'common';
  if (id < 280) return 'rare';
  return 'legendary';
}

function capitalize(s: string): string {
  return s.length === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1);
}

export const SPECIES: readonly SpeciesDef[] = FLORA_NAMES.map((folder, id) => ({
  id,
  name: capitalize(folder),
  folder,
  rarity: rarityFor(id),
}));

export const SPECIES_BY_RARITY: Record<Rarity, readonly SpeciesDef[]> = {
  common: SPECIES.filter((s) => s.rarity === 'common'),
  rare: SPECIES.filter((s) => s.rarity === 'rare'),
  legendary: SPECIES.filter((s) => s.rarity === 'legendary'),
};
