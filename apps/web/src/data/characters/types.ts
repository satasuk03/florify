import type { Rarity } from '@florify/shared';

export interface CharacterDef {
  readonly id: number;
  readonly slug: string;         // image file basename under /public/gardeners
  readonly nameEN: string;
  readonly nameTH: string;
  readonly rarity: Rarity;
}
