import type { Rarity } from '@florify/shared';
import type { BackgroundDef } from './types';
import series0 from './series-0';

export type { BackgroundDef } from './types';

const _backgrounds: BackgroundDef[] = [];
for (const b of series0) {
  if (_backgrounds[b.id] != null) throw new Error(`duplicate background id ${b.id}`);
  _backgrounds[b.id] = b;
}

export const BACKGROUNDS: readonly BackgroundDef[] = _backgrounds;

export const BACKGROUNDS_BY_ID: Readonly<Record<number, BackgroundDef>> = Object.freeze(
  _backgrounds.reduce<Record<number, BackgroundDef>>((acc, b) => {
    acc[b.id] = b;
    return acc;
  }, {}),
);

export const BACKGROUNDS_BY_RARITY: Record<Rarity, readonly BackgroundDef[]> = {
  common: BACKGROUNDS.filter((b) => b.rarity === 'common'),
  rare: BACKGROUNDS.filter((b) => b.rarity === 'rare'),
  legendary: BACKGROUNDS.filter((b) => b.rarity === 'legendary'),
};

export function backgroundImagePath(b: BackgroundDef): string {
  return `/backgrounds/${b.slug}.webp`;
}
