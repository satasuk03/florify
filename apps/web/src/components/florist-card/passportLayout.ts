import type { FloristCardData } from "@/store/gameStore";
import { SPECIES_BY_ID } from "@/data/species";

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
  bgTop: "#FBF8F3",
  bgBottom: "#F3E9D6",
  border: "#E3D7C0",
  ink900: "#2B241B",
  ink700: "#4A3F30",
  ink500: "#6B5E4B",
  ink300: "#9C8F7B",
  clay500: "#C7825A",
  clay600: "#A96842",
  divider: "#D1C0A0",
  barBg: "#EEE6D6",
  barCommon: "#B8A888",
  barRare: "#7A9CB8",
  barLegendary: "#D4A24C",
} as const;

// ── Theme types ──────────────────────────────────────────────────

export type BackgroundLayer =
  | { type: "gradient"; from: string; to: string; angle?: number }
  | { type: "solid"; color: string };

export interface RarityTextStyle {
  color: string;
  family: "serif" | "sans" | "mono";
  weight: 400 | 500 | 600 | 700;
  letterSpacing?: number;
  gradient?: { colors: string[]; stops: number[] };
  glow?: { color: string; blur: number };
}

export interface PassportTheme {
  id: string;
  background: BackgroundLayer[];
  colors: typeof PASSPORT_COLORS;
  rarityStyle: {
    common: RarityTextStyle;
    rare: RarityTextStyle;
    legendary: RarityTextStyle;
  };
}

export const DEFAULT_THEME: PassportTheme = {
  id: "classic",
  background: [{ type: "gradient", from: "#FBF8F3", to: "#F3E9D6" }],
  colors: PASSPORT_COLORS,
  rarityStyle: {
    common: {
      color: PASSPORT_COLORS.ink700,
      family: "serif",
      weight: 600,
      letterSpacing: 1,
      gradient: {
        colors: ["#8B7355", "#A68B5B", "#C4A96A", "#A68B5B", "#8B7355"],
        stops: [0, 0.25, 0.5, 0.75, 1],
      },
      glow: { color: "rgba(184, 168, 136, 0.25)", blur: 10 },
    },
    rare: {
      color: PASSPORT_COLORS.ink700,
      family: "serif",
      weight: 600,
      letterSpacing: 1,
      gradient: {
        colors: ["#5A7A8A", "#8AB4C8", "#B8D8E8", "#8AB4C8", "#5A7A8A"],
        stops: [0, 0.25, 0.5, 0.75, 1],
      },
      glow: { color: "rgba(122, 156, 184, 0.35)", blur: 14 },
    },
    legendary: {
      color: PASSPORT_COLORS.ink700,
      family: "serif",
      weight: 700,
      letterSpacing: 2,
      gradient: {
        colors: ["#8B6914", "#D4A24C", "#FFD700", "#D4A24C", "#8B6914"],
        stops: [0, 0.25, 0.5, 0.75, 1],
      },
      glow: { color: "rgba(212, 162, 76, 0.45)", blur: 20 },
    },
  },
};

export type Align = "left" | "center" | "right";

export type DrawOp =
  | {
      type: "text";
      text: string;
      x: number;
      y: number;
      size: number;
      weight: 400 | 500 | 600 | 700;
      family: "serif" | "sans" | "mono";
      color: string;
      align: Align;
      letterSpacing?: number;
      /** DOM-only: count-up animation metadata (ignored by canvas renderer). */
      animate?: { value: number; delay?: number };
      /** If set, renderers measure and shrink `size` down through `sizeLadder`
       *  until the rendered text fits inside `maxWidth`. Pure layout stays
       *  agnostic to the measurement — `fitTextOps` mutates the op before the
       *  main draw loop. */
      fitTo?: { maxWidth: number; sizeLadder: number[] };
    }
  | {
      type: "rect";
      x: number;
      y: number;
      w: number;
      h: number;
      color: string;
      radius?: number;
      /** DOM-only: bar-grow animation metadata (ignored by canvas renderer). */
      animate?: { delay?: number };
    }
  | {
      type: "line";
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      color: string;
      width: number;
    }
  | {
      type: "corner";
      /** Top-left position of the L */
      x: number;
      y: number;
      /** Length of each arm */
      len: number;
      /** 'tl' | 'tr' | 'bl' | 'br' */
      corner: "tl" | "tr" | "bl" | "br";
      color: string;
      width: number;
    }
  | {
      type: "image";
      /** Webp URL, or null to draw the placeholder instead. */
      src: string | null;
      x: number;
      y: number;
      w: number;
      h: number;
      radius: number;
      bgColor: string;
      border?: { color: string; width: number };
      /** Rendered centered when src is null or load fails. */
      placeholder?: { text: string; size: number; color: string };
    }
  | {
      type: "gradientText";
      text: string;
      x: number;
      y: number;
      size: number;
      weight: 400 | 500 | 600 | 700;
      family: "serif" | "sans" | "mono";
      gradient: { colors: string[]; stops: number[] };
      align: Align;
      letterSpacing?: number;
      animate?: { value: number; delay?: number };
      fitTo?: { maxWidth: number; sizeLadder: number[] };
      /** DOM-only: animate the gradient position (rainbow sweep). */
      animateGradient?: boolean;
    }
  | {
      type: "glow";
      x: number;
      y: number;
      w: number;
      h: number;
      color: string;
      blur: number;
      radius?: number;
    };

