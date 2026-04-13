import type { Rarity } from '@florify/shared';

export const HARVEST_HEADLINES: Record<'th' | 'en', Record<Rarity, string[]>> = {
  th: {
    common: [
      'ใบอ่อนแย้มรับวัน 🌿',
      'ลมหายใจแผ่วเบาของสวน 🍃',
      'อุ่นใจในผืนดินเดิม 🌱',
      'พลิกหน้ากระดาษใบใหม่ 📖🌿',
      'งดงามเงียบๆ ในมุมเดิม 🪴',
      'ชูยอดรับแสงอ่อน ☀️',
      'ค่อยๆ คลี่ใบอย่างใจเย็น 🌿',
      'เมล็ดพันธุ์แห่งเรื่องราวธรรมดา 🌱',
      'เบ่งบานในวันแสนธรรมดา 🍃',
      'เติบโตอย่างเงียบเชียบ 🌿',
    ],
    rare: [
      'สิ่งล้ำค่าที่ซ่อนเร้น ✨',
      'ความลับที่ผืนดินมอบให้ 🍀',
      'ประกายเงียบงันใต้ร่มเงา 💠',
      'เสียงกระซิบจากป่าลึก 🌿✨',
      'เผยตัวในจังหวะที่พอดี ☁️✨',
      'หน้ากระดาษที่รอคนค้นพบ 📖✨',
    ],
    legendary: [
      'ปฐมบทแห่งการผลิบาน 🌼',
      'วินาทีที่โลกหยุดหมุน 💫',
      'บุปผาที่กาลเวลาจารึก 👑',
      'ลมหายใจแห่งตำนานในมือคุณ 🌟',
    ],
  },
  en: {
    common: [
      'A young leaf greets the day 🌿',
      'The garden breathes softly 🍃',
      'Rooted in familiar soil 🌱',
      'Turning a fresh page 📖🌿',
      'Quiet beauty in its corner 🪴',
      'Lifting toward gentle light ☀️',
      'Unfurling at its own pace 🌿',
      'A seed of an ordinary tale 🌱',
      'Blooming on a plain day 🍃',
      'Growing in silence 🌿',
    ],
    rare: [
      'A treasure kept hidden ✨',
      'A secret the earth offered 🍀',
      'A quiet glimmer in the shade 💠',
      'A whisper from the deep wood 🌿✨',
      'Appearing right on cue ☁️✨',
      'A page that waited to be found 📖✨',
    ],
    legendary: [
      'The opening verse of a bloom 🌼',
      'The moment the world paused 💫',
      'A flower time itself remembers 👑',
      'A legend breathing in your hands 🌟',
    ],
  },
};

export function pickHarvestHeadline(lang: 'th' | 'en', rarity: Rarity, treeId: string): string {
  const pool = HARVEST_HEADLINES[lang][rarity];
  let h = 0;
  for (let i = 0; i < treeId.length; i++) h = (h * 31 + treeId.charCodeAt(i)) >>> 0;
  return pool[h % pool.length] ?? pool[0]!;
}
