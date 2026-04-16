import type { Rarity } from '@florify/shared';
import type { CharacterDef } from './types';
import series0 from './series-0';

export type { CharacterDef } from './types';

const _characters: CharacterDef[] = [];
for (const c of series0) {
  if (_characters[c.id] != null) throw new Error(`duplicate character id ${c.id}`);
  _characters[c.id] = c;
}

export const CHARACTERS: readonly CharacterDef[] = _characters;

export const CHARACTERS_BY_ID: Readonly<Record<number, CharacterDef>> = Object.freeze(
  _characters.reduce<Record<number, CharacterDef>>((acc, c) => {
    acc[c.id] = c;
    return acc;
  }, {}),
);

export const CHARACTERS_BY_RARITY: Record<Rarity, readonly CharacterDef[]> = {
  common: CHARACTERS.filter((c) => c.rarity === 'common'),
  rare: CHARACTERS.filter((c) => c.rarity === 'rare'),
  legendary: CHARACTERS.filter((c) => c.rarity === 'legendary'),
};

/** Public image path (served from Next.js /public). */
export function characterImagePath(c: CharacterDef): string {
  return `/gardeners/${c.slug}.webp`;
}
