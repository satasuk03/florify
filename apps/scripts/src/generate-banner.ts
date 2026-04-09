import { writeFile, mkdir, access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config as loadEnv } from 'dotenv';
import sharp from 'sharp';
import { generateImage } from './xai.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = resolve(__dirname, '..');

loadEnv({ path: resolve(PKG_ROOT, '.env') });

if (!process.env.XAI_API_KEY) {
  console.error(
    'ERROR: XAI_API_KEY is not set. Copy .env.example to .env and fill it in.',
  );
  process.exit(1);
}

type AspectRatio = '1:1' | '3:2' | '2:3' | '16:9' | '9:16';
const VALID_RATIOS = new Set<string>(['1:1', '3:2', '2:3', '16:9', '9:16']);

interface CliOptions {
  prompt: string;
  output: string;
  ratio: AspectRatio;
  force: boolean;
}

const SHOP_BANNER_PROMPT = `Close-up portrait anime-style illustration of a cute shopkeeper girl, medium shot from waist up, centered in frame. She has big sparkling expressive eyes, a warm smile, and a small sprout hair accessory on her brown hair. She wears a leaf-green apron over a cream blouse and holds a glowing seed packet in one hand. Behind her, slightly blurred bokeh background of a magical plant shop — shelves with potted seedlings, glass bottles of shimmering elixirs, warm golden light streaming through a greenhouse window with climbing ivy. Magical golden pollen particles float around her. Color palette: warm cream, honey gold, terracotta, muted sage green, soft amber highlights. The title "Sprout Shop" is displayed at the top in stylized fantasy lettering. Modern anime aesthetic with Ghibli warmth, highly detailed character art, cel-shaded lighting with painterly touches, shallow depth of field, 4K quality, game promotional banner art.`;

function parseArgs(argv: string[]): CliOptions {
  const opts: CliOptions = {
    prompt: '',
    output: resolve(PKG_ROOT, 'output', 'shop-banner.webp'),
    ratio: '16:9',
    force: false,
  };

  for (const arg of argv) {
    if (arg === '--force') {
      opts.force = true;
    } else if (arg === '--shop') {
      opts.prompt = SHOP_BANNER_PROMPT;
    } else if (arg.startsWith('--prompt=')) {
      opts.prompt = arg.slice('--prompt='.length);
    } else if (arg.startsWith('--output=')) {
      opts.output = arg.slice('--output='.length);
    } else if (arg.startsWith('--ratio=')) {
      const r = arg.slice('--ratio='.length);
      if (!VALID_RATIOS.has(r)) {
        console.error(`Invalid ratio "${r}". Valid: ${[...VALID_RATIOS].join(', ')}`);
        process.exit(1);
      }
      opts.ratio = r as AspectRatio;
    }
  }

  return opts;
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function main(): Promise<void> {
  const opts = parseArgs(process.argv.slice(2));

  if (!opts.prompt) {
    console.log(`Usage:
  pnpm banner --shop                  Generate the default shop banner
  pnpm banner --prompt="..."          Generate with a custom prompt

Options:
  --output=<path>   Output file path (default: output/shop-banner.webp)
  --ratio=<r>       Aspect ratio: 1:1, 3:2, 2:3, 16:9, 9:16 (default: 16:9)
  --force           Overwrite existing file`);
    process.exit(0);
  }

  if (!opts.force && (await fileExists(opts.output))) {
    console.log(`File already exists: ${opts.output}`);
    console.log('Use --force to overwrite.');
    process.exit(0);
  }

  console.log(`Generating banner (ratio=${opts.ratio})...`);
  const start = Date.now();

  const url = await generateImage(opts.prompt, { aspectRatio: opts.ratio });
  console.log(`Image generated in ${((Date.now() - start) / 1000).toFixed(1)}s`);

  console.log('Downloading & converting to WebP...');
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Download failed: ${res.status} ${res.statusText}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());

  await mkdir(dirname(opts.output), { recursive: true });
  await sharp(buf).webp({ quality: 75 }).toFile(opts.output);

  console.log(`Saved: ${opts.output}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
