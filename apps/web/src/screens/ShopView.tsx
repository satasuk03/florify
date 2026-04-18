"use client";

import { useState } from "react";
import Link from "next/link";
import { nanoid } from "nanoid";
import {
  BOOSTER_COST_COMMON,
  BOOSTER_COST_RARE,
  BOOSTER_COST_LEGENDARY,
  COSMETIC_BOX_COST,
  type BoosterTier,
  type CosmeticType,
  type TreeInstance,
} from "@florify/shared";
import { BackIcon, CoinIcon } from "@/components/icons";
import { SproutIndicator } from "@/components/SproutIndicator";
import { GoldIndicator } from "@/components/GoldIndicator";
import { HarvestOverlay } from "@/components/HarvestOverlay";
import { BoosterOpeningOverlay } from "@/components/BoosterOpeningOverlay";
import { CosmeticBoxOverlay } from "@/components/CosmeticBoxOverlay";
import {
  useGameStore,
  type BoosterResult,
  type CosmeticBoxResult,
} from "@/store/gameStore";
import { useT, useLanguage } from "@/i18n/useT";
import { SPECIES_BY_RARITY } from "@/data/species";

/* ─── Tier palette (warm, paper-friendly) ────────────────────── */
type TierPalette = {
  main: string;
  deep: string;
  paper: string;
  light: string;
  bloom: string;
};

const PALETTE: Record<BoosterTier, TierPalette> = {
  common: {
    main: "#b8a888",
    deep: "#8b7355",
    paper: "#f0e8d4",
    light: "#d8cfb8",
    bloom: "#9bb57d",
  },
  rare: {
    main: "#7a9cb8",
    deep: "#4a7a9c",
    paper: "#dce8f0",
    light: "#b0c8d8",
    bloom: "#a9c5d8",
  },
  legendary: {
    main: "#d4a24c",
    deep: "#9c7a2a",
    paper: "#f5e4b8",
    light: "#e8c888",
    bloom: "#e8b860",
  },
};

const PACKS: {
  tier: BoosterTier;
  cost: number;
  odds: [number, number, number];
}[] = [
  { tier: "common", cost: BOOSTER_COST_COMMON, odds: [80, 15, 5] },
  { tier: "rare", cost: BOOSTER_COST_RARE, odds: [30, 60, 10] },
  { tier: "legendary", cost: BOOSTER_COST_LEGENDARY, odds: [5, 45, 45] },
];

const TIER_LABEL: Record<BoosterTier, string> = {
  common: "Common",
  rare: "Rare",
  legendary: "Legendary",
};

