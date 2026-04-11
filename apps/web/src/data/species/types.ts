import type { Rarity } from "@florify/shared";

export enum SpeciesCollection {
  Original = "original",
  ChineseGarden = "chinese-garden",
  AbyssalGarden = "abyssal-garden",
}

export interface SpeciesDef {
  readonly id: number;
  readonly name: string;
  readonly folder: string;
  readonly rarity: Rarity;
  readonly descriptionEN: string;
  readonly descriptionTH: string;
  readonly collection: SpeciesCollection;
  /** Bilingual title unlocked when this Legendary reaches Flora Level 5.
   *  Only defined for Legendary species. */
  readonly epithet?: { readonly en: string; readonly th: string };
}
