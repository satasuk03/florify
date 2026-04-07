'use client';

import { useEffect, useRef, useState } from 'react';
import { MAX_WATER_DROPS } from '@florify/shared';
import { CountdownTimer } from './CountdownTimer';



/**
 * Glassy pill showing current water drops with animations:
 * - Drop count does a pop+color-flash when it changes
 * - Countdown timer sits below the main count on its own line
 */
export function DropsIndicator({
  drops,
  nextDropAt,
}: {
  drops: number;
  nextDropAt: number | null;
}) {
  const prevDrops = useRef(drops);
  const [popKey, setPopKey] = useState(0);
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (prevDrops.current !== drops) {
      setDirection(drops > prevDrops.current ? 'up' : 'down');
      setPopKey((k) => k + 1);
      prevDrops.current = drops;
    }
  }, [drops]);

  // Clear the animation class after it finishes
  const [animating, setAnimating] = useState(false);
  useEffect(() => {
    if (popKey === 0) return;
    setAnimating(true);
    const id = setTimeout(() => setAnimating(false), 400);
    return () => clearTimeout(id);
  }, [popKey]);

  const isOverflow = drops > MAX_WATER_DROPS;
  const showCountdown = nextDropAt !== null && drops < MAX_WATER_DROPS;

  return (
    <div className="flex flex-col items-center mb-3">
      {/* Glassy pill — drops count + countdown together */}
      <div className="flex items-center gap-2.5 rounded-full bg-cream-50/30 backdrop-blur-md border border-cream-200/60 shadow-soft-sm px-4 py-1.5">
        <span
          className={`text-sm transition-transform duration-300 ${
            animating && direction === 'up' ? 'animate-drop-bounce' : ''
          }`}
        >💧</span>
        <span
          key={popKey}
          className={`tabular-nums font-mono text-sm font-medium transition-colors duration-300 ${
            isOverflow
              ? 'text-leaf-600'
              : animating && direction === 'up'
                ? 'text-sky-600 animate-count-pop'
                : animating && direction === 'down'
                  ? 'text-clay-600 animate-count-pop'
                  : 'text-ink-700'
          }`}
        >
          {drops}/{MAX_WATER_DROPS}
        </span>
        {showCountdown && (
          <>
            <span className="text-ink-300">·</span>
            <span className="tabular-nums font-mono text-xs text-ink-600">
              ⏳ <CountdownTimer until={nextDropAt ?? 0} />
            </span>
          </>
        )}
      </div>
    </div>
  );
}
