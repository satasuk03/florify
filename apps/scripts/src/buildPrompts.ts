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
  liushu: [
    'A delicate young willow seedling with thin graceful drooping branches emerging from dark soil in an elegant celadon-glazed ceramic pot, two slender pale-green cotyledon leaves unfurling, guofeng anime illustration style, jade-green and cream palette, cream background, botanical illustration style, vertical composition',
    'A slender thin petite young girl with delicate features and downcast gentle eyes, very slim narrow body, long straight black hair in a simple bun with a small pink flower hairpin and dangling jade earrings, wearing a flowing oversized pale jade-green and white layered Chinese Hanfu with a soft pink sash, wide billowing translucent sleeves, the slim girl standing gracefully beside a young weeping willow tree with elegant drooping branches, one delicate hand reaching toward a trailing willow branch, guofeng anime illustration style, jade-green deep-green and soft pink palette, cream background, no text no letters no writing, botanical illustration style, vertical composition',
    'A beautiful slender teenage girl with elegant refined features and a serene gentle expression, slim graceful figure, long flowing black hair in an elaborate updo with a pink lotus flower hairpin and dangling pearl and jade hair ornaments, wearing a graceful flowing jade-green and pale blue layered silk Chinese Hanfu, translucent outer robe billowing gently, one hand raised gracefully holding a willow branch, standing beneath a lush mature weeping willow tree with long cascading branches, guofeng anime illustration style, jade-green deep-green and soft pink palette, cream background, no text no letters no writing, botanical illustration style, vertical composition',
  ],
  zhuzi: [
    'A tiny bamboo seedling with one or two slender pale-green shoots emerging from dark soil in a round celadon pot, delicate young bamboo leaves just beginning to unfurl, Chinese ink wash guofeng painting style with watercolor washes and visible brushstrokes, emerald-green and cream palette, cream background, botanical illustration style, vertical composition',
    'A young bamboo plant with several tall slender green stalks and lush leaves growing in a round celadon pot, bamboo segments clearly visible, leaves fanning outward gracefully, Chinese ink wash guofeng painting style with watercolor washes and visible brushstrokes, deep emerald-green and cream palette, cream background, botanical illustration style, vertical composition',
    'A beautiful slender anime young woman with big expressive eyes and elegant refined features and a serene peaceful expression, long flowing black hair adorned with a simple white flower hairpin, wearing a flowing white and pale jade-green layered silk Chinese Hanfu with wide billowing sleeves, sitting gracefully on a mossy rock beside a lush mature bamboo grove with tall stalks and dense green leaves, playing a bamboo flute dizi with both hands raised elegantly, a clear stream flowing at her feet with gentle ripples, anime character with Chinese ink wash guofeng background painting style with watercolor washes and visible brushstrokes, deep emerald-green and white palette with soft jade accents, cream background, no text no letters no writing, botanical illustration style, vertical composition',
  ],
  lanternanemone: [
    'A tiny bioluminescent sea anemone seedling attached to a dark volcanic rock, two small translucent petal-like tentacle buds with faint blue-green glow at the tips, dark deep ocean background filling the entire image edge to edge, scattered floating luminous particles, botanical illustration style, vertical composition',
    'A young bioluminescent sea anemone plant growing on dark volcanic rock, several translucent petal-like tentacles unfurling with pulsing teal and cyan bioluminescent light running along each frond, tiny glowing plankton particles floating around it, dark deep ocean background filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A magnificent fully bloomed deep-sea anemone plant growing on dark volcanic rock, a lush crown of long flowing translucent petal-like fronds radiating intense ethereal blue-green bioluminescent light, the plant body glowing from within with warm amber light contrasting the cool fronds, surrounded by clouds of tiny glowing particles like underwater stars, dark deep ocean background filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  phantomjellybloom: [
    'A tiny deep-sea flowering plant seedling rooted on dark coral rock, a small translucent bell-shaped bud with faint violet and pink bioluminescence, two thin trailing vine-like tendrils with tiny glowing seed pods, dark abyssal ocean background filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young deep-sea flowering plant rooted on dark coral rock, a translucent bell-shaped bloom opening to reveal shifting violet purple and magenta bioluminescent patterns inside, several elegant trailing vine tendrils with glowing seed pods like a string of underwater lanterns, ethereal ghostly glow illuminating the surrounding dark water, dark abyssal ocean background filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A breathtaking mature deep-sea flowering plant rooted on dark coral rock, a large translucent dome-shaped bloom radiating intense shifting aurora-like colors of violet magenta and electric blue, dozens of long flowing vine tendrils trailing downward like luminous ribbons each dotted with brilliant glowing seed pods, the entire plant emanating an otherworldly ethereal light in the darkness of the deep ocean, dark abyssal ocean background filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  veilcoral: [
    'A tiny translucent coral polyp just settling on dark rocky substrate, barely visible soft pink coloration, faint gossamer-like tissue, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young branching coral growing across smooth stone, delicate translucent polyps extended and swaying like gossamer fabric, cream and pink hues with gentle light dancing across branches, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature veil coral in full splendor, intricate branching structure with translucent polyps fully extended in cascading fan formation, luminous pink and white coloring with subtle iridescence, flowing tissue waving like gossamer veils in the current, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  reeflace: [
    'A minuscule lace-like coral frond barely emerging from sandy bottom near small rocks, pale cream coloration with faint structural lines, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young fan-shaped coral showing webbed lacework pattern, growing across flat rock, cream and light tan hues with delicate shadows through branches, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A magnificent mature lace coral in full bloom, expansive fan formation with intricate geometric lacework patterns, cream and pale amber coloration with light filtering through gaps creating shadow patterns, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  spiralanemone: [
    'A tiny spiral anemone just attached to a small rock, tentacles barely visible as faint curled forms, soft green-yellow coloration with scattered micro-luminescent points, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young anemone with developing spiral tentacle structure on smooth volcanic rock, pale green body with golden tentacle tips, delicate bioluminescent speckles beginning to glow, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature spiral anemone in full glory, perfectly coiled tentacles creating mesmerizing spiral geometry, vibrant green column base with golden spiral arms and concentrated bioluminescent nodes glowing softly, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  sunrisefan: [
    'A tiny orange-tinted sea fan frond just emerging from sandy seabed near rocks, pale peachy-yellow hue barely wider than a finger, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young fan coral developing flat structure growing upright from rocky base, warm amber and pale orange coloration with delicate ribbed texture, light rays highlighting its surface, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A magnificent mature sunrise fan in full splendor, perfectly flat expansive structure with rich golden-orange coloration and peachy highlights, intricate ribbed detailing catching light beams, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  bubblekelp: [
    'A minuscule kelp shoot with tiny bubble protrusions along its frond, pale green coloration attached to small rock, faint light catching the bubbles, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young kelp with multiple bubble formations, fronds lengthening gracefully in pale to medium green, distinct rounded bubble shapes catching and refracting light, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature bubble kelp in full growth, long flowing fronds completely studded with glistening spherical bubble pockets, vivid green coloration with silver bubble highlights refracting sunlight in spectacular displays, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  tidalfrond: [
    'A tiny grass-like sprout with single delicate frond just breaking through sand, pale greenish-white coloration barely taller than surrounding grains, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young seagrass developing multiple fronds with slight waviness, pale to medium green bending and waving with suggested current movement, rooted in sandy bottom, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature tidal frond in magnificent growth, numerous long wavy blade-like fronds creating flowing movement, rich dark green coloration with lighter undersides dancing and bending dynamically, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  glimmervine: [
    'A tiny bioluminescent vine tendril barely visible in darkness with two or three faint glowing nodes, pale translucent coloration creeping across dark rock, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A growing vine with developed bioluminescent nodes increasing in brightness, delicate tendrils extending across rocky substrate, pale blue-green coloration visible in its own glow creating dotted light pattern, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature glimmer vine in full luminous display, extensive vine system creeping across and around large dark rocks, numerous bright bioluminescent nodes creating constellation-like pattern, pale blue coloration illuminated from within glowing softly in surrounding darkness, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  phantomfeather: [
    'A barely visible translucent sea pen seedling, faintest suggestion of feathery structure in almost pure white coloration, attached to small dark stone, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young phantom feather showing delicate feathered structure, translucent pale lavender-white coloration with ethereal appearance and soft edges blending into darkness, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature phantom feather in ethereal full bloom, exquisite feathered plume structure spreading gracefully, luminous pale lavender-white coloration glowing softly against deep darkness, each feather segment visible but delicate and transparent, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  driftkelp: [
    'A tiny detached kelp frond floating freely in twilight water, pale olive-green coloration with minimal visible structure, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young drifting kelp with more distinct frond structure, pale green coloration growing richer with characteristic bending and waving patterns floating gracefully, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature drift kelp in elegant full form, extensive branching frond system with flowing graceful curves, rich olive-green coloration with lighter highlights appearing to float and sway majestically, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  deepwateriris: [
    'A tiny closed iris-like anemone bud in deep purple coloration, petal-tentacles folded inward attached to small stone, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young deepwater iris beginning to open, petal-tentacles slowly unfurling in iris-like pattern, rich purple coloration with delicate markings starting to show, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature deepwater iris in full dramatic bloom, perfectly formed iris-shaped structure with multiple layered petal-tentacles, rich deep purple coloration with intricate markings guiding inward to pale luminous center, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  midnightmoss: [
    'A tiny moss sprout barely visible on dark rock surface, nearly black coloration blending with stone, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young moss colony spreading across rock surface, dark charcoal coloration with texture becoming apparent and small elevated growths, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature midnight moss in full coverage, extensive carpet-like growth covering large rock surface, rich dark charcoal and near-black coloration with subtle texture showing individual moss capsules, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  twilightsponge: [
    'A tiny translucent sponge barely forming, pale white-blue coloration with small porous structure on small stone, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young sponge developing visible porous structure, pale lavender-blue coloration with visible filtering openings appearing, settling firmly on rock substrate, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature twilight sponge in full impressive form, substantial porous structure with visible filtering network, pale translucent lavender-blue coloration with subtle bioluminescent highlights in pores, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  starlightcoral: [
    'A tiny branching coral with barely visible luminous points, pale coloration with faintest glowing nodes starting to emerge from substrate, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young starlight coral developing more branches and luminous nodes, pale lavender-white base with small star-like clusters of bioluminescence becoming distinct, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature starlight coral in magnificent full display, intricate branching structure with numerous star-like clusters of bright bioluminescent polyps creating constellation effect, pale luminous lavender coloration with spectacular glowing pattern against darkness, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  shadevine: [
    'A barely visible dark vine tendril emerging from deep substrate, nearly black coloration almost invisible against dark stone, dark abyssal ocean background filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young shade vine extending across abyssal floor, dark carbon coloration with faint brownish tones, delicate tendrils showing distinct structure across dark rocky substrate, dark abyssal ocean background filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature shade vine in full abyssal extent, extensive dark network creating intricate patterns across the floor, rich dark coloration with subtle chestnut and charcoal tones showing extreme deep-sea adaptation, dark abyssal ocean background filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  luminousbell: [
    'A tiny bell-shaped bud barely visible with faint amber bioluminescence just beginning to glow, hanging from small rock overhang, dark abyssal ocean background filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young luminous bell developing fuller bell shape, warm amber glow becoming more pronounced with pale golden coloration visible in its own light, hanging from rock formation, dark abyssal ocean background filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature luminous bell in spectacular full bloom, perfect bell form hanging majestically with brilliant warm amber bioluminescence creating warm halo, rich golden coloration illuminated from within as a spectacular beacon in complete darkness, dark abyssal ocean background filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  voidmoss: [
    'A microscopic moss spore just beginning colonization on abyssal substrate, barely visible dark coloration on dark sediment, dark abyssal ocean background filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young void moss beginning visible growth, very dark brown-black coloration becoming apparent with sparse but growing coverage on substrate, dark abyssal ocean background filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature void moss in extensive coverage, vast dark network completely carpeting substrate, extremely dark brown-black coloration with mineral-rich appearance and dense established growth, dark abyssal ocean background filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  abyssalrose: [
    'A tiny pale bud barely visible in darkness, faintest suggestion of petal structure with milky-white coloration and hints of subtle shifting colors, emerging from mineral-rich substrate, dark abyssal ocean background filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young abyssal rose slowly developing petal structure, petals beginning to separate with delicate bioluminescence activating, pale coloration with barely visible color shifts, dark abyssal ocean background filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature abyssal rose in legendary full bloom, exquisite fully formed petals in perfect spiraling formation, magnificent bioluminescence creating visible spectrum shifts of ultraviolet blue and deep magenta, pale base coloration with extraordinary subtle color gradients, mysterious ethereal beauty emanating in the deepest trench, dark abyssal ocean background filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  deepfern: [
    'A tiny fern frond just beginning to unfurl, pale grayish-white coloration with barely visible mineral-rich texture emerging from dark substrate, dark abyssal ocean background filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young deep fern with multiple fronds developing, gray-brown coloration showing mineral deposits, fronds becoming rigid and structured with fossil-like appearance, dark abyssal ocean background filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature deep fern in full ancient splendor, numerous stiff mineral-encrusted fronds in perfect fern formation, distinctive gray-brown coloration with visible mineral deposits throughout giving fossil-like texture, dark abyssal ocean background filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  chimneysponge: [
    'A tiny sponge base just forming around vent opening, pale-white coloration with minimal structure emerging from rocky vent substrate, dark abyssal ocean background filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young chimney sponge developing upright tubular structure, pale cream-white coloration with chimney-like form becoming apparent, visible attachment to vent substrate with heat shimmer effect, dark abyssal ocean background filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature chimney sponge in full spectacular form, tall impressive chimney structure extending prominently upward, pale off-white coloration with subtle mineral deposits, intricate filtering network visible throughout porous structure surrounded by hydrothermal shimmer, dark abyssal ocean background filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  nocturnecoral: [
    'A barely visible coral polyp foundation, pale almost translucent coloration with faintest suggestion of structure in darkness on dark mineral substrate, dark abyssal ocean background filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young nocturne coral beginning to show characteristic polyp synchronization patterns, pale lavender-white coloration with structure showing rhythmic expansion areas, dark abyssal ocean background filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature nocturne coral in legendary magnificent bloom, spectacular polyp structure with synchronized expansion and contraction patterns creating visual rhythm, luminous pale lavender and white coloration glowing softly, hypnotic waves of movement visible throughout, ethereal beauty transcending physical realm, dark abyssal ocean background filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  lianhua: [
    'A young anime child girl around 6 years old with big gentle eyes, slim petite body, long dark hair in a simple low ponytail with a small pink flower clip, wearing a plain simple pale green cotton Chinese rural peasant dress with no embroidery, the child kneeling beside a shallow water dish with a small pink lotus bud emerging from the water, one hand reaching curiously toward the bud, soft pale green and pale pink watercolor washes spreading gently across the background like wet paint bleeding on paper, pink lotus buds and green lotus leaves rendered in loose watercolor in the background, Chinese ink wash guofeng watercolor painting style with visible brushstrokes and soft color washes, soft pale green and pale pink and white palette, cream background, no text no letters no writing, botanical illustration style, vertical composition',
    'A cute slender anime child girl with big gentle eyes and round young face, thin petite small body, long dark hair in simple twin buns with a small pink lotus bud hairpin, wearing a flowing oversized pale jade-green and white layered Chinese Hanfu robe with wide sleeves too long for her small arms, the small child holding a pink lotus bud close to her chest with both hands, large deep-green lotus leaves with visible veins arching overhead, pink lotus flowers and buds and green lotus leaves and stems surrounding her, soft pale green and pale pink watercolor washes spreading gently across the background like wet paint bleeding on paper, Chinese ink wash guofeng watercolor painting style with visible bold brushstrokes and soft color washes, deep green pink and white palette, cream background, no text no letters no writing, botanical illustration style, vertical composition',
    'A beautiful slender anime woman with delicate refined features and soft blush, gentle downcast eyes with long eyelashes, long flowing black hair in an elegant loose updo with a pink lotus flower and small green jade ornaments and dangling bead hair accessories, wearing a flowing pale blue-white and soft jade-green layered Chinese Hanfu robe with wide sleeves, one hand gracefully holding a large fully bloomed pink lotus flower with layered petals and a yellow center close to her chest, large deep-green lotus leaves with visible veins arching overhead like an umbrella, more pink lotus buds and bloomed lotus flowers and green lotus leaves and stems surrounding her densely, soft pale green and pale pink watercolor washes spreading gently across the background like wet paint bleeding on paper, Chinese ink wash guofeng watercolor painting style with visible bold brushstrokes and soft color washes, deep green pink and white palette, cream background, no text no letters no writing, botanical illustration style, vertical composition',
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
  const USER_ADDED = [
    'meihua', 'bianhua', 'lianhua', 'liushu', 'zhuzi',
    'lanternanemone', 'phantomjellybloom',
    'veilcoral', 'reeflace', 'spiralanemone', 'sunrisefan', 'bubblekelp', 'tidalfrond',
    'glimmervine', 'phantomfeather', 'driftkelp', 'deepwateriris', 'midnightmoss', 'twilightsponge', 'starlightcoral',
    'shadevine', 'luminousbell', 'voidmoss', 'abyssalrose', 'deepfern', 'chimneysponge', 'nocturnecoral',
  ] as const;
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
