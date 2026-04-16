import type { AchievementDef } from "@florify/shared";

// ═══════════════════════════════════════════════════════════════════
// Badge shield rank ladder (low → high):
//   brown → green → blue → bronze → silver → gold → purple-gradient → rainbow
//
// For a series with N tiers, pick the RIGHTMOST N shields from the ladder.
//   1 tier  → [rainbow]
//   2 tiers → [purple-gradient, rainbow]
//   3 tiers → [gold, purple-gradient, rainbow]
//   4 tiers → [silver, gold, purple-gradient, rainbow]
//   5 tiers → [bronze, silver, gold, purple-gradient, rainbow]
//   …up to 8 tiers uses the full ladder.
//
// Emoji in badge replaces the old leading emoji in `name` — names are now
// plain text since the badge visually carries the icon.
// ═══════════════════════════════════════════════════════════════════
export const ACHIEVEMENTS: readonly AchievementDef[] = [
  // ── Collection: Rank Milestones (4 tiers) ──────────────────────────
  {
    id: "collect_rank_1",
    name: "Seedling Steps",
    badge: { shield: "brown", emoji: "🌱" },
    description: { en: "Unlock 20 species", th: "ปลดล็อค 20 สายพันธุ์" },
    flavor: {
      en: "Every botanist starts with a single sprout.",
      th: "นักพฤกษศาสตร์ทุกคนเริ่มจากต้นกล้าต้นเดียว",
    },
    rewards: [{ type: "sprouts", amount: 50 }],
    condition: { type: "species_unlocked", target: 20 },
  },
  {
    id: "collect_rank_2",
    name: "Apprentice Botanist",
    badge: { shield: "green", emoji: "📗" },
    description: { en: "Unlock 75 species", th: "ปลดล็อค 75 สายพันธุ์" },
    flavor: {
      en: "Your notebook is getting thicker.",
      th: "สมุดจดของคุณหนาขึ้นทุกวัน",
    },
    rewards: [{ type: "sprouts", amount: 200 }],
    condition: { type: "species_unlocked", target: 75 },
  },
  {
    id: "collect_rank_3",
    name: "Gardener's Pride",
    badge: { shield: "blue", emoji: "🌳" },
    description: { en: "Unlock 150 species", th: "ปลดล็อค 150 สายพันธุ์" },
    flavor: {
      en: "The garden has started to know you.",
      th: "สวนเริ่มจำคุณได้แล้ว",
    },
    rewards: [{ type: "sprouts", amount: 500 }],
    condition: { type: "species_unlocked", target: 150 },
  },
  {
    id: "collect_rank_4",
    name: "Master Cultivator",
    badge: { shield: "bronze", emoji: "👑" },
    description: { en: "Unlock 250 species", th: "ปลดล็อค 250 สายพันธุ์" },
    flavor: {
      en: "The plants call you sensei now.",
      th: "ตอนนี้ต้นไม้เรียกคุณว่าอาจารย์แล้ว",
    },
    rewards: [{ type: "sprouts", amount: 1000 }],
    condition: { type: "species_unlocked", target: 250 },
  },
  {
    id: "collect_rank_5",
    name: "Flora Sage",
    badge: { shield: "silver", emoji: "🧙" },
    description: { en: "Unlock 300 species", th: "ปลดล็อค 300 สายพันธุ์" },
    flavor: {
      en: "The plants whisper their secrets now.",
      th: "ต้นไม้กระซิบความลับให้ฟังแล้ว",
    },
    rewards: [{ type: "sprouts", amount: 1500 }],
    condition: { type: "species_unlocked", target: 300 },
  },
  {
    id: "collect_rank_6",
    name: "Garden Oracle",
    badge: { shield: "gold", emoji: "🔮" },
    description: { en: "Unlock 350 species", th: "ปลดล็อค 350 สายพันธุ์" },
    flavor: {
      en: "You see what the garden will become.",
      th: "คุณเห็นอนาคตของสวนได้",
    },
    rewards: [{ type: "sprouts", amount: 2000 }],
    condition: { type: "species_unlocked", target: 350 },
  },
  {
    id: "collect_rank_7",
    name: "Flora Ascendant",
    badge: { shield: "rainbow", emoji: "✨" },
    description: { en: "Unlock 400 species", th: "ปลดล็อค 400 สายพันธุ์" },
    flavor: {
      en: "You've transcended the garden itself.",
      th: "คุณข้ามพ้นสวนไปแล้ว",
    },
    rewards: [{ type: "sprouts", amount: 3000 }],
    condition: { type: "species_unlocked", target: 400 },
  },

  // ── Collection: Common (4 tiers) ───────────────────────────────────
  {
    id: "collect_common_10",
    name: "Common Starter",
    badge: { shield: "silver", emoji: "🌼" },
    description: {
      en: "Collect 10 common species",
      th: "สะสม 10 สายพันธุ์ธรรมดา",
    },
    flavor: {
      en: "Ordinary is beautiful if you really look.",
      th: "ธรรมดาก็สวยได้ ถ้ามองด้วยใจ",
    },
    rewards: [{ type: "sprouts", amount: 20 }],
    condition: { type: "species_by_rarity", rarity: "common", target: 10 },
  },
  {
    id: "collect_common_50",
    name: "Common Collector",
    badge: { shield: "gold", emoji: "🌼" },
    description: {
      en: "Collect 50 common species",
      th: "สะสม 50 สายพันธุ์ธรรมดา",
    },
    flavor: {
      en: "Where there are flowers, there is joy.",
      th: "ที่ไหนมีดอกไม้ ที่นั่นมีความสุข",
    },
    rewards: [{ type: "sprouts", amount: 100 }],
    condition: { type: "species_by_rarity", rarity: "common", target: 50 },
  },
  {
    id: "collect_common_100",
    name: "Common Enthusiast",
    badge: { shield: "purple-gradient", emoji: "🌼" },
    description: {
      en: "Collect 100 common species",
      th: "สะสม 100 สายพันธุ์ธรรมดา",
    },
    flavor: {
      en: "A hundred blooms, a thousand smiles.",
      th: "ร้อยดอก หมื่นยิ้ม",
    },
    rewards: [{ type: "sprouts", amount: 300 }],
    condition: { type: "species_by_rarity", rarity: "common", target: 100 },
  },
  {
    id: "collect_common_200",
    name: "Common Completionist",
    badge: { shield: "rainbow", emoji: "🌼" },
    description: {
      en: "Collect 200 common species",
      th: "สะสม 200 สายพันธุ์ธรรมดา",
    },
    flavor: {
      en: "You've got them all. Still hunting?",
      th: "เก็บหมดแล้ว ยังจะเก็บอีกไหม?",
    },
    rewards: [{ type: "sprouts", amount: 1000 }],
    condition: { type: "species_by_rarity", rarity: "common", target: 200 },
  },

  // ── Collection: Rare (2 tiers) ─────────────────────────────────────
  {
    id: "collect_rare_10",
    name: "Rare Finder",
    badge: { shield: "purple-gradient", emoji: "💎" },
    description: {
      en: "Collect 10 rare species",
      th: "สะสม 10 สายพันธุ์หายาก",
    },
    flavor: {
      en: "Sharp eyes you've got.",
      th: "ตาไวจริงๆ",
    },
    rewards: [{ type: "sprouts", amount: 50 }],
    condition: { type: "species_by_rarity", rarity: "rare", target: 10 },
  },
  {
    id: "collect_rare_50",
    name: "Rare Connoisseur",
    badge: { shield: "rainbow", emoji: "💎" },
    description: {
      en: "Collect 50 rare species",
      th: "สะสม 50 สายพันธุ์หายาก",
    },
    flavor: {
      en: "Is it luck, or is it patience?",
      th: "โชคของคุณ หรือความอดทนของคุณ?",
    },
    rewards: [{ type: "sprouts", amount: 300 }],
    condition: { type: "species_by_rarity", rarity: "rare", target: 50 },
  },

  // ── Collection: Legendary (3 tiers) ────────────────────────────────
  {
    id: "collect_legend_5",
    name: "Lucky Star",
    badge: { shield: "gold", emoji: "⭐" },
    description: {
      en: "Collect 5 legendary species",
      th: "สะสม 5 สายพันธุ์ตำนาน",
    },
    flavor: {
      en: "The stars are aligning.",
      th: "ดวงกำลังเข้าข้างคุณ",
    },
    rewards: [{ type: "sprouts", amount: 100 }],
    condition: { type: "species_by_rarity", rarity: "legendary", target: 5 },
  },
  {
    id: "collect_legend_10",
    name: "Stargazer",
    badge: { shield: "purple-gradient", emoji: "⭐" },
    description: {
      en: "Collect 10 legendary species",
      th: "สะสม 10 สายพันธุ์ตำนาน",
    },
    flavor: {
      en: "You're on a first-name basis with legends.",
      th: "คุณกับตำนานเรียกชื่อกันแล้ว",
    },
    rewards: [{ type: "sprouts", amount: 300 }],
    condition: { type: "species_by_rarity", rarity: "legendary", target: 10 },
  },
  {
    id: "collect_legend_20",
    name: "Celestial Garden",
    badge: { shield: "rainbow", emoji: "⭐" },
    description: {
      en: "Collect 20 legendary species",
      th: "สะสม 20 สายพันธุ์ตำนาน",
    },
    flavor: {
      en: "The flower gods have blessed you.",
      th: "เทพแห่งดอกไม้ประทานพร",
    },
    rewards: [{ type: "sprouts", amount: 1000 }],
    condition: { type: "species_by_rarity", rarity: "legendary", target: 20 },
  },

  // ── Collection: Sets — Original (5 tiers) ──────────────────────────
  {
    id: "set_original_10",
    name: "Original Explorer",
    badge: { shield: "bronze", emoji: "🌸" },
    description: {
      en: "Collect 10 Original flora",
      th: "สะสม 10 ดอกไม้ Original",
    },
    flavor: {
      en: "Starting with the classics.",
      th: "เริ่มต้นกับรุ่นคลาสสิก",
    },
    rewards: [{ type: "sprouts", amount: 20 }],
    condition: {
      type: "species_by_collection",
      collection: "original",
      target: 10,
    },
  },
  {
    id: "set_original_50",
    name: "Original Collector",
    badge: { shield: "silver", emoji: "🌸" },
    description: {
      en: "Collect 50 Original flora",
      th: "สะสม 50 ดอกไม้ Original",
    },
    flavor: {
      en: "Fifty Originals and counting.",
      th: "ห้าสิบ Original แล้วนะ",
    },
    rewards: [{ type: "sprouts", amount: 100 }],
    condition: {
      type: "species_by_collection",
      collection: "original",
      target: 50,
    },
  },
  {
    id: "set_original_100",
    name: "Original Enthusiast",
    badge: { shield: "gold", emoji: "🌸" },
    description: {
      en: "Collect 100 Original flora",
      th: "สะสม 100 ดอกไม้ Original",
    },
    flavor: {
      en: "A proper collector now.",
      th: "นักสะสมตัวจริงแล้ว",
    },
    rewards: [{ type: "sprouts", amount: 300 }],
    condition: {
      type: "species_by_collection",
      collection: "original",
      target: 100,
    },
  },
  {
    id: "set_original_200",
    name: "Original Devotee",
    badge: { shield: "purple-gradient", emoji: "🌸" },
    description: {
      en: "Collect 200 Original flora",
      th: "สะสม 200 ดอกไม้ Original",
    },
    flavor: {
      en: "Almost there — don't stop now.",
      th: "ใกล้จะครบแล้ว อย่าเพิ่งท้อ",
    },
    rewards: [{ type: "sprouts", amount: 1000 }],
    condition: {
      type: "species_by_collection",
      collection: "original",
      target: 200,
    },
  },
  {
    id: "set_original_300",
    name: "Original Completionist",
    badge: { shield: "rainbow", emoji: "🌸" },
    description: {
      en: "Collect all 300 Original flora",
      th: "สะสม 300 ดอกไม้ Original ครบ",
    },
    flavor: {
      en: "All 300 Originals. You're a legend.",
      th: "Original ครบ 300 เป็นตำนานแล้ว",
    },
    rewards: [{ type: "sprouts", amount: 5000 }],
    condition: {
      type: "species_by_collection",
      collection: "original",
      target: 300,
    },
  },
  // ── Collection: Sets — Chinese Garden (1 tier) ─────────────────────
  {
    id: "set_chinese_5",
    name: "Chinese Garden Master",
    badge: { shield: "rainbow", emoji: "🏮" },
    description: {
      en: "Collect all 5 Chinese Garden flora",
      th: "สะสม 5 Chinese Garden ครบ",
    },
    flavor: {
      en: "A Chinese garden blooms in your hands.",
      th: "สวนจีนผลิบานในมือคุณ",
    },
    rewards: [{ type: "sprouts", amount: 500 }],
    condition: {
      type: "species_by_collection",
      collection: "chinese-garden",
      target: 5,
    },
  },

  // ── Collection: Sets — Abyssal Garden (4 tiers) ────────────────────
  {
    id: "set_abyssal_10",
    name: "Abyssal Explorer",
    badge: { shield: "silver", emoji: "🌑" },
    description: {
      en: "Collect 10 Abyssal Garden flora",
      th: "สะสม 10 Abyssal Garden",
    },
    flavor: {
      en: "Dipping into the dark.",
      th: "จุ่มเข้าไปในเงาดำ",
    },
    rewards: [{ type: "sprouts", amount: 100 }],
    condition: {
      type: "species_by_collection",
      collection: "abyssal-garden",
      target: 10,
    },
  },
  {
    id: "set_abyssal_20",
    name: "Abyssal Diver",
    badge: { shield: "gold", emoji: "🌑" },
    description: {
      en: "Collect 20 Abyssal Garden flora",
      th: "สะสม 20 Abyssal Garden",
    },
    flavor: {
      en: "Deeper and deeper.",
      th: "ลึกลงไปเรื่อยๆ",
    },
    rewards: [{ type: "sprouts", amount: 300 }],
    condition: {
      type: "species_by_collection",
      collection: "abyssal-garden",
      target: 20,
    },
  },
  {
    id: "set_abyssal_50",
    name: "Abyssal Conqueror",
    badge: { shield: "purple-gradient", emoji: "🌑" },
    description: {
      en: "Collect 50 Abyssal Garden flora",
      th: "สะสม 50 Abyssal Garden",
    },
    flavor: {
      en: "Your shadow lives underwater now.",
      th: "เงาของคุณอยู่ใต้น้ำไปแล้ว",
    },
    rewards: [{ type: "sprouts", amount: 1000 }],
    condition: {
      type: "species_by_collection",
      collection: "abyssal-garden",
      target: 50,
    },
  },
  {
    id: "set_abyssal_100",
    name: "Abyssal Completionist",
    badge: { shield: "rainbow", emoji: "🌑" },
    description: {
      en: "Collect all 100 Abyssal Garden flora",
      th: "สะสม 100 Abyssal Gardenครบ",
    },
    flavor: {
      en: "No one knows the abyss like you do.",
      th: "ไม่มีใครรู้จักเหวลึกเท่าคุณ",
    },
    rewards: [{ type: "sprouts", amount: 5000 }],
    condition: {
      type: "species_by_collection",
      collection: "abyssal-garden",
      target: 100,
    },
  },

  // ── Collection: Sets — Celestial Court (4 tiers) ───────────────────
  {
    id: "set_celestial_5",
    name: "Court Initiate",
    badge: { shield: "silver", emoji: "☁️" },
    description: {
      en: "Collect 5 Celestial Court flora",
      th: "สะสม 5 Celestial Court",
    },
    flavor: {
      en: "The gates of heaven creak open.",
      th: "ประตูสวรรค์เริ่มเปิดแล้ว",
    },
    rewards: [{ type: "sprouts", amount: 200 }],
    condition: {
      type: "species_by_collection",
      collection: "celestial-court",
      target: 5,
    },
  },
  {
    id: "set_celestial_10",
    name: "Court Acolyte",
    badge: { shield: "gold", emoji: "☁️" },
    description: {
      en: "Collect 10 Celestial Court flora",
      th: "สะสม 10 Celestial Court",
    },
    flavor: {
      en: "Myths gather in your garden.",
      th: "ตำนานมารวมตัวในสวนคุณ",
    },
    rewards: [{ type: "sprouts", amount: 500 }],
    condition: {
      type: "species_by_collection",
      collection: "celestial-court",
      target: 10,
    },
  },
  {
    id: "set_celestial_15",
    name: "Court Noble",
    badge: { shield: "purple-gradient", emoji: "☁️" },
    description: {
      en: "Collect 15 Celestial Court flora",
      th: "สะสม 15 Celestial Court",
    },
    flavor: {
      en: "The pantheon knows your name.",
      th: "เทพเจ้าจำชื่อคุณได้แล้ว",
    },
    rewards: [{ type: "sprouts", amount: 1500 }],
    condition: {
      type: "species_by_collection",
      collection: "celestial-court",
      target: 15,
    },
  },
  {
    id: "set_celestial_20",
    name: "Court Sovereign",
    badge: { shield: "rainbow", emoji: "☁️" },
    description: {
      en: "Collect all 20 Celestial Court flora",
      th: "สะสม 20 Celestial Court ครบ",
    },
    flavor: {
      en: "All 20 myths. You sit among gods.",
      th: "ครบ 20 คุณนั่งร่วมกับเทพเจ้าแล้ว",
    },
    rewards: [{ type: "sprouts", amount: 5000 }],
    condition: {
      type: "species_by_collection",
      collection: "celestial-court",
      target: 20,
    },
  },

  // ── Harvest: Total (6 tiers) ───────────────────────────────────────
  {
    id: "harvest_total_10",
    name: "First Harvest",
    badge: { shield: "blue", emoji: "🌾" },
    description: { en: "Harvest 10 flora", th: "เก็บเกี่ยว 10 ต้น" },
    flavor: {
      en: "Remember your very first harvest?",
      th: "จำดอกแรกที่เก็บได้ไหม?",
    },
    rewards: [{ type: "sprouts", amount: 10 }],
    condition: { type: "harvest_total", target: 10 },
  },
  {
    id: "harvest_total_50",
    name: "Budding Farmer",
    badge: { shield: "bronze", emoji: "🌾" },
    description: { en: "Harvest 50 flora", th: "เก็บเกี่ยว 50 ต้น" },
    flavor: {
      en: "The basket is getting heavy.",
      th: "ตะกร้าเริ่มหนักแล้ว",
    },
    rewards: [{ type: "sprouts", amount: 50 }],
    condition: { type: "harvest_total", target: 50 },
  },
  {
    id: "harvest_total_100",
    name: "Harvest Moon",
    badge: { shield: "silver", emoji: "🌾" },
    description: { en: "Harvest 100 flora", th: "เก็บเกี่ยว 100 ต้น" },
    flavor: {
      en: "A hundred blooms have passed through your hands.",
      th: "ร้อยดอกผ่านมือไปแล้ว",
    },
    rewards: [{ type: "sprouts", amount: 100 }],
    condition: { type: "harvest_total", target: 100 },
  },
  {
    id: "harvest_total_200",
    name: "Golden Harvest",
    badge: { shield: "gold", emoji: "🌾" },
    description: { en: "Harvest 200 flora", th: "เก็บเกี่ยว 200 ต้น" },
    flavor: {
      en: "Now that's a real gardener.",
      th: "ชาวสวนตัวจริงเลยนะเนี่ย",
    },
    rewards: [{ type: "sprouts", amount: 200 }],
    condition: { type: "harvest_total", target: 200 },
  },
  {
    id: "harvest_total_500",
    name: "Harvest Festival",
    badge: { shield: "purple-gradient", emoji: "🌾" },
    description: { en: "Harvest 500 flora", th: "เก็บเกี่ยว 500 ต้น" },
    flavor: {
      en: "Five hundred blooms — call it a festival.",
      th: "ห้าร้อยดอก จัดเทศกาลได้เลย",
    },
    rewards: [{ type: "sprouts", amount: 500 }],
    condition: { type: "harvest_total", target: 500 },
  },
  {
    id: "harvest_total_1000",
    name: "Eternal Harvest",
    badge: { shield: "rainbow", emoji: "🌾" },
    description: { en: "Harvest 1,000 flora", th: "เก็บเกี่ยว 1,000 ต้น" },
    flavor: {
      en: "A thousand. Still not stopping?",
      th: "พันดอกแล้ว ยังไม่หยุดหรอ?",
    },
    rewards: [{ type: "sprouts", amount: 1000 }],
    condition: { type: "harvest_total", target: 1000 },
  },

  // ── Harvest: By Rarity (Common) (6 tiers) ──────────────────────────
  ...([10, 50, 100, 200, 500, 1000] as const).map((n, i) => ({
    id: `harvest_common_${n}`,
    name: `Common Reaper ${n}`,
    badge: {
      shield: ["blue", "bronze", "silver", "gold", "purple-gradient", "rainbow"][i]!,
      emoji: "🌼",
    },
    description: {
      en: `Harvest ${n.toLocaleString()} common flora`,
      th: `เก็บเกี่ยวดอกไม้ธรรมดา ${n.toLocaleString()} ต้น`,
    },
    flavor: [
      { en: "Every bloom counts.", th: "ดอกเล็กๆ ก็มีค่า" },
      { en: "You're a regular now.", th: "ติดอันดับขาประจำแล้ว" },
      { en: "Common never felt so rewarding.", th: "ธรรมดาที่ไม่ธรรมดา" },
      { en: "Two hundred and still picking.", th: "สองร้อยแล้วยังเก็บได้อีก" },
      { en: "Common is your comfort zone.", th: "ดอกธรรมดาคือบ้านของคุณ" },
      {
        en: "A thousand? You must really love these.",
        th: "พันดอก! รักดอกธรรมดาจริงๆ",
      },
    ][i]!,
    rewards: [
      { type: "sprouts" as const, amount: [10, 50, 100, 200, 500, 1000][i]! },
    ],
    condition: {
      type: "harvest_by_rarity" as const,
      rarity: "common" as const,
      target: n,
    },
  })),

  // ── Harvest: By Rarity (Rare) (6 tiers) ────────────────────────────
  ...([10, 50, 100, 200, 500, 1000] as const).map((n, i) => ({
    id: `harvest_rare_${n}`,
    name: `Rare Reaper ${n}`,
    badge: {
      shield: ["blue", "bronze", "silver", "gold", "purple-gradient", "rainbow"][i]!,
      emoji: "💎",
    },
    description: {
      en: `Harvest ${n.toLocaleString()} rare flora`,
      th: `เก็บเกี่ยวดอกไม้หายาก ${n.toLocaleString()} ต้น`,
    },
    flavor: [
      { en: "Rare finds feel rarer still.", th: "ยิ่งหายาก ยิ่งภูมิใจ" },
      { en: "Rarity suits you.", th: "ความหายากเหมาะกับคุณ" },
      { en: "A hundred rares and counting.", th: "ร้อยดอกหายากแล้วนะ" },
      { en: "You have a nose for rare things.", th: "ดมกลิ่นของหายากเก่งจัง" },
      { en: "Five hundred rares — how?", th: "ห้าร้อยดอกหายาก... ยังไง?" },
      {
        en: "Rare is the new common for you.",
        th: "ของหายากกลายเป็นของธรรมดาไปแล้ว",
      },
    ][i]!,
    rewards: [
      { type: "sprouts" as const, amount: [30, 150, 300, 600, 1500, 3000][i]! },
    ],
    condition: {
      type: "harvest_by_rarity" as const,
      rarity: "rare" as const,
      target: n,
    },
  })),

  // ── Harvest: By Rarity (Legendary) (6 tiers) ───────────────────────
  ...([10, 50, 100, 200, 500, 1000] as const).map((n, i) => ({
    id: `harvest_legend_${n}`,
    name: `Legend Reaper ${n}`,
    badge: {
      shield: ["blue", "bronze", "silver", "gold", "purple-gradient", "rainbow"][i]!,
      emoji: "⭐",
    },
    description: {
      en: `Harvest ${n.toLocaleString()} legendary flora`,
      th: `เก็บเกี่ยวดอกไม้ตำนาน ${n.toLocaleString()} ต้น`,
    },
    flavor: [
      { en: "A legend in the making.", th: "ตำนานกำลังก่อตัว" },
      { en: "The legends know your name.", th: "ตำนานจำชื่อคุณได้แล้ว" },
      { en: "You bend luck to your will.", th: "คุณบิดโชคได้ตามใจ" },
      { en: "Legends bow to you.", th: "ตำนานยังต้องคารวะ" },
      { en: "Beyond legendary.", th: "เหนือกว่าตำนาน" },
      { en: "You ARE the legend.", th: "คุณนั่นแหละคือตำนาน" },
    ][i]!,
    rewards: [
      {
        type: "sprouts" as const,
        amount: [100, 500, 1000, 2000, 5000, 10000][i]!,
      },
    ],
    condition: {
      type: "harvest_by_rarity" as const,
      rarity: "legendary" as const,
      target: n,
    },
  })),

  // ── Watering (5 tiers) ─────────────────────────────────────────────
  ...([1000, 5000, 10000, 100000, 1000000] as const).map((n, i) => ({
    id: `water_${n}`,
    name: ["Drizzle", "Steady Stream", "Rainfall", "Monsoon", "Ocean"][i]!,
    badge: {
      shield: ["bronze", "silver", "gold", "purple-gradient", "rainbow"][i]!,
      emoji: "💧",
    },
    description: {
      en: `Water ${n.toLocaleString()} times`,
      th: `รดน้ำ ${n.toLocaleString()} ครั้ง`,
    },
    flavor: [
      { en: "Drip, drip, drip.", th: "หยด... หยด... หยด..." },
      { en: "The flowers are drinking well.", th: "ดอกไม้อิ่มน้ำแล้ว" },
      { en: "Your hand is permanently wet.", th: "มือคุณเปียกตลอด 24 ชั่วโมง" },
      { en: "Somewhere, a water bill is crying.", th: "บิลค่าน้ำกำลังร้องไห้" },
      { en: "You ARE the rain.", th: "คุณคือฝน" },
    ][i]!,
    rewards: [
      { type: "sprouts" as const, amount: [50, 200, 500, 2000, 10000][i]! },
    ],
    condition: { type: "total_watered" as const, target: n },
  })),

  // ── Sprout Economy: Gained (6 tiers) ───────────────────────────────
  ...([500, 1000, 5000, 10000, 100000, 1000000] as const).map((n, i) => ({
    id: `sprout_gain_${n}`,
    name: [
      "Penny Sprout",
      "Growing Fund",
      "Sprouting Rich",
      "Sprout Baron",
      "Sprout Tycoon",
      "Sprout Mogul",
    ][i]!,
    badge: {
      shield: ["blue", "bronze", "silver", "gold", "purple-gradient", "rainbow"][i]!,
      emoji: "🌱",
    },
    description: {
      en: `Earn ${n.toLocaleString()} sprouts total`,
      th: `ได้รับ 🌱 รวม ${n.toLocaleString()}`,
    },
    flavor: [
      { en: "Every sprout counts.", th: "ทุก 🌱 มีค่า" },
      {
        en: "A thousand sprouts — treat yourself.",
        th: "พันเม็ดแล้ว เลี้ยงตัวเองหน่อย",
      },
      { en: "Savings are growing.", th: "เงินเก็บกำลังงอก" },
      { en: "Sprout-rich. Plant-richer.", th: "รวย 🌱 รวยใจ" },
      { en: "A hundred thousand. Tax season?", th: "แสนเม็ด จะเสียภาษีไหม?" },
      { en: "You could buy a garden.", th: "ซื้อสวนทั้งสวนได้เลย" },
    ][i]!,
    rewards: [
      { type: "sprouts" as const, amount: [50, 100, 300, 500, 2000, 5000][i]! },
    ],
    condition: { type: "sprouts_gained" as const, target: n },
  })),

  // ── Sprout Economy: Spent (6 tiers) ────────────────────────────────
  ...([500, 1000, 5000, 10000, 100000, 1000000] as const).map((n, i) => ({
    id: `sprout_spend_${n}`,
    name: [
      "Window Shopper",
      "Casual Buyer",
      "Big Spender",
      "Shopaholic",
      "Sprout Whale",
      "Sprout Overlord",
    ][i]!,
    badge: {
      shield: ["blue", "bronze", "silver", "gold", "purple-gradient", "rainbow"][i]!,
      emoji: "💸",
    },
    description: {
      en: `Spend ${n.toLocaleString()} sprouts total`,
      th: `ใช้ 🌱 รวม ${n.toLocaleString()}`,
    },
    flavor: [
      { en: "Just looking, thanks.", th: "แค่มาดูเฉยๆ" },
      { en: "Small purchase, big smile.", th: "ซื้อนิดเดียว ยิ้มเยอะ" },
      { en: "Retail therapy activated.", th: "การช้อปคือการบำบัด" },
      {
        en: "Your wallet forgives you... barely.",
        th: "กระเป๋าให้อภัย... เกือบจะ",
      },
      { en: "A sprout whale has surfaced.", th: "วาฬ 🌱 โผล่พ้นน้ำแล้ว" },
      { en: "Money moves like fertilizer.", th: "เงินไหลเหมือนปุ๋ย" },
    ][i]!,
    rewards: [
      { type: "sprouts" as const, amount: [50, 100, 300, 500, 2000, 5000][i]! },
    ],
    condition: { type: "sprouts_spent" as const, target: n },
  })),

  // ── Streaks (5 tiers) ──────────────────────────────────────────────
  ...([7, 14, 30, 90, 365] as const).map((n, i) => ({
    id: `streak_${n}`,
    name: [
      "Week Warrior",
      "Fortnight Flora",
      "Monthly Devotion",
      "Seasonal Spirit",
      "Eternal Flame",
    ][i]!,
    badge: {
      shield: ["bronze", "silver", "gold", "purple-gradient", "rainbow"][i]!,
      emoji: "🔥",
    },
    description: { en: `${n}-day streak`, th: `เข้าเล่นติดต่อกัน ${n} วัน` },
    flavor: [
      {
        en: "A week without missing. Impressive.",
        th: "หนึ่งสัปดาห์ไม่ขาด เจ๋งมาก",
      },
      {
        en: "Two weeks in — it's a habit now.",
        th: "สองสัปดาห์ กลายเป็นนิสัยแล้ว",
      },
      { en: "A month of devotion.", th: "หนึ่งเดือนแห่งความตั้งใจ" },
      {
        en: "Three months. Don't break now!",
        th: "สามเดือนแล้ว อย่าเผลอหยุดนะ!",
      },
      { en: "A full year. You're unstoppable.", th: "ครบปี คุณหยุดไม่ได้แล้ว" },
    ][i]!,
    rewards: [
      { type: "sprouts" as const, amount: [50, 100, 300, 1000, 5000][i]! },
    ],
    condition: { type: "streak" as const, target: n },
  })),

  // ── Combos (3 levels × 4 tiers) ────────────────────────────────────
  ...([10, 15, 20] as const).flatMap((level) =>
    ([100, 200, 500, 1000] as const).map((n, i) => ({
      id: `combo${level}_${n}`,
      name: `${level === 10 ? "Combo" : level === 15 ? "Surge" : "Thunder"} ${["Starter", "Regular", "Veteran", "Master"][i]!}`,
      badge: {
        shield: ["silver", "gold", "purple-gradient", "rainbow"][i]!,
        emoji: "⚡",
      },
      description: {
        en: `Hit ${level}x combo ${n.toLocaleString()} times`,
        th: `ทำ Combo ${level}x สะสม ${n.toLocaleString()} ครั้ง`,
      },
      flavor:
        level === 10
          ? [
              { en: "Combos feel good.", th: "Combo รู้สึกดีเนอะ" },
              { en: "You're finding the rhythm.", th: "เริ่มจับจังหวะได้แล้ว" },
              {
                en: "Combo is your middle name.",
                th: "Combo คือชื่อกลางของคุณ",
              },
              { en: "A thousand combos. Effortless.", th: "พัน Combo แบบชิลๆ" },
            ][i]!
          : level === 15
            ? [
                {
                  en: "Surge! Feels electric.",
                  th: "Surge! รู้สึกเหมือนไฟช็อต",
                },
                { en: "The field is humming.", th: "สนามกำลังสั่นสะเทือน" },
                { en: "Surge protocol engaged.", th: "เปิดโหมด Surge เต็มที่" },
                {
                  en: "A thousand surges — pure voltage.",
                  th: "พัน Surge พลังเต็มร้อย",
                },
              ][i]!
            : [
                { en: "Thunder rolls.", th: "เสียงฟ้าคำราม" },
                { en: "The storm approaches.", th: "พายุกำลังมา" },
                {
                  en: "Lightning strikes twice... and twice again.",
                  th: "ฟ้าผ่าซ้ำ ซ้ำ ซ้ำ",
                },
                { en: "You ARE the storm.", th: "คุณคือพายุ" },
              ][i]!,
      rewards: [
        {
          type: "sprouts" as const,
          amount:
            level === 10
              ? [50, 100, 200, 500][i]!
              : level === 15
                ? [100, 200, 500, 1000][i]!
                : [200, 500, 1000, 2000][i]!,
        },
      ],
      condition: { type: "combo" as const, level, target: n },
    })),
  ),

  // ── Seed Packets: Total (5 tiers) ──────────────────────────────────
  ...([1, 10, 50, 100, 500] as const).map((n, i) => ({
    id: `seedpacket_total_${n}`,
    name: [
      "First Unboxing",
      "Pack Opener",
      "Pack Enthusiast",
      "Pack Collector",
      "Pack Addict",
    ][i]!,
    badge: {
      shield: ["bronze", "silver", "gold", "purple-gradient", "rainbow"][i]!,
      emoji: "🎁",
    },
    description: {
      en: `Open ${n.toLocaleString()} seed packet${n > 1 ? "s" : ""}`,
      th: `เปิดซองเมล็ดพันธุ์ ${n.toLocaleString()} ซอง`,
    },
    flavor: [
      { en: "The first unboxing feeling.", th: "ความรู้สึกเปิดซองแรก" },
      { en: "Ten packs deep.", th: "เปิดไปสิบซองแล้ว" },
      {
        en: "The crinkle of packets is ASMR.",
        th: "เสียงฉีกซองคือ ASMR ของฉัน",
      },
      { en: "You hoard packets like treasure.", th: "สะสมซองเหมือนเก็บสมบัติ" },
      {
        en: "Five hundred opens. Tell me it's not fun.",
        th: "เปิดห้าร้อยซอง บอกสิว่าไม่สนุก",
      },
    ][i]!,
    rewards: [
      { type: "sprouts" as const, amount: [10, 50, 200, 500, 2000][i]! },
    ],
    condition: {
      type: "seed_packets" as const,
      tier: "total" as const,
      target: n,
    },
  })),

  // ── Seed Packets: Common (4 tiers) ─────────────────────────────────
  ...([1, 10, 50, 100] as const).map((n, i) => ({
    id: `seedpacket_common_${n}`,
    name: [
      "Common Unboxing",
      "Common Pack Fan",
      "Common Pack Pro",
      "Common Pack Master",
    ][i]!,
    badge: {
      shield: ["silver", "gold", "purple-gradient", "rainbow"][i]!,
      emoji: "🌼",
    },
    description: {
      en: `Open ${n.toLocaleString()} common packet${n > 1 ? "s" : ""}`,
      th: `เปิดซองธรรมดา ${n.toLocaleString()} ซอง`,
    },
    flavor: [
      { en: "Your first common packet.", th: "ซองธรรมดาซองแรก" },
      { en: "Commons add up.", th: "ธรรมดาก็ค่อยๆ สะสม" },
      { en: "Common packets never get old.", th: "เปิดกี่รอบก็ไม่เบื่อ" },
      { en: "A hundred common opens.", th: "ร้อยซองธรรมดาแล้ว" },
    ][i]!,
    rewards: [{ type: "sprouts" as const, amount: [10, 50, 200, 500][i]! }],
    condition: {
      type: "seed_packets" as const,
      tier: "common" as const,
      target: n,
    },
  })),

  // ── Seed Packets: Rare (4 tiers) ───────────────────────────────────
  ...([1, 10, 50, 100] as const).map((n, i) => ({
    id: `seedpacket_rare_${n}`,
    name: [
      "Rare Unboxing",
      "Rare Pack Fan",
      "Rare Pack Pro",
      "Rare Pack Master",
    ][i]!,
    badge: {
      shield: ["silver", "gold", "purple-gradient", "rainbow"][i]!,
      emoji: "💎",
    },
    description: {
      en: `Open ${n.toLocaleString()} rare packet${n > 1 ? "s" : ""}`,
      th: `เปิดซองหายาก ${n.toLocaleString()} ซอง`,
    },
    flavor: [
      { en: "A rare pack feels heavier.", th: "ซองหายากหนักกว่านะ" },
      { en: "Ten rare opens. Thrilling.", th: "สิบซองหายาก มันส์จริง" },
      { en: "Rare packets, rare dopamine.", th: "ซองหายาก โดปามีนหายาก" },
      {
        en: "A hundred rare opens. Still excited?",
        th: "ร้อยซองแล้วยังตื่นเต้นอยู่ไหม?",
      },
    ][i]!,
    rewards: [{ type: "sprouts" as const, amount: [20, 100, 500, 1000][i]! }],
    condition: {
      type: "seed_packets" as const,
      tier: "rare" as const,
      target: n,
    },
  })),

  // ── Seed Packets: Legendary (4 tiers) ──────────────────────────────
  ...([1, 10, 50, 100] as const).map((n, i) => ({
    id: `seedpacket_legendary_${n}`,
    name: [
      "Legendary Unboxing",
      "Legendary Pack Fan",
      "Legendary Pack Pro",
      "Legendary Pack Master",
    ][i]!,
    badge: {
      shield: ["silver", "gold", "purple-gradient", "rainbow"][i]!,
      emoji: "⭐",
    },
    description: {
      en: `Open ${n.toLocaleString()} legendary packet${n > 1 ? "s" : ""}`,
      th: `เปิดซองตำนาน ${n.toLocaleString()} ซอง`,
    },
    flavor: [
      {
        en: "First legendary pack. Gold shimmer.",
        th: "ซองตำนานซองแรก ประกายทอง",
      },
      {
        en: "Ten legendary packs. Status: flex.",
        th: "สิบซองตำนาน สเตตัส: แฟลกซ์",
      },
      {
        en: "Fifty legendary packs. Who are you?",
        th: "ห้าสิบซองตำนาน คุณคือใคร?",
      },
      {
        en: "A hundred legendary opens. Unreal.",
        th: "ร้อยซองตำนาน เหลือเชื่อ",
      },
    ][i]!,
    rewards: [{ type: "sprouts" as const, amount: [50, 300, 1500, 3000][i]! }],
    condition: {
      type: "seed_packets" as const,
      tier: "legendary" as const,
      target: n,
    },
  })),

  // ── Daily Mission Completion (7 tiers) ─────────────────────────────
  // Max 5 missions/day — Task God (1,800) caps at ~360 days (~1 year) of
  // perfect play so even the top tier stays reachable within a year.
  ...([25, 75, 200, 400, 750, 1200, 1800] as const).map((n, i) => ({
    id: `mission_${n}`,
    name: [
      "Task Starter",
      "Task Regular",
      "Task Veteran",
      "Task Expert",
      "Task Master",
      "Task Legend",
      "Task God",
    ][i]!,
    badge: {
      shield: ["green", "blue", "bronze", "silver", "gold", "purple-gradient", "rainbow"][i]!,
      emoji: "📋",
    },
    description: {
      en: `Complete ${n.toLocaleString()} missions`,
      th: `ทำภารกิจสำเร็จ ${n.toLocaleString()} ครั้ง`,
    },
    flavor: [
      { en: "The todo list is shrinking.", th: "To-do list สั้นลงแล้ว" },
      { en: "Task runner engaged.", th: "โหมดทำภารกิจเปิด" },
      { en: "Two hundred tasks complete.", th: "ทำภารกิจครบสองร้อยแล้ว" },
      { en: "You could run an office.", th: "เปิดออฟฟิศได้เลย" },
      { en: "Task God mode.", th: "โหมดเทพแห่งภารกิจ" },
      { en: "Missions are afraid of you.", th: "ภารกิจกลัวคุณ" },
      { en: "A full year of perfect missions. Take a bow.", th: "ครบหนึ่งปีเต็มของภารกิจ คำนับเลย" },
    ][i]!,
    rewards: [
      {
        type: "sprouts" as const,
        amount: [50, 100, 300, 1000, 2000, 5000, 10000][i]!,
      },
    ],
    condition: { type: "missions_completed" as const, target: n },
  })),

  // ── All Daily Mission Completion (5 tiers) ─────────────────────────
  ...([10, 30, 90, 365, 1000] as const).map((n, i) => ({
    id: `daily_all_${n}`,
    name: [
      "Devoted 10",
      "Devoted 30",
      "Devoted 90",
      "Devoted 365",
      "Devoted 1000",
    ][i]!,
    badge: {
      shield: ["bronze", "silver", "gold", "purple-gradient", "rainbow"][i]!,
      emoji: "🌟",
    },
    description: {
      en: `Complete all daily missions ${n.toLocaleString()} days`,
      th: `ทำภารกิจประจำวันครบทั้งหมด ${n.toLocaleString()} วัน`,
    },
    flavor: [
      { en: "Ten perfect days.", th: "สิบวันสมบูรณ์แบบ" },
      { en: "A whole month of 100%.", th: "หนึ่งเดือนเต็มร้อย" },
      { en: "Ninety days of devotion.", th: "เก้าสิบวันแห่งความทุ่มเท" },
      { en: "A full year of perfect dailies.", th: "ครบปีทำภารกิจเต็ม" },
      { en: "A thousand full days. Unreal.", th: "พันวันเต็ม เกินคำบรรยาย" },
    ][i]!,
    rewards: [
      { type: "sprouts" as const, amount: [50, 200, 500, 2000, 5000][i]! },
    ],
    condition: { type: "all_daily_completed" as const, target: n },
  })),

  // ── Secrets (non-tiered — all use black shield) ────────────────────
  {
    id: "secret_high_noon",
    name: "It's High Noon",
    badge: { shield: "black", emoji: "🌞" },
    description: {
      en: "Watering at high noon. Aren't you hungry?",
      th: "รดน้ำตอนเที่ยงพอดี หิวข้าวยัง?",
    },
    rewards: [{ type: "sprouts", amount: 100 }],
    condition: { type: "secret" },
    secret: true,
  },
  {
    id: "secret_midnight_mass",
    name: "Midnight Mass",
    badge: { shield: "black", emoji: "🌙" },
    description: {
      en: "Watering at midnight. Shouldn't you be sleeping?",
      th: "รดน้ำตอนเที่ยงคืนพอดี ไม่นอนหรอ?",
    },
    rewards: [{ type: "sprouts", amount: 100 }],
    condition: { type: "secret" },
    secret: true,
  },
];

/** Fast lookup by id. */
export const ACHIEVEMENTS_BY_ID = new Map(ACHIEVEMENTS.map((a) => [a.id, a]));
