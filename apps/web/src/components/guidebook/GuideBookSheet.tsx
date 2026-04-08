'use client';

import { useEffect, useState } from 'react';
import { SPECIES, SPECIES_BY_RARITY } from '@/data/species';
import { RARITY_ROLL_WEIGHTS } from '@/data/rarityWeights';
import { useT } from '@/i18n/useT';
import { useGameStore } from '@/store/gameStore';
import {
  PITY_THRESHOLD, PITY_POINTS_COMMON, PITY_POINTS_RARE, PITY_POINTS_LEGENDARY,
  SPROUT_HARVEST_COMMON, SPROUT_HARVEST_RARE, SPROUT_HARVEST_LEGENDARY,
  SPROUT_ALL_MISSIONS_BONUS, SPROUT_QUEST_REFRESH_COST,
} from '@florify/shared';
import type { Rarity } from '@florify/shared';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function GuideBookSheet({ open, onClose }: Props) {
  const t = useT();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-ink-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center animate-overlay-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t('guide.title')}
    >
      <div
        className="w-full sm:max-w-md bg-cream-50 rounded-t-3xl sm:rounded-3xl shadow-soft-lg max-h-[92dvh] overflow-y-auto scrollbar-elegant animate-sheet-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-cream-50 rounded-t-3xl px-6 pt-6 pb-4">
          <div className="flex justify-between items-center">
            <h2 className="font-serif text-2xl text-ink-900">{t('guide.title')}</h2>
            <button
              onClick={onClose}
              aria-label={t('guide.close')}
              className="text-ink-500 text-2xl leading-none w-10 h-10 flex items-center justify-center hover:bg-cream-100 rounded-full transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Welcome — always visible */}
        <div className="px-6 pb-2">
          <p className="text-sm text-ink-700 leading-relaxed">
            {t('guide.welcome.body', { total: SPECIES.length })}
          </p>
        </div>

        {/* Accordion sections */}
        <div className="px-6 pb-6 pt-2 space-y-1.5">
          <HowToPlaySection />
          <RaritySection />
          <SproutSection />
          <ShopSection />
          <DailySection />
          <ComboSection />
          <FeaturesSection />
          <DriedLeavesSection />
          <InstallPWASection />
          <SaveSection />
          <DeveloperSection />
        </div>
      </div>
    </div>
  );
}

// ── Accordion primitive ─────────────────────────────────────────────

