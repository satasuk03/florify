'use client';

import { useEffect } from 'react';
import { Card } from '@/components/Card';
import { SPECIES, SPECIES_BY_RARITY } from '@/data/species';
import { RARITY_ROLL_WEIGHTS } from '@/data/rarityWeights';
import { useT } from '@/i18n/useT';
import { useGameStore } from '@/store/gameStore';
import { PITY_THRESHOLD, PITY_POINTS_COMMON, PITY_POINTS_RARE, PITY_POINTS_LEGENDARY } from '@florify/shared';
import type { Rarity } from '@florify/shared';

/**
 * Guide Book bottom sheet — explains how Florify works for first-time
 * players. Mirrors the `SettingsSheet` pattern (same overlay, animation,
 * dismiss behavior) so it feels like the same family of dialogs.
 *
 * Content here is read-only and dynamic where it matters:
 * - Rarity counts come from `SPECIES_BY_RARITY` so adding new species
 *   automatically updates this screen.
 * - Rarity odds come from `RARITY_ROLL_WEIGHTS` (shared with the game
 *   store's `rollRarity`) so the displayed percentages can never drift
 *   from the actual roll.
 */
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
        className="w-full sm:max-w-md bg-cream-50 rounded-t-3xl sm:rounded-3xl p-6 shadow-soft-lg max-h-[92dvh] overflow-y-auto scrollbar-elegant animate-sheet-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-serif text-2xl text-ink-900">{t('guide.title')}</h2>
          <button
            onClick={onClose}
            aria-label={t('guide.close')}
            className="text-ink-500 text-2xl leading-none w-10 h-10 flex items-center justify-center hover:bg-cream-100 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          <WelcomeSection />
          <HowToPlaySection />
          <RaritySection />
          <FeaturesSection />
          <DriedLeavesSection />
          <SaveSection />
          <DeveloperSection />
        </div>
      </div>
    </div>
  );
}

// ── Sections ──────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-medium text-ink-500 uppercase tracking-wider mb-3">
      {children}
    </h3>
  );
}

function WelcomeSection() {
  const t = useT();
  return (
    <section>
      <SectionHeading>{t('guide.welcome.title')}</SectionHeading>
      <Card className="p-4">
        <p className="text-sm text-ink-700 leading-relaxed">
          {t('guide.welcome.body', { total: SPECIES.length })}
        </p>
      </Card>
    </section>
  );
}

function HowToPlaySection() {
  const t = useT();
  const steps: Array<{ titleKey: 'guide.howto.plant.title' | 'guide.howto.water.title' | 'guide.howto.harvest.title'; bodyKey: 'guide.howto.plant.body' | 'guide.howto.water.body' | 'guide.howto.harvest.body' }> = [
    { titleKey: 'guide.howto.plant.title', bodyKey: 'guide.howto.plant.body' },
    { titleKey: 'guide.howto.water.title', bodyKey: 'guide.howto.water.body' },
    { titleKey: 'guide.howto.harvest.title', bodyKey: 'guide.howto.harvest.body' },
  ];
  return (
    <section>
      <SectionHeading>{t('guide.howto.title')}</SectionHeading>
      <Card className="p-4 space-y-3">
        {steps.map((s) => (
          <div key={s.titleKey}>
            <div className="text-sm font-medium text-ink-900">{t(s.titleKey)}</div>
            <div className="text-sm text-ink-700 leading-relaxed mt-0.5">{t(s.bodyKey)}</div>
          </div>
        ))}
      </Card>
    </section>
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
    <section>
      <SectionHeading>{t('guide.rarity.title')}</SectionHeading>
      <Card className="p-4 space-y-3">
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
      </Card>
    </section>
  );
}

function FeaturesSection() {
  const t = useT();
  const items: Array<{ titleKey: 'guide.features.gallery.title' | 'guide.features.passport.title' | 'guide.features.streak.title' | 'guide.features.rank.title'; bodyKey: 'guide.features.gallery.body' | 'guide.features.passport.body' | 'guide.features.streak.body' | 'guide.features.rank.body' }> = [
    { titleKey: 'guide.features.gallery.title', bodyKey: 'guide.features.gallery.body' },
    { titleKey: 'guide.features.passport.title', bodyKey: 'guide.features.passport.body' },
    { titleKey: 'guide.features.streak.title', bodyKey: 'guide.features.streak.body' },
    { titleKey: 'guide.features.rank.title', bodyKey: 'guide.features.rank.body' },
  ];
  return (
    <section>
      <SectionHeading>{t('guide.features.title')}</SectionHeading>
      <Card className="p-4 space-y-3">
        {items.map((it) => (
          <div key={it.titleKey}>
            <div className="text-sm font-medium text-ink-900">{t(it.titleKey)}</div>
            <div className="text-sm text-ink-700 leading-relaxed mt-0.5">{t(it.bodyKey)}</div>
          </div>
        ))}
      </Card>
    </section>
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
    <section>
      <SectionHeading>{t('guide.driedLeaves.title')}</SectionHeading>
      <Card className="p-4 space-y-3">
        <p className="text-sm text-ink-700 leading-relaxed">
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
      </Card>
    </section>
  );
}

function SaveSection() {
  const t = useT();
  return (
    <section>
      <SectionHeading>{t('guide.save.title')}</SectionHeading>
      <Card className="p-4 space-y-3">
        <div>
          <div className="text-sm font-medium text-ink-900">{t('guide.save.auto.title')}</div>
          <div className="text-sm text-ink-700 leading-relaxed mt-0.5">{t('guide.save.auto.body')}</div>
        </div>
        <div className="rounded-lg bg-clay-500/10 border border-clay-500/30 p-3">
          <div className="text-sm font-medium text-ink-900">{t('guide.save.warning.title')}</div>
          <div className="text-sm text-ink-700 leading-relaxed mt-0.5">{t('guide.save.warning.body')}</div>
        </div>
        <div>
          <div className="text-sm font-medium text-ink-900">{t('guide.save.backup.title')}</div>
          <div className="text-sm text-ink-700 leading-relaxed mt-0.5">{t('guide.save.backup.body')}</div>
        </div>
      </Card>
    </section>
  );
}

function DeveloperSection() {
  const t = useT();
  return (
    <section>
      <SectionHeading>{t('guide.developer.title')}</SectionHeading>
      <Card className="p-4">
        <p className="text-sm text-ink-700 leading-relaxed">
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
      </Card>
    </section>
  );
}
