import type { Language } from "@florify/shared";

/**
 * Client-side i18n dictionary. Flat dot-path keys keep the `t()` call
 * site simple and let TypeScript infer the union of valid keys.
 *
 * Scope of this first pass: PlotView, Gallery, and the Settings sheet.
 * Secondary surfaces (Florist Card, Debug, overlays) still render their
 * original Thai strings and will be migrated incrementally.
 */
export const dict = {
  th: {
    // ── PlotView ───────────────────────────────
    "plot.plant": "เริ่มปลูก",
    "plot.water": "รดน้ำ",
    "plot.wateredCount": "{count}/{total} หยด",
    "plot.openGallery": "เปิดแกลเลอรี",
    "plot.openFloristCard": "เปิดการ์ดนักจัดดอกไม้",
    "plot.openSettings": "เปิดตั้งค่า",
    "plot.openGuideBook": "เปิดคู่มือ",
    "plot.switchLanguage": "เปลี่ยนภาษา",

    // ── Gallery ────────────────────────────────
    "gallery.title": "Floripedia",
    "gallery.back": "กลับไปหน้าหลัก",
    "gallery.harvested": "เก็บเกี่ยวแล้ว",
    "gallery.speciesUnlocked": "สายพันธุ์ที่ปลดล็อก",
    "gallery.empty": "ยังไม่มีต้นไม้ที่เก็บไว้ — เริ่มปลูกเลย",
    "gallery.rarityProgress": "ความคืบหน้าตามความหายาก",
    "gallery.searchPlaceholder": "ค้นหาชื่อ, คำอธิบาย, collection…",
    "gallery.filterStatus": "สถานะ",
    "gallery.filter.all": "ทั้งหมด",
    "gallery.filter.found": "เจอแล้ว",
    "gallery.filter.missing": "ยังไม่เจอ",
    "gallery.filterRarity": "ความหายาก",
    "gallery.rarity.common": "ธรรมดา",
    "gallery.rarity.rare": "หายาก",
    "gallery.rarity.legendary": "ตำนาน",
    "gallery.filterCollection": "Collection",
    "gallery.resetFilters": "รีเซ็ตตัวกรอง",
    "gallery.showing": "แสดง {count} จาก {total} สายพันธุ์",
    "gallery.noResults": "ไม่พบผลลัพธ์ — ลองปรับตัวกรองหรือคำค้น",

    // ── Settings sheet ─────────────────────────
    "settings.title": "ตั้งค่า",
    "settings.close": "ปิด",

    "settings.account": "บัญชี",
    "settings.yourName": "ชื่อของคุณ",
    "settings.namePlaceholder": "Guest",
    "settings.nameHint":
      "ชื่อนี้จะโชว์บน Florist Card ของคุณ (สูงสุด {max} ตัวอักษร)",

    "settings.preferences": "การตั้งค่า",
    "settings.sound": "เสียง",
    "settings.soundHint": "เปิดเสียงเอฟเฟกต์ในเกม (เร็วๆ นี้)",
    "settings.haptics": "Haptics (สั่น)",
    "settings.hapticsHint": "Android รองรับ · iOS ไม่รองรับ",
    "settings.notifications": "แจ้งเตือนรดน้ำ",
    "settings.notificationsHint": "ทำงานเฉพาะตอน tab เปิดอยู่ (ไม่ใช่ PWA)",
    "settings.notificationsDenied":
      "ไม่ได้รับอนุญาต — ลองเปิดใน browser settings",

    "settings.saveData": "ข้อมูลบันทึก",
    "settings.saveDataHint":
      "สำรองข้อมูลเป็นรหัสตัวอักษร คัดลอกเก็บไว้ที่ไหนก็ได้ (โน้ต, chat, อีเมล) แล้วนำกลับมาใส่ทีหลังได้",
    "settings.exportCopy": "คัดลอก",
    "settings.exportCopied": "คัดลอกรหัส save แล้ว — เก็บไว้ที่ปลอดภัย",
    "settings.exportManualPrompt": "คัดลอกรหัสนี้:",
    "settings.exportFailed": "Export ล้มเหลว: {reason}",
    "settings.import": "Import",
    "settings.cancel": "ยกเลิก",
    "settings.importPlaceholder": "วางรหัส save ที่นี่…",
    "settings.importConfirm":
      "แทนที่ข้อมูลปัจจุบันทั้งหมด? การกระทำนี้ย้อนกลับไม่ได้",
    "settings.importSubmit": "นำเข้าและแทนที่",
    "settings.importSuccess": "นำเข้าข้อมูลเรียบร้อย กำลังรีโหลด…",

    "settings.dangerZone": "เขตอันตราย",
    "settings.dangerHint": "รีเซ็ตต้นไม้ทุกต้น สถิติ และ streak ทั้งหมด",
    "settings.resetAll": "รีเซ็ตข้อมูลทั้งหมด",
    "settings.resetConfirm":
      "รีเซ็ตต้นไม้ทั้งหมดและสถิติ? การกระทำนี้ย้อนกลับไม่ได้",
    "settings.resetSuccess": "รีเซ็ตข้อมูลเรียบร้อย",

    // ── Guide Book ─────────────────────────────
    "guide.title": "คู่มือเล่นเกม",
    "guide.close": "ปิด",
    "guide.welcome.title": "ยินดีต้อนรับสู่ Florify",
    "guide.welcome.body":
      "Florify คือสวนเล็กๆ ที่ค่อยๆ เติบโตไปพร้อมคุณ ปลูก รดน้ำ และสะสมดอกไม้จากทั้งหมด {total} สายพันธุ์ เล่นวันละนิด ไม่ต้องรีบ",
    "guide.howto.title": "วิธีการเล่น",
    "guide.howto.plant.title": "1. ปลูก",
    "guide.howto.plant.body":
      "แตะปุ่มด้านล่างเพื่อสุ่มเมล็ดพันธุ์ใหม่ มีต้นไม้ที่กำลังเติบโตได้ทีละ 1 ต้น",
    "guide.howto.water.title": "2. รดน้ำ",
    "guide.howto.water.body":
      "แตะรดน้ำแต่ละครั้งใช้ 1 หยด สะสมได้สูงสุด 50 หยด (ฟื้นฟู 1 หยดทุก 2 นาที) แต่ละต้นใช้ 12–20 หยด",
    "guide.howto.harvest.title": "3. เก็บเกี่ยว",
    "guide.howto.harvest.body":
      "เมื่อรดน้ำครบ ต้นไม้จะบานและถูกเก็บเข้าแกลเลอรี ปลดล็อคสายพันธุ์ใหม่ให้คุณ",
    "guide.rarity.title": "ระดับความหายาก",
    "guide.rarity.hint":
      "ทุกครั้งที่ปลูก เกมจะสุ่มความหายากตามโอกาสด้านล่าง แล้วค่อยสุ่มสายพันธุ์ในกลุ่มนั้น",
    "guide.rarity.common": "ธรรมดา",
    "guide.rarity.rare": "หายาก",
    "guide.rarity.legendary": "ตำนาน",
    "guide.rarity.speciesCount": "{count} สายพันธุ์",
    "guide.features.title": "ฟีเจอร์อื่นๆ",
    "guide.features.gallery.title": "แกลเลอรี",
    "guide.features.gallery.body":
      "ดูต้นไม้ทุกต้นที่เก็บเกี่ยวแล้ว พร้อมเรื่องราวของแต่ละสายพันธุ์",
    "guide.features.passport.title": "การ์ดนักจัดดอกไม้",
    "guide.features.passport.body":
      "การ์ดพาสปอร์ตสรุปสถิติและอันดับของคุณ แชร์ให้เพื่อนดูได้",
    "guide.features.streak.title": "สตรีครายวัน",
    "guide.features.streak.body": "กลับมาเล่นต่อเนื่องทุกวันเพื่อสะสมสตรีค",
    "guide.features.rank.title": "อันดับนักจัดดอกไม้",
    "guide.features.rank.body":
      "5 ระดับ: Seedling → Apprentice (20+) → Gardener (75+) → Master (150+) → Legend (250+)",
    "guide.driedLeaves.title": "🍂 ใบไม้แห้ง",
    "guide.driedLeaves.body":
      "เก็บเกี่ยวต้นไม้ที่มีแล้วจะได้ใบไม้แห้ง สะสมครบ {threshold} ใบจะได้สายพันธุ์ใหม่ที่ยังไม่เคยมี 1 ต้น ⚠️ ใบไม้แห้งจะรีเซ็ตเป็น 0 ทุกครั้งที่ได้สายพันธุ์ใหม่",
    "guide.driedLeaves.rates":
      "+{common} ธรรมดา · +{rare} หายาก · +{legendary} ตำนาน",
    "guide.driedLeaves.progress": "🍂 {current} / {threshold}",
    "harvest.driedLeavesGained": "🍂 +{points}",
    "harvest.driedLeavesReward": "🍂 ได้สายพันธุ์ใหม่!",
    "guide.save.title": "การเซฟเกม",
    "guide.save.auto.title": "บันทึกอัตโนมัติ",
    "guide.save.auto.body":
      "ทุกการปลูก รดน้ำ เก็บเกี่ยว จะถูกเซฟลงเบราว์เซอร์ของคุณทันที ไม่มีเซิร์ฟเวอร์ ข้อมูลอยู่ในเครื่องคุณล้วนๆ",
    "guide.save.warning.title": "⚠️ ข้อมูลอยู่แค่ในเบราว์เซอร์นี้",
    "guide.save.warning.body":
      "ถ้าเคลียร์ข้อมูลเบราว์เซอร์ เปลี่ยนอุปกรณ์ หรือใช้ incognito ข้อมูลจะหายหมด — สำรองไว้ก่อนด้วยรหัสเซฟ",
    "guide.save.backup.title": "สำรอง / กู้คืนด้วยรหัสเซฟ",
    "guide.save.backup.body":
      "ไปที่ตั้งค่า → ข้อมูลบันทึก → คัดลอกรหัส แล้วเก็บไว้ในโน้ตหรือแชท ถ้าอยากย้ายเครื่องก็วางรหัสกลับเข้าไปที่ Import",
    "guide.daily.title": "เช็คอิน & ภารกิจประจำวัน",
    "guide.daily.body":
      "เช็คอินรับ 30 หยด + โบนัสสตรีคสูงสุด +20 · ภารกิจ 5 อัน (10P/อัน) สะสมครบไมล์สโตนได้หยดเพิ่ม · รีเซ็ตทุกเที่ยงคืน",
    "guide.developer.title": "พัฒนาโดย",
    "guide.developer.body": "เกมนี้สร้างโดย Zeze — ดูผลงานอื่นๆ ได้ที่",
    "guide.developer.linkLabel": "zeze.app/portfolio",

    // ── Welcome dialogue ────────────────────────
    "welcome.title": "ยินดีต้อนรับสู่ Florify",
    "welcome.subtitle": "สวนเล็กๆ ที่เติบโตไปพร้อมคุณ",
    "welcome.nameLabel": "ตั้งชื่อของคุณ",
    "welcome.namePlaceholder": "ชื่อของคุณ",
    "welcome.step1.title": "เริ่มปลูก",
    "welcome.step1.body": "แตะปุ่มด้านล่างเพื่อสุ่มเมล็ดพันธุ์ใหม่",
    "welcome.step2.title": "รดน้ำ",
    "welcome.step2.body": "รดน้ำทีละหยด ดูต้นไม้เติบโตผ่าน 3 ระยะ",
    "welcome.step3.title": "เก็บเกี่ยว",
    "welcome.step3.body": "รดครบ ต้นไม้บาน เก็บเข้าแกลเลอรีของคุณ",
    "welcome.rarity": "สะสม {total} สายพันธุ์ — ธรรมดา หายาก และตำนาน",
    "welcome.next": "ถัดไป",
    "welcome.start": "เริ่มปลูกต้นแรก!",
    "welcome.skip": "ข้าม",
    "welcome.browserSave.title": "ข้อมูลเซฟบนเบราว์เซอร์",
    "welcome.browserSave.body":
      "ข้อมูลเกมจะเซฟอยู่บนเบราว์เซอร์นี้เท่านั้น — แต่สามารถ Export ได้ในหน้าตั้งค่า",
    "settings.replayWelcome": "ดู Welcome อีกครั้ง",

    // ── Daily Missions ─────────────────────────
    "plot.openMissions": "เปิดภารกิจประจำวัน",
    "missions.title": "ภารกิจประจำวัน",
    "missions.close": "ปิด",
    "missions.resetIn": "รีเซ็ตใน {time}",
    "missions.claimAll": "รับรางวัลทั้งหมด",
    "missions.claimed": "รับแล้ว",
    "missions.noClaim": "ทำภารกิจเพื่อรับรางวัล",
    "missions.drops": "{drops} หยด",
    "missions.dropsAwarded": "ได้รับ {drops} หยด!",
    "missions.water": "รดน้ำ {target} ครั้ง",
    "missions.plant": "ปลูกต้นไม้ {target} ต้น",
    "missions.harvest": "เก็บเกี่ยว {target} ต้น",
    "missions.harvest_rare": "เก็บเกี่ยวสายพันธุ์หายาก {target} ต้น",
    "missions.visit_floripedia": "เยี่ยมชมแกลเลอรี",
    "missions.share_florist_card": "แชร์ Florist Card",

    // ── Daily Check-in ─────────────────────────
    "checkin.title": "เช็คอินรายวัน",
    "checkin.streak": "Day {count}",
    "checkin.base": "เช็คอิน",
    "checkin.bonus": "โบนัส",
    "checkin.total": "รวม",
    "checkin.claim": "รับรางวัล",
    "checkin.claimed": "รับแล้ววันนี้",
    "checkin.maxBonus": "โบนัสเต็ม!",

    // ── Harvest overlay ────────────────────────
    "harvest.headline.common": "ต้นไม้ใหม่ 🌿",
    "harvest.headline.rare": "พบของหายาก ✨",
    "harvest.headline.legendary": "บานสะพรั่งในตำนาน 🌼",
    "harvest.waterings": "ใช้ {count} หยด · เก็บเข้า Gallery แล้ว",
    "harvest.collect": "เก็บเข้า Gallery",
    "harvest.share": "แชร์",

    // ── Floripedia (public species page) ───────
    "floripedia.title": "Floripedia",
    "floripedia.notFound": "ไม่พบสายพันธุ์นี้",
    "floripedia.home": "กลับหน้าหลัก",
    "floripedia.share": "แชร์หน้านี้",
    "floripedia.shareTitle": "Florify — {name}",
    "floripedia.shareText": "ฉันเจอ {name} ใน Florify 🌿",
    "floripedia.copied": "คัดลอกลิงก์แล้ว",
    "floripedia.harvestedBy": "เก็บเกี่ยวโดย {name}",
  },
  en: {
    // ── PlotView ───────────────────────────────
    "plot.plant": "Plant",
    "plot.water": "Water",
    "plot.wateredCount": "{count}/{total} drops",
    "plot.openGallery": "Open Gallery",
    "plot.openFloristCard": "Open Florist Card",
    "plot.openSettings": "Open Settings",
    "plot.openGuideBook": "Open Guide Book",
    "plot.switchLanguage": "Switch language",

    // ── Gallery ────────────────────────────────
    "gallery.title": "Floripedia",
    "gallery.back": "Back to home",
    "gallery.harvested": "harvested",
    "gallery.speciesUnlocked": "species unlocked",
    "gallery.empty": "No saved plants yet — start growing",
    "gallery.rarityProgress": "Rarity Progress",
    "gallery.searchPlaceholder": "Search name, description, collection…",
    "gallery.filterStatus": "Status",
    "gallery.filter.all": "All",
    "gallery.filter.found": "Found",
    "gallery.filter.missing": "Not found",
    "gallery.filterRarity": "Rarity",
    "gallery.rarity.common": "Common",
    "gallery.rarity.rare": "Rare",
    "gallery.rarity.legendary": "Legendary",
    "gallery.filterCollection": "Collection",
    "gallery.resetFilters": "Reset filters",
    "gallery.showing": "Showing {count} of {total} species",
    "gallery.noResults": "No results — try adjusting filters or search",

    // ── Settings sheet ─────────────────────────
    "settings.title": "Settings",
    "settings.close": "Close",

    "settings.account": "Account",
    "settings.yourName": "Your name",
    "settings.namePlaceholder": "Guest",
    "settings.nameHint": "Shown on your Florist Card (max {max} characters)",

    "settings.preferences": "Preferences",
    "settings.sound": "Sound",
    "settings.soundHint": "In-game sound effects (coming soon)",
    "settings.haptics": "Haptics",
    "settings.hapticsHint": "Supported on Android · not on iOS",
    "settings.notifications": "Drop reminders",
    "settings.notificationsHint": "Only fires while the tab is open (not PWA)",
    "settings.notificationsDenied":
      "Permission denied — enable in browser settings",

    "settings.saveData": "Save data",
    "settings.saveDataHint":
      "Back up your progress as a text code. Stash it anywhere (notes, chat, email) and restore later.",
    "settings.exportCopy": "Export (copy code)",
    "settings.exportCopied": "Save code copied — keep it somewhere safe",
    "settings.exportManualPrompt": "Copy this code:",
    "settings.exportFailed": "Export failed: {reason}",
    "settings.import": "Import",
    "settings.cancel": "Cancel",
    "settings.importPlaceholder": "Paste save code here…",
    "settings.importConfirm":
      "Replace all current data? This cannot be undone.",
    "settings.importSubmit": "Import and replace",
    "settings.importSuccess": "Imported successfully — reloading…",

    "settings.dangerZone": "Danger zone",
    "settings.dangerHint": "Reset every plant, stat, and streak",
    "settings.resetAll": "Reset all data",
    "settings.resetConfirm":
      "Reset all plants and stats? This cannot be undone.",
    "settings.resetSuccess": "Data reset",

    // ── Guide Book ─────────────────────────────
    "guide.title": "Guide Book",
    "guide.close": "Close",
    "guide.welcome.title": "Welcome to Florify",
    "guide.welcome.body":
      "Florify is a quiet little garden that grows with you. Plant, water, and collect flowers from a catalog of {total} species. A few minutes a day is plenty — no rush.",
    "guide.howto.title": "How to play",
    "guide.howto.plant.title": "1. Plant",
    "guide.howto.plant.body":
      "Tap the button at the bottom to sow a new seed. Only one tree can be growing at a time.",
    "guide.howto.water.title": "2. Water",
    "guide.howto.water.body":
      "Each tap costs 1 water drop. You can hold up to 50 drops (1 drop regenerates every 2 minutes). Each tree needs 12–20 drops.",
    "guide.howto.harvest.title": "3. Harvest",
    "guide.howto.harvest.body":
      "Once fully watered, the tree blooms and is added to your Gallery, unlocking a new species.",
    "guide.rarity.title": "Rarity tiers",
    "guide.rarity.hint":
      "Each time you plant, the game rolls a rarity by the odds below, then picks a species from that pool.",
    "guide.rarity.common": "Common",
    "guide.rarity.rare": "Rare",
    "guide.rarity.legendary": "Legendary",
    "guide.rarity.speciesCount": "{count} species",
    "guide.features.title": "Other features",
    "guide.features.gallery.title": "Gallery",
    "guide.features.gallery.body":
      "Browse every tree you have harvested, complete with lore for each species.",
    "guide.features.passport.title": "Florist Card",
    "guide.features.passport.body":
      "A passport card summarizing your stats and rank, shareable with friends.",
    "guide.features.streak.title": "Daily streak",
    "guide.features.streak.body":
      "Come back each day to keep your streak alive.",
    "guide.features.rank.title": "Florist rank",
    "guide.features.rank.body":
      "Five tiers: Seedling → Apprentice (20+) → Gardener (75+) → Master (150+) → Legend (250+)",
    "guide.driedLeaves.title": "🍂 Dried Leaves",
    "guide.driedLeaves.body":
      "Harvesting a species you already own earns dried leaves. Collect {threshold} to receive a new species you have never had. ⚠️ Dried leaves reset to 0 every time you obtain a new species.",
    "guide.driedLeaves.rates":
      "+{common} common · +{rare} rare · +{legendary} legendary",
    "guide.driedLeaves.progress": "🍂 {current} / {threshold}",
    "harvest.driedLeavesGained": "🍂 +{points}",
    "harvest.driedLeavesReward": "🍂 New species unlocked!",
    "guide.save.title": "Saving your game",
    "guide.save.auto.title": "Autosave",
    "guide.save.auto.body":
      "Every plant, water, and harvest is saved to your browser instantly. No server — your data lives on your device only.",
    "guide.save.warning.title": "⚠️ Your data only lives in this browser",
    "guide.save.warning.body":
      "Clearing browser data, switching devices, or using incognito will wipe everything — back up with a save code first.",
    "guide.save.backup.title": "Back up / restore with a save code",
    "guide.save.backup.body":
      "Open Settings → Save data → copy the code and keep it in a note or chat. To move to another device, paste the code into Import.",
    "guide.daily.title": "Check-in & Daily Missions",
    "guide.daily.body":
      "Check in for 30 drops + streak bonus up to +20 · 5 missions (10P each), hit milestones for bonus drops · Resets at midnight",
    "guide.developer.title": "Made by",
    "guide.developer.body": "Built by Zeze — see other projects at",
    "guide.developer.linkLabel": "zeze.app/portfolio",

    // ── Welcome dialogue ────────────────────────
    "welcome.title": "Welcome to Florify",
    "welcome.subtitle": "A quiet little garden that grows with you",
    "welcome.nameLabel": "Choose your name",
    "welcome.namePlaceholder": "Your name",
    "welcome.step1.title": "Plant",
    "welcome.step1.body": "Tap the button below to sow a random seed",
    "welcome.step2.title": "Water",
    "welcome.step2.body":
      "Water drop by drop and watch it grow through 3 stages",
    "welcome.step3.title": "Harvest",
    "welcome.step3.body": "Fully watered? It blooms and joins your Gallery",
    "welcome.rarity": "Collect {total} species — common, rare, and legendary",
    "welcome.next": "Next",
    "welcome.start": "Plant my first tree!",
    "welcome.skip": "Skip",
    "welcome.browserSave.title": "Browser-only save",
    "welcome.browserSave.body":
      "Your game data is saved in this browser only — but you can export it anytime in Settings",
    "settings.replayWelcome": "Replay Welcome",

    // ── Daily Missions ─────────────────────────
    "plot.openMissions": "Open Daily Missions",
    "missions.title": "Daily Missions",
    "missions.close": "Close",
    "missions.resetIn": "Resets in {time}",
    "missions.claimAll": "Claim All",
    "missions.claimed": "Claimed",
    "missions.noClaim": "Complete missions for rewards",
    "missions.drops": "{drops} drops",
    "missions.dropsAwarded": "Received {drops} drops!",
    "missions.water": "Water {target} times",
    "missions.plant": "Plant {target} trees",
    "missions.harvest": "Harvest {target} trees",
    "missions.harvest_rare": "Harvest {target} rare species",
    "missions.visit_floripedia": "Visit Gallery",
    "missions.share_florist_card": "Share Florist Card",

    // ── Daily Check-in ─────────────────────────
    "checkin.title": "Daily Check-in",
    "checkin.streak": "Day {count}",
    "checkin.base": "Check-in",
    "checkin.bonus": "Bonus",
    "checkin.total": "Total",
    "checkin.claim": "Claim",
    "checkin.claimed": "Claimed today",
    "checkin.maxBonus": "Max bonus!",

    // ── Harvest overlay ────────────────────────
    "harvest.headline.common": "New addition 🌿",
    "harvest.headline.rare": "Rare find ✨",
    "harvest.headline.legendary": "Legendary bloom 🌼",
    "harvest.waterings": "{count} drops used · Added to Gallery",
    "harvest.collect": "Add to Gallery",
    "harvest.share": "Share",

    // ── Floripedia (public species page) ───────
    "floripedia.title": "Floripedia",
    "floripedia.notFound": "Species not found",
    "floripedia.home": "Back to home",
    "floripedia.share": "Share this page",
    "floripedia.shareTitle": "Florify — {name}",
    "floripedia.shareText": "I found {name} in Florify 🌿",
    "floripedia.copied": "Link copied",
    "floripedia.harvestedBy": "Harvested by {name}",
  },
} as const satisfies Record<Language, Record<string, string>>;

export type DictKey = keyof (typeof dict)["th"];
