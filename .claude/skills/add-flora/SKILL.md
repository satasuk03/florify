---
name: add-flora
description: Add a new flora species to Florify. Takes a species description from the user, generates 3 stage images (seedling, young, mature) via the xAI image script, places the webps under apps/web/public/floras/{folder}/, and registers the species in apps/web/src/data/species.ts. Use when the user asks to add / create / register a new flora or species.
---

# add-flora

Create a brand-new flora species end-to-end: lore → prompts → 3 generated images → data registration.

## Inputs to collect from the user

Before doing anything else, make sure you have:

1. **Species description** — a short paragraph describing vibes, colors, lore, and any special traits. This is the only required input. If missing, ask.
2. **Folder name** *(optional)* — lowercase, no spaces, ascii only (e.g. `voidlotus`). If not supplied, propose one based on the description and confirm.
3. **Display name** *(optional)* — defaults to Title-cased folder.
4. **Rarity** *(optional)* — `common` | `rare` | `legendary`. Default `rare` for user-added floras unless the description clearly implies otherwise.
5. **Series** *(optional)* — `SpeciesSeries.Original` | `SpeciesSeries.Abnormal` (enum in `apps/web/src/data/species.ts`). Default `SpeciesSeries.Abnormal` for user-added floras, since `Original` is reserved for the hand-authored 300-species catalogue.
6. **Thai description** *(optional)* — if the user doesn't provide one, translate the English description yourself into natural Thai in the same literary voice as existing entries in `apps/web/src/data/species.ts`.

Do NOT reuse a folder name that already exists in `SPECIES` (`apps/web/src/data/species.ts`) or under `apps/web/public/floras/`. Check both before proceeding.

## Architecture you must respect

- The catalogue is a strictly-ordered array in `apps/web/src/data/species.ts`. `id` equals array index. `folder` must match `public/floras/{folder}/`.
- Runtime images live at `apps/web/public/floras/{folder}/stage-{1|2|3}.webp`. Stage 1 = seedling, Stage 2 = young plant, Stage 3 = mature bloom.
- Image generation is driven by `apps/scripts/` — prompts live in `apps/scripts/prompts.json`, the generator is `apps/scripts/src/generate.ts`, which writes to `apps/scripts/output/{folder}/stage-{N}.webp`. It reads `XAI_API_KEY` from `apps/scripts/.env`.
- `species.ts` has a hard integrity check asserting `length === 300`. New species push the count past 300, so you must relax it to `>= 300` (see Step 5).

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

Then **append** the new folder to the generator. Since `buildPrompts.ts` currently iterates `PREFIXES × SUFFIXES` to produce exactly 300, the cleanest way to inject a user-added flora without disturbing the 300-grid ordering is:

- After the existing double-loop, push your new folder to `out` explicitly.
- Update the post-loop count check from `!== 300` to `< 300` (or `!== 301+N`).
- Re-run the script: `pnpm --filter @florify/scripts build-prompts` (or `tsx apps/scripts/src/buildPrompts.ts` from the scripts package).

### 4. Generate the 3 images
From `apps/scripts/`:

```bash
pnpm --filter @florify/scripts generate -- --all
```

If the user only wants to regenerate the new flora (faster, cheaper), narrow the task queue — the simplest way is to temporarily edit `prompts.json` to contain only the new entry, run `generate --all`, then restore it. Confirm `XAI_API_KEY` is set in `apps/scripts/.env` first; if not, ask the user to populate it and stop.

Images land in `apps/scripts/output/{folder}/stage-{1,2,3}.webp`.

### 5. Move images into the web app
```bash
mkdir -p apps/web/public/floras/{folder}
cp apps/scripts/output/{folder}/stage-*.webp apps/web/public/floras/{folder}/
```

Verify all three files exist and are non-empty before moving on.

### 6. Register the species in data files
**`apps/web/src/data/species.ts`** — append a new `SpeciesDef` object to the `SPECIES` array with:
   - `id`: next sequential integer (300 for the first user-added, 301 for the next, …)
   - `folder`: matches the folder created in step 5
   - `name`: display name
   - `rarity`: chosen rarity
   - `descriptionEN` / `descriptionTH`: the lore
   - `series`: `SpeciesSeries.Abnormal` by default for user-added floras (use `SpeciesSeries.Original` only if the user explicitly asks). Import the enum from the same file — it's exported alongside `SpeciesDef`.
   Relax the `SPECIES.length !== 300` guard to `< 300`. Keep the id-equals-index check intact — it still needs to pass.

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
