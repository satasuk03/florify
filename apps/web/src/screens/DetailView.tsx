'use client';

import { useState } from 'react';
import Link from 'next/link';
import { RarityBadge } from '@/components/RarityBadge';
import { BackIcon } from '@/components/icons';
import { FloraImage } from '@/components/FloraImage';
import { LangToggle, type Lang } from '@/components/LangToggle';
import {
  StageSelector,
  STAGE_PROGRESS,
  type Stage,
} from '@/components/StageSelector';
import { useGameStore } from '@/store/gameStore';
import { SPECIES } from '@/data/species';

/**
 * Detail view for a single harvested tree. Reads `id` from the parent
 * page via props (the page grabs it from `useSearchParams`). Shows the
 * pre-rendered stage-3 flora image.
 *
 * Uses the query-param routing pattern instead of a dynamic route
 * because Next.js 16 static export forbids `dynamicParams: true`.
 */

const COPY = {
  th: {
    notFound: 'ไม่พบต้นไม้',
    seed: 'เมล็ด',
    waterings: 'รดน้ำ',
    waterUnit: 'หยด',
    planted: 'ปลูกเมื่อ',
    harvested: 'เก็บเกี่ยว',
    locale: 'th-TH' as const,
    stageLabel: (n: Stage) => `ระยะ ${n}`,
  },
  en: {
    notFound: 'Tree not found',
    seed: 'Seed',
    waterings: 'Waterings',
    waterUnit: 'drops',
    planted: 'Planted',
    harvested: 'Harvested',
    locale: 'en-US' as const,
    stageLabel: (n: Stage) => `Stage ${n}`,
  },
};

export function DetailView({ id }: { id: string | null }) {
  const [lang, setLang] = useState<Lang>('th');
  const [stage, setStage] = useState<Stage>(3);
  const t = COPY[lang];

  const tree = useGameStore((s) =>
    id ? s.state.collection.find((t) => t.id === id) ?? null : null,
  );

  if (!tree) {
    return (
      <div className="h-full bg-cream-50 safe-top safe-bottom flex flex-col">
        <header className="flex items-center px-4 py-3">
          <Link
            href="/gallery"
            className="w-10 h-10 flex items-center justify-center text-ink-700"
            aria-label="Back to gallery"
          >
            <BackIcon />
          </Link>
        </header>
        <div className="flex-1 flex items-center justify-center text-ink-500">
          {t.notFound}
        </div>
      </div>
    );
  }

  const species = SPECIES[tree.speciesId];
  const description = lang === 'th' ? species?.descriptionTH : species?.descriptionEN;

  return (
    <div className="h-full bg-cream-50 flex flex-col safe-top safe-bottom overflow-hidden">
      <header className="flex items-center justify-between px-4 py-3 animate-fade-down">
        <Link
          href="/gallery"
          className="w-10 h-10 flex items-center justify-center text-ink-700 hover:bg-cream-100 rounded-full transition-all duration-300 ease-out hover:-translate-x-0.5"
          aria-label="Back to gallery"
        >
          <BackIcon />
        </Link>
        <RarityBadge rarity={tree.rarity} />
      </header>

      <div className="flex-1 min-h-0 flex items-center justify-center px-4 pb-2">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Specimen frame: layered cream card with a soft radial inner
              glow, a hairline border, and a gentle outer shadow — reads
              as a botanical plate rather than a bare image. */}
          <div
            aria-hidden
            className="absolute inset-2 rounded-[2rem] bg-cream-100 border border-cream-300/70 shadow-soft-lg"
          />
          <div
            aria-hidden
            className="absolute inset-3 rounded-[1.75rem] bg-[radial-gradient(ellipse_at_center,_var(--color-cream-50)_0%,_var(--color-cream-100)_55%,_var(--color-cream-200)_100%)]"
          />
          {/* Corner tick marks — a tiny hint of a specimen plate. */}
          <div aria-hidden className="absolute inset-5 pointer-events-none">
            <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cream-400/60 rounded-tl-md" />
            <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cream-400/60 rounded-tr-md" />
            <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cream-400/60 rounded-bl-md" />
            <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cream-400/60 rounded-br-md" />
          </div>

          <FloraImage
            key={`${tree.id}-${stage}`}
            speciesId={tree.speciesId}
            progress={STAGE_PROGRESS[stage]}
            className="relative max-h-[88%] max-w-[82%] object-contain drop-shadow-[0_18px_30px_rgba(75,55,30,0.18)]"
          />

          {/* Stage selector floats over the bottom edge of the frame. */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 animate-fade-up" style={{ animationDelay: '220ms' }}>
            <StageSelector stage={stage} onChange={setStage} label={t.stageLabel} />
          </div>
        </div>
      </div>

      <div
        className="mx-4 mb-4 rounded-3xl bg-cream-100/90 backdrop-blur border border-cream-200 shadow-soft-md animate-fade-up"
        style={{ animationDelay: '160ms' }}
      >
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h2 className="text-2xl font-serif text-ink-900 leading-tight">
              {species?.name ?? 'Unknown'}
            </h2>
            <LangToggle lang={lang} onChange={setLang} />
          </div>

          <p
            key={lang}
            lang={lang}
            className="text-sm text-ink-700 leading-relaxed animate-fade-in"
          >
            {description}
          </p>

          <div className="mt-4 pt-4 border-t border-cream-300/70">
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-xs">
              <dt className="text-ink-500">{t.seed}</dt>
              <dd className="font-mono text-ink-700 text-right truncate">{tree.seed}</dd>

              <dt className="text-ink-500">{t.waterings}</dt>
              <dd className="text-ink-700 text-right">
                {tree.requiredWaterings} {t.waterUnit}
              </dd>

              <dt className="text-ink-500">{t.planted}</dt>
              <dd className="text-ink-700 text-right">
                {new Date(tree.plantedAt).toLocaleDateString(t.locale)}
              </dd>

              {tree.harvestedAt && (
                <>
                  <dt className="text-ink-500">{t.harvested}</dt>
                  <dd className="text-ink-700 text-right">
                    {new Date(tree.harvestedAt).toLocaleDateString(t.locale)}
                  </dd>
                </>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
