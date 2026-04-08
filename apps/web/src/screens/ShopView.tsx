'use client';

import { useState } from 'react';
import Link from 'next/link';
import { nanoid } from 'nanoid';
import {
  BOOSTER_COST_COMMON,
  BOOSTER_COST_RARE,
  BOOSTER_COST_LEGENDARY,
  type BoosterTier,
  type TreeInstance,
} from '@florify/shared';
import { BackIcon } from '@/components/icons';
import { SproutIndicator } from '@/components/SproutIndicator';
import { HarvestOverlay } from '@/components/HarvestOverlay';
import { BoosterOpeningOverlay } from '@/components/BoosterOpeningOverlay';
import { useGameStore, type BoosterResult } from '@/store/gameStore';
import { useT } from '@/i18n/useT';

const PACKS: { tier: BoosterTier; cost: number; odds: [number, number, number] }[] = [
  { tier: 'common', cost: BOOSTER_COST_COMMON, odds: [80, 15, 5] },
  { tier: 'rare', cost: BOOSTER_COST_RARE, odds: [30, 60, 10] },
  { tier: 'legendary', cost: BOOSTER_COST_LEGENDARY, odds: [5, 45, 45] },
];

const TIER_STYLE: Record<BoosterTier, {
  gradient: string;
  border: string;
  glow: string;
  accent: string;
  accentLight: string;
  foilStops: [string, string, string];
  icon: string;
}> = {
  common: {
    gradient: 'from-[#e8dfc8] via-[#f5eedd] to-[#e0d4b8]',
    border: 'border-[#c4b896]',
    glow: '0 0 20px rgba(184, 168, 136, 0.3)',
    accent: '#8B7355',
    accentLight: '#B8A888',
    foilStops: ['#F0E8D4', '#FBF5E8', '#E3D7BE'],
    icon: '🌿',
  },
  rare: {
    gradient: 'from-[#c8dae8] via-[#ddeeff] to-[#b8cfe0]',
    border: 'border-[#96b4c4]',
    glow: '0 0 24px rgba(122, 156, 184, 0.4)',
    accent: '#4A7A9C',
    accentLight: '#7A9CB8',
    foilStops: ['#D4E4F0', '#E8F2FB', '#BED7E3'],
    icon: '✨',
  },
  legendary: {
    gradient: 'from-[#e8d4a8] via-[#fff2d4] to-[#d4b878]',
    border: 'border-[#c4a044]',
    glow: '0 0 32px rgba(212, 162, 76, 0.5)',
    accent: '#9C7A2A',
    accentLight: '#D4A24C',
    foilStops: ['#F0DCA8', '#FFF5D4', '#D4B878'],
    icon: '🌼',
  },
};

const TIER_LABEL: Record<BoosterTier, string> = {
  common: 'Common',
  rare: 'Rare',
  legendary: 'Legendary',
};

export function ShopView() {
  const t = useT();
  const sprouts = useGameStore((s) => s.state.sprouts);
  const openBooster = useGameStore((s) => s.openBooster);

  const [openingTier, setOpeningTier] = useState<BoosterTier | null>(null);
  const [boosterResult, setBoosterResult] = useState<BoosterResult | null>(null);
  const [harvestTree, setHarvestTree] = useState<TreeInstance | null>(null);

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
    <div className="min-h-full h-full overflow-y-auto bg-cream-50 safe-top safe-bottom scrollbar-elegant">
      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="relative flex items-center justify-between px-4 py-4 animate-fade-down">
        <Link
          href="/"
          className="w-10 h-10 flex items-center justify-center text-ink-700 hover:bg-cream-100 rounded-full transition-all duration-300 ease-out hover:-translate-x-0.5"
          aria-label={t('shop.back')}
        >
          <BackIcon />
        </Link>
        <h1 className="text-xl font-serif font-bold text-ink-900 tracking-wide">{t('shop.title')}</h1>
        <div className="w-10" aria-hidden />
      </header>

      {/* ── Sprout balance ──────────────────────────────────────── */}
      <div className="flex justify-center mb-6 animate-fade-up" style={{ animationDelay: '60ms' }}>
        <SproutIndicator />
      </div>

      {/* ── Booster Pack cards ──────────────────────────────────── */}
      <div className="px-4 pb-24 flex flex-col gap-5">
        {PACKS.map(({ tier, cost, odds }, i) => {
          const style = TIER_STYLE[tier];
          const canAfford = sprouts >= cost;

          return (
            <button
              key={tier}
              type="button"
              onClick={() => handleBuy(tier)}
              disabled={!canAfford}
              className="group relative w-full text-left animate-fade-up disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ animationDelay: `${120 + i * 100}ms` }}
            >
              {/* Card */}
              <div
                className={`relative overflow-hidden rounded-2xl border-2 ${style.border} bg-gradient-to-br ${style.gradient} p-0 transition-all duration-300 group-hover:scale-[1.01] group-active:scale-[0.98]`}
                style={{ boxShadow: canAfford ? style.glow : undefined }}
              >
                {/* Foil shine sweep */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.4) 45%, rgba(255,255,255,0.1) 55%, transparent 70%)',
                  }}
                />

                {/* Diagonal crimp pattern */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]" aria-hidden>
                  <pattern id={`crimp-${tier}`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="8" stroke="currentColor" strokeWidth="1" />
                  </pattern>
                  <rect width="100%" height="100%" fill={`url(#crimp-${tier})`} />
                </svg>

                <div className="relative flex items-stretch">
                  {/* Left: Pack visual */}
                  <div className="flex-shrink-0 w-28 flex items-center justify-center py-6">
                    <PackSVG tier={tier} style={style} />
                  </div>

                  {/* Right: Info */}
                  <div className="flex-1 py-5 pr-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="font-serif text-base font-bold text-ink-800 leading-tight">
                          {TIER_LABEL[tier]}
                        </h2>
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] mt-0.5" style={{ color: style.accent }}>
                          Booster Pack
                        </div>
                      </div>
                      <div
                        className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
                        style={{ background: `${style.accentLight}30` }}
                      >
                        <span className="text-sm">🌱</span>
                        <span className="font-mono text-base font-bold tabular-nums" style={{ color: style.accent }}>
                          {cost}
                        </span>
                      </div>
                    </div>

                    {/* Odds as mini bars */}
                    <div className="mt-3.5 space-y-1.5">
                      <OddsBar label={t('shop.odds.common', { pct: odds[0] })} pct={odds[0]} color="#B8A888" />
                      <OddsBar label={t('shop.odds.rare', { pct: odds[1] })} pct={odds[1]} color="#7A9CB8" />
                      <OddsBar label={t('shop.odds.legendary', { pct: odds[2] })} pct={odds[2]} color="#D4A24C" />
                    </div>
                  </div>
                </div>

                {/* Bottom buy strip */}
                <div
                  className="relative py-2.5 text-center text-xs font-bold uppercase tracking-[0.15em] transition-colors duration-200"
                  style={{
                    background: canAfford ? `${style.accentLight}25` : 'rgba(0,0,0,0.03)',
                    color: canAfford ? style.accent : '#9C8F7B',
                    borderTop: `1px solid ${style.accentLight}40`,
                  }}
                >
                  {canAfford ? t('shop.buy') : t('shop.insufficient')}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Booster opening overlay ─────────────────────────────── */}
      {openingTier && (
        <BoosterOpeningOverlay
          tier={openingTier}
          rarity={boosterResult?.rarity ?? 'common'}
          onComplete={handleOpeningComplete}
        />
      )}

      {/* ── Harvest result overlay ──────────────────────────────── */}
      <HarvestOverlay
        tree={harvestTree}
        pityPointsGained={boosterResult?.pityPointsGained}
        pityReward={boosterResult?.pityReward}
        sproutsGained={boosterResult?.sproutsGained}
        source="booster"
        onDismiss={handleDismissHarvest}
      />
    </div>
  );
}

