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
}
