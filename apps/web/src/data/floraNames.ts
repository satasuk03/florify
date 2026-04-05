/**
 * Deterministic 300-entry flora name manifest.
 *
 * Order must stay in lock-step with `apps/scripts/src/buildPrompts.ts` —
 * that script is the source of truth for the image folders under
 * `public/floras/{name}/stage-{1|2|3}.webp`. `FLORA_NAMES[speciesId]`
 * resolves a stable speciesId (0..299) to its folder name.
 */

const PREFIXES = [
  'sun', 'moon', 'star', 'dawn', 'dusk', 'night', 'dream', 'mist', 'storm', 'tide',
  'ember', 'frost', 'glow', 'shadow', 'silver', 'gold', 'crimson', 'violet', 'azure', 'jade',
  'ruby', 'amber', 'pearl', 'obsidian', 'copper', 'crystal', 'velvet', 'silk', 'flame', 'ice',
  'ash', 'cloud', 'rain', 'wind', 'echo', 'ghost', 'fae', 'wisp', 'thorn', 'briar',
  'bloom', 'whisper', 'dew', 'spark', 'veil', 'heart', 'breath', 'song', 'spell', 'rune',
  'mirth', 'tempest', 'grove', 'hollow', 'fen', 'marsh', 'cinder', 'opal', 'topaz', 'coral',
] as const;

const SUFFIXES = ['leaf', 'fern', 'bloom', 'petal', 'moss'] as const;

function buildFloraNames(): readonly string[] {
  const out: string[] = [];
  for (const p of PREFIXES) {
    for (const s of SUFFIXES) {
      out.push(`${p}${s}`);
    }
  }
  return out;
}

export const FLORA_NAMES: readonly string[] = buildFloraNames();

if (FLORA_NAMES.length !== 300) {
  throw new Error(`expected 300 flora names, got ${FLORA_NAMES.length}`);
}