/** Mini booster pack SVG — foil packet with tier-specific coloring */
function PackSVG({ tier, style }: { tier: BoosterTier; style: typeof TIER_STYLE.common }) {
  const id = `pack-${tier}`;
  return (
    <svg viewBox="0 0 80 110" className="w-16 h-22 drop-shadow-sm" aria-hidden>
      <defs>
        <linearGradient id={`${id}-foil`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={style.foilStops[0]} />
          <stop offset="50%" stopColor={style.foilStops[1]} />
          <stop offset="100%" stopColor={style.foilStops[2]} />
        </linearGradient>
        <linearGradient id={`${id}-seal`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={style.accentLight} stopOpacity="0.6" />
          <stop offset="100%" stopColor={style.accent} stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Body */}
      <rect x="8" y="12" width="64" height="86" rx="4" fill={`url(#${id}-foil)`} stroke={style.accentLight} strokeWidth="1" />

      {/* Top seal */}
      <rect x="8" y="12" width="64" height="14" rx="4" fill={`url(#${id}-seal)`} />
      <rect x="8" y="22" width="64" height="4" fill={`url(#${id}-seal)`} />

      {/* Bottom seal */}
      <rect x="8" y="84" width="64" height="14" rx="4" fill={`url(#${id}-seal)`} />
      <rect x="8" y="84" width="64" height="4" fill={`url(#${id}-seal)`} />

      {/* Crimp lines */}
      {[16, 22, 28, 34, 40, 46, 52, 56, 62].map((x) => (
        <line key={x} x1={x} y1="13" x2={x} y2="25" stroke={style.accent} strokeWidth="0.4" opacity="0.3" />
      ))}
      {[16, 22, 28, 34, 40, 46, 52, 56, 62].map((x) => (
        <line key={`b${x}`} x1={x} y1="85" x2={x} y2="97" stroke={style.accent} strokeWidth="0.4" opacity="0.3" />
      ))}

      {/* Center ornament */}
      <circle cx="40" cy="55" r="16" fill="none" stroke={style.accentLight} strokeWidth="1" opacity="0.5" />
      <circle cx="40" cy="55" r="10" fill="none" stroke={style.accentLight} strokeWidth="0.6" opacity="0.3" />

      {/* Center icon text */}
      <text x="40" y="59" textAnchor="middle" fontSize="14" dominantBaseline="middle">
        {style.icon}
      </text>

      {/* Diagonal gloss */}
      <rect x="8" y="12" width="64" height="86" rx="4" fill="url(#gloss-sweep)" opacity="0.15" />
      <defs>
        <linearGradient id="gloss-sweep" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="40%" stopColor="white" stopOpacity="0.6" />
          <stop offset="60%" stopColor="white" stopOpacity="0" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Tiny horizontal bar showing rarity odds */
function OddsBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-ink-900/5 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color, opacity: 0.7 }}
        />
      </div>
      <span className="text-[10px] text-ink-500 tabular-nums font-medium w-24 text-right">
        {label}
      </span>
    </div>
  );
}
