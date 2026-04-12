import { writeFile, mkdir, access } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import sharp from "sharp";
import {
  generateImage,
  type XaiAspectRatio,
  type XaiResolution,
} from "./xai.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = resolve(__dirname, "..");

loadEnv({ path: resolve(PKG_ROOT, ".env") });

if (!process.env.XAI_API_KEY) {
  console.error(
    "ERROR: XAI_API_KEY is not set. Add it to apps/scripts/.env",
  );
  process.exit(1);
}

const VALID_RATIOS = new Set<string>([
  "1:1", "2:3", "3:2", "3:4", "4:3",
  "9:16", "16:9", "2:1", "1:2", "auto",
]);

const VALID_SIZES = new Set<string>(["1k", "2k"]);
const VALID_FORMATS = new Set<string>(["png", "webp"]);

interface CliOptions {
  prompt: string;
  aspectRatio: XaiAspectRatio;
  resolution?: XaiResolution;
  format: "png" | "webp";
  output: string;
  force: boolean;
}

function parseArgs(argv: string[]): CliOptions {
  const opts: CliOptions = {
    prompt: "",
    aspectRatio: "1:1",
    format: "png",
    output: "",
    force: false,
  };

  const positional: string[] = [];

  for (const arg of argv) {
    if (arg === "--force") {
      opts.force = true;
    } else if (arg.startsWith("--ratio=")) {
      const v = arg.slice("--ratio=".length);
      if (!VALID_RATIOS.has(v)) {
        console.error(
          `Invalid ratio "${v}". Valid: ${[...VALID_RATIOS].join(", ")}`,
        );
        process.exit(1);
      }
      opts.aspectRatio = v as XaiAspectRatio;
    } else if (arg.startsWith("--size=")) {
      const v = arg.slice("--size=".length).toLowerCase();
      if (!VALID_SIZES.has(v)) {
        console.error(
          `Invalid size "${v}". Valid: ${[...VALID_SIZES].join(", ")}`,
        );
        process.exit(1);
      }
      opts.resolution = v as XaiResolution;
    } else if (arg.startsWith("--format=")) {
      const v = arg.slice("--format=".length);
      if (!VALID_FORMATS.has(v)) {
        console.error(`Invalid format "${v}". Valid: png, webp`);
        process.exit(1);
      }
      opts.format = v as "png" | "webp";
    } else if (arg.startsWith("--output=")) {
      opts.output = arg.slice("--output=".length);
    } else if (!arg.startsWith("--")) {
      positional.push(arg);
    }
  }

  opts.prompt = positional.join(" ");

  if (!opts.output && opts.prompt) {
    const ts = Date.now();
    opts.output = resolve(PKG_ROOT, "output", `grok-${ts}.${opts.format}`);
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

const USAGE = `Usage:
  pnpm grok "your prompt here"

Options:
  --ratio=<r>       Aspect ratio (default: 1:1)
                    1:1, 2:3, 3:2, 3:4, 4:3, 9:16, 16:9, 2:1, 1:2, auto
  --size=<s>        Resolution: 1k, 2k (default: none)
  --format=png|webp Output format (default: png)
  --output=<path>   Output file path
  --force           Overwrite existing file

Model: grok-imagine-image (xAI)`;

async function main(): Promise<void> {
  const opts = parseArgs(process.argv.slice(2));

  if (!opts.prompt) {
    console.log(USAGE);
    process.exit(0);
  }

  if (!opts.force && (await fileExists(opts.output))) {
    console.log(`File already exists: ${opts.output}`);
    console.log("Use --force to overwrite.");
    process.exit(0);
  }

  console.log(`Model:  grok-imagine-image`);
  console.log(`Ratio:  ${opts.aspectRatio}`);
  if (opts.resolution) {
    console.log(`Size:   ${opts.resolution}`);
  }
  console.log(`Format: ${opts.format}`);
  console.log(`Generating...`);

  const start = Date.now();
  const url = await generateImage(opts.prompt, {
    aspectRatio: opts.aspectRatio,
    resolution: opts.resolution,
  });
  console.log(
    `Image generated in ${((Date.now() - start) / 1000).toFixed(1)}s`,
  );

  console.log("Downloading...");
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Download failed: ${res.status} ${res.statusText}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());

  let outputBuf: Buffer;
  if (opts.format === "webp") {
    outputBuf = await sharp(buf).webp({ quality: 75 }).toBuffer();
  } else {
    outputBuf = buf;
  }

  await mkdir(dirname(opts.output), { recursive: true });
  await writeFile(opts.output, outputBuf);

  const sizeKB = (outputBuf.length / 1024).toFixed(0);
  console.log(`Saved:  ${opts.output} (${sizeKB} KB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
