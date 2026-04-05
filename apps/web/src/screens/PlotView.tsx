'use client';

import { useEffect, useRef, useState } from 'react';
import type { TreeInstance } from '@florify/shared';
import { FloraImage } from '@/components/FloraImage';
import { PerlinNoise } from '@/components/PerlinNoise';
import { Button } from '@/components/Button';
import { CountdownTimer } from '@/components/CountdownTimer';
import { CornerButton } from '@/components/CornerButton';
import { GalleryIcon, FloristCardIcon, SettingsIcon } from '@/components/icons';
import { FloristCardSheet } from '@/components/florist-card/FloristCardSheet';
import { SettingsSheet } from '@/components/settings/SettingsSheet';
import { HarvestOverlay } from '@/components/HarvestOverlay';
import { SeedPacket } from '@/components/SeedPacket';
import { useGameStore } from '@/store/gameStore';
import { useHandheld } from '@/hooks/useHandheld';
import { SPECIES } from '@/data/species';

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
  const [showSettings, setShowSettings] = useState(false);
  const [harvested, setHarvested] = useState<TreeInstance | null>(null);

  // Plot phase state machine. Drives whether we show the seed packet,
  // the opening animation, or the full flora. `activeTree` is the
  // ground truth from the store but we can't render flora the instant
  // it appears — the packet opening needs ~1.2s first. So the phase is
  // derived on mount, then advanced manually by the packet's onComplete
  // callback, and re-synced in render (via the "adjust state on prop
  // change" pattern) for post-harvest transitions and zustand hydration
  // edge cases.
  type Phase = 'empty' | 'opening' | 'tree';
  const [phase, setPhase] = useState<Phase>(tree ? 'tree' : 'empty');
  const [prevTree, setPrevTree] = useState(tree);
  if (tree !== prevTree) {
    setPrevTree(tree);
    // Hydration from saved state with an existing tree → skip the
    // animation entirely and show the flora immediately.
    if (tree && phase === 'empty') setPhase('tree');
    // Post-harvest (waterTree clears activeTree) → return to empty
    // state with the packet visible again for the next plant. We
    // intentionally don't touch 'opening' — that's a user-driven
    // latch the packet's onComplete will advance.
    else if (!tree && phase === 'tree') setPhase('empty');
  }

  // `canWater()` is derived from `Date.now()` but Zustand only notifies
  // subscribers on `set()` — so when the cooldown simply elapses, nothing
  // triggers a re-render and the รดน้ำ button stays disabled until some
  // unrelated interaction re-renders the screen. Schedule a one-shot
  // re-render at the exact moment the cooldown expires to re-enable it
  // without a page refresh.
  const [, forceTick] = useState(0);
  useEffect(() => {
    if (canWater || nextAt === null) return;
    const delay = Math.max(0, nextAt - Date.now()) + 50;
    const id = setTimeout(() => forceTick((n) => n + 1), delay);
    return () => clearTimeout(id);
  }, [canWater, nextAt]);

  const handleWater = () => {
    const result = water();
    if (result.ok && result.harvested) setHarvested(result.harvested);
  };

  const handlePlant = () => {
    // Guard against double-taps during the opening animation. The
    // button's `pointer-events-none` also blocks this but belt +
    // braces — a keyboard user can still activate a focused button.
    if (phase !== 'empty') return;
    setPhase('opening');
    plant();
  };

  const percent = tree
    ? Math.round((tree.currentWaterings / tree.requiredWaterings) * 100)
    : 0;
  const species = tree ? SPECIES[tree.speciesId] : null;

  return (
    <main className="relative h-full w-full bg-cream-50 overflow-hidden">
      {/* Fine-grain perlin texture behind everything */}
      <PerlinNoise />

      {/* Full-bleed 2D flora (fills the frame on desktop, the screen on mobile).
          Wrapped in a ref'd box that receives a handheld-camera wobble via
          `useHandheld`, so the flora drifts gently like a shaky phone hold.
          Gated on `phase === 'tree'` rather than `tree` directly so the
          seed packet has time to finish its opening sequence before the
          flora mounts and plays its stage-in animation. */}
      {tree && phase === 'tree' && (
        <HandheldFlora
          speciesId={tree.speciesId}
          progress={tree.currentWaterings / tree.requiredWaterings}
        />
      )}

      {/* ─── SEED PACKET ───────────────────────────────────
          Centerpiece of the empty state; plays its opening sequence
          while the phase is 'opening'. Sized to ~62% of viewport
          width (capped at 280px) so it sits comfortably between the
          corner chrome and the bottom button on phone screens. */}
      {phase !== 'tree' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <SeedPacket
            state={phase === 'opening' ? 'opening' : 'idle'}
            onComplete={() => setPhase('tree')}
            className="w-[min(62vw,280px)]"
          />
        </div>
      )}

      {/* ─── TOP-CENTER: Florify wordmark + active tree readout ─────
          Identifies the app (Fraunces serif, same family as the passport
          wordmark) and — when a tree is active — surfaces its species
          name, a growth gauge, and the waterings tally. Sits between the
          corner buttons; width is capped so it never collides with them. */}
      <div
        className="absolute top-0 left-0 right-0 flex flex-col items-center pointer-events-none animate-fade-down"
        style={{
          paddingTop: 'calc(env(safe-area-inset-top) + 0.9rem)',
          animationDelay: '60ms',
        }}
      >
        <div className="font-serif text-2xl font-bold text-ink-900 tracking-[0.15em]">
          Florify
        </div>
        {phase === 'tree' && tree && species && (
          <div
            key={tree.id}
            className="mt-3 flex flex-col items-center gap-1.5 animate-fade-in"
          >
            <div className="flex items-baseline gap-2">
              <div className="font-serif text-sm font-medium text-ink-700">
                {species.name}
              </div>
              <div
                className={`text-[10px] uppercase tracking-[0.15em] font-semibold ${
                  tree.rarity === 'legendary'
                    ? 'text-amber-600'
                    : tree.rarity === 'rare'
                    ? 'text-sky-600'
                    : 'text-ink-400'
                }`}
              >
                {tree.rarity}
              </div>
            </div>
            <div className="w-32 h-1.5 rounded-full bg-ink-900/10 overflow-hidden">
              <div
                className="h-full bg-ink-900/60 transition-[width] duration-500 ease-out"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="text-[11px] text-ink-500 tabular-nums tracking-wider">
              รดน้ำแล้ว {tree.currentWaterings} ครั้ง
            </div>
          </div>
        )}
      </div>

      {/* ─── TOP-LEFT: Gallery ──────────────────────────── */}
      <div
        className="absolute top-0 left-0 pl-4 pointer-events-none animate-fade-down"
        style={{
          paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)',
          animationDelay: '120ms',
        }}
      >
        <CornerButton to="/gallery" label="Open Gallery" size="primary">
          <GalleryIcon />
        </CornerButton>
      </div>

      {/* ─── TOP-RIGHT: Florist Card + Settings ── */}
      <div
        className="absolute top-0 right-0 flex flex-col items-end gap-2 pr-4 pointer-events-none animate-fade-down"
        style={{
          paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)',
          animationDelay: '200ms',
        }}
      >
        <CornerButton
          onClick={() => setShowFlorist(true)}
          label="Open Florist Card"
          size="primary"
        >
          <FloristCardIcon />
        </CornerButton>

        <CornerButton
          onClick={() => setShowSettings(true)}
          label="Open Settings"
          size="primary"
        >
          <SettingsIcon />
        </CornerButton>
      </div>

      {/* ─── BOTTOM CENTER ACTION ──────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 flex flex-col items-center pointer-events-none animate-fade-up"
        style={{
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)',
          animationDelay: '280ms',
        }}
      >
        <div
          className={`pointer-events-auto flex flex-col items-center gap-2 transition-opacity duration-[240ms] ease-out ${
            phase === 'opening' ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {phase === 'empty' ? (
            <Button size="lg" onClick={handlePlant} className="min-w-[240px]">
              เริ่มปลูก
            </Button>
          ) : phase === 'tree' ? (
            <Button
              size="lg"
              onClick={handleWater}
              disabled={!canWater}
              className={`min-w-[240px] ${!canWater ? 'opacity-60' : ''}`}
            >
              รดน้ำ
            </Button>
          ) : null}

          {phase === 'tree' && tree && !canWater && nextAt !== null && (
            <div className="text-sm text-ink-500 mt-1">
              ⏳ <CountdownTimer until={nextAt} />
            </div>
          )}
        </div>
      </div>

      <FloristCardSheet open={showFlorist} onClose={() => setShowFlorist(false)} />
      <SettingsSheet open={showSettings} onClose={() => setShowSettings(false)} />
      <HarvestOverlay tree={harvested} onDismiss={() => setHarvested(null)} />
    </main>
  );
}

/**
 * Flora layer with handheld-camera wobble. Extracted so the `useHandheld`
 * effect mounts with the ref'd div — calling the hook higher up in
 * `PlotView` fires its effect before the gated flora div exists, so
 * `ref.current` is null and the RAF loop never starts.
 */
function HandheldFlora({ speciesId, progress }: { speciesId: number; progress: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useHandheld(ref);
  return (
    <div
      ref={ref}
      className="absolute inset-0 pointer-events-none select-none will-change-transform animate-fade-in"
    >
      <FloraImage
        speciesId={speciesId}
        progress={progress}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}
