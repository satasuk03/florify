"use client";

import { useState } from 'react';
import { FLORA_LEVEL_CURVE, FLORA_MAX_LEVEL } from '@florify/shared';
import type { Rarity } from '@florify/shared';
import { useGameStore, canMergeFloraLevel } from '@/store/gameStore';
import { MergeBurst } from '@/components/flora-level/MergeBurst';

interface Props {
  speciesId: number;
  rarity: Rarity;
  onMaxReveal: (speciesId: number) => void;
  labels: {
    title: string;
    merge: (count: number) => string;
    max: string;
  };
}

/**
 * Flora Level progression panel shown inside the species detail view.
 * Reads the per-species entry from the store, renders the current
 * level, a progress bar toward the next level, and a Merge button that
 * drains any pending merges in one click.
 *
 * On reaching Lv 5 for the first time, calls `onMaxReveal(speciesId)`
 * so the parent can display the MaxRevealModal.
 */
export function FloraLevelSection({ speciesId, rarity, onMaxReveal, labels }: Props) {
  const entry = useGameStore((s) => s.state.floraLevels[speciesId]);
  const mergeFloraLevel = useGameStore((s) => s.mergeFloraLevel);
  const [animatingLevel, setAnimatingLevel] = useState<number | null>(null);
  const [burstKey, setBurstKey] = useState(0);
  const [shaking, setShaking] = useState(false);

  if (!entry) return null;

  const { level, pendingMerges } = entry;
  const isMax = level >= FLORA_MAX_LEVEL;
  const cost = isMax ? 0 : (FLORA_LEVEL_CURVE[level - 1] ?? 0);
  const canMerge = canMergeFloraLevel(entry);
  const fill = isMax ? 1 : cost === 0 ? 0 : Math.min(pendingMerges / cost, 1);
  const displayLevel = animatingLevel ?? level;

  const handleMerge = () => {
    if (!canMerge) return;
    const before = level;
    mergeFloraLevel(speciesId);
    const after = useGameStore.getState().state.floraLevels[speciesId]?.level ?? before;

    // Juicy: particle burst + button shake + haptic buzz
    setBurstKey((k) => k + 1);
    setShaking(true);
    window.setTimeout(() => setShaking(false), 500);
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(35);
    }

    if (after > before) {
      // Tick the displayed level up one step at a time, 200ms per step.
      let current = before;
      const step = () => {
        current += 1;
        setAnimatingLevel(current);
        if (current < after) {
          setTimeout(step, 200);
        } else {
          setTimeout(() => setAnimatingLevel(null), 200);
        }
      };
      setTimeout(step, 50);
    }
    if (before < FLORA_MAX_LEVEL && after === FLORA_MAX_LEVEL) {
      // Fire the reveal after the tick animation finishes.
      const delay = 200 * Math.max(1, after - before) + 200;
      setTimeout(() => onMaxReveal(speciesId), delay);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-cream-300/70 flex items-center gap-2 text-xs">
      <span
        className={`font-semibold tabular-nums shrink-0 ${
          isMax
            ? 'text-amber-600'
            : rarity === 'legendary'
              ? 'text-amber-600'
              : 'text-ink-600'
        }`}
      >
        {isMax ? `✦ Lv ${displayLevel} ✦` : `Lv ${displayLevel}`}
      </span>
      <div className="flex-1 h-1.5 rounded-full bg-cream-200 overflow-hidden">
        <div
          className={`h-full transition-all duration-200 ${
            isMax ? 'bg-amber-500' : 'bg-amber-400'
          }`}
          style={{ width: `${fill * 100}%` }}
        />
      </div>
      {isMax ? (
        <span className="text-amber-600 font-semibold shrink-0 whitespace-nowrap">
          {labels.max}
        </span>
      ) : (
        <>
          <span className="text-ink-400 tabular-nums shrink-0">
            {pendingMerges}/{cost}
          </span>
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={handleMerge}
              disabled={!canMerge}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-[0.97] ${
                shaking ? 'animate-claim-press ' : ''
              }${
                canMerge
                  ? 'bg-amber-500 text-cream-50 hover:bg-amber-600 shadow-soft-sm'
                  : 'bg-cream-200 text-ink-400 cursor-not-allowed'
              }`}
            >
              {labels.merge(pendingMerges)}
            </button>
            {burstKey > 0 && <MergeBurst key={burstKey} playKey={burstKey} />}
          </div>
        </>
      )}
    </div>
  );
}
