import type { FloristCardData } from '@/store/gameStore';

/**
 * Pure layout spec for the Florist Card passport.
 *
 * A list of absolute-positioned draw instructions over a 1080×1920
 * canvas. Both renderers — the in-app React DOM component and the
 * Canvas 2D share-image generator — walk this same list. This is the
 * "one definition, two renderers" pattern from designs/11 §11.6.
 *
 * All coordinates are in canvas pixels, NOT CSS pixels. The DOM
 * renderer scales the whole thing down to fit inside the modal.
 */

export const PASSPORT_W = 1080;
export const PASSPORT_H = 1920;

export const PASSPORT_COLORS = {
  bgTop: '#FBF8F3',
  bgBottom: '#F3E9D6',
  border: '#E3D7C0',
  ink900: '#2B241B',
  ink700: '#4A3F30',
  ink500: '#6B5E4B',
  ink300: '#9C8F7B',
  clay500: '#C7825A',
  clay600: '#A96842',
  divider: '#D1C0A0',
  barBg: '#EEE6D6',
  barCommon: '#B8A888',
  barRare: '#7A9CB8',
  barLegendary: '#D4A24C',
} as const;

export type Align = 'left' | 'center' | 'right';

export type DrawOp =
  | {
      type: 'text';
      text: string;
      x: number;
      y: number;
      size: number;
      weight: 400 | 500 | 600 | 700;
      family: 'serif' | 'sans' | 'mono';
      color: string;
      align: Align;
      letterSpacing?: number;
    }
  | {
      type: 'rect';
      x: number;
      y: number;
      w: number;
      h: number;
      color: string;
      radius?: number;
    }
  | {
      type: 'line';
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      color: string;
      width: number;
    }
  | {
      type: 'corner';
      /** Top-left position of the L */
      x: number;
      y: number;
      /** Length of each arm */
      len: number;
      /** 'tl' | 'tr' | 'bl' | 'br' */
      corner: 'tl' | 'tr' | 'bl' | 'br';
      color: string;
      width: number;
    };

