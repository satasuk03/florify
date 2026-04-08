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

const TIER_COLORS: Record<BoosterTier, { bg: string; border: string; badge: string }> = {
  common: { bg: 'bg-leaf-50', border: 'border-leaf-300', badge: 'bg-leaf-100 text-leaf-700' },
  rare: { bg: 'bg-sky-50', border: 'border-sky-300', badge: 'bg-sky-100 text-sky-700' },
  legendary: { bg: 'bg-amber-50', border: 'border-amber-300', badge: 'bg-amber-100 text-amber-700' },
};

const TIER_LABEL: Record<BoosterTier, { th: string; en: string }> = {
  common: { th: 'Common Booster', en: 'Common Booster' },
  rare: { th: 'Rare Booster', en: 'Rare Booster' },
  legendary: { th: 'Legendary Booster', en: 'Legendary Booster' },
};

export function ShopView() {
  const t = useT();
  const sprouts = useGameStore((s) => s.state.sprouts);
  const openBooster = useGameStore((s) => s.openBooster);

  // Booster opening flow state
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
    // Create synthetic TreeInstance for HarvestOverlay
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
    <div className="min-h-full h-full overflow-y-auto bg-cream-50 safe-top safe-bottom px-4 pb-24 scrollbar-elegant">
      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="flex items-center justify-between py-4 animate-fade-down">
        <Link
          href="/"
          className="w-10 h-10 flex items-center justify-center text-ink-700 hover:bg-cream-100 rounded-full transition-all duration-300 ease-out hover:-translate-x-0.5"
          aria-label={t('shop.back')}
        >
          <BackIcon />
        </Link>
        <h1 className="text-xl font-serif">{t('shop.title')}</h1>
        <div className="w-10" aria-hidden />
      </header>

      {/* ── Sprout balance ──────────────────────────────────────── */}
      <div className="flex justify-center mb-6 animate-fade-up" style={{ animationDelay: '60ms' }}>
        <SproutIndicator />
      </div>

      {/* ── Booster Pack cards ──────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        {PACKS.map(({ tier, cost, odds }, i) => {
          const colors = TIER_COLORS[tier];
          const label = TIER_LABEL[tier];
          const canAfford = sprouts >= cost;

          return (
            <div
              key={tier}
              className={`rounded-2xl border-2 ${colors.border} ${colors.bg} p-5 animate-fade-up transition-all duration-300`}
              style={{ animationDelay: `${120 + i * 80}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="font-serif text-lg font-medium text-ink-800">{label.en}</h2>
                  <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${colors.badge}`}>
                    {tier.toUpperCase()}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-mono text-lg font-bold text-ink-800 tabular-nums">
                    🌱 {cost}
                  </div>
                </div>
              </div>

              {/* Odds breakdown */}
              <div className="flex gap-3 text-xs text-ink-500 mb-4">
                <span>{t('shop.odds.common', { pct: odds[0] })}</span>
                <span>{t('shop.odds.rare', { pct: odds[1] })}</span>
                <span>{t('shop.odds.legendary', { pct: odds[2] })}</span>
              </div>

              <button
                type="button"
                onClick={() => handleBuy(tier)}
                disabled={!canAfford}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  canAfford
                    ? 'bg-ink-800 text-cream-50 hover:bg-ink-700 active:scale-[0.98] shadow-soft-sm'
                    : 'bg-ink-200 text-ink-400 cursor-not-allowed'
                }`}
              >
                {canAfford ? t('shop.buy') : t('shop.insufficient')}
              </button>
            </div>
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
