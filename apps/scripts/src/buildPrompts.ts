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
  coralwhisper: [
    'A tiny coral whisper seedling — a single pale-pink branching filament barely two centimeters tall on sandy seabed with small shell fragments, translucent coloration with faint blush tones, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young coral whisper growing across sandy substrate, delicate branching network of blush-pink filaments spreading outward, translucent polyps just becoming visible along each branch, soft light dancing across the colony, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature coral whisper in magnificent full form, intricate cascade of gossamer-fine branching filaments in soft rose and cream, hundreds of tiny polyps fully extended and waving gently, the entire colony breathing with the current like a living veil, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  tidalglass: [
    'A tiny tidal glass seedling — a single ultra-translucent grass blade barely visible with faint prismatic light bending through its structure, rooted in white sand, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young tidal glass meadow of several transparent grass blades growing from sandy bottom, pale green tones with visible prismatic refractions creating faint rainbow shadows on the sand below, bending gracefully together, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature tidal glass meadow in full brilliance, numerous long translucent blades swaying in perfect formation, prismatic light dispersing into miniature rainbow patterns across the seafloor, the whole meadow shimmering like broken mirrors in shifting current, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  crownpolyp: [
    'A tiny crown polyp colony just beginning, three or four minuscule individual polyps with coronet-like tentacle rings barely extended, warm tangerine and pale gold coloration on rocky substrate, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young crown polyp formation developing into a mounded dome shape, multiple feeding tentacle crowns extended in rich tangerine and gold hues, distinctive coronet pattern visible on each polyp, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A magnificent mature crown polyp colony in full bloom, substantial mounded formation with hundreds of tangerine-gold coronet tentacle crowns fully extended in unison, the surface alive with uniform feeding motion creating a spectacular field of tiny sovereign flowers, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  seablossom: [
    'A tiny sea blossom seedling — a minuscule anemone bud with folded magenta and white tentacle tips just emerging from flat coral rubble, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young sea blossom anemone on flat coral rubble, tentacles partially extended in vivid magenta with white banding, flower-like formation taking shape with cheerful coloration, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature sea blossom in magnificent full bloom, compact anemone with all tentacles fully extended in lush magenta and white floral pattern, the organism resembling a vibrant garden flower in the blue water, small fish visible swimming nearby, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  pearlwrack: [
    'A tiny pearl wrack seedling, single short frond with two or three minuscule bead-like vesicles just forming, pale cream-green coloration attached to small rock in sunny shallows, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young pearl wrack developing branching fronds with growing round vesicles, pale green fronds studded with small perfect spheres containing faint iridescent fluid, hints of prismatic light scattering, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature pearl wrack in full splendor, lush branching fronds completely laden with glistening pearl-like vesicles in cream and pale gold, scattered rainbow prismatic light patterns drifting across surrounding reef, the whole plant shimmering with jeweled beauty, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  coralcrown: [
    'A tiny coral crown seedling — a curved arc of just a few vivid purple and crimson polyps forming on flat rock, the crescent shape barely suggested, brilliant jewel-toned coloration already showing, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young coral crown growing into a partial diadem shape, arching branches in deep saturated purple and crimson with rich layered polyps, the hollow center beginning to form, intense jewel-toned coloration, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature coral crown in legendary full perfection, a complete crescent-diadem architecture of dramatically arching branches, saturated deep purples and rich crimson in an impossible jewel palette, the hollow central space framed by the magnificent colony, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  mossyarch: [
    'A tiny mossy arch seedling — a small encrusting alga patch in deep emerald beginning to form on a flat rock surface, dense velvet-like texture, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young mossy arch growing over rocky substrate, rich emerald coralline alga beginning to form arching formations over small rock ledges, dense textured surface with varied greens, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature mossy arch in full architectural splendor, sweeping arched formations of deep emerald coralline alga creating genuine tunnels and archways over substantial rock formations, small colorful reef fish passing through the living archways, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  saltbraid: [
    'A tiny salt braid seedling — a short ribbon-like frond with the faintest twist just beginning, deep olive-green coloration with delicate surface texture, anchored to small rock, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young salt braid developing distinctive twisted braiding along its fronds, deep olive and green with visible crosshatch texture on the ribbon surface, loose spiraling forming naturally, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature salt braid in magnificent full growth, long flowing ribbon fronds in lush olive-green with complex braided twisting throughout, delicate crosshatch surface texture catching light, forming a loose net-like shelter among rocks with small juvenile fish swimming through, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  inkbloom: [
    'A tiny ink bloom patch — the faintest suggestion of deep blue-black velvet-textured alga beginning to spread on dark stone in twilight water, absorbing rather than reflecting what little light exists, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young ink bloom spreading more visibly across rocky substrate, rich indigo and blue-black coloration with fine velvet-like surface texture, almost luminously dark against the surrounding twilight water, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature ink bloom covering a substantial rock face, deep indigo-black expanse of fine velvet-textured tissue with subtle depth and layered dark tones, an absorbing darkness more profound than the surrounding sea, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  murmurkelp: [
    'A tiny murmur kelp — a single short stipe with small flat ribbon frond hanging in mid-water, dark olive-brown coloration with slightly translucent edges, isolated and solitary in dim twilight, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young murmur kelp growing longer, single elongated stipe and ribbon frond swaying gently in mid-water current, deep olive-dark coloration with slight undulation motion, solitary and graceful, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature murmur kelp in full isolated splendor, dramatically long single stipe and vast ribbon frond descending through twilight water, rich dark olive coloration with subtle texture, swaying ceaselessly alone in the dim current with quiet philosophical presence, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  ashcoral: [
    'A tiny ash coral formation just beginning to encrust a dark rock face, pale bleached-grey coloration with fine powdery texture, ghost-like pale forms in dim twilight water, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young ash coral colony developing across rock surface, pale silvery-grey crumbling-textured formations, complex surface pattern emerging with multiple lobes and ridges, dim water lending mysterious atmosphere, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature ash coral in full extensive growth, covering large rock face with pale grey powdery formations, remarkably robust structure despite delicate appearance, subtle texture showing decades of calcium carbonate secretion, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  silkwhip: [
    'A tiny silk whip seedling — a single delicate pale stalk barely centimeters tall rising from sediment, faintest suggestion of feeding polyps at tip, translucent and ethereal in dim water, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young silk whip growing taller, single elegant unbranched stalk in pale translucent lavender-white, developing plume of fine thread-like polyps at top, swaying slowly in dim current, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature silk whip in ethereal full glory, dramatically tall single stalk rising from dark sediment ending in magnificent plume of fine feeding polyps like embroidery thread, translucent pale lavender-white coloration with subtle glow, swaying in a vast slow arc, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  coldlace: [
    'A tiny cold lace colony — a minuscule filigree patch of pale grey-white bryozoan just beginning to form on rock surface, delicate lace-like cellular structure barely visible, cold atmosphere, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young cold lace colony expanding across rock face, intricate cellular filigree pattern growing, pale grey-white lace-like structure with remarkable delicacy, beginning to drape and hang from rock ledge edge, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature cold lace formation in full frozen splendor, extensive pale grey-white filigree draped from rock faces like frozen curtains, extraordinarily delicate lattice-work with visible individual zooid cells in the pattern, ghostly beauty in dim water, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  blindroot: [
    'A tiny blind root seedling — a single almost-white pale grass blade emerging from dark sediment, colorless and ghostly, no pigmentation, rooted firmly in twilight zone floor, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young blind root meadow developing, several pale white-cream grass blades growing from dark sediment, colorless and ethereal with slight translucency, an eerie pale meadow in dim water, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature blind root meadow in full eerie splendor, extensive pale white colorless grass blades creating a ghostly meadow on dark sediment floor, beautiful and haunting in twilight water, pale blades bending uniformly in slow current, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  vesperfrond: [
    'A tiny vesper frond seedling — a small fern-like frond in muted dusty violet just unfurling from dark rock, faintest bioluminescent midrib line barely glowing, dim and mysterious atmosphere, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young vesper frond growing more elaborate fern structure, dusty violet fronds with delicate bioluminescent midrib lines pulsing faintly, intricate pinnate structure forming, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature vesper frond in dramatic evening beauty, full fern-like fronds in rich muted violet with clear bioluminescent lines along each midrib glowing softly in the twilight — pulsing in its own private dusk, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  ventshrub: [
    'A tiny vent shrub seedling — a small rigid multi-stemmed sprout emerging from mineral-crusted rock near vent opening, dark bronze and iron-grey coloration with heat shimmer barely visible, dark abyssal ocean background filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young vent shrub developing compact bushy form, multiple rigid branches in dark bronze and iron-grey with mineral encrustation, rooted near hydrothermal vent with faint heat shimmer, stark and robust, dark abyssal ocean background filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature vent shrub in full abyssal splendor, dense compact multi-branched bush with heavily mineral-encrusted stems in rich dark bronze, iron-grey and deep rust tones, growing at edge of active hydrothermal vent with heat shimmer and mineral smoke around base, geological grandeur, dark abyssal ocean background filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  gloomcap: [
    'A tiny gloom cap — a minuscule disc-shaped organism just settling on abyssal sediment, dull grey-green coloration barely distinguishable from substrate, faint concentric ring pattern beginning to form, dark abyssal ocean background filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young gloom cap developing wider flat-capped form on abyssal floor, grey-green disc with clearer concentric ring pattern, anonymous and quiet in the absolute dark, dark abyssal ocean background filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature gloom cap colony in full abyssal expanse, several wide flat-capped forms across sediment floor, dull grey-green with well-defined concentric growth rings, scattered anonymously across the abyss, perfectly adapted to permanent darkness and pressure, dark abyssal ocean background filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  pressurebloom: [
    'A tiny pressure bloom seedling — a small sealed star-shaped bud on abyssal rock, ivory-pale coloration with faint violet bioluminescent veins barely visible, bud tightly closed under extreme pressure, dark abyssal ocean background filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young pressure bloom beginning to open, star-shaped flower with pale ivory petals and bioluminescent violet veins illuminating from within, growing with two companions in a cluster of three, dark abyssal ocean background filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature pressure bloom in full impossible bloom, three star-shaped flowers in a cluster, wide-open pale ivory petals brilliantly shot through with glowing violet bioluminescent veins, breathtaking beauty existing only under crushing abyssal pressure, dark abyssal ocean background filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  crystalgarden: [
    'A tiny crystal garden seedling — a few minuscule translucent mineral columns just precipitating from dark sediment, faint biological blush of pale pink-white coloration from microorganisms within, dark abyssal ocean background filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young crystal garden developing a small forest of translucent mineral columns rising from abyssal floor, pale translucent coloration with faint living blush from chemosynthetic organisms within, otherworldly and ancient, dark abyssal ocean background filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature crystal garden in full extraordinary formation, a dense forest of tall translucent mineral columns rising from dark sediment, pale crystalline structures with faint biological pink glow within each column, an impossible beauty between mineral and living worlds, profound ancient silence, dark abyssal ocean background filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  eternalmoss: [
    'A tiny eternal moss seedling — a small ancient-seeming patch of deep otherworldly teal moss on abyssal substrate, edges turning dark gold, one or two tiny perfect white bioluminescent nodes glowing cold and steady, dark abyssal ocean background filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A young eternal moss growing slowly across abyssal floor, deep teal coloration with dark gold margins, several white bioluminescent nodes glowing with cold steady starlight-like quality, profound age implied in unhurried growth, dark abyssal ocean background filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature eternal moss in legendary full expanse, vast carpet of deep otherworldly teal across the abyssal floor with dark gold margins, scattered white bioluminescent nodes glowing cold and eternal as stars, the sheer age and scale of the organism conveying deep geological time, one patch of an immeasurable whole, dark abyssal ocean background filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  siltribbon: [
    'A single tiny blade of silt ribbon seagrass, pale green and translucent, just a few centimeters tall rooted in fine white sand, soft dappled light above, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A small cluster of narrow silt ribbon seagrass blades, erect and slightly swaying, sage-green with delicate midribs catching golden light, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A sweeping curtain of silt ribbon seagrass, tall cascading blades in sage-green and fleeting gold where shafts of sunlight pierce through, roots anchored in white sand below, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  flamepolyp: [
    'A tiny patch of flame polyps on a fragment of reef rock, scarlet and amber tentacles barely extended, backlit by pale sunlight, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A fist-sized colony of flame polyps on reef rock, vivid red-orange tentacles fanned wide, rippling like tongues of fire in gentle current, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A blazing colony of flame polyps covering an entire reef wall face, dense scarlet and amber tentacles extending outward en masse, luminous against the deep blue, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  frothalga: [
    'A small cloud of pale green froth algae cells loosely drifting in crystal-clear shallow water, catching sunlight, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A fluffy mass of froth algae, soft lime-green, dotted with tiny rising oxygen bubbles, anchored loosely in warm shallow reef water, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A dramatic billowing cloud of froth algae filling the water column, pale green and white with streams of oxygen bubbles spiraling upward in sunlight shafts, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  stonelace: [
    'A thin crust of stone lace coralline alga just beginning to spread on a fragment of dead reef rubble, soft pink and mauve mineral tones, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, botanical illustration style, vertical composition',
    'Stone lace encrusting a larger reef substrate piece, pink-mauve patterns following every curve and groove of the rock, delicate mineral texture, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A fully colonized reef boulder draped entirely in stone lace, every surface a tapestry of calcified pink mauve and cream, otherworldly in its completeness, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  lacesponge: [
    'A small frilled disc of lace sponge, creamy white with an open lacework texture, perched on shallow reef rock, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A growing sheet of lace sponge spreading horizontally, geometric openwork of creamy white tubes, light playing through its gaps, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A dramatic flat colony of lace sponge fully expanded, a wide intricate mesh of creamy ivory tubes, sunlight casting complex shadow-patterns through its open lattice onto the reef below, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  coralwisp: [
    'A single tiny spiral filament of coral wisp, barely a centimeter tall, pale gold, rising delicately from a shallow reef surface in dappled sunlight, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A slender spiraling coral wisp filament, mid-height, pale gold catching light, its perfect helix form making it look almost artificial, anchored on pale reef rock, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A fully mature coral wisp, its single half-meter helix of pale gold rising dramatically from the reef floor, impossibly thin, spiraling upward like a living question mark in bright sunlight, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  glasswort: [
    'A single tiny glassy succulent-like stem of glass wort, pale sea-green and translucent with silica sheen, emerging from shallow sandy substrate, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A small cluster of glass wort stems, plump and crystalline in appearance, sea-green with faint refraction shimmer, compact in sunlit shallow water, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature glass wort plant, its swollen glassy stems forming a tight succulent cluster, some stems almost invisible due to their transparency except for faint refraction lines, catching sunlight, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  duskfringe: [
    'A small frond of dusk fringe alga, dusty rose with a darker lavender edge, lone and delicate in dim water, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, botanical illustration style, vertical composition',
    'Several dusk fringe fronds hanging in loose curtain formation, dusty rose and muted lavender with darker outlined edges, swaying gently in slow current, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A full curtain of dusk fringe, long cascading fronds in dusty rose and lavender with meticulously darker-edged margins, draped beautifully against the dim blue twilight, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  emberroot: [
    'A tiny cluster of dark orange-red fronds of ember root just breaking through dark sediment, sparse and small, glowing warmly against the cold dark, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A small clump of ember root fronds, dark orange-red, warm-colored and vivid against the cool twilight depths, the sediment surface hinting at rhizomes below, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature ember root colony, a dramatic spread of dark orange-red fronds rising from a wide sediment field, anomalously warm and fiery against the cold blue-purple twilight, with hints of hidden rhizome runners, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  hazewrack: [
    'A tiny brown rosette of haze wrack on dim rock, with just a few microscopic particles drifting around it in the dim water, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A small haze wrack rosette releasing a faint cloud of reproductive spores, the particles glowing faintly as they drift upward in the sparse light, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature haze wrack plant surrounded by a dramatic billowing cloud of bioluminescent reproductive particles, the tiny brown rosette at the base almost hidden beneath the luminous haze it has released, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  paletendril: [
    'A tiny pale-grey holdfast on a stone with one or two very thin pale filaments just beginning to drift upward, ghostly in the dim water, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A pale tendril plant with several long pale grey wandering filaments drifting freely in the water column above a single holdfast, each filament untangled and separate, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature pale tendril, its many long grey filaments spreading through the water in an elegant non-tangled array, each one reaching in a different direction from the small anchoring holdfast below, ghostly and ethereal, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  waxcoral: [
    'A small smooth dome of wax coral, cream-colored with a waxy sheen, sitting quietly on dim twilight rock, its surface almost featureless, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A growing mound of wax coral, smooth and cream-amber with a candlewax gloss, faint amber undulations across its surface suggesting hidden internal structure, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A large mature wax coral colony, a dramatic rounded formation of cream and amber with a luminous waxy gloss, the surface so smooth it seems sculpted rather than grown, in dim blue-purple twilight, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  threadgarden: [
    'A single small tube worm of threadworm garden, its tiny feathery plume fanned open, cream and pale violet, rising from dark sediment, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A small cluster of threadworm garden tube worms, their feathery plumes in cream ivory and pale violet fanned wide, a miniature meadow of waving crowns, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A dense spectacular forest of threadworm garden tube worms, dozens of cream and pale violet feathery plumes all fanned open simultaneously, forming a mesmerizing meadow in the twilight gloom, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  smokefern: [
    'A single tiny smoke fern frond, pale grey-green with edges so fine they appear to dissolve into the water, alone on dark sediment, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A small isolated clump of smoke fern, grey-green fronds so finely divided their edges blur into the surrounding water like smoke, quietly luminous, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature clump of smoke fern, its mass of ultra-fine grey-green fronds creating a soft-edged cloud-like form, each frond edge dissolving into the surrounding twilight water, beautiful and ephemeral, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  ventlily: [
    'A single tiny upturned trumpet-shaped frond of vent lily near a hydrothermal vent, rust-brown and ochre, mineral deposits beginning to form on its surface in total darkness, dark abyssal ocean background filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A small cluster of vent lily fronds, their upturned trumpet shapes catching faint vent glow, rust-brown and ochre coloring, with visible mineral glaze building on surfaces, dark abyssal ocean background filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A dramatic colony of vent lily trumpets clustered around a hydrothermal vent, their rust-brown and ochre fronds oriented upward in a ring, covered in intricate natural mineral glaze, glowing faintly from the vent light below, dark abyssal ocean background filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  brinebloom: [
    'A tiny ring of brine bloom mat at the edge of a miniature brine pool, dark teal and silver-white banding, in complete abyssal darkness, dark abyssal ocean background filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A growing brine bloom colony forming concentric teal and silver-white rings at the brine-seawater interface of a small abyssal brine pool, dark abyssal ocean background filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A stunning mature brine bloom colony, perfect concentric rings of dark teal and luminous silver-white spreading outward from the edge of an abyssal brine pool, creating the illusion of a shoreline in the deepest dark, dark abyssal ocean background filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  ossuaryfern: [
    'A single pale white frond of ossuary fern emerging from a small whale bone fragment on the abyssal floor, delicate against the absolute darkness, dark abyssal ocean background filling the entire image edge to edge, botanical illustration style, vertical composition',
    'Several ossuary fern fronds threading through the ribs and gaps of a partially visible whale skeleton section, pale white against aged bone, eerily beautiful, dark abyssal ocean background filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A fully colonized whale fall skeleton section draped in pale white ossuary fern fronds, the intricate plant-life filling every gap of ancient bone, transforming a grave into a garden in the total dark, dark abyssal ocean background filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  voidtendril: [
    'A tiny black filament of void tendril barely visible against the abyssal dark, just a suggestion of form rising from sediment, dark abyssal ocean background filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A void tendril filament rising from dark sediment, black and nearly invisible, tapering to near-nothingness at its tip, its presence only known by the subtle displacement of particles around it, dark abyssal ocean background filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature void tendril, a single dramatic black filament rising tall from the abyssal floor, perfectly straight, narrowing to invisibility at its top, rendered in near-total darkness with only the faintest hint of its form against the surrounding void, dark abyssal ocean background filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  meridiancoral: [
    'The very beginning of a meridian coral wall, just a thin vertical strip of bioluminescent skeleton, cold blue-white glow, rising precisely from dark abyssal sediment, dark abyssal ocean background filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A growing meridian coral wall, a tall thin vertical plane of bioluminescent coral skeleton, glowing cold blue-white, oriented vertically like a living fence between thermal columns, dark abyssal ocean background filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A fully mature meridian coral, a dramatic glowing wall of bioluminescent skeleton rising straight up from the abyssal floor in a perfect vertical plane, cold blue-white light illuminating the absolute darkness around it, vast and solitary, dark abyssal ocean background filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  abyssalseraph: [
    'A single tiny six-branched abyssal seraph organism, miniature and symmetrical, faintly pulsing with violet-gold bioluminescence, alone on the abyssal floor, dark abyssal ocean background filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A small cluster of abyssal seraph structures, their six-branched symmetrical forms glowing with slow violet-gold pulses, otherworldly and cathedral-like even in miniature, dark abyssal ocean background filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A full colony of abyssal seraph in bloom, multiple large six-branched symmetrical forms rising from the abyssal floor, all pulsing in slow synchronized waves of violet-gold bioluminescence, magnificent and awe-inspiring in the total dark, like a cathedral of living light, dark abyssal ocean background filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  tidehymn: [
    'Tiny ivory hydroid polyp colony, single thread strung between two seagrass blades, a few minute bell-cups just beginning to form, pale and delicate, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, botanical illustration style, vertical composition',
    'A growing garland of ivory bell-polyps draped across multiple seagrass blades, each cup slightly open, soft shimmer of translucence where sunlight passes through, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A full reef meadow curtained with Tide Hymn colonies, dense garlands of glowing ivory bell-cups trembling in unison, seagrass blades barely visible beneath the shimmering hydroid lattice, a continuous musical shimmer of pale light, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  coralplume: [
    'A tiny gorgonian coral stub, single smooth flexible axis just emerging from reef rock, a few small saffron-yellow polyp nubs along its sides, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, botanical illustration style, vertical composition',
    'Coral Plume with axis rising, first feathery side branches spreading outward, vivid saffron-yellow polyps open like tiny suns on each branch tip, warm glow against blue water, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature Coral Plume in full glory, half-metre axis crowned with dense tropical-bird plumage of saffron-gold branches, each polyp a blazing yellow disc, the whole colony radiating warmth and colour against the reef, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  blushwreath: [
    'A tiny pink ring of encrusting red alga just beginning to form on a patch of dead white coral substrate, barely a centimetre across, vivid pink at the growing edge, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, botanical illustration style, vertical composition',
    'Blush Wreath growing into a clear ring shape, soft pink outer edge, dusty rose inner tissue, the central area beginning to pale, viewed slightly from above to show the ring form, dead coral reef substrate beneath, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A large near-perfect circular wreath of encrusting red alga, viewed from a slight overhead angle, vivid blush pink at the outer rim graduating through rose to pale dusty-white at the centre, laid like a floral wreath on the reef floor, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  sunkencup: [
    'A tiny solitary cup coral attached to bare reef rock, the cup barely formed, translucent rim of nascent tentacles, a hint of electric turquoise at the centre, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, botanical illustration style, vertical composition',
    'Sunken Cup coral on an exposed reef face, the cup opened wider, vivid electric turquoise disc clearly visible, a ring of short translucent white tentacles rimming it, alone and bold on plain rock, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A fully mature Sunken Cup coral, thumb-sized cup wide open, blazing electric turquoise central disc surrounded by a full crown of translucent white tentacles, solitary on a stark reef wall, a jewel of colour against bare stone, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  reefmantle: [
    'A small patch of smooth terracotta-orange encrusting sponge just beginning to drape over reef rubble, a few tiny oscula dimples on its surface, warm earthy tones, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, botanical illustration style, vertical composition',
    'Reef Mantle growing across more reef rubble, smooth rounded lobes of warm terracotta and burnt sienna spreading over broken coral, surface dimpled with oscula like fired clay pores, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature Reef Mantle draped thickly over a mound of reef rubble, smooth warm-terracotta and sienna lobes fully encasing the substrate, the surface richly dimpled with exhaling oscula, solid and earthen as a clay vessel, quietly holding the reef together, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  gildedfrond: [
    'A small seedling of iridescent kelp, a single young blade emerging from a holdfast on reef rock, its tissue shimmering between pale green and warm gold as sunlight catches it, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, botanical illustration style, vertical composition',
    'Gilded Frond growing larger, wide blade undulating in the current, surface rippling with patches of green gold and copper iridescence, light-scattering effect visible across the blade surface, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A towering mature Gilded Frond, broad blade standing nearly upright above the reef floor, surface blazing with shifting iridescent colours — emerald green hammered gold burnished copper — catching and fracturing sunlight into a spectacle of refracted colour, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  crownhydroid: [
    'A tiny Crown Hydroid colony, two or three stacked rings of polyp cups just forming on a reef surface, each ring barely open, pale and intricate, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, botanical illustration style, vertical composition',
    'Crown Hydroid with several clearly tiered rings ascending the colony axis, the topmost whorl open like a sundew crown, polyps extending fine white tentacle filaments outward, precise geometric elegance, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A fully mature Crown Hydroid colony, elaborate tiered spire of stacked polyp whorls, the apex whorl opened magnificently wide like a sundew sticky crown, each polyp radiating hair-thin white tentacle filaments in perfect radial symmetry, a masterwork of patient predatory architecture, deep blue ocean background with soft light rays filtering from above filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  duskveil: [
    'A small patch of translucent bryozoan colony beginning to hang from a rocky overhang, pale frosted-glass texture, faint diffuse glow in the dim water, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, botanical illustration style, vertical composition',
    'Dusk Veil bryozoan colony hanging as a wider translucent sheet from a submerged overhang, frosted-glass appearance, soft diffuse bioluminescent glow emanating from the colony into the surrounding dim water, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A large mature Dusk Veil, a full curtain of translucent frosted-glass bryozoan hanging free from a rocky overhang, softly re-emitting ambient light as a gentle diffuse glow that melts into the surrounding twilight, barely holding the dark at bay, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  pewterbloom: [
    'A small cluster of pewter-grey colonial polyp cups just opening on submerged rock, dull silver-grey, interior lines barely glowing with faint luminescence, muted and understated, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, botanical illustration style, vertical composition',
    'Pewter Bloom colony spreading across rock, massed formations of dull silver-grey cups, each interior traced with faint luminescent lines, the whole colony having the flat grey-silver quality of pewter metalwork, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A vast field of Pewter Bloom, spreading across the twilight seafloor in all directions, hundreds of dull silver-grey polyp cups open together, their faint interior luminescence creating a dim overcast-sky effect of grey upon grey, quiet and profound, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  shroudkelp: [
    'A tiny seedling of near-black kelp, a single narrow darkened blade anchored to twilight-zone rock, a faint phosphorescent seam just beginning at its edge, still, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, botanical illustration style, vertical composition',
    'Shroud Kelp with a single wide blade, nearly black, hand-width, hanging motionless, its full margin edged in a delicate phosphorescent seam of pale light, the blade perfectly still against the dim water, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature Shroud Kelp, single massive near-black blade hanging immobile like a dark curtain from its holdfast, the entire perimeter traced by a continuous faint phosphorescent hem, an eerie stillness around it as if the current refuses to touch it, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  murkcrinoid: [
    'A tiny feather star crinoid anchored to a submerged ledge, just a few short muted violet arms beginning to branch, held out in the dim water, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, botanical illustration style, vertical composition',
    'Murk Crinoid spreading wider, arms twice-divided in muted violet, the fractal branching pattern becoming visible, fine pinnules catching drifting particles from the water column, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A fully spread Murk Crinoid, arms radiating wide from a central disc anchored on a ledge, three-times-divided muted violet fractal lattice creating a spectacular net in the twilight water, the whole organism a living mandala of soft purple geometry, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  paleseapen: [
    'A tiny sea pen just emerging from soft sediment, small flattened rachis beginning to form, a few pale ash-white polyps just visible, rising alone from the flat twilight floor, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, botanical illustration style, vertical composition',
    'Pale Sea Pen standing upright from the sediment, single flattened feather-like rachis clothed in rows of pale ash-white polyps, the lone vertical form in an otherwise flat landscape of grey sediment, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature Pale Sea Pen in full extension, tall flattened rachis bearing dense rows of ash-white polyps on both sides, standing alone and isolated in the twilight sediment plain, the single upright form casting a faint shadow in the dim water, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  fossilwrack: [
    'A small xenophyophore test, a compact branching structure of agglutinated sediment grains and mineral particles on the twilight seafloor, ancient-looking seaweed-fossil-like texture, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, botanical illustration style, vertical composition',
    'Fossil Wrack xenophyophore spreading wider, irregular branching arms of cemented sediment grains mimicking the form of ancient fossil seaweed, earthy grey-tan tones, uncanny organic-yet-mineral quality, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A large sprawling Fossil Wrack specimen across the twilight seafloor, elaborate branching test of agglutinated sediment perfectly imitating the form of fossilized ancient algae, the structure eerily beautiful in its geological mimicry, simultaneously alive and ancient, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  trancehydroid: [
    'A young Trance Hydroid spire, a slender polished axis just beginning to rise from the twilight seafloor, the first few whorls of polyps spiraling outward with geometric precision, a faint azure glow at the base, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, botanical illustration style, vertical composition',
    'Trance Hydroid spire growing taller, clearly spiraling whorls of gonozooids ascending the polished axis like a nautilus shell uncoiling, azure bioluminescence beginning to pulse up the structure in a slow wave, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A towering mature Trance Hydroid spire, over two metres tall, a majestic colonial pillar of spiraling polyp whorls with the precision of a nautilus shell, azure bioluminescence travelling in a slow continuous wave from base to tip as if the entire structure breathes, one of the most hauntingly beautiful formations in the ocean, dark blue-purple ocean background with faint distant light filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  cindersponge: [
    'A tiny glass sponge forming on abyssal rock, a small lattice of silica spicules in open geometric weave, charcoal grey exterior, a faint ember-orange glow barely visible in the interior canals, dark abyssal ocean background filling the entire image edge to edge, botanical illustration style, vertical composition',
    'Cinder Sponge growing larger, open silica-lattice structure more elaborate, dark charcoal-grey sooty exterior, interior canal system glowing with warm bacterial bioluminescence like embers cooling in ash, dark abyssal ocean background filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A full mature Cinder Sponge, elaborate rigid-yet-lacelike open lattice of silica spicules, dark as soot on the outside, inner canal system glowing with deep amber-orange bacterial light like the last embers of a fire seen through latticed metal, a haunting beauty in the absolute dark, dark abyssal ocean background filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  riftgarden: [
    'A small patch of white and pale-yellow chemosynthetic filament mat forming around a seeping crack in dark abyssal basalt, delicate as frost, dark abyssal ocean background filling the entire image edge to edge, botanical illustration style, vertical composition',
    'Rift Garden spreading as a continuous white-and-pale-yellow filament carpet along the seams of dark spreading-rift basalt, the delicate mat covering more of the dark rock, the contrast between living frost-like mat and black stone striking, dark abyssal ocean background filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A mature Rift Garden, a spectacular living carpet of white and pale-yellow chemosynthetic filaments covering a wide expanse of dark abyssal basalt along a spreading rift, the whole colony resembling hoarfrost on black stone, impossibly delicate in absolute darkness, dark abyssal ocean background filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  stalklantern: [
    'A tiny stalked crinoid just emerging from abyssal sediment, a short calcite stalk with a few short translucent arms barely beginning to unfurl, faint blue-white pinpoints of light at pinnule tips, dark abyssal ocean background filling the entire image edge to edge, botanical illustration style, vertical composition',
    'Stalk Lantern with taller calcite column, crown of longer translucent clouded-glass arms spread wide, each pinnule tip producing a cold steady point of blue-white bioluminescence, forming a candelabra shape in the abyss, dark abyssal ocean background filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A fully mature Stalk Lantern, tall calcite column topped with an elaborate crown of long combed translucent arms, every pinnule tip a cold blue-white point of light creating a breathtaking living candelabra in the absolute dark of the abyss, geometry made from patience and calcium, dark abyssal ocean background filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  bonelichen: [
    'A tiny patch of pale grey-green lichen-analog thallus beginning to cover a fragment of whale bone on the abyssal floor, pressing flat and intimate against the ancient calcium surface, dark abyssal ocean background filling the entire image edge to edge, botanical illustration style, vertical composition',
    'Bone Lichen covering more of a whale rib, pale grey-green thallus filling every groove and pore, a few small amber spore cups just appearing in clusters on the surface, the lichen becoming indistinguishable from the bone itself, dark abyssal ocean background filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'Bone Lichen fully colonizing a large whale bone or vertebra, the pale grey-green thallus perfectly merged with the ancient calcium structure, patches of minute amber spore cups glowing faintly, the living lichen and the dead bone become one indivisible form in the abyss, dark abyssal ocean background filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  trenchseraph: [
    'A small stalked xenophyophore just anchored in hadal sediment, a short thick stalk topped with the first few branching agglutinated chambers of sediment grains, ancient and alien in form, dark abyssal ocean background filling the entire image edge to edge, botanical illustration style, vertical composition',
    'Trench Seraph growing taller, stalk thicker, branching crown of agglutinated mineral-grain chambers spreading wider at the apex, the silhouette beginning to suggest a figure raising its arms, faint thermal glow from deep vents in the background, dark abyssal ocean background filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'A towering mature Trench Seraph, enormous single stalk planted in hadal sediment, branching crown of agglutinated chambers spread wide like outstretched arms, its silhouette against a faint thermal glow eerily suggesting an angelic figure of extraordinary patience and age, dark abyssal ocean background filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
  ],
  voidlotus: [
    'A tiny Void Lotus bud emerging from abyssal sediment, a single dark near-black shoot with the faintest violet iridescence at its tip, barely distinguishable from the darkness around it, dark abyssal ocean background filling the entire image edge to edge, botanical illustration style, vertical composition',
    'Void Lotus bud beginning to open, symmetrical black petals slowly unfurling, faint violet iridescence shifting across the petal surfaces at certain angles, an impossible bloom forming in absolute darkness, dark abyssal ocean background filling the entire image edge to edge, painterly botanical illustration style, vertical composition',
    'The Void Lotus in full bloom, a perfectly symmetrical multi-petaled flower of pure black, each petal carrying a faint violet iridescence that shifts and vanishes depending on viewing angle — the color of an eye opening in darkness — the most mysterious and beautiful thing the abyss has ever produced, dark abyssal ocean background filling the entire image edge to edge, elegant botanical illustration style, vertical composition',
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
    'coralwhisper', 'tidalglass', 'crownpolyp', 'seablossom', 'pearlwrack', 'coralcrown', 'mossyarch', 'saltbraid',
    'inkbloom', 'murmurkelp', 'ashcoral', 'silkwhip', 'coldlace', 'blindroot', 'vesperfrond',
    'ventshrub', 'gloomcap', 'pressurebloom', 'crystalgarden', 'eternalmoss',
    'siltribbon', 'flamepolyp', 'frothalga', 'stonelace', 'lacesponge', 'coralwisp', 'glasswort',
    'duskfringe', 'emberroot', 'hazewrack', 'paletendril', 'waxcoral', 'threadgarden', 'smokefern',
    'ventlily', 'brinebloom', 'ossuaryfern', 'voidtendril', 'meridiancoral', 'abyssalseraph',
    'tidehymn', 'coralplume', 'blushwreath', 'sunkencup', 'reefmantle', 'gildedfrond', 'crownhydroid',
    'duskveil', 'pewterbloom', 'shroudkelp', 'murkcrinoid', 'paleseapen', 'fossilwrack', 'trancehydroid',
    'cindersponge', 'riftgarden', 'stalklantern', 'bonelichen', 'trenchseraph', 'voidlotus',
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
