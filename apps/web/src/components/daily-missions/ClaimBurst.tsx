'use client';

import { useEffect, useMemo, useState } from 'react';

const BURST_COUNT = 10;

/**
 * Particle burst animation for drop claim buttons.
 * Pre-computes random values in useMemo to avoid impure renders.
 */
export function ClaimBurst() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setVisible(false), 900);
    return () => clearTimeout(id);
  }, []);

  const particles = useMemo(
    () =>
      Array.from({ length: BURST_COUNT }, (_, i) => {
        const angle = (i / BURST_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const dist = 50 + Math.random() * 40;
        return {
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist,
          delay: Math.random() * 80,
          size: 14 + Math.random() * 8,
        };
      }),
    [],
  );

  if (!visible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10" aria-hidden>
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute"
          style={{
            '--dx': `${p.dx}px`,
            '--dy': `${p.dy}px`,
            fontSize: `${p.size}px`,
            animation: `claim-drop-burst 700ms cubic-bezier(0.22, 1, 0.36, 1) both`,
            animationDelay: `${p.delay}ms`,
          } as React.CSSProperties}
        >
          💧
        </span>
      ))}
    </div>
  );
}
