import type { AchievementDef } from '@florify/shared';

export const ACHIEVEMENTS: readonly AchievementDef[] = [
  // ── Collection: Rank Milestones ────────────────────────────────────
  {
    id: 'collect_rank_1',
    name: '🌱 Seedling Steps',
    description: { en: 'Unlock 20 species', th: 'ปลดล็อค 20 สายพันธุ์' },
    rewards: [{ type: 'sprouts', amount: 50 }],
    condition: { type: 'species_unlocked', target: 20 },
  },
  {
    id: 'collect_rank_2',
    name: '📗 Apprentice Botanist',
    description: { en: 'Unlock 75 species', th: 'ปลดล็อค 75 สายพันธุ์' },
    rewards: [{ type: 'sprouts', amount: 200 }],
    condition: { type: 'species_unlocked', target: 75 },
  },
  {
    id: 'collect_rank_3',
    name: '🌳 Gardener\'s Pride',
    description: { en: 'Unlock 150 species', th: 'ปลดล็อค 150 สายพันธุ์' },
    rewards: [{ type: 'sprouts', amount: 500 }],
    condition: { type: 'species_unlocked', target: 150 },
  },
  {
    id: 'collect_rank_4',
    name: '👑 Master Cultivator',
    description: { en: 'Unlock 250 species', th: 'ปลดล็อค 250 สายพันธุ์' },
    rewards: [{ type: 'sprouts', amount: 1000 }],
    condition: { type: 'species_unlocked', target: 250 },
  },

  // ── Collection: Common ──────────────────────────────────────────────
  {
    id: 'collect_common_10',
    name: '🌼 Common Starter',
    description: { en: 'Collect 10 common species', th: 'สะสม 10 สายพันธุ์ธรรมดา' },
    rewards: [{ type: 'sprouts', amount: 20 }],
    condition: { type: 'species_by_rarity', rarity: 'common', target: 10 },
  },
  {
    id: 'collect_common_50',
    name: '🌼 Common Collector',
    description: { en: 'Collect 50 common species', th: 'สะสม 50 สายพันธุ์ธรรมดา' },
    rewards: [{ type: 'sprouts', amount: 100 }],
    condition: { type: 'species_by_rarity', rarity: 'common', target: 50 },
  },
  {
    id: 'collect_common_100',
    name: '🌼 Common Enthusiast',
    description: { en: 'Collect 100 common species', th: 'สะสม 100 สายพันธุ์ธรรมดา' },
    rewards: [{ type: 'sprouts', amount: 300 }],
    condition: { type: 'species_by_rarity', rarity: 'common', target: 100 },
  },
  {
    id: 'collect_common_200',
    name: '🌼 Common Completionist',
    description: { en: 'Collect 200 common species', th: 'สะสม 200 สายพันธุ์ธรรมดา' },
    rewards: [{ type: 'sprouts', amount: 1000 }],
    condition: { type: 'species_by_rarity', rarity: 'common', target: 200 },
  },

  // ── Collection: Rare ────────────────────────────────────────────────
  {
    id: 'collect_rare_10',
    name: '💎 Rare Finder',
    description: { en: 'Collect 10 rare species', th: 'สะสม 10 สายพันธุ์หายาก' },
    rewards: [{ type: 'sprouts', amount: 50 }],
    condition: { type: 'species_by_rarity', rarity: 'rare', target: 10 },
  },
  {
    id: 'collect_rare_50',
    name: '💎 Rare Connoisseur',
    description: { en: 'Collect 50 rare species', th: 'สะสม 50 สายพันธุ์หายาก' },
    rewards: [{ type: 'sprouts', amount: 300 }],
    condition: { type: 'species_by_rarity', rarity: 'rare', target: 50 },
  },

  // ── Collection: Legendary ───────────────────────────────────────────
  {
    id: 'collect_legend_5',
    name: '⭐ Lucky Star',
    description: { en: 'Collect 5 legendary species', th: 'สะสม 5 สายพันธุ์ตำนาน' },
    rewards: [{ type: 'sprouts', amount: 100 }],
    condition: { type: 'species_by_rarity', rarity: 'legendary', target: 5 },
  },
  {
    id: 'collect_legend_10',
    name: '⭐ Stargazer',
    description: { en: 'Collect 10 legendary species', th: 'สะสม 10 สายพันธุ์ตำนาน' },
    rewards: [{ type: 'sprouts', amount: 300 }],
    condition: { type: 'species_by_rarity', rarity: 'legendary', target: 10 },
  },
  {
    id: 'collect_legend_20',
    name: '⭐ Celestial Garden',
    description: { en: 'Collect 20 legendary species', th: 'สะสม 20 สายพันธุ์ตำนาน' },
    rewards: [{ type: 'sprouts', amount: 1000 }],
    condition: { type: 'species_by_rarity', rarity: 'legendary', target: 20 },
  },

  // ── Collection: Sets ────────────────────────────────────────────────
  {
    id: 'set_original_10',
    name: '🌸 Original Explorer',
    description: { en: 'Collect 10 Original flora', th: 'สะสม 10 ดอกไม้ Original' },
    rewards: [{ type: 'sprouts', amount: 20 }],
    condition: { type: 'species_by_collection', collection: 'original', target: 10 },
  },
  {
    id: 'set_original_50',
    name: '🌸 Original Collector',
    description: { en: 'Collect 50 Original flora', th: 'สะสม 50 ดอกไม้ Original' },
    rewards: [{ type: 'sprouts', amount: 100 }],
    condition: { type: 'species_by_collection', collection: 'original', target: 50 },
  },
  {
    id: 'set_original_100',
    name: '🌸 Original Enthusiast',
    description: { en: 'Collect 100 Original flora', th: 'สะสม 100 ดอกไม้ Original' },
    rewards: [{ type: 'sprouts', amount: 300 }],
    condition: { type: 'species_by_collection', collection: 'original', target: 100 },
  },
  {
    id: 'set_original_200',
    name: '🌸 Original Devotee',
    description: { en: 'Collect 200 Original flora', th: 'สะสม 200 ดอกไม้ Original' },
    rewards: [{ type: 'sprouts', amount: 1000 }],
    condition: { type: 'species_by_collection', collection: 'original', target: 200 },
  },
  {
    id: 'set_original_300',
    name: '🌸 Original Completionist',
    description: { en: 'Collect all 300 Original flora', th: 'สะสม 300 ดอกไม้ Original ครบ' },
    rewards: [{ type: 'sprouts', amount: 5000 }],
    condition: { type: 'species_by_collection', collection: 'original', target: 300 },
  },
  {
    id: 'set_chinese_5',
    name: '🏮 Chinese Garden Master',
    description: { en: 'Collect all 5 Chinese Garden flora', th: 'สะสม 5 ดอกไม้สวนจีนครบ' },
    rewards: [{ type: 'sprouts', amount: 500 }],
    condition: { type: 'species_by_collection', collection: 'chinese-garden', target: 5 },
  },
  {
    id: 'set_abyssal_10',
    name: '🌑 Abyssal Explorer',
    description: { en: 'Collect 10 Abyssal Garden flora', th: 'สะสม 10 ดอกไม้สวนเหว' },
    rewards: [{ type: 'sprouts', amount: 100 }],
    condition: { type: 'species_by_collection', collection: 'abyssal-garden', target: 10 },
  },
  {
    id: 'set_abyssal_20',
    name: '🌑 Abyssal Diver',
    description: { en: 'Collect 20 Abyssal Garden flora', th: 'สะสม 20 ดอกไม้สวนเหว' },
    rewards: [{ type: 'sprouts', amount: 300 }],
    condition: { type: 'species_by_collection', collection: 'abyssal-garden', target: 20 },
  },

  // ── Harvest: Total ──────────────────────────────────────────────────
  {
    id: 'harvest_total_10',
    name: '🌾 First Harvest',
    description: { en: 'Harvest 10 flora', th: 'เก็บเกี่ยว 10 ต้น' },
    rewards: [{ type: 'sprouts', amount: 10 }],
    condition: { type: 'harvest_total', target: 10 },
  },
  {
    id: 'harvest_total_50',
    name: '🌾 Budding Farmer',
    description: { en: 'Harvest 50 flora', th: 'เก็บเกี่ยว 50 ต้น' },
    rewards: [{ type: 'sprouts', amount: 50 }],
    condition: { type: 'harvest_total', target: 50 },
  },
  {
    id: 'harvest_total_100',
    name: '🌾 Harvest Moon',
    description: { en: 'Harvest 100 flora', th: 'เก็บเกี่ยว 100 ต้น' },
    rewards: [{ type: 'sprouts', amount: 100 }],
    condition: { type: 'harvest_total', target: 100 },
  },
  {
    id: 'harvest_total_200',
    name: '🌾 Golden Harvest',
    description: { en: 'Harvest 200 flora', th: 'เก็บเกี่ยว 200 ต้น' },
    rewards: [{ type: 'sprouts', amount: 200 }],
    condition: { type: 'harvest_total', target: 200 },
  },
  {
    id: 'harvest_total_500',
    name: '🌾 Harvest Festival',
    description: { en: 'Harvest 500 flora', th: 'เก็บเกี่ยว 500 ต้น' },
    rewards: [{ type: 'sprouts', amount: 500 }],
    condition: { type: 'harvest_total', target: 500 },
  },
  {
    id: 'harvest_total_1000',
    name: '🌾 Eternal Harvest',
    description: { en: 'Harvest 1,000 flora', th: 'เก็บเกี่ยว 1,000 ต้น' },
    rewards: [{ type: 'sprouts', amount: 1000 }],
    condition: { type: 'harvest_total', target: 1000 },
  },

  // ── Harvest: By Rarity (Common) ────────────────────────────────────
  ...([10, 50, 100, 200, 500, 1000] as const).map((n, i) => ({
    id: `harvest_common_${n}`,
    name: `🌼 Common Reaper ${n}`,
    description: { en: `Harvest ${n.toLocaleString()} common flora`, th: `เก็บเกี่ยวดอกไม้ธรรมดา ${n.toLocaleString()} ต้น` },
    rewards: [{ type: 'sprouts' as const, amount: [10, 50, 100, 200, 500, 1000][i]! }],
    condition: { type: 'harvest_by_rarity' as const, rarity: 'common' as const, target: n },
  })),

  // ── Harvest: By Rarity (Rare) ──────────────────────────────────────
  ...([10, 50, 100, 200, 500, 1000] as const).map((n, i) => ({
    id: `harvest_rare_${n}`,
    name: `💎 Rare Reaper ${n}`,
    description: { en: `Harvest ${n.toLocaleString()} rare flora`, th: `เก็บเกี่ยวดอกไม้หายาก ${n.toLocaleString()} ต้น` },
    rewards: [{ type: 'sprouts' as const, amount: [30, 150, 300, 600, 1500, 3000][i]! }],
    condition: { type: 'harvest_by_rarity' as const, rarity: 'rare' as const, target: n },
  })),

  // ── Harvest: By Rarity (Legendary) ─────────────────────────────────
  ...([10, 50, 100, 200, 500, 1000] as const).map((n, i) => ({
    id: `harvest_legend_${n}`,
    name: `⭐ Legend Reaper ${n}`,
    description: { en: `Harvest ${n.toLocaleString()} legendary flora`, th: `เก็บเกี่ยวดอกไม้ตำนาน ${n.toLocaleString()} ต้น` },
    rewards: [{ type: 'sprouts' as const, amount: [100, 500, 1000, 2000, 5000, 10000][i]! }],
    condition: { type: 'harvest_by_rarity' as const, rarity: 'legendary' as const, target: n },
  })),

  // ── Watering ────────────────────────────────────────────────────────
  ...([1000, 5000, 10000, 100000, 1000000] as const).map((n, i) => ({
    id: `water_${n}`,
    name: ['💧 Drizzle', '💧 Steady Stream', '💧 Rainfall', '💧 Monsoon', '💧 Ocean'][i]!,
    description: { en: `Water ${n.toLocaleString()} times`, th: `รดน้ำ ${n.toLocaleString()} ครั้ง` },
    rewards: [{ type: 'sprouts' as const, amount: [50, 200, 500, 2000, 10000][i]! }],
    condition: { type: 'total_watered' as const, target: n },
  })),

  // ── Sprout Economy: Gained ──────────────────────────────────────────
  ...([500, 1000, 5000, 10000, 100000, 1000000] as const).map((n, i) => ({
    id: `sprout_gain_${n}`,
    name: ['🌱 Penny Sprout', '🌱 Growing Fund', '🌱 Sprouting Rich', '🌱 Sprout Baron', '🌱 Sprout Tycoon', '🌱 Sprout Mogul'][i]!,
    description: { en: `Earn ${n.toLocaleString()} sprouts total`, th: `ได้รับ 🌱 รวม ${n.toLocaleString()}` },
    rewards: [{ type: 'sprouts' as const, amount: [50, 100, 300, 500, 2000, 5000][i]! }],
    condition: { type: 'sprouts_gained' as const, target: n },
  })),

  // ── Sprout Economy: Spent ───────────────────────────────────────────
  ...([500, 1000, 5000, 10000, 100000, 1000000] as const).map((n, i) => ({
    id: `sprout_spend_${n}`,
    name: ['💸 Window Shopper', '💸 Casual Buyer', '💸 Big Spender', '💸 Shopaholic', '💸 Sprout Whale', '💸 Sprout Overlord'][i]!,
    description: { en: `Spend ${n.toLocaleString()} sprouts total`, th: `ใช้ 🌱 รวม ${n.toLocaleString()}` },
    rewards: [{ type: 'sprouts' as const, amount: [50, 100, 300, 500, 2000, 5000][i]! }],
    condition: { type: 'sprouts_spent' as const, target: n },
  })),

  // ── Streaks ─────────────────────────────────────────────────────────
  ...([7, 14, 30, 90, 365] as const).map((n, i) => ({
    id: `streak_${n}`,
    name: ['🔥 Week Warrior', '🔥 Fortnight Flora', '🔥 Monthly Devotion', '🔥 Seasonal Spirit', '🔥 Eternal Flame'][i]!,
    description: { en: `${n}-day streak`, th: `เข้าเล่นติดต่อกัน ${n} วัน` },
    rewards: [{ type: 'sprouts' as const, amount: [50, 100, 300, 1000, 5000][i]! }],
    condition: { type: 'streak' as const, target: n },
  })),

  // ── Combos ──────────────────────────────────────────────────────────
  ...([10, 15, 20] as const).flatMap((level) =>
    ([100, 200, 500, 1000] as const).map((n, i) => ({
      id: `combo${level}_${n}`,
      name: `⚡ ${level === 10 ? 'Combo' : level === 15 ? 'Surge' : 'Thunder'} ${['Starter', 'Regular', 'Veteran', 'Master'][i]!}`,
      description: {
        en: `Hit ${level}x combo ${n.toLocaleString()} times`,
        th: `ทำ Combo ${level}x สะสม ${n.toLocaleString()} ครั้ง`,
      },
      rewards: [{ type: 'sprouts' as const, amount:
        (level === 10 ? [50, 100, 200, 500][i]! :
        level === 15 ? [100, 200, 500, 1000][i]! :
        [200, 500, 1000, 2000][i]!)
      }],
      condition: { type: 'combo' as const, level, target: n },
    }))
  ),

  // ── Seed Packets: Total ─────────────────────────────────────────────
  ...([1, 10, 50, 100, 500] as const).map((n, i) => ({
    id: `seedpacket_total_${n}`,
    name: ['🎁 First Unboxing', '🎁 Pack Opener', '🎁 Pack Enthusiast', '🎁 Pack Collector', '🎁 Pack Addict'][i]!,
    description: { en: `Open ${n.toLocaleString()} seed packet${n > 1 ? 's' : ''}`, th: `เปิดซองเมล็ดพันธุ์ ${n.toLocaleString()} ซอง` },
    rewards: [{ type: 'sprouts' as const, amount: [10, 50, 200, 500, 2000][i]! }],
    condition: { type: 'seed_packets' as const, tier: 'total' as const, target: n },
  })),

  // ── Seed Packets: Common ────────────────────────────────────────────
  ...([1, 10, 50, 100] as const).map((n, i) => ({
    id: `seedpacket_common_${n}`,
    name: ['🌼 Common Unboxing', '🌼 Common Pack Fan', '🌼 Common Pack Pro', '🌼 Common Pack Master'][i]!,
    description: { en: `Open ${n.toLocaleString()} common packet${n > 1 ? 's' : ''}`, th: `เปิดซองธรรมดา ${n.toLocaleString()} ซอง` },
    rewards: [{ type: 'sprouts' as const, amount: [10, 50, 200, 500][i]! }],
    condition: { type: 'seed_packets' as const, tier: 'common' as const, target: n },
  })),

  // ── Seed Packets: Rare ──────────────────────────────────────────────
  ...([1, 10, 50, 100] as const).map((n, i) => ({
    id: `seedpacket_rare_${n}`,
    name: ['💎 Rare Unboxing', '💎 Rare Pack Fan', '💎 Rare Pack Pro', '💎 Rare Pack Master'][i]!,
    description: { en: `Open ${n.toLocaleString()} rare packet${n > 1 ? 's' : ''}`, th: `เปิดซองหายาก ${n.toLocaleString()} ซอง` },
    rewards: [{ type: 'sprouts' as const, amount: [20, 100, 500, 1000][i]! }],
    condition: { type: 'seed_packets' as const, tier: 'rare' as const, target: n },
  })),

  // ── Seed Packets: Legendary ─────────────────────────────────────────
  ...([1, 10, 50, 100] as const).map((n, i) => ({
    id: `seedpacket_legendary_${n}`,
    name: ['⭐ Legendary Unboxing', '⭐ Legendary Pack Fan', '⭐ Legendary Pack Pro', '⭐ Legendary Pack Master'][i]!,
    description: { en: `Open ${n.toLocaleString()} legendary packet${n > 1 ? 's' : ''}`, th: `เปิดซองตำนาน ${n.toLocaleString()} ซอง` },
    rewards: [{ type: 'sprouts' as const, amount: [50, 300, 1500, 3000][i]! }],
    condition: { type: 'seed_packets' as const, tier: 'legendary' as const, target: n },
  })),

  // ── Daily Mission Completion ────────────────────────────────────────
  ...([100, 300, 1000, 5000, 10000, 100000, 1000000] as const).map((n, i) => ({
    id: `mission_${n}`,
    name: ['📋 Task Starter', '📋 Task Regular', '📋 Task Veteran', '📋 Task Expert', '📋 Task Master', '📋 Task Legend', '📋 Task God'][i]!,
    description: { en: `Complete ${n.toLocaleString()} missions`, th: `ทำภารกิจสำเร็จ ${n.toLocaleString()} ครั้ง` },
    rewards: [{ type: 'sprouts' as const, amount: [50, 100, 300, 1000, 2000, 5000, 10000][i]! }],
    condition: { type: 'missions_completed' as const, target: n },
  })),

  // ── All Daily Mission Completion ────────────────────────────────────
  ...([10, 30, 90, 365, 1000] as const).map((n, i) => ({
    id: `daily_all_${n}`,
    name: ['🌟 Devoted 10', '🌟 Devoted 30', '🌟 Devoted 90', '🌟 Devoted 365', '🌟 Devoted 1000'][i]!,
    description: { en: `Complete all daily missions ${n.toLocaleString()} days`, th: `ทำภารกิจประจำวันครบทั้งหมด ${n.toLocaleString()} วัน` },
    rewards: [{ type: 'sprouts' as const, amount: [50, 200, 500, 2000, 5000][i]! }],
    condition: { type: 'all_daily_completed' as const, target: n },
  })),
];

/** Fast lookup by id. */
export const ACHIEVEMENTS_BY_ID = new Map(ACHIEVEMENTS.map((a) => [a.id, a]));