function formatDate(ms: number): string {
  const d = new Date(ms);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Build the full passport layout from player data.
 *
 * Pixel ranges mirror designs/11 §11.5. Critical content stays within
 * y ∈ [240, 1680] so Instagram/Facebook story overlays never cover it.
 */
export function buildLayout(data: FloristCardData): DrawOp[] {
  const ops: DrawOp[] = [];
  const cx = PASSPORT_W / 2;
  const col = { left: 180, right: PASSPORT_W - 180 }; // 720px content column

  // ── Decorative corner frames ─────────────────────────────────────
  const cornerArm = 90;
  const cornerInset = 80;
  const cornerWidth = 4;
  ops.push(
    { type: 'corner', corner: 'tl', x: cornerInset, y: cornerInset, len: cornerArm, color: PASSPORT_COLORS.border, width: cornerWidth },
    { type: 'corner', corner: 'tr', x: PASSPORT_W - cornerInset, y: cornerInset, len: cornerArm, color: PASSPORT_COLORS.border, width: cornerWidth },
    { type: 'corner', corner: 'bl', x: cornerInset, y: PASSPORT_H - cornerInset, len: cornerArm, color: PASSPORT_COLORS.border, width: cornerWidth },
    { type: 'corner', corner: 'br', x: PASSPORT_W - cornerInset, y: PASSPORT_H - cornerInset, len: cornerArm, color: PASSPORT_COLORS.border, width: cornerWidth },
  );

  // ── Header: wordmark + eyebrow + divider ─────────────────────────
  ops.push({
    type: 'text',
    text: 'FLORIFY',
    x: cx,
    y: 310,
    size: 96,
    weight: 700,
    family: 'serif',
    color: PASSPORT_COLORS.ink900,
    align: 'center',
    letterSpacing: 8,
  });
  ops.push({
    type: 'text',
    text: 'BOTANICAL PASSPORT',
    x: cx,
    y: 375,
    size: 32,
    weight: 500,
    family: 'sans',
    color: PASSPORT_COLORS.ink500,
    align: 'center',
    letterSpacing: 10,
  });
  ops.push({
    type: 'line',
    x1: col.left,
    y1: 430,
    x2: col.right,
    y2: 430,
    color: PASSPORT_COLORS.divider,
    width: 2,
  });

  // ── Hero block: species unlocked ─────────────────────────────────
  ops.push({
    type: 'text',
    text: `${data.speciesUnlocked} / 300`,
    x: cx,
    y: 640,
    size: 180,
    weight: 700,
    family: 'serif',
    color: PASSPORT_COLORS.ink900,
    align: 'center',
  });
  ops.push({
    type: 'text',
    text: 'SPECIES UNLOCKED',
    x: cx,
    y: 720,
    size: 36,
    weight: 600,
    family: 'sans',
    color: PASSPORT_COLORS.ink500,
    align: 'center',
    letterSpacing: 8,
  });

  // ── Rank pill ────────────────────────────────────────────────────
  ops.push({
    type: 'text',
    text: `◆  ${data.rank.toUpperCase()}  ◆`,
    x: cx,
    y: 870,
    size: 52,
    weight: 600,
    family: 'serif',
    color: PASSPORT_COLORS.clay600,
    align: 'center',
    letterSpacing: 4,
  });

  // ── Rarity bars ──────────────────────────────────────────────────
  const barRows = [
    { label: 'Common', unlocked: data.rarityProgress.common.unlocked, total: data.rarityProgress.common.total, fill: PASSPORT_COLORS.barCommon },
    { label: 'Rare', unlocked: data.rarityProgress.rare.unlocked, total: data.rarityProgress.rare.total, fill: PASSPORT_COLORS.barRare },
    { label: 'Legendary', unlocked: data.rarityProgress.legendary.unlocked, total: data.rarityProgress.legendary.total, fill: PASSPORT_COLORS.barLegendary },
  ] as const;

  const barRowY0 = 1020;
  const rowHeight = 110;
  const barX = col.left + 280;
  const barW = 420;
  const barH = 20;

  for (let i = 0; i < barRows.length; i++) {
    const row = barRows[i]!;
    const y = barRowY0 + i * rowHeight;
    // Label
    ops.push({
      type: 'text',
      text: row.label,
      x: col.left,
      y: y + 4,
      size: 34,
      weight: 500,
      family: 'sans',
      color: PASSPORT_COLORS.ink700,
      align: 'left',
    });
    // Bar background
    ops.push({
      type: 'rect',
      x: barX,
      y: y - 20,
      w: barW,
      h: barH,
      color: PASSPORT_COLORS.barBg,
      radius: barH / 2,
    });
    // Bar fill
    const frac = row.total > 0 ? Math.max(0, Math.min(1, row.unlocked / row.total)) : 0;
    if (frac > 0) {
      ops.push({
        type: 'rect',
        x: barX,
        y: y - 20,
        w: Math.max(barH, barW * frac),
        h: barH,
        color: row.fill,
        radius: barH / 2,
      });
    }
    // Count
    ops.push({
      type: 'text',
      text: `${row.unlocked} / ${row.total}`,
      x: col.right,
      y: y + 4,
      size: 30,
      weight: 500,
      family: 'sans',
      color: PASSPORT_COLORS.ink500,
      align: 'right',
    });
  }

  // ── Stat line ────────────────────────────────────────────────────
  ops.push({
    type: 'text',
    text: `${data.totalHarvested} harvested  ·  🔥  ${data.currentStreak} day streak`,
    x: cx,
    y: 1440,
    size: 34,
    weight: 500,
    family: 'sans',
    color: PASSPORT_COLORS.ink700,
    align: 'center',
  });
  ops.push({
    type: 'text',
    text: `Longest streak: ${data.longestStreak} days`,
    x: cx,
    y: 1495,
    size: 28,
    weight: 400,
    family: 'sans',
    color: PASSPORT_COLORS.ink500,
    align: 'center',
  });

  // ── Divider ──────────────────────────────────────────────────────
  ops.push({
    type: 'line',
    x1: col.left,
    y1: 1580,
    x2: col.right,
    y2: 1580,
    color: PASSPORT_COLORS.divider,
    width: 2,
  });

  // ── Identity block ───────────────────────────────────────────────
  ops.push({
    type: 'text',
    text: data.displayName,
    x: col.left,
    y: 1650,
    size: 36,
    weight: 600,
    family: 'sans',
    color: PASSPORT_COLORS.ink900,
    align: 'left',
  });
  ops.push({
    type: 'text',
    text: data.serial,
    x: col.left,
    y: 1700,
    size: 30,
    weight: 500,
    family: 'mono',
    color: PASSPORT_COLORS.ink500,
    align: 'left',
    letterSpacing: 2,
  });
  ops.push({
    type: 'text',
    text: `Issued ${formatDate(data.startedAt)}`,
    x: col.left,
    y: 1745,
    size: 26,
    weight: 400,
    family: 'sans',
    color: PASSPORT_COLORS.ink500,
    align: 'left',
  });

  // ── Footer URL ───────────────────────────────────────────────────
  ops.push({
    type: 'text',
    text: 'florify.app',
    x: col.right,
    y: 1745,
    size: 30,
    weight: 500,
    family: 'sans',
    color: PASSPORT_COLORS.clay500,
    align: 'right',
  });

  return ops;
}
