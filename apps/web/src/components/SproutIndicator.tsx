'use client';

import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '@/store/gameStore';

/**
 * Compact 🌱 N pill showing current sprout balance.
 * Pop animation on count change, similar to DropsIndicator.
 */
export function SproutIndicator() {
  const hydrated = useGameStore((s) => s.hydrated);
  const sprouts = useGameStore((s) => s.state.sprouts);
  const prevSprouts = useRef(sprouts);
  const [popKey, setPopKey] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (prevSprouts.current !== sprouts) {
      setPopKey((k) => k + 1);
      prevSprouts.current = sprouts;
    }
  }, [sprouts]);

  useEffect(() => {
    if (popKey === 0) return;
    setAnimating(true);
    const id = setTimeout(() => setAnimating(false), 400);
    return () => clearTimeout(id);
  }, [popKey]);

  if (!hydrated) return null;

  return (
    <div className="flex items-center gap-1.5 rounded-full bg-cream-50/30 backdrop-blur-md border border-cream-200/60 shadow-soft-sm px-3 py-1">
      <span className="text-sm">🌱</span>
      <span
        key={popKey}
        className={`tabular-nums font-mono text-sm font-medium ${
          animating ? 'text-leaf-600 animate-count-pop' : 'text-ink-700'
        }`}
      >
        {sprouts}
      </span>
    </div>
  );
}