export function ShopView() {
  const t = useT();
  const lang = useLanguage();
  const sprouts = useGameStore((s) => s.state.sprouts);
  const gold = useGameStore((s) => s.state.gold);
  const openBooster = useGameStore((s) => s.openBooster);
  const openCosmeticBox = useGameStore((s) => s.openCosmeticBox);

  const [openingTier, setOpeningTier] = useState<BoosterTier | null>(null);
  const [boosterResult, setBoosterResult] = useState<BoosterResult | null>(
    null,
  );
  const [harvestTree, setHarvestTree] = useState<TreeInstance | null>(null);
  const [cosmeticOpening, setCosmeticOpening] = useState<{
    type: CosmeticType;
    result: CosmeticBoxResult;
  } | null>(null);

  const handleBuyCosmeticBox = (type: CosmeticType) => {
    const result = openCosmeticBox(type);
    if (!result) return;
    setCosmeticOpening({ type, result });
  };

  const handleBuy = (tier: BoosterTier) => {
    const result = openBooster(tier);
    if (!result) return;
    setBoosterResult(result);
    setOpeningTier(tier);
  };

  const handleOpeningComplete = () => {
    if (!boosterResult) return;
    const syntheticTree: TreeInstance = {
      id: nanoid(),
      seed: 0,
      speciesId: boosterResult.speciesId,
      rarity: boosterResult.rarity,
      requiredWaterings: 0,
      currentWaterings: 0,
      plantedAt: Date.now(),
      harvestedAt: Date.now(),
    };
    setOpeningTier(null);
    setHarvestTree(syntheticTree);
  };

  const handleDismissHarvest = () => {
    setHarvestTree(null);
    setBoosterResult(null);
  };

  return (
    <div
      className="min-h-full h-full overflow-y-auto safe-top safe-bottom scrollbar-elegant relative"
      style={{ background: "var(--color-cream-100)" }}
    >
      {/* Subtle paper texture across the page */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0.5,
          background:
            "repeating-radial-gradient(circle at 30% 40%, rgba(122,92,58,0.015) 0, rgba(122,92,58,0.015) 2px, transparent 2px, transparent 5px)",
        }}
      />

      {/* ── Masthead ───────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-20 animate-fade-down"
        style={{
          background: "var(--color-cream-50)",
          borderBottom: "2px solid var(--color-ink-900)",
        }}
      >
        <div className="flex items-center px-4 pt-4 pb-2 gap-2">
          <Link
            href="/"
            className="w-10 h-10 flex items-center justify-center text-ink-700 bg-cream-50/85 backdrop-blur-sm border border-cream-300 rounded-full shadow-soft-sm transition-all duration-300 ease-out hover:bg-cream-100 hover:-translate-x-0.5"
            aria-label={t("shop.back")}
          >
            <BackIcon />
          </Link>
          <div className="flex-1" />
          <SproutIndicator />
          <GoldIndicator />
        </div>

        <div className="text-center px-4 pb-3">
          <div
            className="font-mono uppercase text-ink-500"
            style={{ fontSize: 9, letterSpacing: "0.3em" }}
          >
            {t("shop.gazette.volume")}
          </div>
          <h1
            className="font-serif text-ink-900 mt-1"
            style={{
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 0.95,
            }}
          >
            {t("shop.gazette.mastheadLead")}
            <br />
            <em
              style={{
                fontStyle: "italic",
                fontWeight: 600,
                color: "var(--color-clay-500)",
              }}
            >
              {t("shop.gazette.mastheadAccent")}
            </em>
          </h1>
          <div
            className="font-serif italic text-ink-500 mt-1"
            style={{ fontSize: 11 }}
          >
            {t("shop.gazette.dek")}
          </div>
        </div>
      </div>

      {/* ── Ornament divider ───────────────────────────────────── */}
      <div
        aria-hidden
        className="flex items-center justify-center gap-2.5 text-ink-300 pt-4 pb-1.5 relative"
      >
        <span
          style={{
            flex: 1,
            maxWidth: 80,
            height: 1,
            background: "currentColor",
            opacity: 0.4,
          }}
        />
        <span
          className="font-serif italic"
          style={{ fontSize: 14, opacity: 0.7 }}
        >
          ❦
        </span>
        <span
          style={{
            flex: 1,
            maxWidth: 80,
            height: 1,
            background: "currentColor",
            opacity: 0.4,
          }}
        />
      </div>

      {/* ── Pack plates ────────────────────────────────────────── */}
      <div className="relative">
        {PACKS.map(({ tier, cost, odds }, i) => (
          <PackPlate
            key={tier}
            tier={tier}
            cost={cost}
            odds={odds}
            plate={i + 1}
            canAfford={sprouts >= cost}
            onBuy={() => handleBuy(tier)}
            t={t}
            lang={lang}
          />
        ))}
      </div>

      {/* ── Classifieds (cosmetic boxes) ───────────────────────── */}
      <div className="relative px-4 pt-4 pb-8">
        <div
          className="flex items-center gap-2.5 pb-2"
          style={{ borderBottom: "1px solid var(--color-ink-900)" }}
        >
          <div
            className="font-serif"
            style={{
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              color: "var(--color-ink-900)",
            }}
          >
            {t("shop.gazette.classifieds")}
          </div>
          <div
            style={{
              flex: 1,
              borderTop: "2px double var(--color-ink-900)",
              marginTop: 4,
              opacity: 0.6,
            }}
          />
          <div
            className="font-mono uppercase text-ink-500"
            style={{ fontSize: 9, letterSpacing: "0.2em" }}
          >
            {t("shop.gazette.payInGold")}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mt-2.5">
          <ClassifiedAd
            type="character"
            cost={COSMETIC_BOX_COST}
            canAfford={gold >= COSMETIC_BOX_COST}
            onBuy={() => handleBuyCosmeticBox("character")}
            t={t}
          />
          <ClassifiedAd
            type="background"
            cost={COSMETIC_BOX_COST}
            canAfford={gold >= COSMETIC_BOX_COST}
            onBuy={() => handleBuyCosmeticBox("background")}
            t={t}
          />
        </div>
      </div>

      {/* ── Overlays (unchanged) ───────────────────────────────── */}
      {cosmeticOpening && (
        <CosmeticBoxOverlay
          type={cosmeticOpening.type}
          result={cosmeticOpening.result}
          onDismiss={() => setCosmeticOpening(null)}
        />
      )}

      {openingTier && (
        <BoosterOpeningOverlay
          tier={openingTier}
          rarity={boosterResult?.rarity ?? "common"}
          onComplete={handleOpeningComplete}
        />
      )}

      <HarvestOverlay
        tree={harvestTree}
        isNew={boosterResult?.isNew ?? false}
        pityPointsGained={boosterResult?.pityPointsGained}
        pityReward={boosterResult?.pityReward}
        sproutsGained={boosterResult?.sproutsGained}
        source="booster"
        onDismiss={handleDismissHarvest}
      />
    </div>
  );
}

