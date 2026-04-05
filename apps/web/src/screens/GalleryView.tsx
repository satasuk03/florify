'use client';

import Link from 'next/link';
import { Card } from '@/components/Card';
import { RarityBadge } from '@/components/RarityBadge';
import { BackIcon } from '@/components/icons';
import { FloraImage } from '@/components/FloraImage';
import { useGameStore } from '@/store/gameStore';
import { SPECIES } from '@/data/species';
import { TOTAL_SPECIES } from '@florify/shared';

/**
 * Gallery grid — every harvested tree as a thumbnail, sorted by most
 * recently harvested. Thumbnails are the pre-rendered stage-3 webp
 * shipped in `public/floras/{folder}/`.
 */
export function GalleryView() {
  const collection = useGameStore((s) => s.state.collection);
  const unlocked = useGameStore((s) => s.uniqueSpeciesUnlocked());
  const sorted = [...collection].sort(
    (a, b) => (b.harvestedAt ?? 0) - (a.harvestedAt ?? 0),
  );

  return (
    <div className="min-h-full h-full overflow-y-auto bg-cream-50 safe-top safe-bottom px-4 pb-24">
      <header className="flex items-center justify-between py-4">
        <Link
          href="/"
          className="w-10 h-10 flex items-center justify-center text-ink-700 hover:bg-cream-100 rounded-full transition-colors"
          aria-label="Back to home"
        >
          <BackIcon />
        </Link>
        <h1 className="text-xl font-serif">Gallery</h1>
        <div className="w-10" aria-hidden />
      </header>

      <section className="grid grid-cols-2 gap-3 text-center my-4">
        <Card className="p-3">
          <div className="text-3xl font-serif text-ink-900 tabular-nums">
            {collection.length}
          </div>
          <div className="text-xs text-ink-500 mt-1">harvested</div>
        </Card>
        <Card className="p-3">
          <div className="text-3xl font-serif text-ink-900 tabular-nums">
            {unlocked} / {TOTAL_SPECIES}
          </div>
          <div className="text-xs text-ink-500 mt-1">species unlocked</div>
        </Card>
      </section>

      {sorted.length === 0 ? (
        <div className="text-center text-ink-500 text-sm mt-16">
          ยังไม่มีต้นไม้ที่เก็บไว้ — เริ่มปลูกเลย
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {sorted.map((tree) => (
            <Link key={tree.id} href={{ pathname: '/gallery/detail', query: { id: tree.id } }}>
              <GalleryTile speciesId={tree.speciesId} rarity={tree.rarity} />
              <div className="text-xs mt-1 text-ink-700 truncate">
                {SPECIES[tree.speciesId]?.name}
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
}: {
  speciesId: number;
  rarity: 'common' | 'rare' | 'legendary';
}) {
  return (
    <Card className="overflow-hidden aspect-square relative">
      <FloraImage
        speciesId={speciesId}
        progress={1}
        className="w-full h-full object-cover"
      />
      <div className="absolute top-1 right-1">
        <RarityBadge rarity={rarity} />
      </div>
    </Card>
  );
}
