'use client';

import { useEffect } from 'react';
import type { Rarity, TreeInstance } from '@florify/shared';
import { Button } from '@/components/Button';
import { RarityBadge } from '@/components/RarityBadge';
import { SPECIES } from '@/data/species';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Full-screen harvest celebration.
 *
 * Triggered from PlotView when `waterTree()` returns `harvested`. The
 * background glow is tinted by rarity so legendary feels different
 * from common at a glance — part of the chase mechanic.
 *
 * Reduced-motion users get the same visual elements without the
 * pulse/scale animations.
 */

interface Props {
  tree: TreeInstance | null;
  onDismiss: () => void;
}

const GLOW: Record<Rarity, string> = {
  common: 'radial-gradient(closest-side, rgba(184, 168, 136, 0.45), rgba(251, 248, 243, 0) 70%)',
  rare: 'radial-gradient(closest-side, rgba(122, 156, 184, 0.5), rgba(251, 248, 243, 0) 70%)',
  legendary: 'radial-gradient(closest-side, rgba(212, 162, 76, 0.65), rgba(251, 248, 243, 0) 70%)',
};

const HEADLINE: Record<Rarity, string> = {
  common: 'New addition 🌿',
  rare: 'Rare find ✨',
  legendary: 'Legendary bloom 🌼',
};

export function HarvestOverlay({ tree, onDismiss }: Props) {
  const reduced = useReducedMotion();

  // Auto-dismiss on Escape
  useEffect(() => {
    if (!tree) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [tree, onDismiss]);

  if (!tree) return null;

  const species = SPECIES[tree.speciesId];
  const headline = HEADLINE[tree.rarity];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Harvest celebration"
      className="fixed inset-0 z-50 flex items-center justify-center bg-cream-50/85 backdrop-blur-sm animate-overlay-in"
      onClick={onDismiss}
    >
      {/* Rarity-tinted radial glow */}
      <div
        aria-hidden
        className={`absolute inset-0 pointer-events-none ${reduced ? '' : 'animate-pulse-slow'}`}
        style={{ background: GLOW[tree.rarity] }}
      />

      <div
        className="relative flex flex-col items-center gap-5 px-8 text-center max-w-md animate-scale-in"
        style={{ animationDelay: '80ms' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Children fade up with a gentle stagger so the reveal feels
            orchestrated rather than all-at-once. */}
        <div className="animate-fade-up" style={{ animationDelay: '160ms' }}>
          <RarityBadge rarity={tree.rarity} />
        </div>
        <h2
          className="font-serif text-3xl text-ink-900 animate-fade-up"
          style={{ animationDelay: '220ms' }}
        >
          {headline}
        </h2>
        <p
          className="font-serif text-2xl text-ink-700 animate-fade-up"
          style={{ animationDelay: '300ms' }}
        >
          {species?.name ?? 'Unknown species'}
        </p>
        <p
          className="text-sm text-ink-500 max-w-xs animate-fade-up"
          style={{ animationDelay: '380ms' }}
        >
          รดน้ำ {tree.requiredWaterings} ครั้ง · เก็บเข้า Gallery แล้ว
        </p>

        <div className="animate-fade-up" style={{ animationDelay: '460ms' }}>
          <Button size="lg" onClick={onDismiss} className="mt-3 min-w-[200px]">
            เก็บเข้า Gallery
          </Button>
        </div>
      </div>
    </div>
  );
}
