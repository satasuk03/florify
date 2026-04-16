'use client';

import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { CoinIcon } from '@/components/icons';

/**
 * 🪙 N gold pill. Mirrors SproutIndicator visually so the two currencies
 * feel like a pair in the shop header. Only used on screens that spend
 * gold (Shop, Cosmetics) — intentionally absent from PlotView.
 */
export function GoldIndicator() {
  const hydrated = useGameStore((s) => s.hydrated);
  const gold = useGameStore((s) => s.state.gold);
  const prevGold = useRef(gold);
  const [popKey, setPopKey] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (prevGold.current !== gold) {
      setPopKey((k) => k + 1);
      prevGold.current = gold;
    }
  }, [gold]);

  useEffect(() => {
    if (popKey === 0) return;
    setAnimating(true);
    const id = setTimeout(() => setAnimating(false), 400);
    return () => clearTimeout(id);
  }, [popKey]);

  if (!hydrated) return null;

  return (
    <div className="flex items-center gap-1.5 rounded-full bg-cream-50/30 backdrop-blur-md border border-cream-200/60 shadow-soft-sm px-3 py-1">
      <CoinIcon size={16} />
      <span
        key={popKey}
        className={`tabular-nums font-mono text-sm font-medium ${
          animating ? 'text-amber-600 animate-count-pop' : 'text-ink-700'
        }`}
      >
        {gold}
      </span>
    </div>
  );
}
