'use client';

import { useEffect } from 'react';
import { clsx } from 'clsx';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Kraft-paper seed packet — empty-state centerpiece + plant transition.
 *
 * Two modes driven by `state`:
 *   - `idle`    → slow float + sway, loops forever
 *   - `opening` → 6-step sequence (~1160ms): shake → tear flap → seal
 *                 pop → seed drops → packet dissolves → onComplete()
 *
 * All motion lives in `globals.css` (`animate-packet-*` keyframes) so
 * timings are authoritative in one place — the `setTimeout` below must
 * stay in sync with those delays. Reduced-motion collapses the whole
 * sequence: onComplete fires on next tick and none of the keyframes
 * play (the global `prefers-reduced-motion` override handles that).
 *
 * This is pure presentation — it never touches the store. The parent
 * (PlotView) owns the phase state machine and tells the packet when
 * to open, then reacts to `onComplete`.
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
// delays + durations in globals.css (680ms dissolve delay + 480ms
// dissolve duration = 1160ms). Floorcheck: flora stage-in adds
// another ~300ms of visual overlap but the handoff fires here.
const OPEN_DURATION_MS = 1160;

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
        'pointer-events-none select-none drop-shadow-[0_12px_32px_rgba(75,55,30,0.18)]',
        className,
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 200 280"
        className={clsx(
          'h-full w-full overflow-visible',
          !opening && 'animate-packet-float',
          opening && 'animate-packet-shake',
        )}
        // Enable 3D transforms on children (flap rotateX).
        style={{ transformStyle: 'preserve-3d', perspective: 600 }}
      >
        <defs>
          {/* Kraft-paper grain — subtle, applied to body fill.
              baseFrequency high so the noise is fine-grained; the
              colorMatrix desaturates and the composite clamps it
              to a very low opacity so it reads as paper fiber, not
              static. */}
          <filter id="packet-grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              seed="4"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.52
                      0 0 0 0 0.44
                      0 0 0 0 0.32
                      0 0 0 0.08 0"
            />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>

          {/* Soft top-to-bottom cream shade suggesting paper fiber. */}
          <linearGradient id="packet-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F6F1E8" />
            <stop offset="100%" stopColor="#EEE6D6" />
          </linearGradient>

          {/* Opening mouth — darker so the gap reads after tear. */}
          <linearGradient id="packet-inside" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6B5E4B" />
            <stop offset="100%" stopColor="#9C8F7B" />
          </linearGradient>
        </defs>

        {/* ─── BODY (dissolves as one group during `opening`) ── */}
        <g className={clsx(opening && 'animate-packet-dissolve')}>
          {/* Inside-of-packet backdrop — visible after flap tears. */}
          <rect
            x="18"
            y="22"
            width="164"
            height="24"
            rx="1"
            fill="url(#packet-inside)"
            opacity="0.6"
          />

          {/* Main packet body */}
          <rect
            x="10"
            y="30"
            width="180"
            height="238"
            rx="5"
            fill="url(#packet-body)"
            stroke="#E3D7C0"
            strokeWidth="1.2"
          />
          {/* Paper grain overlay */}
          <rect
            x="10"
            y="30"
            width="180"
            height="238"
            rx="5"
            fill="#F6F1E8"
            filter="url(#packet-grain)"
          />

          {/* Corner L embossings — botanical-plate framing. */}
          <g stroke="#9C8F7B" strokeWidth="1" fill="none" opacity="0.55">
            {/* top-left */}
            <path d="M 20 44 L 20 38 L 26 38" />
            {/* top-right */}
            <path d="M 180 44 L 180 38 L 174 38" />
            {/* bottom-left */}
            <path d="M 20 256 L 20 262 L 26 262" />
            {/* bottom-right */}
            <path d="M 180 256 L 180 262 L 174 262" />
          </g>

          {/* Wordmark — Fraunces serif via CSS inheritance */}
          <text
            x="100"
            y="98"
            textAnchor="middle"
            fontFamily="var(--font-serif)"
            fontSize="22"
            fontWeight="600"
            fill="#2B241B"
            letterSpacing="2"
          >
            FLORIFY
          </text>
          <text
            x="100"
            y="116"
            textAnchor="middle"
            fontFamily="var(--font-sans)"
            fontSize="7"
            fontWeight="500"
            fill="#6B5E4B"
            letterSpacing="3"
          >
            BOTANICAL SEED
          </text>

          {/* Thin divider */}
          <line
            x1="40"
            y1="128"
            x2="160"
            y2="128"
            stroke="#D1C0A0"
            strokeWidth="0.8"
          />

          {/* Twine — two diagonal strands crossing at the seal. */}
          <g
            stroke="#A96842"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
            opacity="0.85"
          >
            <path d="M 40 155 Q 100 148 160 155" />
            <path d="M 40 165 Q 100 172 160 165" />
          </g>

          {/* Wax seal — scales + fades during tear phase. */}
          <g
            className={clsx(opening && 'animate-packet-seal-pop')}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          >
            <circle
              cx="100"
              cy="160"
              r="14"
              fill="#C7825A"
              stroke="#A96842"
              strokeWidth="1.2"
            />
            <circle
              cx="100"
              cy="160"
              r="10"
              fill="none"
              stroke="#FBF8F3"
              strokeWidth="0.6"
              opacity="0.7"
            />
            {/* 5-petal leaf glyph inside */}
            <g fill="#FBF8F3" opacity="0.95">
              <circle cx="100" cy="153" r="2" />
              <circle cx="106" cy="157.5" r="2" />
              <circle cx="104" cy="165" r="2" />
              <circle cx="96" cy="165" r="2" />
              <circle cx="94" cy="157.5" r="2" />
              <circle cx="100" cy="160" r="1.2" fill="#8A5E1C" />
            </g>
          </g>

          {/* Lower label block */}
          <text
            x="100"
            y="208"
            textAnchor="middle"
            fontFamily="var(--font-serif)"
            fontSize="9"
            fontStyle="italic"
            fill="#6B5E4B"
            letterSpacing="1"
          >
            sow · water · collect
          </text>
          <text
            x="100"
            y="230"
            textAnchor="middle"
            fontFamily="var(--font-sans)"
            fontSize="8"
            fontWeight="600"
            fill="#4A3F30"
            letterSpacing="2.5"
          >
            SEED №??
          </text>

          {/* Decorative bottom hairline */}
          <line
            x1="50"
            y1="248"
            x2="150"
            y2="248"
            stroke="#D1C0A0"
            strokeWidth="0.6"
          />

          {/* Falling seed — only travels during the drop phase. Stays
              invisible otherwise thanks to the 0%/100% opacity stops
              in the `packet-seed-drop` keyframe. */}
          {opening && (
            <g className="animate-packet-seed-drop">
              <ellipse
                cx="100"
                cy="44"
                rx="3.2"
                ry="4.8"
                fill="#2B241B"
                transform="rotate(-8 100 44)"
              />
              <ellipse
                cx="99"
                cy="42.5"
                rx="1"
                ry="1.6"
                fill="#6B5E4B"
                opacity="0.6"
              />
            </g>
          )}
        </g>

        {/* ─── FLAP (rotates back independently during tear) ──
             Positioned OUTSIDE the dissolve group so the flap can
             have its own transform without fighting the parent. */}
        <g
          className={clsx(
            opening && 'animate-packet-tear animate-packet-dissolve',
          )}
          style={{ transformBox: 'fill-box', transformOrigin: 'top' }}
        >
          {/* Flap body — scalloped bottom edge (8 waves) to read as
              a torn/deckled paper edge when it opens. */}
          <path
            d="M 10 10
               L 190 10
               L 190 34
               Q 178 40 166 34
               Q 154 28 142 34
               Q 130 40 118 34
               Q 106 28 94 34
               Q 82 40 70 34
               Q 58 28 46 34
               Q 34 40 22 34
               Q 16 32 10 34
               Z"
            fill="url(#packet-body)"
            stroke="#E3D7C0"
            strokeWidth="1.2"
          />
          <path
            d="M 10 10
               L 190 10
               L 190 34
               Q 178 40 166 34
               Q 154 28 142 34
               Q 130 40 118 34
               Q 106 28 94 34
               Q 82 40 70 34
               Q 58 28 46 34
               Q 34 40 22 34
               Q 16 32 10 34
               Z"
            fill="#F6F1E8"
            filter="url(#packet-grain)"
          />
          {/* Highlight line along the fold */}
          <line
            x1="14"
            y1="14"
            x2="186"
            y2="14"
            stroke="#FBF8F3"
            strokeWidth="0.8"
            opacity="0.8"
          />
        </g>
      </svg>
    </div>
  );
}
