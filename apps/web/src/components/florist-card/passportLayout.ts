import type { FloristCardData } from "@/store/gameStore";
import { SPECIES_BY_ID } from "@/data/species";

/**
 * Florify Passport · B1 "Full Bleed" — layout spec.
 *
 * A list of absolute-positioned draw instructions over a 1080×1920
 * canvas. Both renderers — the in-app React DOM component and the
 * Canvas 2D share-image generator — walk this same list.
 *
 * Coordinates are canvas pixels, not CSS pixels. The DOM renderer
 * scales the whole stage down to fit the modal.
 *
 * Reference: design_handoff_passport_b1/B1_Passport.html + README.md.
 */

export const PASSPORT_W = 1080;
export const PASSPORT_H = 1920;

// ── B1 tokens (README §Design tokens) ────────────────────────────
export const PASSPORT_COLORS = {
  bgFallback: "#0A0806",
  cream: "#F7F3EA",
  muted: "rgba(247,243,234,0.72)",
  faint: "rgba(247,243,234,0.55)",
  divider: "rgba(247,243,234,0.25)",

  rareCommon: "#B8A888",
  rareRare: "#7A9CB8",
  rareLegend: "#D4A24C",

  shinyGradient: [
    "#FFB0C3",
    "#FFE18A",
    "#A6F0AD",
    "#9EC6FF",
    "#C9A3FF",
    "#FFB0C3",
  ],
} as const;

// Scrim gradients — asymmetric (heavier bottom, lighter top) to hold
// type against any specimen. Don't swap for a symmetric tint.
const TOP_SCRIM_STOPS = [
  { offset: 0, color: "rgba(0,0,0,0.45)" },
  { offset: 0.4, color: "rgba(0,0,0,0.18)" },
  { offset: 0.7, color: "rgba(0,0,0,0)" },
  { offset: 1, color: "rgba(0,0,0,0)" },
];
const BOTTOM_SCRIM_STOPS = [
  { offset: 0, color: "rgba(0,0,0,0)" },
  { offset: 0.35, color: "rgba(0,0,0,0.12)" },
  { offset: 0.7, color: "rgba(0,0,0,0.45)" },
  { offset: 1, color: "rgba(0,0,0,0.72)" },
];

// Shadow presets (README §DROP SHADOWS)
const SHADOW_DEFAULT = { offsetY: 1, blur: 6, color: "rgba(0,0,0,0.40)" } as const;
const SHADOW_CAPTION = { offsetY: 2, blur: 12, color: "rgba(0,0,0,0.35)" } as const;
const SHADOW_TITLE = { offsetY: 4, blur: 24, color: "rgba(0,0,0,0.50)" } as const;
const SHADOW_SHINY = { offsetY: 4, blur: 24, color: "rgba(0,0,0,0.55)" } as const;

// ── Theme (kept as a thin hook for future variants) ──────────────
export interface PassportTheme {
  id: string;
  colors: typeof PASSPORT_COLORS;
}

export const DEFAULT_THEME: PassportTheme = {
  id: "b1-full-bleed",
  colors: PASSPORT_COLORS,
};

export type Align = "left" | "center" | "right";

export interface TextShadow {
  offsetY: number;
  blur: number;
  color: string;
}

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
      italic?: boolean;
      shadow?: TextShadow;
      /** DOM-only: count-up animation metadata (ignored by canvas renderer). */
      animate?: { value: number; delay?: number };
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
      type: "image";
      src: string | null;
      x: number;
      y: number;
      w: number;
      h: number;
      radius: number;
      bgColor: string;
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
      italic?: boolean;
      shadow?: TextShadow;
      animate?: { value: number; delay?: number };
      fitTo?: { maxWidth: number; sizeLadder: number[] };
      /** DOM-only: animate the gradient position (rainbow sweep). */
      animateGradient?: boolean;
    }
  | {
      type: "gradientRect";
      x: number;
      y: number;
      w: number;
      h: number;
      /** 0 = top→bottom, 90 = left→right. Matches CSS linear-gradient angles. */
      angle: number;
      stops: { offset: number; color: string }[];
    };

