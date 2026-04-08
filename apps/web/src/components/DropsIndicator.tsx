'use client';

import { useEffect, useRef, useState } from 'react';
import { MAX_WATER_DROPS } from '@florify/shared';
import { CountdownTimer } from './CountdownTimer';

const WAVE_PATH =
  'M0,10 Q15,0 30,10 Q45,20 60,10 Q75,0 90,10 Q105,20 120,10 Q135,0 150,10 Q165,20 180,10 Q195,0 210,10 Q225,20 240,10 V20H0Z';
const WAVE_PATH_2 =
  'M0,10 Q15,2 30,10 Q45,18 60,10 Q75,2 90,10 Q105,18 120,10 Q135,2 150,10 Q165,18 180,10 Q195,2 210,10 Q225,18 240,10 V20H0Z';

/**
 * Glassy pill showing current water drops with wave-fill animation:
 * - Water level rises/falls with drop count
 * - Two SVG wave layers scroll in opposite directions
 * - At max drops the wave hides and water fills the pill completely
 * - Drop count does a pop+color-flash when it changes
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

  const [animating, setAnimating] = useState(false);
  useEffect(() => {
    if (popKey === 0) return;
    setAnimating(true);
    const id = setTimeout(() => setAnimating(false), 400);
    return () => clearTimeout(id);
  }, [popKey]);

  const isOverflow = drops > MAX_WATER_DROPS;
  const isFull = drops >= MAX_WATER_DROPS;
  const isLow = drops <= 5 && drops > 0;
  const showCountdown = nextDropAt !== null && drops < MAX_WATER_DROPS;
  const pct = Math.min((drops / MAX_WATER_DROPS) * 100, 100);

  return (
    <div className="flex flex-col items-center mb-3">
      {/* Glassy pill with wave fill */}
      <div className="relative flex items-center gap-2.5 rounded-full bg-cream-50/30 backdrop-blur-md border border-cream-200/60 shadow-soft-sm px-4 py-1.5 overflow-hidden">
        {/* Water fill */}
        <div
          className="absolute bottom-0 left-0 right-0 transition-[height] duration-300 ease-out"
          style={{ height: `${pct}%` }}
        >
          {/* Solid water body */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              top: isFull ? 0 : 10,
              background: 'rgba(56,189,248,0.45)',
            }}
          />

          {/* Wave layers — hidden when full */}
          {!isFull && (
            <div
              className="absolute top-0 left-0 w-full"
              style={{ height: 20, transform: 'translateY(-50%)' }}
            >
              <svg
                className="absolute top-0 left-0 h-full"
                style={{
                  width: '200%',
                  animation: 'wave-drift 3.5s linear infinite',
                }}
                viewBox="0 0 120 20"
                preserveAspectRatio="none"
              >
                <path d={WAVE_PATH} fill="rgba(56,189,248,0.45)" />
              </svg>
              <svg
                className="absolute top-0 left-0 h-full"
                style={{
                  width: '200%',
                  animation: 'wave-drift 5s linear infinite reverse',
                }}
                viewBox="0 0 120 20"
                preserveAspectRatio="none"
              >
                <path d={WAVE_PATH_2} fill="rgba(56,189,248,0.3)" />
              </svg>
            </div>
          )}
        </div>

        {/* Text overlay */}
        <span
          className={`relative z-10 text-sm transition-transform duration-300 ${
            animating && direction === 'up' ? 'animate-drop-bounce' : ''
          }`}
        >💧</span>
        <span
          key={popKey}
          className={`relative z-10 tabular-nums font-mono text-sm font-medium transition-colors duration-300 ${
            isOverflow
              ? 'text-leaf-600'
              : isFull
                ? 'text-emerald-400'
                : isLow
                  ? 'text-red-300'
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
            <span className="relative z-10 text-ink-300">·</span>
            <span className="relative z-10 tabular-nums font-mono text-xs text-ink-600">
              ⏳ <CountdownTimer until={nextDropAt ?? 0} />
            </span>
          </>
        )}
      </div>
    </div>
  );
}
