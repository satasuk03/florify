---
name: grok
description: Generate images using xAI's Grok Imagine model via CLI. Use when the user asks to generate an image, create a picture, make art, or produce visual assets using Grok / xAI. Supports text-to-image with aspect ratio, resolution, and format options.
---

# grok

Generate images from text prompts using xAI's Grok Imagine image generation model.

## Model

| Model ID | Notes |
|----------|-------|
| `grok-imagine-image` | xAI's image generation model. Supports various aspect ratios and up to 2K resolution. |

## Prerequisites

`XAI_API_KEY` must be set in `apps/scripts/.env`. If missing, ask the user to add it (get one at https://console.x.ai/).

## Usage

Run from the repo root:

```bash
# Basic generation (default: 1:1, PNG)
pnpm --filter @florify/scripts grok "A cute botanical seedling in a clay pot"

# Set aspect ratio
pnpm --filter @florify/scripts grok "A tall bamboo forest" --ratio=9:16

# Set resolution
pnpm --filter @florify/scripts grok "A rose garden" --size=2k

# Output as WebP
pnpm --filter @florify/scripts grok "A sunflower field" --format=webp

# Specify output path
pnpm --filter @florify/scripts grok "A daisy" --output=apps/web/public/daisy.png

# Overwrite existing file
pnpm --filter @florify/scripts grok "A lily" --output=out.png --force
```

## CLI Options

| Flag | Values | Default | Notes |
|------|--------|---------|-------|
| `--ratio=` | `1:1`, `2:3`, `3:2`, `3:4`, `4:3`, `9:16`, `16:9`, `2:1`, `1:2`, `auto` | `1:1` | Aspect ratio |
| `--size=` | `1k`, `2k` | none | Resolution |
| `--format=` | `png`, `webp` | `png` | Output format |
| `--output=` | file path | `output/grok-{timestamp}.{ext}` | Output file path |
| `--force` | — | — | Overwrite existing file |

## Procedure When User Asks to Generate

1. **Collect the prompt** — ask if not provided. Encourage descriptive, narrative prompts over keyword lists.
2. **Pick options** — ask about ratio/size if relevant to the use case, otherwise use defaults.
3. **Check API key** — if `XAI_API_KEY` is missing from `apps/scripts/.env`, stop and ask the user to add it.
4. **Run the command** — execute `pnpm --filter @florify/scripts grok "prompt" [options]`.
5. **Report results** — show the output path, file size, and model used.

## Prompting Tips

- **Describe the scene narratively** — "A sunlit meadow with wildflowers swaying in a gentle breeze" works better than "meadow, flowers, sun".
- **Be specific about style** — mention art style (anime, watercolor, oil painting, photorealistic), mood, lighting, camera angle.
- **Include atmosphere** — warm/cool tones, time of day, weather conditions help guide the output.
- For **characters** — describe pose, clothing, expression, and background context.
- For **landscapes** — describe depth layers (foreground, midground, background) for more interesting compositions.

## Architecture

| File | Purpose |
|------|---------|
| `apps/scripts/src/xai.ts` | xAI client wrapper using OpenAI SDK. `generateImage(prompt, opts?)` returns image URL. |
| `apps/scripts/src/grok.ts` | CLI entry point. Arg parsing, URL download, format conversion (sharp), file output. |
| `apps/scripts/.env` | `XAI_API_KEY` stored here alongside `GEMINI_API_KEY`. |

The xAI API returns a URL. The CLI downloads, optionally converts to WebP via `sharp`, and saves to disk.
