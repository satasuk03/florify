import { writeFile, mkdir, access } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import sharp from "sharp";
import {
  generateImage,
  type GeminiModel,
  type AspectRatio,
  type ImageSize,
} from "./gemini.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = resolve(__dirname, "..");

loadEnv({ path: resolve(PKG_ROOT, ".env") });

if (!process.env.GEMINI_API_KEY) {
  console.error(
    "ERROR: GEMINI_API_KEY is not set. Add it to apps/scripts/.env",
  );
  process.exit(1);
}

const MODEL_ALIASES: Record<string, GeminiModel> = {
  flash: "gemini-3.1-flash-image-preview",
  "3.1": "gemini-3.1-flash-image-preview",
  pro: "gemini-3-pro-image-preview",
  "3pro": "gemini-3-pro-image-preview",
  "2.5": "gemini-2.5-flash-image",
};

const VALID_RATIOS = new Set<string>([
  "1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4",
  "9:16", "16:9", "21:9", "1:4", "4:1", "1:8", "8:1",
]);

const VALID_SIZES = new Set<string>(["512", "1K", "2K", "4K"]);
const VALID_FORMATS = new Set<string>(["png", "webp"]);

interface CliOptions {
  prompt: string;
  model: GeminiModel;
  aspectRatio: AspectRatio;
  imageSize: ImageSize;
  format: "png" | "webp";
  output: string;
  force: boolean;
}

function parseArgs(argv: string[]): CliOptions {
  const opts: CliOptions = {
    prompt: "",
    model: "gemini-3.1-flash-image-preview",
    aspectRatio: "1:1",
    imageSize: "1K",
    format: "png",
    output: "",
    force: false,
  };

  const positional: string[] = [];

  for (const arg of argv) {
    if (arg === "--force") {
      opts.force = true;
    } else if (arg.startsWith("--model=")) {
      const v = arg.slice("--model=".length);
      const resolved = MODEL_ALIASES[v];
      if (!resolved) {
        console.error(
          `Invalid model "${v}". Valid: ${Object.keys(MODEL_ALIASES).join(", ")}`,
        );
        process.exit(1);
      }
      opts.model = resolved;
    } else if (arg.startsWith("--ratio=")) {
      const v = arg.slice("--ratio=".length);
      if (!VALID_RATIOS.has(v)) {
        console.error(
          `Invalid ratio "${v}". Valid: ${[...VALID_RATIOS].join(", ")}`,
        );
        process.exit(1);
      }
      opts.aspectRatio = v as AspectRatio;
    } else if (arg.startsWith("--size=")) {
      const v = arg.slice("--size=".length);
      if (!VALID_SIZES.has(v)) {
        console.error(
          `Invalid size "${v}". Valid: ${[...VALID_SIZES].join(", ")}`,
        );
        process.exit(1);
      }
      opts.imageSize = v as ImageSize;
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
    opts.output = resolve(
      PKG_ROOT,
      "output",
      `nanobanana-${ts}.${opts.format}`,
    );
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
  pnpm nanobanana "your prompt here"

Options:
  --model=flash|pro|2.5  Model (default: flash = gemini-3.1-flash-image-preview)
  --ratio=<r>            Aspect ratio (default: 1:1)
  --size=<s>             Resolution: 512, 1K, 2K, 4K (default: 1K)
  --format=png|webp      Output format (default: png)
  --output=<path>        Output file path
  --force                Overwrite existing file

Models:
  flash / 3.1  gemini-3.1-flash-image-preview (Nano Banana 2) — best all-around
  pro / 3pro   gemini-3-pro-image-preview (Nano Banana Pro) — professional quality
  2.5          gemini-2.5-flash-image (Nano Banana) — fastest`;

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

  const modelShort =
    opts.model === "gemini-3.1-flash-image-preview" ? "3.1 Flash"
    : opts.model === "gemini-3-pro-image-preview" ? "3 Pro"
    : "2.5 Flash";

  console.log(`Model:  ${modelShort}`);
  console.log(`Ratio:  ${opts.aspectRatio}`);
  if (opts.model !== "gemini-2.5-flash-image") {
    console.log(`Size:   ${opts.imageSize}`);
  }
  console.log(`Format: ${opts.format}`);
  console.log(`Generating...`);

  const start = Date.now();
  const buf = await generateImage(opts.prompt, {
    model: opts.model,
    aspectRatio: opts.aspectRatio,
    imageSize: opts.imageSize,
  });
  console.log(
    `Image generated in ${((Date.now() - start) / 1000).toFixed(1)}s`,
  );

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
