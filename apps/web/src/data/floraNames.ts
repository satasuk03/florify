/**
 * Deterministic 300-entry flora name manifest.
 *
 * Order must stay in lock-step with `apps/scripts/src/buildPrompts.ts` —
 * that script is the source of truth for the image folders under
 * `public/floras/{name}/stage-{1|2|3}.webp`. `FLORA_NAMES[speciesId]`
 * resolves a stable speciesId (0..299) to its folder name.
 */

export const PREFIXES = [
  'sun', 'moon', 'star', 'dawn', 'dusk', 'night', 'dream', 'mist', 'storm', 'tide',
  'ember', 'frost', 'glow', 'shadow', 'silver', 'gold', 'crimson', 'violet', 'azure', 'jade',
  'ruby', 'amber', 'pearl', 'obsidian', 'copper', 'crystal', 'velvet', 'silk', 'flame', 'ice',
  'ash', 'cloud', 'rain', 'wind', 'echo', 'ghost', 'fae', 'wisp', 'thorn', 'briar',
  'bloom', 'whisper', 'dew', 'spark', 'veil', 'heart', 'breath', 'song', 'spell', 'rune',
  'mirth', 'tempest', 'grove', 'hollow', 'fen', 'marsh', 'cinder', 'opal', 'topaz', 'coral',
] as const;

export const SUFFIXES = ['leaf', 'fern', 'bloom', 'petal', 'moss'] as const;

export type Prefix = (typeof PREFIXES)[number];
export type Suffix = (typeof SUFFIXES)[number];

export interface FloraEntry {
  readonly folder: string;
  readonly prefix: Prefix;
  readonly suffix: Suffix;
}

function buildFloraEntries(): readonly FloraEntry[] {
  const out: FloraEntry[] = [];
  for (const prefix of PREFIXES) {
    for (const suffix of SUFFIXES) {
      out.push({ folder: `${prefix}${suffix}`, prefix, suffix });
    }
  }
  return out;
}

export const FLORA_ENTRIES: readonly FloraEntry[] = buildFloraEntries();

export const FLORA_NAMES: readonly string[] = FLORA_ENTRIES.map((e) => e.folder);

if (FLORA_NAMES.length !== 300) {
  throw new Error(`expected 300 flora names, got ${FLORA_NAMES.length}`);
}
