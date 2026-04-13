---
name: nanobanana
description: Generate images using Gemini's Nano Banana models via CLI. Use when the user asks to generate an image, create a picture, make art, or produce visual assets using Gemini / Nano Banana. Supports text-to-image with model selection, aspect ratio, resolution, and format options.
---

# nanobanana

Generate images from text prompts using Google Gemini's native image generation (Nano Banana).

## Available Models

| Alias | Model ID | Notes |
|-------|----------|-------|
| `flash` / `3.1` | `gemini-3.1-flash-image-preview` | **Default.** Best all-around. Supports 512/1K/2K/4K. Thinking mode. |
| `pro` / `3pro` | `gemini-3-pro-image-preview` | Professional quality. Advanced reasoning. Supports 1K/2K/4K. |
| `2.5` | `gemini-2.5-flash-image` | Fastest & cheapest. 1K only. |

## Prerequisites

`GEMINI_API_KEY` must be set in `apps/scripts/.env`. If missing, ask the user to add it (get one at https://aistudio.google.com/apikey).

## Usage

Run from the repo root:

```bash
# Basic generation (default: 3.1 Flash, 1:1, 1K, PNG)
pnpm --filter @florify/scripts nanobanana "A cute botanical seedling in a clay pot"

# Choose model
pnpm --filter @florify/scripts nanobanana "A mushroom forest" --model=2.5

# Set aspect ratio and resolution
pnpm --filter @florify/scripts nanobanana "A tall bamboo" --ratio=9:16 --size=2K

# Output as WebP
pnpm --filter @florify/scripts nanobanana "A rose garden" --format=webp

# Specify output path
pnpm --filter @florify/scripts nanobanana "A sunflower" --output=apps/web/public/sunflower.png

# Overwrite existing file
pnpm --filter @florify/scripts nanobanana "A daisy" --output=out.png --force
```

## CLI Options

| Flag | Values | Default | Notes |
|------|--------|---------|-------|
| `--model=` | `flash`, `3.1`, `pro`, `3pro`, `2.5` | `flash` | Model alias |
| `--ratio=` | `1:1`, `2:3`, `3:2`, `3:4`, `4:3`, `4:5`, `5:4`, `9:16`, `16:9`, `21:9`, `1:4`, `4:1`, `1:8`, `8:1` | `1:1` | Aspect ratio |
| `--size=` | `512`, `1K`, `2K`, `4K` | `1K` | Resolution (3.1 Flash only, ignored for 2.5) |
| `--format=` | `png`, `webp` | `png` | Output format |
| `--output=` | file path | `output/nanobanana-{timestamp}.{ext}` | Output file path |
| `--force` | — | — | Overwrite existing file |

## Procedure When User Asks to Generate

1. **Collect the prompt** — ask if not provided. Encourage descriptive, narrative prompts over keyword lists.
2. **Pick options** — ask about model/ratio/size if relevant to the use case, otherwise use defaults.
3. **Check API key** — if `GEMINI_API_KEY` is missing from `apps/scripts/.env`, stop and ask the user to add it.
4. **Run the command** — execute `pnpm --filter @florify/scripts nanobanana "prompt" [options]`.
5. **Report results** — show the output path, file size, and model used.

## Prompting Tips (from Gemini docs)

- **Describe the scene, don't just list keywords.** Narrative prompts produce better results.
- **Be hyper-specific** — "ornate elven plate armor, etched with silver leaf patterns" beats "fantasy armor".
- **Use photography terms** for photorealistic images — mention camera angles, lens types, lighting.
- **Step-by-step instructions** for complex scenes — "First, create a background of... Then, add..."
- For **text in images** — be explicit about font style, placement, and content.
- For **stickers/icons** — request "white background" (model can't do transparent).

## Architecture

| File | Purpose |
|------|---------|
| `apps/scripts/src/gemini.ts` | Gemini client wrapper. `generateImage(prompt, opts?)` returns PNG Buffer. |
| `apps/scripts/src/nanobanana.ts` | CLI entry point. Arg parsing, format conversion, file output. |
| `apps/scripts/.env` | `GEMINI_API_KEY` stored here alongside `XAI_API_KEY`. |

The Gemini API returns base64-encoded PNG inline (no URL download needed). WebP conversion uses `sharp`.