function Accordion({
  icon,
  title,
  defaultOpen = false,
  children,
}: {
  icon: string;
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-cream-100 border border-cream-300 rounded-xl shadow-soft-sm overflow-hidden transition-shadow duration-300 ease-out hover:shadow-soft-md">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer"
        aria-expanded={open}
      >
        <span className="text-base leading-none shrink-0" aria-hidden>{icon}</span>
        <span className="text-sm font-medium text-ink-900 flex-1">{title}</span>
        <svg
          className="w-4 h-4 text-ink-400 shrink-0 transition-transform duration-300 ease-out"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-0.5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sections ────────────────────────────────────────────────────────

function HowToPlaySection() {
  const t = useT();
  const steps: Array<{ titleKey: 'guide.howto.plant.title' | 'guide.howto.water.title' | 'guide.howto.harvest.title'; bodyKey: 'guide.howto.plant.body' | 'guide.howto.water.body' | 'guide.howto.harvest.body'; icon: string }> = [
    { titleKey: 'guide.howto.plant.title', bodyKey: 'guide.howto.plant.body', icon: '1' },
    { titleKey: 'guide.howto.water.title', bodyKey: 'guide.howto.water.body', icon: '2' },
    { titleKey: 'guide.howto.harvest.title', bodyKey: 'guide.howto.harvest.body', icon: '3' },
  ];
  return (
    <Accordion icon="🌱" title={t('guide.howto.title')} defaultOpen>
      <div className="space-y-3">
        {steps.map((s) => (
          <div key={s.titleKey} className="flex gap-3">
            <span className="w-5 h-5 rounded-full bg-clay-500 text-cream-50 text-xs font-medium flex items-center justify-center shrink-0 mt-0.5">
              {s.icon}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-ink-900">{t(s.titleKey)}</div>
              <div className="text-xs text-ink-600 leading-relaxed mt-0.5">{t(s.bodyKey)}</div>
            </div>
          </div>
        ))}
      </div>
    </Accordion>
  );
}

function RaritySection() {
  const t = useT();
  const tiers: Array<{ key: Rarity; labelKey: 'guide.rarity.common' | 'guide.rarity.rare' | 'guide.rarity.legendary'; dotVar: string }> = [
    { key: 'common', labelKey: 'guide.rarity.common', dotVar: 'var(--color-rarity-common)' },
    { key: 'rare', labelKey: 'guide.rarity.rare', dotVar: 'var(--color-rarity-rare)' },
    { key: 'legendary', labelKey: 'guide.rarity.legendary', dotVar: 'var(--color-rarity-legendary)' },
  ];
  return (
    <Accordion icon="✨" title={t('guide.rarity.title')}>
      <div className="space-y-3">
        <p className="text-xs text-ink-500 leading-relaxed">{t('guide.rarity.hint')}</p>
        <div className="space-y-2">
          {tiers.map((tier) => {
            const count = SPECIES_BY_RARITY[tier.key].length;
            const weight = RARITY_ROLL_WEIGHTS[tier.key];
            const pct = Math.round(weight * 100);
            return (
              <div key={tier.key} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: tier.dotVar }}
                    aria-hidden
                  />
                  <span className="text-sm text-ink-900">{t(tier.labelKey)}</span>
                </div>
                <div className="text-xs text-ink-500 tabular-nums">
                  {t('guide.rarity.speciesCount', { count })} · {pct}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Accordion>
  );
}

function DailySection() {
  const t = useT();
  return (
    <Accordion icon="📋" title={t('guide.daily.title')}>
      <p className="text-xs text-ink-600 leading-relaxed">
        {t('guide.daily.body')}
      </p>
    </Accordion>
  );
}

function ComboSection() {
  const t = useT();
  return (
    <Accordion icon="🔥" title={t('guide.combo.title')}>
      <p className="text-xs text-ink-600 leading-relaxed">
        {t('guide.combo.body')}
      </p>
    </Accordion>
  );
}

function FeaturesSection() {
  const t = useT();
  const items: Array<{ titleKey: 'guide.features.rank.title'; bodyKey: 'guide.features.rank.body' }> = [
    { titleKey: 'guide.features.rank.title', bodyKey: 'guide.features.rank.body' },
  ];
  return (
    <Accordion icon="🏅" title={t('guide.features.title')}>
      <div className="space-y-3">
        {items.map((it) => (
          <div key={it.titleKey}>
            <div className="text-sm font-medium text-ink-900">{t(it.titleKey)}</div>
            <div className="text-xs text-ink-600 leading-relaxed mt-0.5">{t(it.bodyKey)}</div>
          </div>
        ))}
      </div>
    </Accordion>
  );
}

function DriedLeavesSection() {
  const t = useT();
  const pityPoints = useGameStore((s) => s.state.pityPoints);
  const pct = Math.min(100, (pityPoints / PITY_THRESHOLD) * 100);
  const rates: Array<{ key: Rarity; labelKey: 'guide.rarity.common' | 'guide.rarity.rare' | 'guide.rarity.legendary'; points: number; dotVar: string }> = [
    { key: 'common', labelKey: 'guide.rarity.common', points: PITY_POINTS_COMMON, dotVar: 'var(--color-rarity-common)' },
    { key: 'rare', labelKey: 'guide.rarity.rare', points: PITY_POINTS_RARE, dotVar: 'var(--color-rarity-rare)' },
    { key: 'legendary', labelKey: 'guide.rarity.legendary', points: PITY_POINTS_LEGENDARY, dotVar: 'var(--color-rarity-legendary)' },
  ];
  return (
    <Accordion icon="🍂" title={t('guide.driedLeaves.title')}>
      <div className="space-y-3">
        <p className="text-xs text-ink-600 leading-relaxed">
          {t('guide.driedLeaves.body', { threshold: PITY_THRESHOLD })}
        </p>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-ink-500 tabular-nums">
            <span>{t('guide.driedLeaves.progress', { current: pityPoints, threshold: PITY_THRESHOLD })}</span>
          </div>
          <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-clay-500 rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <div className="space-y-2">
          {rates.map((r) => (
            <div key={r.key} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: r.dotVar }}
                  aria-hidden
                />
                <span className="text-sm text-ink-900">{t(r.labelKey)}</span>
              </div>
              <div className="text-xs text-ink-500 tabular-nums">
                +{r.points} 🍂
              </div>
            </div>
          ))}
        </div>
      </div>
    </Accordion>
  );
}

function SproutSection() {
  const t = useT();
  const sprouts = useGameStore((s) => s.state.sprouts);
  const rates: Array<{ key: Rarity; labelKey: 'guide.rarity.common' | 'guide.rarity.rare' | 'guide.rarity.legendary'; gain: number; dotVar: string }> = [
    { key: 'common', labelKey: 'guide.rarity.common', gain: SPROUT_HARVEST_COMMON, dotVar: 'var(--color-rarity-common)' },
    { key: 'rare', labelKey: 'guide.rarity.rare', gain: SPROUT_HARVEST_RARE, dotVar: 'var(--color-rarity-rare)' },
    { key: 'legendary', labelKey: 'guide.rarity.legendary', gain: SPROUT_HARVEST_LEGENDARY, dotVar: 'var(--color-rarity-legendary)' },
  ];
  return (
    <Accordion icon="🌱" title={t('guide.sprout.title')}>
      <div className="space-y-3">
        <p className="text-xs text-ink-600 leading-relaxed">
          {t('guide.sprout.body')}
        </p>

        {/* Current balance */}
        <div className="flex items-center justify-between bg-cream-200/50 rounded-lg px-3 py-2">
          <span className="text-xs text-ink-500">{t('guide.sprout.balance')}</span>
          <span className="font-mono text-sm font-bold text-leaf-700 tabular-nums">🌱 {sprouts}</span>
        </div>

        {/* Harvest rates */}
        <div>
          <div className="text-xs font-medium text-ink-700 mb-1.5">{t('guide.sprout.harvestRates')}</div>
          <div className="space-y-1.5">
            {rates.map((r) => (
              <div key={r.key} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.dotVar }} aria-hidden />
                  <span className="text-sm text-ink-900">{t(r.labelKey)}</span>
                </div>
                <div className="text-xs text-ink-500 tabular-nums">+{r.gain} 🌱</div>
              </div>
            ))}
          </div>
        </div>

        {/* Other sources */}
        <div>
          <div className="text-xs font-medium text-ink-700 mb-1">{t('guide.sprout.otherSources')}</div>
          <div className="text-xs text-ink-600 leading-relaxed">
            {t('guide.sprout.questBonus', { amount: SPROUT_ALL_MISSIONS_BONUS })}
          </div>
        </div>

        {/* Quest refresh */}
        <div>
          <div className="text-xs font-medium text-ink-700 mb-1">{t('guide.sprout.refreshTitle')}</div>
          <div className="text-xs text-ink-600 leading-relaxed">
            {t('guide.sprout.refreshBody', { cost: SPROUT_QUEST_REFRESH_COST })}
          </div>
        </div>
      </div>
    </Accordion>
  );
}

