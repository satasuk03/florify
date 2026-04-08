'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Integer counter that tweens from 0 to `value` on mount and whenever
 * `value` changes. Uses an ease-out curve so it settles rather than
 * overshoots, matching the app's "quiet luxury" motion vocabulary.
 */
export function AnimatedNumber({
  value,
  duration = 900,
  delay = 0,
  className,
}: {
  value: number;
  duration?: number;
  delay?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const start = performance.now();
      const from = 0;
      const delta = value - from;

      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        // ease-out cubic — matches cubic-bezier(0.22, 1, 0.36, 1) feel
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(Math.round(from + delta * eased));
        if (t < 1) {
          frameRef.current = requestAnimationFrame(tick);
        }
      };

      frameRef.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [value, duration, delay]);

  return <span className={className}>{display}</span>;
}
