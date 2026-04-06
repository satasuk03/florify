/**
 * Deterministic generator for prompts.json.
 *
 * Produces 300 unique flora entries (60 prefixes × 5 suffixes) × 3 growth stages.
 * Each flora is assigned a visual theme bundle by index so the 300 feel varied
 * but consistent in style: 9:16 vertical, potted, cream background, botanical
 * illustration. Edit the arrays below to taste, then `tsx src/buildPrompts.ts`.
 *
 * The POC floras (sunleaf, moonfern, emberbloom, frostpetal, glowmoss) are
 * preserved as explicit overrides so their already-generated images still
 * match the prompts file.
 */

import { writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = resolve(__dirname, '..', 'prompts.json');

// 60 evocative prefixes × 5 plant suffixes = 300 unique names.
const PREFIXES = [
  'sun', 'moon', 'star', 'dawn', 'dusk', 'night', 'dream', 'mist', 'storm', 'tide',
  'ember', 'frost', 'glow', 'shadow', 'silver', 'gold', 'crimson', 'violet', 'azure', 'jade',
  'ruby', 'amber', 'pearl', 'obsidian', 'copper', 'crystal', 'velvet', 'silk', 'flame', 'ice',
  'ash', 'cloud', 'rain', 'wind', 'echo', 'ghost', 'fae', 'wisp', 'thorn', 'briar',
  'bloom', 'whisper', 'dew', 'spark', 'veil', 'heart', 'breath', 'song', 'spell', 'rune',
  'mirth', 'tempest', 'grove', 'hollow', 'fen', 'marsh', 'cinder', 'opal', 'topaz', 'coral',
] as const;

const SUFFIXES = ['leaf', 'fern', 'bloom', 'petal', 'moss'] as const;

interface Theme {
  color: string; // primary palette descriptor
  special: string; // unique effect phrase
  vessel: string; // pot/container description
  mood: string; // lighting / atmosphere
}

// 20 visual themes — each flora is assigned one deterministically by index.
const THEMES: Theme[] = [
  { color: 'warm gold and cream', special: 'shimmering veins of light', vessel: 'small clay pot', mood: 'warm morning sunlight' },
  { color: 'pale silver and white', special: 'a faint lunar glow', vessel: 'round stone pot', mood: 'cool moonlit ambiance' },
  { color: 'deep crimson and orange', special: 'ember-like inner fire', vessel: 'dark ceramic pot', mood: 'dramatic warm glow' },
  { color: 'translucent ice-blue', special: 'delicate frost crystals on the edges', vessel: 'pale porcelain pot', mood: 'crisp cold light' },
  { color: 'emerald and cyan', special: 'soft bioluminescent shimmer', vessel: 'shallow mossy dish', mood: 'dreamy dusk atmosphere' },
  { color: 'rich violet and indigo', special: 'tiny twinkling starlike points', vessel: 'hammered copper pot', mood: 'twilight starlight' },
  { color: 'coral pink and peach', special: 'petals softly blushing from within', vessel: 'hand-thrown terracotta pot', mood: 'golden hour sidelight' },
  { color: 'jade green and gold', special: 'glossy leaves catching the light', vessel: 'celadon-glazed pot', mood: 'serene afternoon glow' },
  { color: 'smoky obsidian and gold', special: 'gilded veins running through dark leaves', vessel: 'black matte ceramic pot', mood: 'low dramatic candlelight' },
  { color: 'pearl white and rose', special: 'iridescent sheen rippling across the surface', vessel: 'glazed porcelain pot', mood: 'soft diffused daylight' },
  { color: 'amber and honey', special: 'warm resinous droplets clinging to the stems', vessel: 'rustic wooden pot', mood: 'late afternoon honey light' },
  { color: 'deep azure and teal', special: 'ripples of oceanic blue light', vessel: 'wave-textured stoneware pot', mood: 'cool aquamarine ambience' },
  { color: 'dusky mauve and plum', special: 'soft velvet texture on every petal', vessel: 'matte lavender pot', mood: 'quiet evening hush' },
  { color: 'ruby red and wine', special: 'deep luminous inner glow like stained glass', vessel: 'dark glazed pot', mood: 'warm firelit interior' },
  { color: 'ash grey and pale mint', special: 'curling wisps of faint vapor', vessel: 'weathered concrete pot', mood: 'misty grey morning' },
  { color: 'topaz yellow and bronze', special: 'tiny crystalline dewdrops along the edges', vessel: 'brushed bronze pot', mood: 'bright golden noon' },
  { color: 'opalescent rainbow pastel', special: 'softly shifting prismatic shimmer', vessel: 'iridescent glazed pot', mood: 'dreamlike soft pastel light' },
  { color: 'forest green and chestnut', special: 'deep earthy richness and healthy sheen', vessel: 'aged terracotta pot', mood: 'cool forest understory light' },
  { color: 'copper orange and rust', special: 'metallic sheen across veined leaves', vessel: 'patinated copper pot', mood: 'warm autumnal glow' },
  { color: 'snow white and pale gold', special: 'delicate feathered edges catching the light', vessel: 'white marble pot', mood: 'soft winter morning light' },
];

function buildStages(
  name: string,
  theme: Theme,
): [string, string, string] {
  const base = 'cream background, vertical composition, 9:16 aspect';
  return [
    `A tiny ${name} seedling just breaking through soft soil in a ${theme.vessel}, two small ${theme.color} cotyledons with ${theme.special}, ${theme.mood}, shallow depth of field, minimalist ${base}, botanical illustration style`,
    `A young ${name} plant in a ${theme.vessel}, several ${theme.color} leaves unfurling with ${theme.special}, ${theme.mood}, gentle sidelight, painterly ${base}, botanical illustration style`,
    `A mature ${name} in full bloom in a ${theme.vessel}, lush cascade of ${theme.color} foliage and flowers with ${theme.special}, ${theme.mood}, rich detail, elegant ${base}, botanical illustration style`,
  ];
}

// Overrides: keep the 5 POC prompts verbatim so existing generated images
// still match their source prompts (important for resumability logic).
const OVERRIDES: Record<string, [string, string, string]> = {
  sunleaf: [
    'A tiny sunleaf seedling just breaking through warm terracotta soil in a small clay pot, two pale-gold cotyledons catching soft morning sunlight, shallow depth of field, minimalist cream background, botanical illustration style, vertical composition',
    'A young sunleaf plant in a clay pot, five or six slender golden-veined leaves fanning outward, gentle warm sidelight, cream background, soft painterly botanical style, vertical composition',
    'A mature sunleaf in full bloom in a clay pot, lush cascade of luminous gold-veined leaves with tiny sun-shaped yellow flowers, warm morning light, cream background, elegant botanical illustration, vertical composition',
  ],
  moonfern: [
    'A tiny moonfern sprout uncurling its first silvery frond in a stone pot, pale lavender mist around the base, cool moonlit ambiance, soft dark-cream background, botanical illustration style, vertical composition',
    'A young moonfern in a stone pot, several pale silver fronds gently unfurling, faint bioluminescent glow along the stems, soft dusk lighting, cream background, painterly botanical style, vertical composition',
    'A mature moonfern in a stone pot, full crown of arched silver-white fronds shimmering with soft blue luminescence, dreamy twilight atmosphere, cream background, elegant botanical illustration, vertical composition',
  ],
  emberbloom: [
    'A tiny emberbloom seedling in a dark ceramic pot, single crimson shoot with two tiny flame-shaped leaves, faint warm red glow at the tips, soft cream background, botanical illustration style, vertical composition',
    'A young emberbloom in a dark ceramic pot, several crimson and orange leaves curling like small flames, subtle inner glow, warm sidelight, cream background, painterly botanical style, vertical composition',
    'A mature emberbloom in a dark ceramic pot, full bouquet of fiery red-orange petals radiating light like living embers, dramatic warm glow, cream background, elegant botanical illustration, vertical composition',
  ],
  frostpetal: [
    'A tiny frostpetal seedling in a pale blue porcelain pot, two small ice-blue cotyledons rimmed with delicate frost crystals, cool crisp light, soft cream background, botanical illustration style, vertical composition',
    'A young frostpetal in a pale blue porcelain pot, several translucent ice-blue leaves edged in white frost, subtle cool glow, cream background, painterly botanical style, vertical composition',
    'A mature frostpetal in a pale blue porcelain pot, cluster of crystalline pale-blue blossoms with frost-tipped petals, shimmering cold radiance, cream background, elegant botanical illustration, vertical composition',
  ],
  glowmoss: [
    'A tiny glowmoss patch just beginning to spread across a small mossy stone in a shallow dish, faint green-cyan luminescence between the fibers, soft cream background, botanical illustration style, vertical composition',
    'A young glowmoss cushion covering a stone in a shallow dish, lush bed of tiny emerald fronds glowing softly from within, warm-cool contrast lighting, cream background, painterly botanical style, vertical composition',
    'A mature glowmoss formation blanketing a stone in a shallow dish, dense carpet of luminous green-cyan moss with tiny glowing spore stalks rising upward, dreamy bioluminescent atmosphere, cream background, elegant botanical illustration, vertical composition',
  ],
  bianhua: [
    'A slender delicate anime child girl with big sparkling eyes, thin petite body, long black hair with simple red ribbon, wearing a flowing dark teal and gold Wuxia-style robe with elegant draping, the child standing gracefully beside a tiny red spider lily sprout emerging from dark earth, one hand gently extended toward the first crimson bud, hands hidden in long sleeves, refined Wuxia game art style, dark moody atmosphere, bold black ink wash splashes in the background with scattered gold leaf flakes floating, deep black teal and crimson palette with gold accents, white border edges with ink splatter, botanical illustration style, vertical composition',
    'A beautiful teenage anime girl in elaborate dark teal and crimson silk dress with gold chain jewelry and ornate hair ornaments, alluring mysterious pose with flowing dark ribbons, standing beside young red spider lilies with glowing crimson petals, dark dramatic ink splash painting style, bold black ink wash background with gold leaf fragments floating, deep black and teal palette with blood-red and gold accents, sensual dark elegance, white border edges with ink splatter, botanical illustration style, vertical composition',
    'A stunning slender adult anime woman with large breasts in luxurious dark teal and black silk robes with deep neckline and exposed shoulders, long flowing black hair with a simple elegant dark butterfly hairpin and minimal gold hair accessories, gold chain body jewelry and arm bracelets, seductive Dunhuang apsara dancing pose with one arm raised gracefully and flowing teal and crimson silk ribbons swirling dynamically around her body, surrounded by fully bloomed red spider lilies with ethereal crimson glow, anime illustration style matching stage 2 aesthetic, dark moody ink splash painting style, bold black ink wash background with gold leaf fragments floating, deep black and teal palette with blood-red and gold accents, dark sensual elegance, white border edges with ink splatter, botanical illustration style, vertical composition',
  ],
  meihua: [
    'A cute small child girl in ornate red and gold Hanfu with intricate floral embroidery patterns, standing beside a tiny plum blossom seedling, the child curiously touching the first pink bud, detailed watercolor anime illustration style, vibrant saturated colors, delicate ink splatter accents, white background with soft watercolor washes, botanical illustration style, vertical composition',
    'A beautiful teenage anime girl in elaborate crimson Hanfu with detailed floral and phoenix embroidery, flowing translucent silk sleeves, alluring confident pose, standing beside a young plum blossom tree with pink and white flowers blooming, cherry blossom petals floating in the air, detailed watercolor anime illustration style, vibrant saturated colors, soft sexy elegance, ink splatter accents, white background with watercolor washes, botanical illustration style, vertical composition',
    'A stunning adult anime woman in luxurious deep red and gold Hanfu with rich detailed embroidery of dragons and peonies, flowing layered silk robes with translucent fabric, elegant seductive pose, hair ornaments with red flowers and gold accessories, standing beneath a fully bloomed plum blossom tree cascading with pink petals, detailed watercolor anime illustration style, vibrant saturated colors, sensual beauty, ink splatter accents, white background with watercolor washes, botanical illustration style, vertical composition',
  ],
};

async function main(): Promise<void> {
  const out: Record<string, [string, string, string]> = {};
  let index = 0;

  for (const prefix of PREFIXES) {
    for (const suffix of SUFFIXES) {
      const name = `${prefix}${suffix}`;
      if (OVERRIDES[name]) {
        out[name] = OVERRIDES[name];
      } else {
        const theme = THEMES[index % THEMES.length]!;
        out[name] = buildStages(name, theme);
      }
      index++;
    }
  }

  // Append user-added floras (outside the 300-grid)
  const USER_ADDED = ['meihua', 'bianhua'] as const;
  for (const name of USER_ADDED) {
    if (OVERRIDES[name]) {
      out[name] = OVERRIDES[name];
    }
  }

  const count = Object.keys(out).length;
  if (count < 300) {
    throw new Error(`expected at least 300 floras, got ${count}`);
  }

  await writeFile(OUT_PATH, JSON.stringify(out, null, 2) + '\n', 'utf-8');
  console.log(`wrote ${count} floras × 3 stages = ${count * 3} prompts → ${OUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
