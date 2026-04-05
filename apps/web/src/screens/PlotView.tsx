'use client';

import { useRef, useState } from 'react';
import type { TreeInstance } from '@florify/shared';
import { FloraImage } from '@/components/FloraImage';
import { PerlinNoise } from '@/components/PerlinNoise';
import { Button } from '@/components/Button';
import { CountdownTimer } from '@/components/CountdownTimer';
import { CornerButton } from '@/components/CornerButton';
import { GalleryIcon, FloristCardIcon, UserIcon } from '@/components/icons';
import { FloristCardSheet } from '@/components/florist-card/FloristCardSheet';
import { HarvestOverlay } from '@/components/HarvestOverlay';
import { useGameStore } from '@/store/gameStore';
import { useHandheld } from '@/hooks/useHandheld';
import { toast } from '@/lib/toast';

/**
 * Home screen — designs/07 §7.1.
 *
 * Full-bleed 2D flora image (three growth stages, driven by progress).
 * Three corner buttons (Gallery TL; Florist Card + Login TR stack).
 * One big toggle button at the bottom that cycles through plant →
 * water → disabled+countdown based on the active tree state. No other
 * chrome — the flora is the hero.
 */
export function PlotView() {
  const tree = useGameStore((s) => s.state.activeTree);
  const canWater = useGameStore((s) => s.canWater());
  const nextAt = useGameStore((s) => s.nextWaterAt());
  const plant = useGameStore((s) => s.plantTree);
  const water = useGameStore((s) => s.waterTree);
  const [showFlorist, setShowFlorist] = useState(false);
  const [harvested, setHarvested] = useState<TreeInstance | null>(null);
  const floraRef = useRef<HTMLDivElement>(null);
  useHandheld(floraRef);

  const handleWater = () => {
    const result = water();
    if (result.ok && result.harvested) setHarvested(result.harvested);
  };

  const percent = tree
    ? Math.round((tree.currentWaterings / tree.requiredWaterings) * 100)
    : 0;

  return (
    <main className="relative h-full w-full bg-cream-50 overflow-hidden">
      {/* Fine-grain perlin texture behind everything */}
      <PerlinNoise />

      {/* Full-bleed 2D flora (fills the frame on desktop, the screen on mobile).
          Wrapped in a ref'd box that receives a handheld-camera wobble via
          `useHandheld`, so the flora drifts gently like a shaky phone hold. */}
      {tree && (
        <div
          ref={floraRef}
          className="absolute inset-0 pointer-events-none select-none will-change-transform"
        >
          <FloraImage
            speciesId={tree.speciesId}
            progress={tree.currentWaterings / tree.requiredWaterings}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      )}

      {/* ─── TOP-LEFT: Gallery ──────────────────────────── */}
      <div
        className="absolute top-0 left-0 pl-4 pointer-events-none"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)' }}
      >
        <CornerButton to="/gallery" label="Open Gallery" size="primary">
          <GalleryIcon />
        </CornerButton>
      </div>

      {/* ─── TOP-RIGHT: Florist Card + Login (Coming Soon) ── */}
      <div
        className="absolute top-0 right-0 flex flex-col items-end gap-2 pr-4 pointer-events-none"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)' }}
      >
        <CornerButton
          onClick={() => setShowFlorist(true)}
          label="Open Florist Card"
          size="primary"
        >
          <FloristCardIcon />
        </CornerButton>

        <CornerButton
          onClick={() => toast('เร็วๆ นี้ — จะได้ sync ต้นไม้ข้ามเครื่อง')}
          label="Login (Coming Soon)"
          size="secondary"
          comingSoon
        >
          <UserIcon />
        </CornerButton>
      </div>

      {/* ─── BOTTOM CENTER ACTION ──────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 flex flex-col items-center pointer-events-none"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)' }}
      >
        <div className="pointer-events-auto flex flex-col items-center gap-2">
          {tree && (
            <div className="text-xs text-ink-500 tracking-wider font-medium tabular-nums">
              {percent}%
            </div>
          )}

          {!tree ? (
            <Button size="lg" onClick={() => plant()} className="min-w-[240px]">
              เริ่มปลูก
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={handleWater}
              disabled={!canWater}
              className={`min-w-[240px] ${!canWater ? 'opacity-60' : ''}`}
            >
              รดน้ำ
            </Button>
          )}

          {tree && !canWater && nextAt !== null && (
            <div className="text-sm text-ink-500 mt-1">
              ⏳ <CountdownTimer until={nextAt} />
            </div>
          )}
        </div>
      </div>

      <FloristCardSheet open={showFlorist} onClose={() => setShowFlorist(false)} />
      <HarvestOverlay tree={harvested} onDismiss={() => setHarvested(null)} />
    </main>
  );
}
