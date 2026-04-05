'use client';

import { useEffect } from 'react';
import { clsx } from 'clsx';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Satin-foil seed packet — empty-state centerpiece + plant transition.
 *
 * Visual register: pale champagne foil with a soft pearl gradient, a
 * warm diagonal gloss stripe, and beige seal crimps at the top and
 * bottom (mimicking a real pressed-foil seed packet). Adapted from a
 * premium booster-pack reference but toned down to fit Florify's
 * cream/clay/ink palette — "quiet luxurious" not "TCG sparkle".
 *
 * Two modes driven by `state`:
 *   - `idle`    → slow float + sway, loops forever
 *   - `opening` → 5-step sequence (~1380ms): shake → tear flap flies
 *                 off → seal pops → seed drops → packet dissolves
 *                 → onComplete()
 *
 * All motion lives in `globals.css` (`animate-packet-*` keyframes) so
 * timings are authoritative in one place — the `setTimeout` below must
 * stay in sync with those delays. Reduced-motion collapses the whole
 * sequence: onComplete fires on next tick and none of the keyframes
 * play (the global `prefers-reduced-motion` override handles that).
 *
 * Rarity/species is deliberately not surfaced here. Label says
 * "SEED №??" literal, matching the game's hidden-rarity mechanic —
 * rarity is only revealed in HarvestOverlay when the tree is picked.
 */

interface Props {
  state: 'idle' | 'opening';
  onComplete: () => void;
  className?: string;
}

// Total opening sequence length, must match the sum of animation
// delays + durations in globals.css (860ms dissolve delay + 520ms
// dissolve duration = 1380ms).
const OPEN_DURATION_MS = 1380;

// Jagged tear line that runs across the packet where the flap meets
// the body. Both the flap's bottom edge and the interior opening's
// top edge sample the same y-values at the same x-stops, so the two
// line up perfectly when the flap flies off. Hard-coded (not random)
// so SSR and hydration stay stable.
const TEAR_XS = [10, 28, 46, 64, 82, 100, 118, 136, 154, 172, 190] as const;
const TEAR_YS = [58, 66, 52, 64, 56, 68, 54, 66, 58, 62, 56] as const;

// Flap outline: flat top at y=10, down the right side, then tracing
// the jagged tear line right-to-left, then Z closes up the left side.
const FLAP_PATH = (() => {
  const last = TEAR_XS.length - 1;
  const rightToLeft = TEAR_XS.slice(0, -1)
    .map((_, i) => {
      const idx = last - 1 - i;
      return `L ${TEAR_XS[idx]} ${TEAR_YS[idx]}`;
    })
    .join(' ');
  return `M 10 10 L 190 10 L ${TEAR_XS[last]} ${TEAR_YS[last]} ${rightToLeft} Z`;
})();

// Interior-opening outline: traces the jagged tear line left-to-right,
// then closes with a flat bottom at y=82 so a ~20px dark band remains
// visible after the flap is gone.
const INTERIOR_PATH = (() => {
  const leftToRight = TEAR_XS.slice(1)
    .map((x, i) => `L ${x} ${TEAR_YS[i + 1]}`)
    .join(' ');
  return `M ${TEAR_XS[0]} ${TEAR_YS[0]} ${leftToRight} L 190 82 L 10 82 Z`;
})();

