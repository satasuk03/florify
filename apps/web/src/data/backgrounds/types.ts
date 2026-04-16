import type { Rarity } from '@florify/shared';

export interface BackgroundDef {
  readonly id: number;
  readonly slug: string;         // image file basename under /public/backgrounds
  readonly nameEN: string;
  readonly nameTH: string;
  readonly rarity: Rarity;
}
