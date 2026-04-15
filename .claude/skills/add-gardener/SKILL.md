---
name: add-gardener
description: Add a new gardener character to Florify. Takes a character description, generates a single full-body character image via the xAI/Grok script on a solid background, removes the background with rembg (isnet-anime), trims and saves as a transparent WebP under apps/web/public/gardeners/{slug}.webp. Use when the user asks to add / create / generate a new gardener or character.
---

# add-gardener

Create a brand-new gardener character end-to-end: description → prompt → grok image → background removal → transparent webp asset.

Gardeners are player-selectable characters rendered over user-chosen backgrounds, so the final asset MUST be a WebP with alpha channel (no baked background).

## Inputs to collect from the user

Before doing anything else, make sure you have:

1. **Character description** — short paragraph: vibe, outfit, pose, mood, any props (e.g. watering can, flower basket). Required — if missing, ask.
2. **Slug** *(optional)* — lowercase, no spaces, ascii only (e.g. `willow`, `meihua`). If not supplied, propose one from the description and confirm. Must not collide with an existing file in `apps/web/public/gardeners/`.
3. **Art style** *(optional)* — defaults to `guofeng Chinese ink wash painting` to match Florify's flora aesthetic. Ask if the user wants something else (anime, watercolor, storybook, etc.).
4. **Aspect ratio** *(optional)* — defaults to `3:4` (portrait, full-body friendly).
5. **Background fill color for generation** *(optional)* — defaults to `#f5f0e6` (warm cream, matches flora cream background). Pick a solid color that contrasts with the character's main colors so rembg cuts cleanly. Avoid colors that appear in the character itself.

Verify the slug is not already used:
- Check `apps/web/public/gardeners/{slug}.webp` does not exist.

## Architecture you must respect

- Grok (`grok-imagine-image` via `apps/scripts/src/grok.ts`) does NOT support transparent backgrounds. Always prompt for a **solid flat background** of a specific color, then strip it in a later step.
- Background removal runs via `apps/scripts/src/rembg.ts` → wraps the `rembg` Python CLI (`isnet-anime` model + `-ppm` post-processing). The model is tuned for illustration/anime linework — keep the style within that family for best edges.
- Final asset conversion runs via `apps/scripts/src/finalize-character.ts` → Sharp `.trim()` + WebP with alpha (quality 90, alphaQuality 100). Destination defaults to `apps/web/public/gardeners/{slug}.webp`.
- Required external dependency on the dev machine: `pipx install "rembg[cli]"` + `pipx inject rembg onnxruntime`. First run downloads `isnet-anime.onnx` (~170 MB) to `~/.u2net/`.
- `XAI_API_KEY` must be set in `apps/scripts/.env`.

## Procedure

### 1. Gather inputs & pick a slug
Confirm description, slug, style, ratio, and bg color with the user if anything is ambiguous. Verify `apps/web/public/gardeners/{slug}.webp` does not exist.

### 2. Craft the generation prompt
Build a single prompt string that includes, in this order:
- Character core (e.g. `young gardener character, full body standing pose`)
- Outfit / props / pose details from the user's description
- Art style clause (e.g. `guofeng Chinese ink wash painting style, delicate brush strokes, subtle color accents`)
- Mood / expression
- **Mandatory closing clause**: `solid flat background #RRGGBB` (use the chosen bg color)

Good example:
```
young gardener character, full body standing pose, guofeng Chinese ink wash painting style,
flowing robes with floral embroidery, holding a watering can, serene expression,
delicate brush strokes, subtle color accents, solid flat background #f5f0e6
```

Do NOT ask for transparent, PNG alpha, cut-out, or sticker style in the prompt — Grok will ignore those and may produce weirder backgrounds. A solid hex color works best.

### 3. Generate the character image
From the repo root (or `apps/scripts/`):

```bash
pnpm --filter @florify/scripts grok "<your prompt>" --format=png --ratio=3:4
```

Output lands in `apps/scripts/output/grok-{timestamp}.png`. Note the exact filename — you need it for the next step.

Confirm `XAI_API_KEY` exists in `apps/scripts/.env` before running. If missing, stop and ask the user to populate it.

### 4. Background removal
```bash
pnpm --filter @florify/scripts rembg apps/scripts/output/grok-{timestamp}.png
```

Produces `apps/scripts/output/grok-{timestamp}-cutout.png` (PNG with alpha).

If the `rembg` CLI is not on PATH, the script prints install instructions. Stop and ask the user to install before retrying.

Visually verify edge quality (read the cutout PNG — transparent areas render as black in the tool preview but alpha is intact):
- Hair silhouette clean, no jagged steps
- No halo of the original bg color around edges
- Fine details (plant stems, accessories) preserved

If edges are poor, regenerate step 3 with a different bg color (more contrast) or try `--model=birefnet-portrait` in step 4.

### 5. Finalize as WebP
```bash
pnpm --filter @florify/scripts finalize-character apps/scripts/output/grok-{timestamp}-cutout.png --name={slug}
```

This trims transparent border, converts to WebP (alpha preserved), and saves to `apps/web/public/gardeners/{slug}.webp`.

Verify the file exists and is non-empty.

### 6. Verify
- Read the final `.webp` to confirm the character fills the frame and background is fully transparent.
- Suggest the user preview it in the web app once the Gardener UI exists.

### 7. Report
Summarize for the user:
- Slug
- Generation prompt used
- Paths of intermediate files (original PNG, cutout PNG) and final WebP
- File size of the final WebP

## Guardrails
- Never overwrite an existing `apps/web/public/gardeners/{slug}.webp` without explicit confirmation.
- Never prompt Grok for transparent/PNG-alpha output — it doesn't work. Always use a solid hex bg and strip later.
- If rembg or onnxruntime isn't installed, stop and surface setup instructions. Do not save a character whose background is still baked in.
- Do not register the character in any data file yet — the Gardener data structure is not implemented. When it is, extend this skill with a registration step (mirror `add-flora` step 6).