/* ─── Pack plate ─────────────────────────────────────────────── */
function PackPlate({
  tier,
  cost,
  odds,
  plate,
  canAfford,
  onBuy,
  t,
  lang,
}: {
  tier: BoosterTier;
  cost: number;
  odds: [number, number, number];
  plate: number;
  canAfford: boolean;
  onBuy: () => void;
  t: ReturnType<typeof useT>;
  lang: ReturnType<typeof useLanguage>;
}) {
  const c = PALETTE[tier];
  const speciesCount = SPECIES_BY_RARITY[tier].length;
  const thaiTitle = {
    common: t("shop.gazette.tier.commonTh"),
    rare: t("shop.gazette.tier.rareTh"),
    legendary: t("shop.gazette.tier.legendaryTh"),
  }[tier];
  const enLead = {
    common: t("shop.gazette.tier.commonLead"),
    rare: t("shop.gazette.tier.rareLead"),
    legendary: t("shop.gazette.tier.legendaryLead"),
  }[tier];
  const enAccent = {
    common: t("shop.gazette.tier.commonAccent"),
    rare: t("shop.gazette.tier.rareAccent"),
    legendary: t("shop.gazette.tier.legendaryAccent"),
  }[tier];

  return (
    <div
      className="animate-fade-up"
      style={{
        padding: "8px 18px 20px",
        borderBottom: "1px dashed var(--color-cream-400)",
        animationDelay: `${plate * 90}ms`,
      }}
    >
      {/* Plate header (eyebrow + species count) */}
      <div className="flex items-baseline justify-between mb-2.5">
        <div
          className="font-mono uppercase"
          style={{
            fontSize: 9,
            letterSpacing: "0.22em",
            color: c.deep,
            fontWeight: 600,
          }}
        >
          {t("shop.gazette.plateLabel", {
            n: plate,
            tier: TIER_LABEL[tier],
          })}
        </div>
        <div
          className="font-serif italic text-ink-500"
          style={{ fontSize: 11 }}
        >
          {t("shop.gazette.speciesPossible", { count: speciesCount })}
        </div>
      </div>

      {/* Big serif title */}
      <h2
        className="font-serif text-ink-900 m-0"
        style={{
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: "-0.025em",
          lineHeight: 1,
        }}
      >
        {lang === "th" ? (
          <em
            style={{
              fontStyle: "italic",
              color: c.deep,
              fontWeight: 600,
            }}
          >
            {thaiTitle}
          </em>
        ) : (
          <>
            {enLead}{" "}
            <em
              style={{
                fontStyle: "italic",
                color: c.deep,
                fontWeight: 600,
              }}
            >
              {enAccent}
            </em>
          </>
        )}
      </h2>

      {/* Body row: pack + almanac */}
      <div className="flex items-stretch gap-3.5 mt-3">
        {/* Pack on cream card with offset shadow */}
        <div
          className="flex-shrink-0 flex items-center justify-center"
          style={{
            width: 120,
            background: "var(--color-cream-50)",
            border: "1px solid var(--color-cream-300)",
            borderRadius: 2,
            padding: 8,
            boxShadow: "2px 2px 0 rgba(75,55,30,0.12)",
          }}
        >
          <GazettePackSVG tier={tier} width={102} />
        </div>

        {/* Almanac column */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div
              className="font-mono uppercase text-ink-500"
              style={{
                fontSize: 9,
                letterSpacing: "0.14em",
                marginBottom: 6,
              }}
            >
              {t("shop.gazette.almanac")}
            </div>

            <OddsRow
              label={t("shop.gazette.oddsCommon")}
              pct={odds[0]}
              color="var(--color-rarity-common)"
            />
            <OddsRow
              label={t("shop.gazette.oddsRare")}
              pct={odds[1]}
              color="var(--color-rarity-rare)"
            />
            <OddsRow
              label={t("shop.gazette.oddsLegendary")}
              pct={odds[2]}
              color="var(--color-rarity-legendary)"
            />
          </div>

          <div
            className="font-serif italic text-ink-500"
            style={{ fontSize: 11, lineHeight: 1.4, marginTop: 8 }}
          >
            {t(`shop.tagline.${tier}` as Parameters<typeof t>[0])}
          </div>
        </div>
      </div>

      {/* Ticket buy button */}
      <button
        type="button"
        onClick={onBuy}
        disabled={!canAfford}
        className="group relative w-full text-left mt-3 transition-all duration-200 disabled:cursor-not-allowed"
        style={{
          background: c.paper,
          border: `1.5px dashed ${c.deep}`,
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderRadius: 4,
          opacity: canAfford ? 1 : 0.55,
        }}
      >
        {/* Left notch cutout */}
        <span
          aria-hidden
          className="absolute"
          style={{
            left: -8,
            top: "50%",
            transform: "translateY(-50%)",
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "var(--color-cream-100)",
          }}
        />
        {/* Right notch cutout */}
        <span
          aria-hidden
          className="absolute"
          style={{
            right: -8,
            top: "50%",
            transform: "translateY(-50%)",
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "var(--color-cream-100)",
          }}
        />

        <div className="flex-1">
          <div
            className="font-mono uppercase"
            style={{
              fontSize: 8,
              letterSpacing: "0.2em",
              color: c.deep,
            }}
          >
            {t("shop.gazette.admitOne")}
          </div>
          <div
            className="font-serif"
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: c.deep,
              letterSpacing: "-0.02em",
            }}
          >
            <span className="tabular-nums">{cost}</span>{" "}
            <span
              className="font-sans uppercase"
              style={{
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.1em",
              }}
            >
              {t("shop.gazette.sproutsUnit")}
            </span>
          </div>
        </div>

        <span
          className="font-serif italic shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-active:scale-[0.97]"
          style={{
            padding: "10px 18px",
            background: canAfford ? c.deep : "rgba(155, 143, 123, 0.6)",
            color: c.paper,
            fontSize: 14,
            fontWeight: 600,
            borderRadius: 4,
            boxShadow: "var(--shadow-soft-sm)",
          }}
        >
          {canAfford
            ? t("shop.gazette.tearOff")
            : t("shop.gazette.notEnough")}
        </span>
      </button>
    </div>
  );
}