export function SeedPacket({ state, onComplete, className }: Props) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (state !== 'opening') return;
    const delay = reduced ? 0 : OPEN_DURATION_MS;
    const id = setTimeout(onComplete, delay);
    return () => clearTimeout(id);
  }, [state, reduced, onComplete]);

  const opening = state === 'opening';

  return (
    <div
      className={clsx(
        'pointer-events-none select-none',
        // Warm soft drop shadow (matches the reference's dy=15 sd=20
        // tinted with ink rather than neutral gray).
        'drop-shadow-[0_14px_28px_rgba(120,90,50,0.18)]',
        className,
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 200 300"
        className={clsx(
          'h-full w-full overflow-visible',
          !opening && 'animate-packet-float',
          opening && 'animate-packet-shake',
        )}
      >
        <defs>
          {/* Satin-foil gradient — 5-stop pale pearl with a warm
              champagne midtone. Gives the body a soft sheen without
              looking metallic. */}
          <linearGradient id="packet-foil" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDFBF6" />
            <stop offset="25%" stopColor="#F4EDDE" />
            <stop offset="50%" stopColor="#FBF8F3" />
            <stop offset="75%" stopColor="#EFE5D1" />
            <stop offset="100%" stopColor="#F6F0E3" />
          </linearGradient>

          {/* Seal crimp strip (top/bottom edges of the packet where
              the foil is pressed closed) — warm beige, slightly
              darker than the body. */}
          <linearGradient id="packet-seal" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E3D7C0" />
            <stop offset="50%" stopColor="#F1E8D5" />
            <stop offset="100%" stopColor="#DBCDB0" />
          </linearGradient>

          {/* Vertical crimp marks — tight repeating hairlines that
              telegraph a pressed-foil seam. */}
          <pattern
            id="packet-crimp"
            x="0"
            y="0"
            width="6"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="3"
              y1="2"
              x2="3"
              y2="18"
              stroke="#B8A888"
              strokeWidth="0.6"
              opacity="0.55"
            />
          </pattern>

          {/* Darker interior — revealed through the tear line once
              the flap flies off. */}
          <linearGradient id="packet-inside" x1="0%" y1="0%" x2="0%" y2="1">
            <stop offset="0%" stopColor="#4A3F30" />
            <stop offset="100%" stopColor="#6B5E4B" />
          </linearGradient>

          {/* Central ornament ring — champagne stroke. */}
          <linearGradient id="packet-champagne" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C4A482" />
            <stop offset="50%" stopColor="#E8D5C4" />
            <stop offset="100%" stopColor="#B89570" />
          </linearGradient>
        </defs>

        {/* ─── Floor shadow ─── soft warm ellipse grounding the packet. */}
        <ellipse
          cx="100"
          cy="288"
          rx="72"
          ry="5"
          fill="#78614A"
          opacity="0.14"
        />

        {/* ─── BODY (dissolves during `opening`) ─────────────────── */}
        <g className={clsx(opening && 'animate-packet-dissolve')}>
          {/* Main packet body — satin foil fill. */}
          <rect
            x="10"
            y="22"
            width="180"
            height="252"
            rx="6"
            fill="url(#packet-foil)"
            stroke="#D6CFC4"
            strokeWidth="1"
          />

          {/* Gloss reflection — a warm diagonal highlight stripe on
              the body. Kept narrow and low-opacity so it reads as a
              satin sheen, not a plastic glare. */}
          <path
            d="M 22 30
               L 56 30
               L 40 266
               L 18 266
               Z"
            fill="#FFFFFF"
            opacity="0.28"
          />
          <path
            d="M 60 30
               L 74 30
               L 58 266
               L 46 266
               Z"
            fill="#FFFFFF"
            opacity="0.12"
          />

          {/* Interior opening — dark shape revealed when the flap
              flies off. Its top edge is the same jagged path as the
              flap's bottom, so they line up 1:1. */}
          <path d={INTERIOR_PATH} fill="url(#packet-inside)" opacity="0.75" />

          {/* Bottom seal crimp — press-closed foil seam. */}
          <g>
            <rect
              x="10"
              y="250"
              width="180"
              height="20"
              rx="1"
              fill="url(#packet-seal)"
            />
            <rect
              x="10"
              y="250"
              width="180"
              height="20"
              fill="url(#packet-crimp)"
            />
            {/* Highlight along the top edge of the crimp. */}
            <line
              x1="12"
              y1="251.5"
              x2="188"
              y2="251.5"
              stroke="#FFFFFF"
              strokeWidth="0.6"
              opacity="0.7"
            />
          </g>

          {/* Corner hairline markers — subtle champagne L-brackets. */}
          <g stroke="url(#packet-champagne)" strokeWidth="0.8" fill="none" opacity="0.7">
            <path d="M 20 94 L 20 88 L 26 88" />
            <path d="M 180 94 L 180 88 L 174 88" />
            <path d="M 20 240 L 20 246 L 26 246" />
            <path d="M 180 240 L 180 246 L 174 246" />
          </g>

          {/* Wordmark — serif FLORIFY with wide tracking. */}
          <text
            x="100"
            y="118"
            textAnchor="middle"
            fontFamily="var(--font-serif)"
            fontSize="22"
            fontWeight="600"
            fill="#3A2F22"
            letterSpacing="3"
          >
            FLORIFY
          </text>
          <text
            x="100"
            y="134"
            textAnchor="middle"
            fontFamily="var(--font-sans)"
            fontSize="6.5"
            fontWeight="400"
            fill="#8A7760"
            letterSpacing="3.5"
          >
            BOTANICAL · SEED
          </text>

          {/* Thin champagne separator. */}
          <line
            x1="70"
            y1="144"
            x2="130"
            y2="144"
            stroke="url(#packet-champagne)"
            strokeWidth="0.8"
          />

          {/* Central ornament — a minimal concentric ring with a tiny
              leaf glyph, instead of the wax seal. Champagne stroke on
              the foil reads as "embossed" rather than "stuck on top". */}
          <g
            className={clsx(opening && 'animate-packet-seal-pop')}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          >
            <circle
              cx="100"
              cy="178"
              r="18"
              fill="none"
              stroke="url(#packet-champagne)"
              strokeWidth="1"
            />
            <circle
              cx="100"
              cy="178"
              r="13"
              fill="none"
              stroke="#C4A482"
              strokeWidth="0.5"
              strokeDasharray="1.5 2.5"
              opacity="0.8"
            />
            {/* Minimal leaf silhouette */}
            <path
              d="M 100 168 Q 108 174 108 180 Q 108 186 100 190 Q 92 186 92 180 Q 92 174 100 168 Z"
              fill="none"
              stroke="#A39171"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            <line
              x1="100"
              y1="168"
              x2="100"
              y2="190"
              stroke="#A39171"
              strokeWidth="0.7"
            />
          </g>

          {/* Italic whisper */}
          <text
            x="100"
            y="216"
            textAnchor="middle"
            fontFamily="var(--font-serif)"
            fontSize="8.5"
            fontStyle="italic"
            fill="#8A7760"
            letterSpacing="0.6"
          >
            sow · water · collect
          </text>

          {/* Monogram SEED №?? */}
          <text
            x="100"
            y="236"
            textAnchor="middle"
            fontFamily="var(--font-sans)"
            fontSize="7"
            fontWeight="600"
            fill="#5C4F3C"
            letterSpacing="3"
          >
            SEED  №??
          </text>

          {/* Falling seed — only travels during the drop phase. */}
          {opening && (
            <g className="animate-packet-seed-drop">
              <ellipse
                cx="100"
                cy="62"
                rx="3.2"
                ry="4.8"
                fill="#2B241B"
                transform="rotate(-8 100 62)"
              />
              <ellipse
                cx="99"
                cy="60.5"
                rx="1"
                ry="1.6"
                fill="#6B5E4B"
                opacity="0.6"
              />
            </g>
          )}
        </g>

        {/* ─── FLAP (tears off and flies up-and-away during open) ──
             Contains its own top seal crimp so the whole top strip of
             the packet travels together. Rendered outside the body
             dissolve group so its tear transform is independent. */}
        <g className={clsx(opening && 'animate-packet-tear')}>
          {/* Flap body — satin foil with jagged bottom tear line. */}
          <path d={FLAP_PATH} fill="url(#packet-foil)" stroke="#D6CFC4" strokeWidth="1" />

          {/* Gloss reflection stripe on the flap (a stubby echo of
              the body stripe so the two read as one material). */}
          <path
            d="M 22 30 L 56 30 L 44 58 L 22 58 Z"
            fill="#FFFFFF"
            opacity="0.3"
          />

          {/* Top seal crimp — press-closed foil at the very top of
              the packet. Travels with the flap when it flies off. */}
          <rect
            x="10"
            y="10"
            width="180"
            height="16"
            rx="1"
            fill="url(#packet-seal)"
          />
          <rect
            x="10"
            y="10"
            width="180"
            height="16"
            fill="url(#packet-crimp)"
          />
          <line
            x1="12"
            y1="24.5"
            x2="188"
            y2="24.5"
            stroke="#FFFFFF"
            strokeWidth="0.6"
            opacity="0.7"
          />

          {/* "SEEDS" stamp on the flap — something branded rides
              along when the piece flies off. */}
          <text
            x="100"
            y="46"
            textAnchor="middle"
            fontFamily="var(--font-sans)"
            fontSize="7"
            fontWeight="600"
            fill="#8A7760"
            letterSpacing="4"
          >
            SEEDS
          </text>
          <line
            x1="74"
            y1="52"
            x2="126"
            y2="52"
            stroke="url(#packet-champagne)"
            strokeWidth="0.6"
            opacity="0.75"
          />
        </g>
      </svg>
    </div>
  );
}
