import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import { dirname, extname, resolve, basename } from "node:path";

interface CliOptions {
  input: string;
  output: string;
  model: string;
  postProcess: boolean;
  force: boolean;
}

const DEFAULT_MODEL = "isnet-anime";

const USAGE = `Usage:
  pnpm rembg <input-image> [options]

Options:
  --output=<path>        Output PNG path (default: <input>-cutout.png)
  --model=<name>         rembg model (default: ${DEFAULT_MODEL})
                         anime/illustration: isnet-anime
                         realistic portrait:  birefnet-portrait
                         general:             isnet-general-use, u2net
  --no-post-process      Disable alpha-matte post processing
  --force                Overwrite existing output

Requires rembg CLI. Install once:
  pipx install "rembg[cli]"`;

function parseArgs(argv: string[]): CliOptions {
  const opts: CliOptions = {
    input: "",
    output: "",
    model: DEFAULT_MODEL,
    postProcess: true,
    force: false,
  };

  const positional: string[] = [];
  for (const arg of argv) {
    if (arg === "--force") opts.force = true;
    else if (arg === "--no-post-process") opts.postProcess = false;
    else if (arg.startsWith("--output=")) opts.output = arg.slice(9);
    else if (arg.startsWith("--model=")) opts.model = arg.slice(8);
    else if (!arg.startsWith("--")) positional.push(arg);
  }

  opts.input = positional[0] ?? "";

  if (opts.input && !opts.output) {
    const ext = extname(opts.input);
    const base = basename(opts.input, ext);
    opts.output = resolve(dirname(opts.input), `${base}-cutout.png`);
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

function checkRembgAvailable(): Promise<boolean> {
  return new Promise((res) => {
    const child = spawn("rembg", ["--help"], { stdio: "ignore" });
    child.on("error", () => res(false));
    child.on("exit", (code) => res(code === 0));
  });
}

function runRembg(opts: CliOptions): Promise<void> {
  return new Promise((res, rej) => {
    const args = ["i", "-m", opts.model];
    if (opts.postProcess) args.push("-ppm");
    args.push(opts.input, opts.output);

    const child = spawn("rembg", args, { stdio: "inherit" });
    child.on("error", rej);
    child.on("exit", (code) => {
      if (code === 0) res();
      else rej(new Error(`rembg exited with code ${code}`));
    });
  });
}

async function main(): Promise<void> {
  const opts = parseArgs(process.argv.slice(2));

  if (!opts.input) {
    console.log(USAGE);
    process.exit(0);
  }

  if (!(await fileExists(opts.input))) {
    console.error(`Input file not found: ${opts.input}`);
    process.exit(1);
  }

  if (!opts.force && (await fileExists(opts.output))) {
    console.log(`Output already exists: ${opts.output}`);
    console.log("Use --force to overwrite.");
    process.exit(0);
  }

  if (!(await checkRembgAvailable())) {
    console.error("rembg CLI not found on PATH.");
    console.error('Install with: pipx install "rembg[cli]"');
    process.exit(1);
  }

  console.log(`Model:  ${opts.model}`);
  console.log(`Input:  ${opts.input}`);
  console.log(`Output: ${opts.output}`);
  console.log(`Post-process: ${opts.postProcess ? "on" : "off"}`);
  console.log("Removing background...");

  const start = Date.now();
  await runRembg(opts);
  console.log(`Done in ${((Date.now() - start) / 1000).toFixed(1)}s`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
