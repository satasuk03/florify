---
name: add-flora
description: Add a new flora species to Florify. Takes a species description from the user, generates 3 stage images (seedling, young, mature) via the xAI image script, places the webps under apps/web/public/floras/{folder}/, and registers the species in the latest series file under apps/web/src/data/species/. Use when the user asks to add / create / register a new flora or species.
---

# add-flora

Create a brand-new flora species end-to-end: lore → prompts → 3 generated images → data registration.

## Inputs to collect from the user

Before doing anything else, make sure you have:

1. **Species description** — a short paragraph describing vibes, colors, lore, and any special traits. This is the only required input. If missing, ask.
2. **Folder name** *(optional)* — lowercase, no spaces, ascii only (e.g. `voidlotus`). If not supplied, propose one based on the description and confirm.
3. **Display name** *(optional)* — defaults to Title-cased folder.
4. **Rarity** *(optional)* — `common` | `rare` | `legendary`. Default `rare` for user-added floras unless the description clearly implies otherwise.
5. **Collection** *(optional)* — `SpeciesCollection.Original` | `SpeciesCollection.ChineseGarden` (enum in `apps/web/src/data/species/types.ts`). Default `SpeciesCollection.ChineseGarden` for Chinese-themed floras, `SpeciesCollection.Original` is reserved for the hand-authored 300-species catalogue. Add new enum values if the user wants a new collection theme.
6. **Thai description** *(optional)* — if the user doesn't provide one, translate the English description yourself into natural Thai in the same literary voice as existing entries in the species series files.

Do NOT reuse a folder name that already exists in `SPECIES` (check series files under `apps/web/src/data/species/`) or under `apps/web/public/floras/`. Check both before proceeding.

## Architecture you must respect

- Species are split into series files under `apps/web/src/data/species/series-{N}.ts` (100 species each), registered and re-exported from `apps/web/src/data/species/index.ts`. Types live in `apps/web/src/data/species/types.ts`. `id` equals array index. `folder` must match `public/floras/{folder}/`.
- Runtime images live at `apps/web/public/floras/{folder}/stage-{1|2|3}.webp`. Stage 1 = seedling, Stage 2 = young plant, Stage 3 = mature bloom.
- Image generation is driven by `apps/scripts/` — prompts live in `apps/scripts/prompts.json`, the generator is `apps/scripts/src/generate.ts`, which writes to `apps/scripts/output/{folder}/stage-{N}.webp`. It reads `XAI_API_KEY` from `apps/scripts/.env`.
- `index.ts` has an integrity check asserting `length >= 300`. The id-equals-index check remains strict.

## Procedure

### 1. Gather inputs & pick a folder
- Confirm description, folder, display name, rarity, and lore with the user if anything is ambiguous.
- Verify `apps/web/public/floras/{folder}/` does not exist and `{folder}` is not already in `SPECIES`.

### 2. Craft 3 stage prompts
Match the style of existing entries in `apps/scripts/src/buildPrompts.ts` (see `OVERRIDES` for the POC floras — `sunleaf`, `moonfern`, `emberbloom`, `frostpetal`, `glowmoss`). Each prompt must:
- End with `botanical illustration style, vertical composition`
- Include `cream background`
- Describe pot/vessel, palette, and a unique special effect drawn from the user's description
- Stage 1: tiny seedling with cotyledons
- Stage 2: young plant with several unfurling leaves
- Stage 3: mature bloom, lush, elegant

### 3. Register the prompt override
Add an entry to the `OVERRIDES` record in `apps/scripts/src/buildPrompts.ts` keyed by the new folder name, with your 3 prompts.

Then **append** the new folder to the `USER_ADDED` array in `buildPrompts.ts`. This array (after the 300-grid double-loop) pushes user-added floras into the output without disturbing the original 300 ordering.

- Add the folder name to `const USER_ADDED = ['meihua', ...] as const;`
- Re-run the script: `tsx apps/scripts/src/buildPrompts.ts` from the scripts package.

### 4. Generate the 3 images
From `apps/scripts/`:

```bash
# Generate only the new flora (recommended — faster & cheaper)
pnpm generate -- --name={folder}

# Generate multiple specific floras
pnpm generate -- --name=meihua,sunleaf

# Force regenerate (overwrite existing images)
pnpm generate -- --name={folder} --force

# Generate all floras
pnpm generate:all
```

The `--name` flag accepts comma-separated flora names. Without `--force`, existing images are skipped.

Confirm `XAI_API_KEY` is set in `apps/scripts/.env` first; if not, ask the user to populate it and stop.

Images land in `apps/scripts/output/{folder}/stage-{1,2,3}.webp`.

### 5. Move images into the web app
```bash
mkdir -p apps/web/public/floras/{folder}
cp apps/scripts/output/{folder}/stage-*.webp apps/web/public/floras/{folder}/
```

Verify all three files exist and are non-empty before moving on.

### 6. Register the species in data files
Append a new `SpeciesDef` object to the **latest series file** under `apps/web/src/data/species/` (e.g. `series-3.ts` for ids 300+). If the current series has 100 entries, create a new `series-N.ts` and import it in `index.ts`.
   - `id`: next sequential integer (check the last id in the latest series file)
   - `folder`: matches the folder created in step 5
   - `name`: display name
   - `rarity`: chosen rarity
   - `descriptionEN` / `descriptionTH`: the lore
   - `collection`: `SpeciesCollection.ChineseGarden` by default for user-added floras (use `SpeciesCollection.Original` only if the user explicitly asks). Import from `./types`.
   Keep the id-equals-index check intact — it still needs to pass.

### 7. Verify
- `pnpm --filter @florify/web typecheck` (or the repo's equivalent) to make sure the integrity checks still pass at import time.
- Suggest the user run the web app and confirm the new flora renders.

### 8. Report
Summarize for the user:
- New species id, folder, name, rarity
- Paths of the 3 generated webps
- Files modified

## Guardrails
- Never overwrite existing webps under `public/floras/`.
- Never reuse an id or folder.
- Never weaken the id-equals-index integrity check — it catches real bugs. Only the `length === 300` assertion needs to be loosened, because the catalogue is growing.
- If image generation fails (missing API key, rate limit, 4xx), stop and surface the error. Do not register a species whose images don't exist yet.
