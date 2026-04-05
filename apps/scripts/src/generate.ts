import { readFile, mkdir, access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config as loadEnv } from 'dotenv';
import sharp from 'sharp';
import { generateImage } from './xai.js';
import type { GenerationResult, GenerationTask, PromptMap } from './types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = resolve(__dirname, '..');

loadEnv({ path: resolve(PKG_ROOT, '.env') });

if (!process.env.XAI_API_KEY) {
  console.error(
    'ERROR: XAI_API_KEY is not set. Copy .env.example to .env and fill it in.',
  );
  process.exit(1);
}

interface CliOptions {
  all: boolean;
  concurrency: number;
  force: boolean;
}

function parseArgs(argv: string[]): CliOptions {
  const opts: CliOptions = { all: false, concurrency: 3, force: false };
  for (const arg of argv) {
    if (arg === '--all') opts.all = true;
    else if (arg === '--force') opts.force = true;
    else if (arg.startsWith('--concurrency=')) {
      const n = Number(arg.slice('--concurrency='.length));
      if (Number.isFinite(n) && n > 0) opts.concurrency = n;
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

async function buildTaskQueue(opts: CliOptions): Promise<GenerationTask[]> {
  const promptsPath = resolve(PKG_ROOT, 'prompts.json');
  const raw = await readFile(promptsPath, 'utf-8');
  const prompts = JSON.parse(raw) as PromptMap;

  const entries = Object.entries(prompts);
  const slice = opts.all ? entries : entries.slice(0, 5);

  const tasks: GenerationTask[] = [];
  for (const [floraName, stagePrompts] of slice) {
    if (!Array.isArray(stagePrompts) || stagePrompts.length !== 3) {
      console.warn(`skip ${floraName}: expected 3 stage prompts`);
      continue;
    }
    for (let i = 0; i < 3; i++) {
      const stage = (i + 1) as 1 | 2 | 3;
      const stagePrompt = stagePrompts[i];
      if (!stagePrompt) continue;
      tasks.push({
        floraName,
        stage,
        prompt: stagePrompt,
        outputPath: resolve(
          PKG_ROOT,
          'output',
          floraName,
          `stage-${stage}.webp`,
        ),
      });
    }
  }
  return tasks;
}

async function downloadToBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`download failed ${res.status} ${res.statusText}`);
  }
  const ab = await res.arrayBuffer();
  return Buffer.from(ab);
}

async function runTask(
  task: GenerationTask,
  force: boolean,
): Promise<GenerationResult> {
  if (!force && (await fileExists(task.outputPath))) {
    return { task, status: 'skipped' };
  }

  const start = Date.now();
  const attempt = async (): Promise<void> => {
    const url = await generateImage(task.prompt);
    const buf = await downloadToBuffer(url);
    await mkdir(dirname(task.outputPath), { recursive: true });
    await sharp(buf).webp({ quality: 90 }).toFile(task.outputPath);
  };

  try {
    await attempt();
  } catch (err) {
    // Retry once on transient errors (network / 5xx). Don't retry 4xx.
    const msg = err instanceof Error ? err.message : String(err);
    const transient =
      /fetch|ECONN|ETIMEDOUT|socket|5\d\d/i.test(msg) &&
      !/4\d\d/.test(msg);
    if (!transient) {
      return { task, status: 'failed', error: msg };
    }
    await new Promise((r) => setTimeout(r, 2000));
    try {
      await attempt();
    } catch (err2) {
      return {
        task,
        status: 'failed',
        error: err2 instanceof Error ? err2.message : String(err2),
      };
    }
  }

  return { task, status: 'ok', durationMs: Date.now() - start };
}

async function runWithConcurrency(
  tasks: GenerationTask[],
  concurrency: number,
  force: boolean,
): Promise<GenerationResult[]> {
  const results: GenerationResult[] = new Array(tasks.length);
  let cursor = 0;
  let completed = 0;
  const total = tasks.length;

  async function worker(): Promise<void> {
    while (true) {
      const idx = cursor++;
      if (idx >= tasks.length) return;
      const task = tasks[idx]!;
      const result = await runTask(task, force);
      results[idx] = result;
      completed++;
      const marker =
        result.status === 'ok'
          ? `ok (${((result.durationMs ?? 0) / 1000).toFixed(1)}s)`
          : result.status === 'skipped'
            ? 'skipped (exists)'
            : `FAILED: ${result.error}`;
      console.log(
        `[${completed}/${total}] ${task.floraName} stage-${task.stage} ${marker}`,
      );
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, tasks.length) },
    worker,
  );
  await Promise.all(workers);
  return results;
}

async function main(): Promise<void> {
  const opts = parseArgs(process.argv.slice(2));
  const tasks = await buildTaskQueue(opts);

  console.log(
    `queued ${tasks.length} image(s) (${opts.all ? 'all' : 'POC: first 5 floras'}, concurrency=${opts.concurrency}${opts.force ? ', force' : ''})`,
  );

  const results = await runWithConcurrency(tasks, opts.concurrency, opts.force);

  const ok = results.filter((r) => r.status === 'ok').length;
  const skipped = results.filter((r) => r.status === 'skipped').length;
  const failed = results.filter((r) => r.status === 'failed');

  console.log('\n--- summary ---');
  console.log(`  ok:      ${ok}`);
  console.log(`  skipped: ${skipped}`);
  console.log(`  failed:  ${failed.length}`);

  if (failed.length > 0) {
    console.log('\nfailures:');
    for (const f of failed) {
      console.log(`  - ${f.task.floraName} stage-${f.task.stage}: ${f.error}`);
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
