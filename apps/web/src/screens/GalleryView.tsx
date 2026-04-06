'use client';

import Link from 'next/link';
import { Card } from '@/components/Card';
import { RarityBadge } from '@/components/RarityBadge';
import { BackIcon } from '@/components/icons';
import { FloraImage } from '@/components/FloraImage';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { useGameStore } from '@/store/gameStore';
import { SPECIES } from '@/data/species';
import { TOTAL_SPECIES } from '@florify/shared';
import { useT } from '@/i18n/useT';

/**
 * Gallery grid — every harvested tree as a thumbnail, sorted by most
 * recently harvested. Thumbnails are the pre-rendered stage-3 webp
 * shipped in `public/floras/{folder}/`.
 */
export function GalleryView() {
  const t = useT();
  const collection = useGameStore((s) => s.state.collection);
  const unlocked = useGameStore((s) => s.uniqueSpeciesUnlocked());
  const totalHarvested = collection.reduce((sum, c) => sum + c.count, 0);
  // Collection is already sorted by lastHarvestedAt desc from store
  const sorted = collection;

  return (
    <div className="min-h-full h-full overflow-y-auto bg-cream-50 safe-top safe-bottom px-4 pb-24">
      <header className="flex items-center justify-between py-4 animate-fade-down">
        <Link
          href="/"
          className="w-10 h-10 flex items-center justify-center text-ink-700 hover:bg-cream-100 rounded-full transition-all duration-300 ease-out hover:-translate-x-0.5"
          aria-label={t('gallery.back')}
        >
          <BackIcon />
        </Link>
        <h1 className="text-xl font-serif">{t('gallery.title')}</h1>
        <div className="w-10" aria-hidden />
      </header>

      <section className="grid grid-cols-2 gap-3 text-center my-4">
        <Card
          className="p-3 animate-fade-up"
          style={{ animationDelay: '80ms' }}
        >
          <div className="text-3xl font-serif text-ink-900 tabular-nums">
            <AnimatedNumber value={totalHarvested} />
          </div>
          <div className="text-xs text-ink-500 mt-1">{t('gallery.harvested')}</div>
        </Card>
        <Card
          className="p-3 animate-fade-up"
          style={{ animationDelay: '160ms' }}
        >
          <div className="text-3xl font-serif text-ink-900 tabular-nums">
            <AnimatedNumber value={unlocked} /> / <AnimatedNumber value={TOTAL_SPECIES} duration={1400} />
          </div>
          <div className="text-xs text-ink-500 mt-1">{t('gallery.speciesUnlocked')}</div>
        </Card>
      </section>

      {sorted.length === 0 ? (
        <div className="text-center text-ink-500 text-sm mt-16 animate-fade-in">
          {t('gallery.empty')}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {sorted.map((entry, i) => (
            <Link
              key={entry.speciesId}
              href={{ pathname: '/gallery/detail', query: { speciesId: String(entry.speciesId) } }}
              className="group block animate-fade-up"
              // Cap stagger at ~12 items so large collections don't wait forever.
              style={{ animationDelay: `${Math.min(i, 12) * 45 + 240}ms` }}
            >
              <GalleryTile speciesId={entry.speciesId} rarity={entry.rarity} count={entry.count} />
              <div className="text-xs mt-1 text-ink-700 truncate">
                {SPECIES[entry.speciesId]?.name}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function GalleryTile({
  speciesId,
  rarity,
  count,
}: {
  speciesId: number;
  rarity: 'common' | 'rare' | 'legendary';
  count: number;
}) {
  return (
    <Card className="overflow-hidden aspect-[3/4] relative group-hover:-translate-y-1 group-hover:shadow-soft-md">
      <FloraImage
        speciesId={speciesId}
        progress={1}
        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
      />
      <div className="absolute top-1 right-1">
        <RarityBadge rarity={rarity} />
      </div>
      {count > 1 && (
        <div className="absolute bottom-1 left-1 bg-ink-900/60 text-cream-50 text-[10px] font-medium px-1.5 py-0.5 rounded-full backdrop-blur-sm">
          ×{count}
        </div>
      )}
    </Card>
  );
}