function ShopSection() {
  const t = useT();
  return (
    <Accordion icon="🛍️" title={t('guide.shop.title')}>
      <div className="space-y-3">
        <p className="text-xs text-ink-600 leading-relaxed">
          {t('guide.shop.body')}
        </p>
        <p className="text-xs text-ink-500 leading-relaxed">
          {t('guide.shop.duplicate')}
        </p>
      </div>
    </Accordion>
  );
}

function InstallPWASection() {
  const t = useT();
  const steps: Array<{ titleKey: 'guide.pwa.ios.title' | 'guide.pwa.android.title' | 'guide.pwa.desktop.title'; bodyKey: 'guide.pwa.ios.body' | 'guide.pwa.android.body' | 'guide.pwa.desktop.body' }> = [
    { titleKey: 'guide.pwa.ios.title', bodyKey: 'guide.pwa.ios.body' },
    { titleKey: 'guide.pwa.android.title', bodyKey: 'guide.pwa.android.body' },
    { titleKey: 'guide.pwa.desktop.title', bodyKey: 'guide.pwa.desktop.body' },
  ];
  return (
    <Accordion icon="📲" title={t('guide.pwa.title')}>
      <div className="space-y-3">
        <p className="text-xs text-ink-600 leading-relaxed">
          {t('guide.pwa.body')}
        </p>
        {steps.map((s) => (
          <div key={s.titleKey}>
            <div className="text-sm font-medium text-ink-900">{t(s.titleKey)}</div>
            <div className="text-xs text-ink-600 leading-relaxed mt-0.5 whitespace-pre-line">{t(s.bodyKey)}</div>
          </div>
        ))}
      </div>
    </Accordion>
  );
}

function SaveSection() {
  const t = useT();
  return (
    <Accordion icon="💾" title={t('guide.save.title')}>
      <div className="space-y-3">
        <div>
          <div className="text-sm font-medium text-ink-900">{t('guide.save.auto.title')}</div>
          <div className="text-xs text-ink-600 leading-relaxed mt-0.5">{t('guide.save.auto.body')}</div>
        </div>
        <div className="rounded-lg bg-clay-500/10 border border-clay-500/30 p-3">
          <div className="text-sm font-medium text-ink-900">{t('guide.save.warning.title')}</div>
          <div className="text-xs text-ink-600 leading-relaxed mt-0.5">{t('guide.save.warning.body')}</div>
        </div>
        <div>
          <div className="text-sm font-medium text-ink-900">{t('guide.save.backup.title')}</div>
          <div className="text-xs text-ink-600 leading-relaxed mt-0.5">{t('guide.save.backup.body')}</div>
        </div>
      </div>
    </Accordion>
  );
}

function DeveloperSection() {
  const t = useT();
  return (
    <Accordion icon="👨‍💻" title={t('guide.developer.title')}>
      <p className="text-xs text-ink-600 leading-relaxed">
        {t('guide.developer.body')}{' '}
        <a
          href="https://zeze.app/portfolio"
          target="_blank"
          rel="noopener noreferrer"
          className="text-clay-500 hover:text-clay-600 underline underline-offset-2 font-medium"
        >
          {t('guide.developer.linkLabel')}
        </a>
      </p>
    </Accordion>
  );
}
