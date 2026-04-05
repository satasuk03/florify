/**
 * Subtle fine-grain Perlin-style noise via SVG `feTurbulence`. Absolute
 * positioned, fills its nearest positioned ancestor, pointer-events:none
 * so it never interferes with touch targets.
 *
 * `baseFrequency` drives the grain size — higher = smaller grain. 2.8
 * is fine enough to read as texture rather than a pattern.
 */
export function PerlinNoise({
  className = '',
  opacity = 0.18,
  baseFrequency = 2.8,
}: {
  className?: string;
  opacity?: number;
  baseFrequency?: number;
}) {
  return (
    <svg
      aria-hidden
      className={`absolute inset-0 h-full w-full pointer-events-none mix-blend-multiply ${className}`}
      style={{ opacity }}
    >
      <filter id="florify-perlin-noise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency={baseFrequency}
          numOctaves={2}
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#florify-perlin-noise)" />
    </svg>
  );
}
