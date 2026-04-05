import type { Rarity } from "@florify/shared";
import { FLORA_ENTRIES, type Prefix, type Suffix } from "./floraNames";

/**
 * The 300-species catalogue.
 *
 * `speciesId` is a stable integer key (0..299) that lives in save data.
 * It indexes directly into `FLORA_NAMES`, which is the folder name under
 * `public/floras/` that holds the three growth-stage images.
 */

export interface SpeciesDef {
  readonly id: number;
  readonly name: string; // display name, e.g. "Sunleaf"
  readonly folder: string; // matches /public/floras/{folder}/
  readonly rarity: Rarity;
  readonly descriptionEN: string;
  readonly descriptionTH: string;
}

function rarityFor(id: number): Rarity {
  if (id < 200) return "common";
  if (id < 280) return "rare";
  return "legendary";
}

function capitalize(s: string): string {
  return s.length === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1);
}

const PREFIX_META: Record<
  Prefix,
  { readonly en: string; readonly th: string }
> = {
  sun: { en: "kissed by morning sunlight", th: "ต้องแสงอรุณ" },
  moon: { en: "bathed in moonlight", th: "อาบแสงจันทร์" },
  star: { en: "sprinkled with starlight", th: "พร่างพราวแสงดาว" },
  dawn: { en: "born at first light", th: "ถือกำเนิดยามรุ่งอรุณ" },
  dusk: { en: "glowing at twilight", th: "เปล่งประกายยามสนธยา" },
  night: { en: "cloaked in deep night", th: "ห่มคลุมด้วยราตรี" },
  dream: { en: "woven from dreams", th: "ถักทอจากความฝัน" },
  mist: { en: "veiled in morning mist", th: "ห่มหมอกยามเช้า" },
  storm: { en: "charged with thunder", th: "เปี่ยมด้วยฟ้าคะนอง" },
  tide: { en: "rocked by ocean tides", th: "โยกไหวตามคลื่น" },
  ember: { en: "warmed by glowing embers", th: "อบอุ่นด้วยถ่านแดง" },
  frost: { en: "laced with winter frost", th: "เคลือบน้ำค้างแข็ง" },
  glow: { en: "pulsing with soft light", th: "เรืองรองอ่อนโยน" },
  shadow: { en: "cloaked in twilight shadow", th: "ห่มเงาสนธยา" },
  silver: { en: "tinged with silver sheen", th: "แต่งแต้มประกายเงิน" },
  gold: { en: "gilded with gold", th: "ชุบด้วยทองคำ" },
  crimson: { en: "flushed crimson red", th: "แดงฉานดั่งเลือด" },
  violet: { en: "tinted deep violet", th: "ม่วงเข้มลึก" },
  azure: { en: "washed in azure blue", th: "ฟ้าครามใส" },
  jade: { en: "carved as if from jade", th: "ดั่งสลักจากหยก" },
  ruby: { en: "glinting like ruby", th: "ประกายดั่งทับทิม" },
  amber: { en: "preserved in amber warmth", th: "อบอุ่นดั่งอำพัน" },
  pearl: { en: "lustrous as pearl", th: "เงาวาวดั่งไข่มุก" },
  obsidian: { en: "forged of black glass", th: "หลอมจากแก้วดำ" },
  copper: { en: "burnished like copper", th: "ขัดเงาดั่งทองแดง" },
  crystal: { en: "clear as crystal", th: "ใสดั่งคริสตัล" },
  velvet: { en: "soft as velvet", th: "นุ่มดั่งกำมะหยี่" },
  silk: { en: "smooth as silk", th: "เรียบลื่นดั่งผ้าไหม" },
  flame: { en: "crowned in living flame", th: "สวมเปลวเพลิง" },
  ice: { en: "carved from winter ice", th: "สลักจากน้ำแข็ง" },
  ash: { en: "dusted with fine ash", th: "โรยด้วยฝุ่นเถ้า" },
  cloud: { en: "floating on clouds", th: "ล่องลอยบนเมฆ" },
  rain: { en: "nourished by gentle rain", th: "ได้รับการหล่อเลี้ยงจากสายฝน" },
  wind: { en: "swayed by restless wind", th: "โอนเอนตามสายลม" },
  echo: { en: "humming with old echoes", th: "ก้องด้วยเสียงสะท้อนเก่า" },
  ghost: { en: "haunted by pale ghosts", th: "ต้องคำสาปวิญญาณ" },
  fae: { en: "blessed by the fae", th: "ได้รับพรจากภูตพราย" },
  wisp: { en: "trailing will-o'-wisps", th: "ทอดแสงวิญญาณพเนจร" },
  thorn: { en: "armored in sharp thorns", th: "หุ้มเกราะด้วยหนามแหลม" },
  briar: { en: "tangled in briar thickets", th: "พันกับกอหนาม" },
  bloom: { en: "bursting in full bloom", th: "ผลิบานเต็มที่" },
  whisper: { en: "murmuring soft whispers", th: "กระซิบเบา ๆ" },
  dew: { en: "beaded with morning dew", th: "เรียงเม็ดน้ำค้างยามเช้า" },
  spark: { en: "crackling with bright sparks", th: "ปะทุประกายสว่าง" },
  veil: { en: "draped in gauzy veils", th: "คลุมด้วยผ้าคลุมบางเบา" },
  heart: { en: "pulsing from its heart", th: "เต้นระรัวจากใจกลาง" },
  breath: { en: "warm as living breath", th: "อุ่นดั่งลมหายใจ" },
  song: { en: "singing a quiet song", th: "ขับบทเพลงเบา ๆ" },
  spell: { en: "bound by old spells", th: "ต้องมนตร์โบราณ" },
  rune: { en: "etched with ancient runes", th: "จารึกด้วยอักขระโบราณ" },
  mirth: { en: "brimming with quiet mirth", th: "เปี่ยมด้วยรอยยิ้ม" },
  tempest: { en: "weathered by tempests", th: "ผ่านพายุใหญ่" },
  grove: { en: "rooted in hidden groves", th: "หยั่งรากในป่าลึกลับ" },
  hollow: { en: "nested in quiet hollows", th: "แอบซ่อนในโพรงเงียบ" },
  fen: { en: "rising from misty fens", th: "ผุดจากหนองหมอก" },
  marsh: { en: "born of deep marsh", th: "ถือกำเนิดจากบึงลึก" },
  cinder: { en: "dusted in warm cinders", th: "โรยด้วยเถ้าถ่านอุ่น" },
  opal: { en: "shimmering like opal", th: "ระยิบระยับดั่งโอปอล" },
  topaz: { en: "glowing amber-topaz", th: "เรืองแสงดั่งบุษราคัม" },
  coral: { en: "branching like coral", th: "แตกกิ่งดั่งปะการัง" },
};

