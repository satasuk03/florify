'use client';

import Link from 'next/link';
import { RarityBadge } from '@/components/RarityBadge';
import { BackIcon } from '@/components/icons';
import { FloraImage } from '@/components/FloraImage';
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

export function DetailView({ id }: { id: string | null }) {
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
          ไม่พบต้นไม้
        </div>
      </div>
    );
  }

  const species = SPECIES[tree.speciesId];

  return (
    <div className="h-full bg-cream-50 flex flex-col safe-top safe-bottom">
      <header className="flex items-center justify-between px-4 py-3">
        <Link
          href="/gallery"
          className="w-10 h-10 flex items-center justify-center text-ink-700 hover:bg-cream-100 rounded-full transition-colors"
          aria-label="Back to gallery"
        >
          <BackIcon />
        </Link>
        <RarityBadge rarity={tree.rarity} />
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <FloraImage
          speciesId={tree.speciesId}
          progress={1}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <div className="p-4 bg-cream-100 border-t border-cream-300">
        <h2 className="text-2xl font-serif mb-1">{species?.name ?? 'Unknown'}</h2>
        <div className="text-sm text-ink-500 space-y-1">
          <div>
            Seed: <span className="font-mono">{tree.seed}</span>
          </div>
          <div>รดน้ำทั้งหมด: {tree.requiredWaterings} ครั้ง</div>
          <div>ปลูก: {new Date(tree.plantedAt).toLocaleDateString('th-TH')}</div>
          {tree.harvestedAt && (
            <div>เก็บ: {new Date(tree.harvestedAt).toLocaleDateString('th-TH')}</div>
          )}
        </div>
      </div>
    </div>
  );
}
