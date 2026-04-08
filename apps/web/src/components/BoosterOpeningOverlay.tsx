'use client';

import { useEffect, useState } from 'react';
import type { BoosterTier, Rarity } from '@florify/shared';

interface Props {
  tier: BoosterTier;
  rarity: Rarity;
  onComplete: () => void;
}

type Phase = 'packet' | 'burst' | 'done';

const RARITY_GLOW: Record<Rarity, string> = {
  common: 'rgba(184, 168, 136, 0.9)',
  rare: 'rgba(122, 156, 184, 0.9)',
  legendary: 'rgba(212, 162, 76, 0.9)',
};

const TIER_COLOR: Record<BoosterTier, string> = {
  common: '#4ade80',
  rare: '#818cf8',
  legendary: '#fbbf24',
};

/**
 * Full-screen booster pack opening animation.
 *
 * Phases:
 * 1. packet — Pack shakes and tears open (~1200ms)
 * 2. burst  — White light -> rarity-colored reveal (~1000ms)
 * 3. done   — Calls onComplete to transition to HarvestOverlay
 */
export function BoosterOpeningOverlay({ tier, rarity, onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>('packet');

  useEffect(() => {
    if (phase === 'packet') {
      const id = setTimeout(() => setPhase('burst'), 1200);
      return () => clearTimeout(id);
    }
    if (phase === 'burst') {
      const id = setTimeout(() => setPhase('done'), 1000);
      return () => clearTimeout(id);
    }
    if (phase === 'done') {
      onComplete();
    }
  }, [phase, onComplete]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: phase === 'burst'
          ? `radial-gradient(circle, ${RARITY_GLOW[rarity]}, rgba(251, 248, 243, 0.95))`
          : 'rgba(251, 248, 243, 0.95)',
        transition: 'background 600ms ease-out',
      }}
    >
      {phase === 'packet' && (
        <div className="flex flex-col items-center gap-4 animate-scale-in">
          {/* Booster Pack visual */}
          <div
            className="relative w-48 h-64 rounded-2xl border-4 flex flex-col items-center justify-center gap-2 shadow-soft-lg"
            style={{
              borderColor: TIER_COLOR[tier],
              background: `linear-gradient(135deg, ${TIER_COLOR[tier]}22, ${TIER_COLOR[tier]}44)`,
              animation: 'booster-shake 200ms ease-in-out 3',
            }}
          >
            <div className="text-4xl">🌱</div>
            <div className="font-serif text-lg font-bold text-ink-800 uppercase tracking-wider">
              {tier}
            </div>
            <div className="text-xs text-ink-500 font-medium">BOOSTER PACK</div>
          </div>
        </div>
      )}

      {phase === 'burst' && (
        <div className="flex items-center justify-center">
          <div
            className="w-32 h-32 rounded-full animate-pulse-slow"
            style={{
              background: `radial-gradient(circle, white, ${RARITY_GLOW[rarity]})`,
              boxShadow: `0 0 80px 40px ${RARITY_GLOW[rarity]}`,
            }}
          />
        </div>
      )}
    </div>
  );
}
