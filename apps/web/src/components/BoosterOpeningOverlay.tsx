'use client';

import { useEffect, useState, useCallback } from 'react';
import type { BoosterTier, Rarity } from '@florify/shared';
import { BoosterPacket } from '@/components/BoosterPacket';
import { useT } from '@/i18n/useT';

interface Props {
  tier: BoosterTier;
  rarity: Rarity;
  onComplete: () => void;
}

type Phase = 'idle' | 'opening' | 'burst' | 'done';

const RARITY_GLOW: Record<Rarity, string> = {
  common: 'rgba(184, 168, 136, 0.85)',
  rare: 'rgba(122, 156, 184, 0.85)',
  legendary: 'rgba(212, 162, 76, 0.85)',
};

/**
 * Full-screen booster pack opening animation.
 *
 * Phase 1 — idle: Pack floats, waiting for the player to tap it.
 * Phase 2 — opening: SeedPacket-style tear sequence (~1380ms).
 * Phase 3 — burst: White → rarity-colour light reveal (~1000ms).
 * Phase 4 — done: Calls onComplete → HarvestOverlay.
 */
export function BoosterOpeningOverlay({ tier, rarity, onComplete }: Props) {
  const t = useT();
  const [phase, setPhase] = useState<Phase>('idle');

  const handleTap = () => {
    if (phase === 'idle') setPhase('opening');
  };

  const handlePacketComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        background: 'rgba(251, 248, 243, 0.92)',
      }}
    >
      {(phase === 'idle' || phase === 'opening') && (
        <div
          className={`animate-scale-in ${phase === 'idle' ? 'cursor-pointer' : ''}`}
          onClick={handleTap}
        >
          <BoosterPacket
            tier={tier}
            state={phase === 'opening' ? 'opening' : 'idle'}
            onComplete={handlePacketComplete}
            className="w-[min(62vw,280px)]"
          />
        </div>
      )}

      {phase === 'idle' && (
        <p
          className="mt-6 text-sm text-ink-500 animate-fade-up font-medium"
          style={{ animationDelay: '300ms' }}
        >
          {t('shop.tapToOpen')}
        </p>
      )}

    </div>
  );
}
