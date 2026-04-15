import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..", "..", "..");
const DEFAULT_DEST_DIR = resolve(
  REPO_ROOT,
  "apps/web/public/gardeners",
);

interface CliOptions {
  input: string;
  name: string;
  destDir: string;
  quality: number;
  trim: boolean;
  force: boolean;
}

const USAGE = `Usage:
  pnpm finalize-character <input-png> --name=<slug> [options]

Options:
  --name=<slug>       Output filename (required) → <slug>.webp
  --dest=<dir>        Destination dir (default: apps/web/public/gardeners)
  --quality=<n>       WebP quality 1-100 (default: 90)
  --no-trim           Skip transparent border trim
  --force             Overwrite existing output`;

function parseArgs(argv: string[]): CliOptions {
  const opts: CliOptions = {
    input: "",
    name: "",
    destDir: DEFAULT_DEST_DIR,
    quality: 90,
    trim: true,
    force: false,
  };

  const positional: string[] = [];
  for (const arg of argv) {
    if (arg === "--force") opts.force = true;
    else if (arg === "--no-trim") opts.trim = false;
    else if (arg.startsWith("--name=")) opts.name = arg.slice(7);
    else if (arg.startsWith("--dest=")) opts.destDir = resolve(arg.slice(7));
    else if (arg.startsWith("--quality=")) opts.quality = Number(arg.slice(10));
    else if (!arg.startsWith("--")) positional.push(arg);
  }

  opts.input = positional[0] ?? "";
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

  if (!opts.input || !opts.name) {
    console.log(USAGE);
    process.exit(0);
  }

  if (!(await fileExists(opts.input))) {
    console.error(`Input file not found: ${opts.input}`);
    process.exit(1);
  }

  const outputPath = resolve(opts.destDir, `${opts.name}.webp`);

  if (!opts.force && (await fileExists(outputPath))) {
    console.log(`Output already exists: ${outputPath}`);
    console.log("Use --force to overwrite.");
    process.exit(0);
  }

  let pipeline = sharp(opts.input);
  const meta = await pipeline.metadata();
  if (!meta.hasAlpha) {
    console.warn(
      "Warning: input has no alpha channel. Run `pnpm rembg` first.",
    );
  }

  if (opts.trim) {
    pipeline = pipeline.trim();
  }

  const buf = await pipeline
    .webp({ quality: opts.quality, alphaQuality: 100 })
    .toBuffer();

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, buf);

  const sizeKB = (buf.length / 1024).toFixed(0);
  console.log(`Saved: ${outputPath} (${sizeKB} KB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
