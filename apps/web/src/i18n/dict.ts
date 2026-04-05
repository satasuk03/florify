import type { Language } from '@florify/shared';

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
    'plot.plant': 'เริ่มปลูก',
    'plot.water': 'รดน้ำ',
    'plot.wateredCount': 'รดน้ำแล้ว {count} ครั้ง',
    'plot.openGallery': 'เปิดแกลเลอรี',
    'plot.openFloristCard': 'เปิดการ์ดนักจัดดอกไม้',
    'plot.openSettings': 'เปิดตั้งค่า',
    'plot.switchLanguage': 'เปลี่ยนภาษา',

    // ── Gallery ────────────────────────────────
    'gallery.title': 'แกลเลอรี',
    'gallery.back': 'กลับไปหน้าหลัก',
    'gallery.harvested': 'เก็บเกี่ยวแล้ว',
    'gallery.speciesUnlocked': 'สายพันธุ์ที่ปลดล็อก',
    'gallery.empty': 'ยังไม่มีต้นไม้ที่เก็บไว้ — เริ่มปลูกเลย',

    // ── Settings sheet ─────────────────────────
    'settings.title': 'ตั้งค่า',
    'settings.close': 'ปิด',

    'settings.account': 'บัญชี',
    'settings.yourName': 'ชื่อของคุณ',
    'settings.namePlaceholder': 'Guest',
    'settings.nameHint': 'ชื่อนี้จะโชว์บน Florist Card ของคุณ (สูงสุด {max} ตัวอักษร)',

    'settings.preferences': 'การตั้งค่า',
    'settings.sound': 'เสียง',
    'settings.soundHint': 'เปิดเสียงเอฟเฟกต์ในเกม (เร็วๆ นี้)',
    'settings.haptics': 'Haptics (สั่น)',
    'settings.hapticsHint': 'Android รองรับ · iOS ไม่รองรับ',
    'settings.notifications': 'แจ้งเตือนรดน้ำ',
    'settings.notificationsHint': 'ทำงานเฉพาะตอน tab เปิดอยู่ (ไม่ใช่ PWA)',
    'settings.notificationsDenied': 'ไม่ได้รับอนุญาต — ลองเปิดใน browser settings',

    'settings.saveData': 'ข้อมูลบันทึก',
    'settings.saveDataHint':
      'สำรองข้อมูลเป็นรหัสตัวอักษร คัดลอกเก็บไว้ที่ไหนก็ได้ (โน้ต, chat, อีเมล) แล้วนำกลับมาใส่ทีหลังได้',
    'settings.exportCopy': 'Export (คัดลอกรหัส)',
    'settings.exportCopied': 'คัดลอกรหัส save แล้ว — เก็บไว้ที่ปลอดภัย',
    'settings.exportManualPrompt': 'คัดลอกรหัสนี้:',
    'settings.exportFailed': 'Export ล้มเหลว: {reason}',
    'settings.import': 'Import',
    'settings.cancel': 'ยกเลิก',
    'settings.importPlaceholder': 'วางรหัส save ที่นี่…',
    'settings.importConfirm': 'แทนที่ข้อมูลปัจจุบันทั้งหมด? การกระทำนี้ย้อนกลับไม่ได้',
    'settings.importSubmit': 'นำเข้าและแทนที่',
    'settings.importSuccess': 'นำเข้าข้อมูลเรียบร้อย กำลังรีโหลด…',

    'settings.dangerZone': 'เขตอันตราย',
    'settings.dangerHint': 'รีเซ็ตต้นไม้ทุกต้น สถิติ และ streak ทั้งหมด',
    'settings.resetAll': 'รีเซ็ตข้อมูลทั้งหมด',
    'settings.resetConfirm': 'รีเซ็ตต้นไม้ทั้งหมดและสถิติ? การกระทำนี้ย้อนกลับไม่ได้',
    'settings.resetSuccess': 'รีเซ็ตข้อมูลเรียบร้อย',

    // ── Harvest overlay ────────────────────────
    'harvest.headline.common': 'ต้นไม้ใหม่ 🌿',
    'harvest.headline.rare': 'พบของหายาก ✨',
    'harvest.headline.legendary': 'บานสะพรั่งในตำนาน 🌼',
    'harvest.waterings': 'รดน้ำ {count} ครั้ง · เก็บเข้า Gallery แล้ว',
    'harvest.collect': 'เก็บเข้า Gallery',
    'harvest.share': 'แชร์',

    // ── Floripedia (public species page) ───────
    'floripedia.title': 'Floripedia',
    'floripedia.notFound': 'ไม่พบสายพันธุ์นี้',
    'floripedia.home': 'กลับหน้าหลัก',
    'floripedia.share': 'แชร์หน้านี้',
    'floripedia.shareTitle': 'Florify — {name}',
    'floripedia.shareText': 'ฉันเจอ {name} ใน Florify 🌿',
    'floripedia.copied': 'คัดลอกลิงก์แล้ว',
  },
  en: {
    // ── PlotView ───────────────────────────────
    'plot.plant': 'Plant',
    'plot.water': 'Water',
    'plot.wateredCount': 'Watered {count} times',
    'plot.openGallery': 'Open Gallery',
    'plot.openFloristCard': 'Open Florist Card',
    'plot.openSettings': 'Open Settings',
    'plot.switchLanguage': 'Switch language',

    // ── Gallery ────────────────────────────────
    'gallery.title': 'Gallery',
    'gallery.back': 'Back to home',
    'gallery.harvested': 'harvested',
    'gallery.speciesUnlocked': 'species unlocked',
    'gallery.empty': 'No saved plants yet — start growing',

    // ── Settings sheet ─────────────────────────
    'settings.title': 'Settings',
    'settings.close': 'Close',

    'settings.account': 'Account',
    'settings.yourName': 'Your name',
    'settings.namePlaceholder': 'Guest',
    'settings.nameHint': 'Shown on your Florist Card (max {max} characters)',

    'settings.preferences': 'Preferences',
    'settings.sound': 'Sound',
    'settings.soundHint': 'In-game sound effects (coming soon)',
    'settings.haptics': 'Haptics',
    'settings.hapticsHint': 'Supported on Android · not on iOS',
    'settings.notifications': 'Watering reminders',
    'settings.notificationsHint': 'Only fires while the tab is open (not PWA)',
    'settings.notificationsDenied': 'Permission denied — enable in browser settings',

    'settings.saveData': 'Save data',
    'settings.saveDataHint':
      'Back up your progress as a text code. Stash it anywhere (notes, chat, email) and restore later.',
    'settings.exportCopy': 'Export (copy code)',
    'settings.exportCopied': 'Save code copied — keep it somewhere safe',
    'settings.exportManualPrompt': 'Copy this code:',
    'settings.exportFailed': 'Export failed: {reason}',
    'settings.import': 'Import',
    'settings.cancel': 'Cancel',
    'settings.importPlaceholder': 'Paste save code here…',
    'settings.importConfirm': 'Replace all current data? This cannot be undone.',
    'settings.importSubmit': 'Import and replace',
    'settings.importSuccess': 'Imported successfully — reloading…',

    'settings.dangerZone': 'Danger zone',
    'settings.dangerHint': 'Reset every plant, stat, and streak',
    'settings.resetAll': 'Reset all data',
    'settings.resetConfirm': 'Reset all plants and stats? This cannot be undone.',
    'settings.resetSuccess': 'Data reset',

    // ── Harvest overlay ────────────────────────
    'harvest.headline.common': 'New addition 🌿',
    'harvest.headline.rare': 'Rare find ✨',
    'harvest.headline.legendary': 'Legendary bloom 🌼',
    'harvest.waterings': 'Watered {count} times · Added to Gallery',
    'harvest.collect': 'Add to Gallery',
    'harvest.share': 'Share',

    // ── Floripedia (public species page) ───────
    'floripedia.title': 'Floripedia',
    'floripedia.notFound': 'Species not found',
    'floripedia.home': 'Back to home',
    'floripedia.share': 'Share this page',
    'floripedia.shareTitle': 'Florify — {name}',
    'floripedia.shareText': 'I found {name} in Florify 🌿',
    'floripedia.copied': 'Link copied',
  },
} as const satisfies Record<Language, Record<string, string>>;

export type DictKey = keyof (typeof dict)['th'];