/**
 * Build the full passport layout from player data. Pure — returns a
 * fresh array per call (so the fit-text pass mutates only this render).
 *
 * B1 is data-driven off `FloristCardData.avatar`: if an avatar is set,
 * the resolved stage image is used as the full-bleed photo and the
 * species name becomes the "Favourite Specimen" caption.
 */
export function buildLayout(
  data: FloristCardData,
  theme: PassportTheme = DEFAULT_THEME,
): DrawOp[] {
  const ops: DrawOp[] = [];
  const c = theme.colors;

  // Safe-margin content column (README §Canvas: left/right 80)
  const LEFT = 80;
  const RIGHT = PASSPORT_W - 80;
  const COL_W = RIGHT - LEFT;

  // Resolve the favorite specimen from the avatar slot.
  const species = data.avatar ? SPECIES_BY_ID[data.avatar.speciesId] : null;
  const favoriteImage = species
    ? `/floras/${species.folder}/stage-${data.avatar!.stage}.webp`
    : null;
  const favoriteName = species?.name ?? null;

  // ── 1. Full-bleed flora image (or dark fallback) ─────────────────
  // Background is the image, object-fit: cover, filling the entire
  // 1080×1920 card. When there's no avatar set, the bg-fallback tint
  // shows through and a subtle placeholder prompts the user.
  ops.push({
    type: "rect",
    x: 0,
    y: 0,
    w: PASSPORT_W,
    h: PASSPORT_H,
    color: c.bgFallback,
  });
  ops.push({
    type: "image",
    src: favoriteImage,
    x: 0,
    y: 0,
    w: PASSPORT_W,
    h: PASSPORT_H,
    radius: 0,
    bgColor: c.bgFallback,
    placeholder: {
      text: "🌱",
      size: 220,
      color: "rgba(247,243,234,0.22)",
    },
  });

  // ── 2. Top scrim (height 420) ────────────────────────────────────
  ops.push({
    type: "gradientRect",
    x: 0,
    y: 0,
    w: PASSPORT_W,
    h: 420,
    angle: 180,
    stops: TOP_SCRIM_STOPS,
  });

  // ── 3. Bottom scrim (height 960, anchored to bottom) ─────────────
  ops.push({
    type: "gradientRect",
    x: 0,
    y: PASSPORT_H - 960,
    w: PASSPORT_W,
    h: 960,
    angle: 180,
    stops: BOTTOM_SCRIM_STOPS,
  });

  // ── A. Masthead (top 70) ─────────────────────────────────────────
  const MASTHEAD_Y = 70;
  // "florify" wordmark — Fraunces 34/600, lowercase, tight tracking.
  ops.push({
    type: "text",
    text: "florify",
    x: LEFT,
    y: MASTHEAD_Y + 34, // top-anchored: baseline ≈ top + size
    size: 34,
    weight: 600,
    family: "serif",
    color: c.cream,
    align: "left",
    letterSpacing: -0.02 * 34,
  });
  // Serial — uppercase Plex 15/500, wide tracking, faint.
  ops.push({
    type: "text",
    text: data.serial.toUpperCase(),
    x: RIGHT,
    y: MASTHEAD_Y + 26,
    size: 15,
    weight: 500,
    family: "sans",
    color: c.faint,
    align: "right",
    letterSpacing: 0.3 * 15,
  });

  // ── B. Species caption (top 170) ─────────────────────────────────
  const CAPTION_Y = 170;
  // Eyebrow — "Fig. 01 · Favourite Specimen"
  ops.push({
    type: "text",
    text: "FIG. 01 · FAVOURITE SPECIMEN",
    x: LEFT,
    y: CAPTION_Y + 14,
    size: 14,
    weight: 500,
    family: "sans",
    color: c.faint,
    align: "left",
    letterSpacing: 0.4 * 14,
  });
  // Specimen name — italic Fraunces 48/500, or a muted placeholder.
  const specimenText = favoriteName ?? "Not chosen yet";
  ops.push({
    type: "text",
    text: specimenText,
    x: LEFT,
    y: CAPTION_Y + 14 + 6 + 48, // eyebrow baseline + margin + size
    size: 48,
    weight: 500,
    family: "serif",
    color: favoriteName ? c.cream : c.faint,
    align: "left",
    italic: true,
    letterSpacing: -0.015 * 48,
    shadow: SHADOW_CAPTION,
  });

  // ── C. Hero block (bottom 340) ───────────────────────────────────
  // Kicker sits above the title; title baseline computed from kicker
  // baseline + margin-bottom + its own size.
  const HERO_BOTTOM = 340;
  const TITLE_SIZE = 156;
  const TITLE_BASELINE_Y = PASSPORT_H - HERO_BOTTOM; // bottom of title line box
  const KICKER_MARGIN_BOTTOM = 22;
  const KICKER_SIZE = 16;
  // Title baseline: position the title so its bottom is at HERO_BOTTOM
  // offset from bottom of canvas. Line-height 0.92 × size ≈ rendered
  // height; baseline ≈ top + size.
  const titleBaselineY = TITLE_BASELINE_Y;
  const kickerBaselineY =
    titleBaselineY - TITLE_SIZE - KICKER_MARGIN_BOTTOM;

  ops.push({
    type: "text",
    text: "— BEARER OF THE TITLE",
    x: LEFT,
    y: kickerBaselineY,
    size: KICKER_SIZE,
    weight: 500,
    family: "sans",
    color: c.muted,
    align: "left",
    letterSpacing: 0.4 * KICKER_SIZE,
    shadow: SHADOW_DEFAULT,
  });

  const titleFitTo = {
    maxWidth: COL_W,
    sizeLadder: [156, 140, 124, 108, 92] as number[],
  };
  if (data.titleShiny) {
    ops.push({
      type: "gradientText",
      text: data.title,
      x: LEFT,
      y: titleBaselineY,
      size: TITLE_SIZE,
      weight: 500,
      family: "serif",
      gradient: {
        colors: [...PASSPORT_COLORS.shinyGradient],
        stops: [0, 0.2, 0.4, 0.6, 0.8, 1],
      },
      align: "left",
      letterSpacing: -0.045 * TITLE_SIZE,
      shadow: SHADOW_SHINY,
      fitTo: titleFitTo,
      animateGradient: true,
    });
  } else {
    ops.push({
      type: "text",
      text: data.title,
      x: LEFT,
      y: titleBaselineY,
      size: TITLE_SIZE,
      weight: 500,
      family: "serif",
      color: c.cream,
      align: "left",
      letterSpacing: -0.045 * TITLE_SIZE,
      shadow: SHADOW_TITLE,
      fitTo: titleFitTo,
    });
  }

  // ── D. Stats strip (bottom 130) ──────────────────────────────────
  // 1 px divider on top, four columns: Harvested | Common | Rare | Legendary
  const STATS_BOTTOM = 130;
  const STATS_BASE_Y = PASSPORT_H - STATS_BOTTOM; // baseline for bottom-aligned big numbers
  const STATS_DIVIDER_Y = STATS_BASE_Y - 112 - 6 - 13 - 28;
  // ^ big number (112) + marginBottom (6) + label size (13) + paddingTop (28)
  // gives the top of the stats block where the 1px divider sits.

  ops.push({
    type: "line",
    x1: LEFT,
    y1: STATS_DIVIDER_Y,
    x2: RIGHT,
    y2: STATS_DIVIDER_Y,
    color: c.divider,
    width: 1,
  });

  // Column layout: hero (auto) takes ~36% of the width, three rarity
  // columns split the remaining 1fr 1fr 1fr with gap 36.
  const STATS_GAP = 36;
  const HERO_COL_W = 360; // matches `auto` sizing for "1,247"-class numbers
  const RARITY_AVAILABLE = COL_W - HERO_COL_W - 3 * STATS_GAP;
  const RARITY_COL_W = RARITY_AVAILABLE / 3;

  // Column 1: Harvested
  const HERO_LABEL_SIZE = 13;
  const HERO_NUM_SIZE = 112;
  const heroNumBaselineY = STATS_BASE_Y; // bottom-aligned
  const heroLabelBaselineY = heroNumBaselineY - HERO_NUM_SIZE * 0.88 - 6; // num line-height 0.88 + gap 6

  ops.push({
    type: "text",
    text: "HARVESTED",
    x: LEFT,
    y: heroLabelBaselineY,
    size: HERO_LABEL_SIZE,
    weight: 500,
    family: "sans",
    color: c.muted,
    align: "left",
    letterSpacing: 0.3 * HERO_LABEL_SIZE,
    shadow: SHADOW_DEFAULT,
  });
  ops.push({
    type: "text",
    text: data.totalHarvested.toLocaleString("en-US"),
    x: LEFT,
    y: heroNumBaselineY,
    size: HERO_NUM_SIZE,
    weight: 600,
    family: "serif",
    color: c.cream,
    align: "left",
    letterSpacing: -0.04 * HERO_NUM_SIZE,
    shadow: SHADOW_DEFAULT,
    animate: { value: data.totalHarvested, delay: 0 },
  });

  // Columns 2–4: Common / Rare / Legendary
  const RARITY_NUM_SIZE = 48;
  const RARITY_LABEL_SIZE = 13;
  const DOT_SIZE = 8;
  const DOT_GAP = 8;

  const rarityNumBaselineY = STATS_BASE_Y; // bottom-aligned with hero number
  const rarityLabelBaselineY =
    rarityNumBaselineY - RARITY_NUM_SIZE - 6; // num line-height 1 + gap 6
  const rarityDotCenterY = rarityLabelBaselineY - RARITY_LABEL_SIZE / 2 + 2;

  const rarities = [
    {
      key: "common" as const,
      label: "COMMON",
      color: c.rareCommon,
      data: data.rarityProgress.common,
    },
    {
      key: "rare" as const,
      label: "RARE",
      color: c.rareRare,
      data: data.rarityProgress.rare,
    },
    {
      key: "legendary" as const,
      label: "LEGENDARY",
      color: c.rareLegend,
      data: data.rarityProgress.legendary,
    },
  ];

  let colX = LEFT + HERO_COL_W + STATS_GAP;
  for (let i = 0; i < rarities.length; i++) {
    const r = rarities[i]!;
    // Dot
    ops.push({
      type: "rect",
      x: colX,
      y: rarityDotCenterY - DOT_SIZE / 2,
      w: DOT_SIZE,
      h: DOT_SIZE,
      color: r.color,
      radius: DOT_SIZE / 2,
    });
    // Label
    ops.push({
      type: "text",
      text: r.label,
      x: colX + DOT_SIZE + DOT_GAP,
      y: rarityLabelBaselineY,
      size: RARITY_LABEL_SIZE,
      weight: 500,
      family: "sans",
      color: c.muted,
      align: "left",
      letterSpacing: 0.26 * RARITY_LABEL_SIZE,
      shadow: SHADOW_DEFAULT,
    });
    // Number "X/Y" — drawn as two separate text ops so the suffix can
    // take a different size/color. The slash is part of the suffix.
    const unlockedStr = r.data.unlocked.toLocaleString("en-US");
    ops.push({
      type: "text",
      text: unlockedStr,
      x: colX,
      y: rarityNumBaselineY,
      size: RARITY_NUM_SIZE,
      weight: 600,
      family: "serif",
      color: c.cream,
      align: "left",
      letterSpacing: -0.02 * RARITY_NUM_SIZE,
      shadow: SHADOW_DEFAULT,
      animate: { value: r.data.unlocked, delay: 150 + i * 60 },
    });
    ops.push({
      type: "text",
      text: `/${r.data.total.toLocaleString("en-US")}`,
      // Position the suffix right after the unlocked number. We use an
      // approximate advance — the unlocked number is short (≤3 digits
      // typically), tabular-nums keeps widths stable. 30px per glyph
      // at size 48 in Fraunces 600 is a close enough approximation
      // for the offset; the visual read is "X/Y" with a clear split.
      x: colX + unlockedStr.length * 30,
      y: rarityNumBaselineY,
      size: 24,
      weight: 400,
      family: "serif",
      color: c.faint,
      align: "left",
      shadow: SHADOW_DEFAULT,
    });

    colX += RARITY_COL_W + STATS_GAP;
  }

  // ── E. Footer (bottom 50) ────────────────────────────────────────
  const FOOTER_BOTTOM = 50;
  const FOOTER_BASELINE_Y = PASSPORT_H - FOOTER_BOTTOM;

  const totalSpecies =
    data.rarityProgress.common.total +
    data.rarityProgress.rare.total +
    data.rarityProgress.legendary.total;

  // Left cluster: display name + meta line
  const DISPLAY_NAME_SIZE = 28;
  ops.push({
    type: "text",
    text: data.displayName,
    x: LEFT,
    y: FOOTER_BASELINE_Y,
    size: DISPLAY_NAME_SIZE,
    weight: 600,
    family: "serif",
    color: c.cream,
    align: "left",
    letterSpacing: -0.01 * DISPLAY_NAME_SIZE,
    shadow: SHADOW_DEFAULT,
  });

  // Meta line sits to the right of the display name. We approximate
  // the display-name advance so the two lines share a baseline (as per
  // `align-items: baseline`). The gap is README-spec'd at 20px.
  const nameApproxWidth = approxTextWidth(
    data.displayName,
    DISPLAY_NAME_SIZE,
    "serif",
  );
  const metaX = LEFT + nameApproxWidth + 20;

  const metaText = data.currentStreak > 0
    ? `${data.speciesUnlocked} / ${totalSpecies} SPECIES · STREAK ${data.currentStreak}`
    : `${data.speciesUnlocked} / ${totalSpecies} SPECIES`;
  ops.push({
    type: "text",
    text: metaText,
    x: metaX,
    y: FOOTER_BASELINE_Y,
    size: 14,
    weight: 500,
    family: "sans",
    color: c.faint,
    align: "left",
    letterSpacing: 0.2 * 14,
    shadow: SHADOW_DEFAULT,
  });

  // Right slot: URL
  ops.push({
    type: "text",
    text: "FLORIFY.ZEZE.APP",
    x: RIGHT,
    y: FOOTER_BASELINE_Y,
    size: 14,
    weight: 500,
    family: "sans",
    color: c.faint,
    align: "right",
    letterSpacing: 0.2 * 14,
    shadow: SHADOW_DEFAULT,
  });

  return ops;
}

/**
 * Rough text-width estimate used only for laying out adjacent baseline
 * segments (display name + meta line in the footer). Fraunces at 600
 * averages ~0.55em per glyph for mixed-case; Thai glyphs are wider so
 * we bump the factor. Not a replacement for ctx.measureText — just a
 * build-time approximation so layout is deterministic.
 */
function approxTextWidth(
  text: string,
  size: number,
  family: "serif" | "sans" | "mono",
): number {
  const hasThai = /[\u0E00-\u0E7F]/.test(text);
  const perGlyph = hasThai ? 0.72 : family === "serif" ? 0.58 : 0.55;
  return text.length * size * perGlyph;
}