function formatDate(ms: number): string {
  const d = new Date(ms);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Build the full passport layout from player data.
 *
 * Pixel ranges mirror designs/11 §11.5. Critical content stays within
 * y ∈ [240, 1680] so Instagram/Facebook story overlays never cover it.
 */
export function buildLayout(
  data: FloristCardData,
  theme: PassportTheme = DEFAULT_THEME,
): DrawOp[] {
  const ops: DrawOp[] = [];
  const cx = PASSPORT_W / 2;
  const col = { left: 180, right: PASSPORT_W - 180 }; // 720px content column
  const c = theme.colors;

  // ── Decorative corner frames ─────────────────────────────────────
  const cornerArm = 100;
  const cornerInset = 80;
  const cornerWidth = 5;
  ops.push(
    {
      type: "corner",
      corner: "tl",
      x: cornerInset,
      y: cornerInset,
      len: cornerArm,
      color: c.clay600,
      width: cornerWidth,
    },
    {
      type: "corner",
      corner: "tr",
      x: PASSPORT_W - cornerInset,
      y: cornerInset,
      len: cornerArm,
      color: c.clay600,
      width: cornerWidth,
    },
    {
      type: "corner",
      corner: "bl",
      x: cornerInset,
      y: PASSPORT_H - cornerInset,
      len: cornerArm,
      color: c.clay600,
      width: cornerWidth,
    },
    {
      type: "corner",
      corner: "br",
      x: PASSPORT_W - cornerInset,
      y: PASSPORT_H - cornerInset,
      len: cornerArm,
      color: c.clay600,
      width: cornerWidth,
    },
  );

  // ── Header: wordmark + eyebrow + divider ─────────────────────────
  ops.push({
    type: "text",
    text: "FLORIFY",
    x: cx,
    y: 310,
    size: 96,
    weight: 700,
    family: "serif",
    color: c.ink900,
    align: "center",
    letterSpacing: 8,
  });
  ops.push({
    type: "text",
    text: "BOTANICAL PASSPORT",
    x: cx,
    y: 375,
    size: 32,
    weight: 500,
    family: "sans",
    color: c.ink500,
    align: "center",
    letterSpacing: 10,
  });
  ops.push({
    type: "line",
    x1: col.left,
    y1: 450,
    x2: col.right,
    y2: 450,
    color: c.divider,
    width: 2,
  });

  // ── Stagger delays for DOM count-up animations ───────────────────
  const DELAY_HERO = 0;
  const DELAY_BARS = 200;
  const DELAY_STATS = 400;

  // ── Hero block: total harvested ──────────────────────────────────
  // Baseline at y=625 — balances the visible cap of "0" (~515) against
  // PASSPORT (375) around the divider at 450, giving roughly equal
  // visual breathing above and below the divider.
  ops.push({
    type: "text",
    text: `${data.totalHarvested}`,
    x: cx,
    y: 625,
    size: 180,
    weight: 700,
    family: "serif",
    color: c.ink900,
    align: "center",
    animate: { value: data.totalHarvested, delay: DELAY_HERO },
  });
  ops.push({
    type: "text",
    text: "TOTAL HARVESTED",
    x: cx,
    y: 705,
    size: 36,
    weight: 600,
    family: "sans",
    color: c.ink500,
    align: "center",
    letterSpacing: 8,
  });

  // ── Title pill (was Rank pill) ───────────────────────────────────
  // Text is data.title — either a chosen achievement name or the auto
  // rank fallback. Achievement names are longer than ranks, so the
  // renderer will auto-shrink via the `fitTo` hint if needed.
  const titleText = `◆  ${data.title}  ◆`;
  const titleFitTo = { maxWidth: col.right - col.left, sizeLadder: [44, 40, 36, 32] as number[] };
  if (data.titleShiny) {
    ops.push({
      type: "gradientText",
      text: titleText,
      x: cx,
      y: 780,
      size: 44,
      weight: 600,
      family: "serif",
      gradient: {
        colors: ["#FFB0C3", "#FFE18A", "#A6F0AD", "#9EC6FF", "#C9A3FF", "#FFB0C3"],
        stops: [0, 0.2, 0.4, 0.6, 0.8, 1],
      },
      align: "center",
      letterSpacing: 2,
      fitTo: titleFitTo,
      animateGradient: true,
    });
  } else {
    ops.push({
      type: "text",
      text: titleText,
      x: cx,
      y: 780,
      size: 44,
      weight: 600,
      family: "serif",
      color: c.clay600,
      align: "center",
      letterSpacing: 2,
      fitTo: titleFitTo,
    });
  }

  // ── Rarity section ornament ───────────────────────────────────────
  const ornY = 860;
  const ornLineW = 80;
  ops.push(
    {
      type: "line",
      x1: cx - ornLineW - 30,
      y1: ornY,
      x2: cx - 30,
      y2: ornY,
      color: c.divider,
      width: 2,
    },
    {
      type: "text",
      text: "◈",
      x: cx,
      y: ornY + 8,
      size: 28,
      weight: 400,
      family: "serif",
      color: c.clay500,
      align: "center",
    },
    {
      type: "line",
      x1: cx + 30,
      y1: ornY,
      x2: cx + ornLineW + 30,
      y2: ornY,
      color: c.divider,
      width: 2,
    },
  );

  // ── Rarity bars ──────────────────────────────────────────────────
  const barRows = [
    {
      label: "Common",
      rarity: "common" as const,
      unlocked: data.rarityProgress.common.unlocked,
      total: data.rarityProgress.common.total,
      fill: c.barCommon,
    },
    {
      label: "Rare",
      rarity: "rare" as const,
      unlocked: data.rarityProgress.rare.unlocked,
      total: data.rarityProgress.rare.total,
      fill: c.barRare,
    },
    {
      label: "Legendary",
      rarity: "legendary" as const,
      unlocked: data.rarityProgress.legendary.unlocked,
      total: data.rarityProgress.legendary.total,
      fill: c.barLegendary,
    },
  ] as const;

  const barRowY0 = 920;
  const rowHeight = 80;
  const barX = col.left + 280;
  const barW = 420;
  const barH = 20;

  for (let i = 0; i < barRows.length; i++) {
    const row = barRows[i]!;
    const y = barRowY0 + i * rowHeight;
    // Rarity label — styled per theme
    const rs = theme.rarityStyle[row.rarity];
    const labelSize = row.rarity === "legendary" ? 36 : 34;
    if (rs.glow) {
      ops.push({
        type: "glow",
        x: col.left - rs.glow.blur,
        y: y + 4 - labelSize - rs.glow.blur / 2,
        w: 200 + rs.glow.blur * 2,
        h: labelSize + rs.glow.blur,
        color: rs.glow.color,
        blur: rs.glow.blur,
        radius: rs.glow.blur,
      });
    }
    if (rs.gradient) {
      ops.push({
        type: "gradientText",
        text: row.label,
        x: col.left,
        y: y + 4,
        size: labelSize,
        weight: rs.weight,
        family: rs.family,
        gradient: rs.gradient,
        align: "left",
        letterSpacing: rs.letterSpacing,
      });
    } else {
      ops.push({
        type: "text",
        text: row.label,
        x: col.left,
        y: y + 4,
        size: labelSize,
        weight: rs.weight,
        family: rs.family,
        color: rs.color,
        align: "left",
        letterSpacing: rs.letterSpacing,
      });
    }
    // Bar background
    ops.push({
      type: "rect",
      x: barX,
      y: y - 20,
      w: barW,
      h: barH,
      color: c.barBg,
      radius: barH / 2,
    });
    // Bar fill
    const frac =
      row.total > 0 ? Math.max(0, Math.min(1, row.unlocked / row.total)) : 0;
    if (frac > 0) {
      ops.push({
        type: "rect",
        x: barX,
        y: y - 20,
        w: Math.max(barH, barW * frac),
        h: barH,
        color: row.fill,
        radius: barH / 2,
        animate: { delay: DELAY_BARS + i * 50 },
      });
    }
    // Count
    ops.push({
      type: "text",
      text: `${row.unlocked} / ${row.total}`,
      x: col.right,
      y: y + 4,
      size: 30,
      weight: 500,
      family: "sans",
      color: c.ink500,
      align: "right",
      animate: { value: row.unlocked, delay: DELAY_BARS + i * 50 },
    });
  }

  // ── Stats panel background ────────────────────────────────────────
  ops.push({
    type: "rect",
    x: col.left - 20,
    y: 1160,
    w: col.right - col.left + 40,
    h: 175,
    color: c.barBg,
    radius: 16,
  });

  // ── Species unlocked summary (below rarity bars) ─────────────────
  const totalSpecies =
    data.rarityProgress.common.total +
    data.rarityProgress.rare.total +
    data.rarityProgress.legendary.total;
  ops.push({
    type: "text",
    text: `${data.speciesUnlocked} / ${totalSpecies} species unlocked`,
    x: cx,
    y: 1200,
    size: 34,
    weight: 600,
    family: "sans",
    color: c.ink700,
    align: "center",
    animate: { value: data.speciesUnlocked, delay: DELAY_STATS },
  });

  // ── Stat line ────────────────────────────────────────────────────
  ops.push({
    type: "text",
    text: `🔥  ${data.currentStreak} day streak`,
    x: cx,
    y: 1250,
    size: 34,
    weight: 500,
    family: "sans",
    color: c.ink700,
    align: "center",
    animate: { value: data.currentStreak, delay: DELAY_STATS + 50 },
  });
  ops.push({
    type: "text",
    text: `Longest streak: ${data.longestStreak} days`,
    x: cx,
    y: 1305,
    size: 28,
    weight: 400,
    family: "sans",
    color: c.ink500,
    align: "center",
    animate: { value: data.longestStreak, delay: DELAY_STATS + 100 },
  });

  // ── Divider ──────────────────────────────────────────────────────
  ops.push({
    type: "line",
    x1: col.left,
    y1: 1390,
    x2: col.right,
    y2: 1390,
    color: c.divider,
    width: 2,
  });

  // ── Identity block ───────────────────────────────────────────────
  // Avatar frame sits on the left; text columns shift right of it.
  const avatarX = col.left;
  const avatarY = 1420;
  const avatarW = 180;
  const avatarH = 220;
  const avatarGap = 30;
  const idTextX = avatarX + avatarW + avatarGap; // 390

  // Avatar image op (before the text so the border stroke sits under
  // nothing — text doesn't intersect this region anyway).
  const avatarSrc = data.avatar
    ? (SPECIES_BY_ID[data.avatar.speciesId]
        ? `/floras/${SPECIES_BY_ID[data.avatar.speciesId]!.folder}/stage-${data.avatar.stage}.webp`
        : null)
    : null;
  ops.push({
    type: "glow",
    x: avatarX - 6,
    y: avatarY - 6,
    w: avatarW + 12,
    h: avatarH + 12,
    color: "rgba(75, 55, 30, 0.08)",
    blur: 12,
    radius: 20,
  });
  ops.push({
    type: "image",
    src: avatarSrc,
    x: avatarX,
    y: avatarY,
    w: avatarW,
    h: avatarH,
    radius: 16,
    bgColor: c.bgTop,
    border: { color: c.border, width: 2 },
    placeholder: { text: "🌱", size: 80, color: c.ink300 },
  });

  ops.push({
    type: "text",
    text: data.displayName,
    x: idTextX,
    y: 1460,
    size: 36,
    weight: 600,
    family: "sans",
    color: c.ink900,
    align: "left",
  });
  ops.push({
    type: "text",
    text: data.serial,
    x: idTextX,
    y: 1510,
    size: 30,
    weight: 500,
    family: "mono",
    color: c.ink500,
    align: "left",
    letterSpacing: 2,
  });
  ops.push({
    type: "text",
    text: `Issued ${formatDate(data.startedAt)}`,
    x: idTextX,
    y: 1555,
    size: 26,
    weight: 400,
    family: "sans",
    color: c.ink500,
    align: "left",
  });
  if (data.sharedAt) {
    ops.push({
      type: "text",
      text: `Data as of ${formatDate(data.sharedAt)}`,
      x: idTextX,
      y: 1595,
      size: 24,
      weight: 400,
      family: "sans",
      color: c.ink300,
      align: "left",
    });
  }

  // ── Footer URL ───────────────────────────────────────────────────
  ops.push({
    type: "text",
    text: "florify.zeze.app",
    x: col.right,
    y: 1555,
    size: 30,
    weight: 500,
    family: "sans",
    color: c.clay500,
    align: "right",
  });

  return ops;
}
