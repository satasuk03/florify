"use client";

/**
 * One-shot water-droplet animation that plays on every successful tap
 * of the รดน้ำ button. PlotView keys this component on a monotonic
 * counter so each tap remounts the tree of droplets + splashes and
 * replays their keyframes from the start.
 *
 * Visuals (see globals.css §water-splash):
 *  - 5 droplets fall from above the plant, each with a horizontal
 *    offset (`--dx`) and its own stagger delay so the burst feels
 *    hand-sprinkled rather than a rigid column.
 *  - As the droplet squishes against the ground a matching splash
 *    ring expands and fades beneath it.
 *
 * Self-unmounts after the longest timeline finishes so stale DOM
 * doesn't pile up on repeated taps.
 */
import { useEffect, useState } from "react";

type Drop = {
  dx: number; // horizontal scatter in px
  delay: number; // ms before this droplet starts falling
};

const DROPS: Drop[] = [
  { dx: -28, delay: 0 },
  { dx: 14, delay: 80 },
  { dx: -6, delay: 150 },
  { dx: 32, delay: 220 },
  { dx: -18, delay: 300 },
];

// Drop fall (620ms) starts at `delay`; splash fires after the drop has
// "landed" (~70% of the fall), so splashDelay = delay + 430.
const DROP_FALL_MS = 620;
const SPLASH_MS = 520;
const LAND_OFFSET = 430;
const TOTAL_MS = Math.max(
  ...DROPS.map((d) => d.delay + DROP_FALL_MS),
  ...DROPS.map((d) => d.delay + LAND_OFFSET + SPLASH_MS),
);

export function WaterSplash() {
  const [alive, setAlive] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => setAlive(false), TOTAL_MS + 40);
    return () => clearTimeout(id);
  }, []);
  if (!alive) return null;

  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none overflow-hidden"
    >
      {/* Anchor at roughly the visual base of the plant — the flora
          image is full-bleed object-cover so the stem base tends to
          sit around the lower third of the viewport. */}
      <div className="absolute left-1/2 bottom-[40%] -translate-x-1/2">
        {DROPS.map((d, i) => (
          <span key={i} className="contents">
            {/* Droplet — a chunky elongated teardrop in water blue.
                `--dx` is read by the water-drop-fall keyframes. */}
            <span
              className="animate-water-drop absolute left-0 top-0 block w-[20px] h-[30px]
                bg-gradient-to-b from-sky-200/50 to-sky-500/55
                shadow-[0_2px_4px_rgba(30,80,120,0.18),inset_0_2px_2px_rgba(255,255,255,0.45)]"
              style={{
                borderRadius: "50% 50% 50% 50% / 65% 65% 35% 35%",
                ["--dx" as string]: `${d.dx}px`,
                animationDelay: `${d.delay}ms`,
                transform: `translate(${d.dx}px, -220px)`,
              }}
            />
            {/* Splash ring — expands from the landing point. Sits at
                the same (dx, 0) so it appears right under the droplet. */}
            <span
              className="animate-water-splash absolute top-[24px] block w-12 h-3
                rounded-[50%] border border-sky-400/45 bg-sky-300/15"
              style={{
                left: `${d.dx - 24}px`,
                animationDelay: `${d.delay + LAND_OFFSET}ms`,
              }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