/* ─── Odds row with hatched fill ─────────────────────────────── */
function OddsRow({
  label,
  pct,
  color,
}: {
  label: string;
  pct: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 mt-[3px]">
      <div
        className="font-serif text-ink-700"
        style={{ width: 62, fontSize: 11 }}
      >
        {label}
      </div>
      <div
        className="flex-1 relative overflow-hidden"
        style={{
          height: 10,
          background: "rgba(43,36,27,0.05)",
          border: "1px solid rgba(43,36,27,0.1)",
        }}
      >
        <div
          className="absolute left-0 top-0 bottom-0"
          style={{
            width: `${pct}%`,
            background: color,
            backgroundImage: `repeating-linear-gradient(45deg, ${color} 0, ${color} 3px, rgba(255,255,255,0.2) 3px, rgba(255,255,255,0.2) 5px)`,
          }}
        />
      </div>
      <div
        className="font-mono text-ink-900 tabular-nums text-right"
        style={{ width: 30, fontSize: 11, fontWeight: 500 }}
      >
        {pct}%
      </div>
    </div>
  );
}

/* ─── Classified ad (cosmetic box) ───────────────────────────── */
function ClassifiedAd({
  type,
  cost,
  canAfford,
  onBuy,
  t,
}: {
  type: CosmeticType;
  cost: number;
  canAfford: boolean;
  onBuy: () => void;
  t: ReturnType<typeof useT>;
}) {
  const isChar = type === "character";
  const titleKey = isChar ? "shop.gazette.wanted" : "shop.gazette.forHire";
  const dekKey = isChar
    ? "shop.gazette.characterDek"
    : "shop.gazette.backgroundDek";

  return (
    <button
      type="button"
      onClick={onBuy}
      disabled={!canAfford}
      className="group text-left transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-55 hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.99]"
      style={{
        background: "var(--color-cream-50)",
        border: "1px solid var(--color-ink-900)",
        padding: "10px 12px",
      }}
    >
      <div
        className="font-serif"
        style={{
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: "-0.005em",
          color: "var(--color-ink-900)",
        }}
      >
        {t(titleKey)}
      </div>
      <div
        className="font-serif italic text-ink-700"
        style={{
          fontSize: 13,
          fontWeight: 500,
          lineHeight: 1.25,
          marginTop: 2,
        }}
      >
        {t(dekKey)}
      </div>

      {/* Detailed odds (replaces "INQUIRE WITHIN") */}
      <div
        className="flex items-center flex-wrap gap-x-2 gap-y-0.5 tabular-nums text-ink-500 mt-2"
        style={{ fontSize: 9 }}
      >
        <span style={{ color: "var(--color-rarity-common)" }}>● 30%</span>
        <span style={{ color: "var(--color-rarity-rare)" }}>● 6%</span>
        <span style={{ color: "var(--color-rarity-legendary)" }}>● 4%</span>
        <span className="text-ink-300">· Gold 36%</span>
        <span className="text-ink-300">· Drops 24%</span>
      </div>

      {/* Price row (replaces "24 available" with gold cost) */}
      <div
        className="flex items-center justify-between mt-1.5 pt-1.5"
        style={{ borderTop: "1px dashed var(--color-cream-400)" }}
      >
        <div className="flex items-center gap-1 text-ink-700">
          <CoinIcon size={12} />
          <span
            className="font-mono tabular-nums"
            style={{ fontSize: 11, fontWeight: 600 }}
          >
            {cost}
          </span>
        </div>
        <div
          className="font-serif italic transition-transform duration-200 group-hover:translate-x-0.5"
          style={{ fontSize: 11, color: "var(--color-clay-600)" }}
        >
          {t("shop.gazette.buy")}
        </div>
      </div>
    </button>
  );
}