const SUFFIX_META: Record<
  Suffix,
  { readonly en: string; readonly th: string }
> = {
  leaf: { en: "leaf", th: "ใบไม้" },
  fern: { en: "fern", th: "เฟิร์น" },
  bloom: { en: "bloom", th: "ดอกไม้" },
  petal: { en: "petal", th: "กลีบดอก" },
  moss: { en: "moss", th: "มอส" },
};

const RARITY_META: Record<
  Rarity,
  { readonly en: string; readonly th: string }
> = {
  common: { en: "common", th: "ทั่วไป" },
  rare: { en: "rare", th: "หายาก" },
  legendary: { en: "legendary", th: "ในตำนาน" },
};

function buildDescriptionEN(
  prefix: Prefix,
  suffix: Suffix,
  rarity: Rarity,
  name: string,
): string {
  return `${name} is a ${RARITY_META[rarity].en} ${SUFFIX_META[suffix].en} ${PREFIX_META[prefix].en}.`;
}

function buildDescriptionTH(
  prefix: Prefix,
  suffix: Suffix,
  rarity: Rarity,
  name: string,
): string {
  return `${name} คือ${SUFFIX_META[suffix].th}${RARITY_META[rarity].th}ที่${PREFIX_META[prefix].th}`;
}

export const SPECIES: readonly SpeciesDef[] = FLORA_ENTRIES.map(
  ({ folder, prefix, suffix }, id) => {
    const rarity = rarityFor(id);
    const name = capitalize(folder);
    return {
      id,
      name,
      folder,
      rarity,
      descriptionEN: buildDescriptionEN(prefix, suffix, rarity, name),
      descriptionTH: buildDescriptionTH(prefix, suffix, rarity, name),
    };
  },
);

export const SPECIES_BY_RARITY: Record<Rarity, readonly SpeciesDef[]> = {
  common: SPECIES.filter((s) => s.rarity === "common"),
  rare: SPECIES.filter((s) => s.rarity === "rare"),
  legendary: SPECIES.filter((s) => s.rarity === "legendary"),
};
