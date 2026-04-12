import type { Rarity } from "@florify/shared";
import type { SpeciesDef } from "./types";
import { SpeciesCollection } from "./types";
import series0 from "./series-0";
import series1 from "./series-1";
import series2 from "./series-2";
import series3 from "./series-3";
import series4 from "./series-4";

export type { SpeciesDef } from "./types";
export { SpeciesCollection } from "./types";

// ---------------------------------------------------------------------------
// Registry — all series are eagerly imported and concatenated once at startup.
// To add a new batch of species, create `series-N.ts` and add it below.
// ---------------------------------------------------------------------------

function registerSeries(
  target: SpeciesDef[],
  entries: readonly SpeciesDef[],
) {
  for (const s of entries) {
    if (target[s.id] != null) {
      throw new Error(`duplicate species id ${s.id}`);
    }
    target[s.id] = s;
  }
}

const _species: SpeciesDef[] = [];
registerSeries(_species, series0);
registerSeries(_species, series1);
registerSeries(_species, series2);
registerSeries(_species, series3);
registerSeries(_species, series4);

// Integrity: catch id/ordering drift early — the app fails to boot rather
// than quietly rendering the wrong image for a saved tree.
if (_species.length < 300) {
  throw new Error(`expected at least 300 species, got ${_species.length}`);
}
for (let i = 0; i < _species.length; i++) {
  const s = _species[i]!;
  if (s.id !== i) {
    throw new Error(`species[${i}].id is ${s.id}, expected ${i}`);
  }
}

export const SPECIES: readonly SpeciesDef[] = _species;

/** O(1) lookup by species id. Sparse allowed — future ids may be gapped. */
export const SPECIES_BY_ID: Readonly<Record<number, SpeciesDef>> = Object.freeze(
  _species.reduce<Record<number, SpeciesDef>>((acc, s) => {
    acc[s.id] = s;
    return acc;
  }, {}),
);

export const SPECIES_BY_RARITY: Record<Rarity, readonly SpeciesDef[]> = {
  common: SPECIES.filter((s) => s.rarity === "common"),
  rare: SPECIES.filter((s) => s.rarity === "rare"),
  legendary: SPECIES.filter((s) => s.rarity === "legendary"),
};

/* Newest collection first */
export const ALL_COLLECTIONS: SpeciesCollection[] = [
  SpeciesCollection.CelestialCourt,
  SpeciesCollection.AbyssalGarden,
  SpeciesCollection.ChineseGarden,
  SpeciesCollection.Original,
];

export const COLLECTION_LABELS: Record<SpeciesCollection, { th: string; en: string }> = {
  [SpeciesCollection.Original]: { th: 'Original', en: 'Original' },
  [SpeciesCollection.ChineseGarden]: { th: 'Chinese Garden', en: 'Chinese Garden' },
  [SpeciesCollection.AbyssalGarden]: { th: 'Abyssal Garden', en: 'Abyssal Garden' },
  [SpeciesCollection.CelestialCourt]: { th: 'Celestial Court', en: 'Celestial Court' },
};