/* ─── Gazette pack SVG (craft-press, per-tier bloom) ─────────── */
function GazettePackSVG({
  tier,
  width = 102,
}: {
  tier: BoosterTier;
  width?: number;
}) {
  const c = PALETTE[tier];
  const id = `gp-${tier}`;
  const h = width * 1.45;

  return (
    <svg
      viewBox="0 0 140 200"
      width={width}
      height={h}
      style={{
        display: "block",
        filter:
          "drop-shadow(0 8px 14px rgba(75,55,30,0.18)) drop-shadow(0 2px 4px rgba(75,55,30,0.12))",
      }}
      aria-hidden
    >
      <defs>
        <linearGradient id={`${id}-paper`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c.paper} />
          <stop offset="0.6" stopColor="#fbf5e8" />
          <stop offset="1" stopColor={c.light} />
        </linearGradient>
        <linearGradient id={`${id}-seal`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.deep} stopOpacity="0.85" />
          <stop offset="1" stopColor={c.main} stopOpacity="0.7" />
        </linearGradient>
        <pattern
          id={`${id}-grain`}
          patternUnits="userSpaceOnUse"
          width="3"
          height="3"
        >
          <circle cx="0.5" cy="0.5" r="0.35" fill={c.deep} opacity="0.08" />
          <circle cx="2" cy="2" r="0.25" fill={c.deep} opacity="0.05" />
        </pattern>
        <linearGradient id={`${id}-gloss`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.4" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Packet body */}
      <rect
        x="8"
        y="14"
        width="124"
        height="172"
        rx="3"
        fill={`url(#${id}-paper)`}
        stroke={c.deep}
        strokeOpacity="0.25"
        strokeWidth="0.8"
      />
      {/* Paper grain */}
      <rect
        x="8"
        y="14"
        width="124"
        height="172"
        rx="3"
        fill={`url(#${id}-grain)`}
      />

      {/* Top seal */}
      <rect
        x="8"
        y="14"
        width="124"
        height="22"
        rx="3"
        fill={`url(#${id}-seal)`}
      />
      <rect x="8" y="32" width="124" height="4" fill={`url(#${id}-seal)`} />

      {/* Top crimp lines */}
      {CRIMP_XS.map((x) => (
        <line
          key={`t${x}`}
          x1={x}
          y1="15"
          x2={x}
          y2="35"
          stroke={c.deep}
          strokeWidth="0.5"
          opacity="0.35"
        />
      ))}

      {/* Stamped logotype */}
      <text
        x="70"
        y="29"
        textAnchor="middle"
        fontFamily="var(--font-serif)"
        fontSize="7"
        fontWeight="600"
        fill="#fbf8f3"
        letterSpacing="1.4"
        opacity="0.9"
      >
        FLORIFY · {TIER_LABEL[tier].toUpperCase()}
      </text>

      {/* Bloom */}
      <g transform="translate(70, 92)">
        {tier === "common" && <CommonBloom c={c} />}
        {tier === "rare" && <RareBloom c={c} />}
        {tier === "legendary" && <LegendaryBloom c={c} />}
      </g>

      {/* Tier title (italic serif, tier-colored) */}
      <text
        x="70"
        y="162"
        textAnchor="middle"
        fontFamily="var(--font-serif)"
        fontSize="13"
        fontWeight="600"
        fontStyle="italic"
        fill={c.deep}
      >
        {TIER_TITLE_EN[tier]}
      </text>

      {/* Small rule */}
      <line
        x1="56"
        y1="167"
        x2="84"
        y2="167"
        stroke={c.main}
        strokeWidth="0.6"
        opacity="0.6"
      />

      {/* Thai subtitle */}
      <text
        x="70"
        y="177"
        textAnchor="middle"
        fontFamily="var(--font-serif)"
        fontSize="7"
        fontWeight="500"
        fill={c.deep}
        opacity="0.55"
      >
        {TIER_TITLE_TH[tier]}
      </text>

      {/* Bottom seal */}
      <rect
        x="8"
        y="170"
        width="124"
        height="16"
        rx="3"
        fill={`url(#${id}-seal)`}
        opacity="0.95"
      />
      {CRIMP_XS.map((x) => (
        <line
          key={`b${x}`}
          x1={x}
          y1="170"
          x2={x}
          y2="185"
          stroke={c.paper}
          strokeWidth="0.5"
          opacity="0.35"
        />
      ))}

      {/* Diagonal gloss */}
      <rect
        x="8"
        y="14"
        width="124"
        height="172"
        rx="3"
        fill={`url(#${id}-gloss)`}
        opacity="0.18"
        pointerEvents="none"
      />
    </svg>
  );
}

const CRIMP_XS = [
  16, 22, 28, 34, 40, 46, 52, 58, 64, 70, 76, 82, 88, 94, 100, 106, 112, 118,
  124,
];

const TIER_TITLE_EN: Record<BoosterTier, string> = {
  common: "Wild Meadow",
  rare: "Twilight Bloom",
  legendary: "Celestial Bouquet",
};

const TIER_TITLE_TH: Record<BoosterTier, string> = {
  common: "ทุ่งดอกไม้ป่า",
  rare: "บุปผาสนธยา",
  legendary: "ช่อดาวสวรรค์",
};

/* ─── Bloom illustrations (per tier) ─────────────────────────── */
function CommonBloom({ c }: { c: TierPalette }) {
  return (
    <g>
      <g opacity="0.92">
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse
            key={a}
            cx="0"
            cy="-14"
            rx="6"
            ry="12"
            fill="#fbf5e8"
            stroke={c.deep}
            strokeWidth="0.6"
            transform={`rotate(${a})`}
          />
        ))}
        <circle cx="0" cy="0" r="6" fill={c.bloom} />
        <circle cx="0" cy="0" r="4" fill={c.main} />
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <circle
            key={a}
            cx="0"
            cy="-2.5"
            r="0.7"
            fill={c.deep}
            transform={`rotate(${a})`}
          />
        ))}
      </g>
      <g transform="translate(0, 18)">
        <path
          d="M0 0 Q-10 4 -14 14 Q-6 12 0 4"
          fill={c.bloom}
          opacity="0.85"
        />
        <path d="M0 0 Q10 4 14 14 Q6 12 0 4" fill={c.bloom} opacity="0.85" />
        <line
          x1="0"
          y1="-8"
          x2="0"
          y2="14"
          stroke={c.deep}
          strokeWidth="0.8"
          opacity="0.5"
        />
      </g>
    </g>
  );
}

function RareBloom({ c }: { c: TierPalette }) {
  return (
    <g>
      {[-30, 0, 30].map((a) => (
        <path
          key={`u${a}`}
          d="M0 0 Q-3 -8 -2 -16 Q0 -20 2 -16 Q3 -8 0 0 Z"
          fill={c.paper}
          stroke={c.deep}
          strokeWidth="0.6"
          transform={`rotate(${a})`}
        />
      ))}
      {[150, 180, 210].map((a) => (
        <path
          key={`l${a}`}
          d="M0 0 Q-4 6 -3 14 Q0 18 3 14 Q4 6 0 0 Z"
          fill={c.bloom}
          stroke={c.deep}
          strokeWidth="0.6"
          transform={`rotate(${a})`}
        />
      ))}
      {[150, 180, 210].map((a) => (
        <line
          key={`v${a}`}
          x1="0"
          y1="2"
          x2="0"
          y2="14"
          stroke={c.deep}
          strokeWidth="0.5"
          opacity="0.4"
          transform={`rotate(${a})`}
        />
      ))}
      <circle cx="0" cy="0" r="2.5" fill={c.deep} />
      <g opacity="0.9">
        <path
          d="M-18 -14L-15 -14M-16.5 -15.5L-16.5 -12.5"
          stroke={c.deep}
          strokeWidth="0.5"
        />
        <path
          d="M16 -16L19 -16M17.5 -17.5L17.5 -14.5"
          stroke={c.deep}
          strokeWidth="0.5"
        />
      </g>
    </g>
  );
}

function LegendaryBloom({ c }: { c: TierPalette }) {
  return (
    <g>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <ellipse
          key={`o${a}`}
          cx="0"
          cy="-14"
          rx="7"
          ry="10"
          fill={c.paper}
          stroke={c.deep}
          strokeWidth="0.6"
          opacity="0.9"
          transform={`rotate(${a})`}
        />
      ))}
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <ellipse
          key={`m${a}`}
          cx="0"
          cy="-9"
          rx="5.5"
          ry="7.5"
          fill={c.bloom}
          stroke={c.deep}
          strokeWidth="0.5"
          transform={`rotate(${a + 30})`}
        />
      ))}
      {[0, 90, 180, 270].map((a) => (
        <ellipse
          key={`i${a}`}
          cx="0"
          cy="-5"
          rx="3.5"
          ry="5"
          fill={c.main}
          stroke={c.deep}
          strokeWidth="0.4"
          transform={`rotate(${a + 15})`}
        />
      ))}
      <circle cx="0" cy="0" r="3.5" fill={c.deep} />
      <circle cx="0" cy="0" r="2" fill={c.main} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line
          key={`r${a}`}
          x1="0"
          y1="-26"
          x2="0"
          y2="-29"
          stroke={c.deep}
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.5"
          transform={`rotate(${a})`}
        />
      ))}
    </g>
  );
}
