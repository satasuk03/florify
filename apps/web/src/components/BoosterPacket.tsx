'use client';

import { useEffect } from 'react';
import { clsx } from 'clsx';
import type { BoosterTier } from '@florify/shared';

/**
 * Booster Pack foil packet — tier-specific variant of SeedPacket.
 *
 * Same structural anatomy (body, gloss stripes, seal crimps, tear line,
 * flap, interior opening, dissolve) but each tier gets its own colour
 * palette and ornament motif:
 *
 *   - Common:    warm earthy greens, leaf ornament, linen-like texture
 *   - Rare:      cool blue-silver, star ornament, frosted shimmer
 *   - Legendary: rich gold, crown ornament, metallic lustre
 *
 * Reuses the `animate-packet-*` CSS classes from globals.css so the
 * shake → tear → seal-pop → dissolve sequence is identical to SeedPacket.
 */

interface Props {
  tier: BoosterTier;
  state: 'idle' | 'opening';
  onComplete: () => void;
  className?: string;
}

const OPEN_DURATION_MS = 1380;

// Same tear geometry as SeedPacket for visual consistency.
const TEAR_XS = [10, 28, 46, 64, 82, 100, 118, 136, 154, 172, 190] as const;
const TEAR_YS = [58, 66, 52, 64, 56, 68, 54, 66, 58, 62, 56] as const;

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

const INTERIOR_PATH = (() => {
  const leftToRight = TEAR_XS.slice(1)
    .map((x, i) => `L ${x} ${TEAR_YS[i + 1]}`)
    .join(' ');
  return `M ${TEAR_XS[0]} ${TEAR_YS[0]} ${leftToRight} L 190 82 L 10 82 Z`;
})();

// ── Tier colour palettes ──────────────────────────────────────────

interface TierPalette {
  foil: [string, string, string, string, string];
  seal: [string, string, string];
  crimp: string;
  stroke: string;
  inside: [string, string];
  accent: [string, string, string]; // gradient for ornament ring
  text: string;
  textSub: string;
  glossOpacity: number;
}

const PALETTES: Record<BoosterTier, TierPalette> = {
  common: {
    foil: ['#F2EDDF', '#E5DCCA', '#F0EAD8', '#DDD3BC', '#E8E0CE'],
    seal: ['#C8BD9E', '#DDD3BC', '#BFB393'],
    crimp: '#A89B7C',
    stroke: '#C4B898',
    inside: ['#4A4230', '#6B5E4B'],
    accent: ['#7A8E5A', '#A8C49A', '#5A7040'],
    text: '#3A3222',
    textSub: '#7A6E58',
    glossOpacity: 0.22,
  },
  rare: {
    foil: ['#E8EFF6', '#D4E2F0', '#ECF2FA', '#C8D8EA', '#DEE8F4'],
    seal: ['#A8BED4', '#C8D8EA', '#96ACCA'],
    crimp: '#7A9CB8',
    stroke: '#A0B8D0',
    inside: ['#2A3A4A', '#4A5E72'],
    accent: ['#5A8AB0', '#8ABCE0', '#3A6A90'],
    text: '#1A2A3A',
    textSub: '#5A7088',
    glossOpacity: 0.30,
  },
  legendary: {
    foil: ['#FFF6E0', '#F0DCA8', '#FFF2D0', '#E8C878', '#F5E4B0'],
    seal: ['#D4A24C', '#E8C878', '#C08830'],
    crimp: '#B08428',
    stroke: '#D4A24C',
    inside: ['#4A3818', '#6B5228'],
    accent: ['#C08830', '#F0D070', '#A06820'],
    text: '#3A2A10',
    textSub: '#8A6A30',
    glossOpacity: 0.35,
  },
};

const TIER_LABELS: Record<BoosterTier, { top: string; mid: string; stamp: string }> = {
  common: { top: 'FLORIFY', mid: 'BOTANICAL · BOOSTER', stamp: 'COMMON  PACK' },
  rare: { top: 'FLORIFY', mid: 'RARE · BOOSTER', stamp: 'RARE  PACK' },
  legendary: { top: 'FLORIFY', mid: 'LEGENDARY · BOOSTER', stamp: 'LEGENDARY' },
};

// ── Tier-specific center ornaments ────────────────────────────────

function CommonOrnament({ accent }: { accent: [string, string, string] }) {
  return (
    <g>
      {/* Double leaf */}
      <path
        d="M 100 165 Q 112 174 112 183 Q 112 192 100 198 Q 88 192 88 183 Q 88 174 100 165 Z"
        fill="none" stroke={accent[1]} strokeWidth="1.2" strokeLinejoin="round"
      />
      <line x1="100" y1="165" x2="100" y2="198" stroke={accent[1]} strokeWidth="0.7" />
      {/* Leaf veins */}
      <path d="M 100 172 Q 106 176 108 180" fill="none" stroke={accent[1]} strokeWidth="0.4" opacity="0.6" />
      <path d="M 100 172 Q 94 176 92 180" fill="none" stroke={accent[1]} strokeWidth="0.4" opacity="0.6" />
      <path d="M 100 180 Q 105 184 107 187" fill="none" stroke={accent[1]} strokeWidth="0.4" opacity="0.5" />
      <path d="M 100 180 Q 95 184 93 187" fill="none" stroke={accent[1]} strokeWidth="0.4" opacity="0.5" />
    </g>
  );
}

function RareOrnament({ accent }: { accent: [string, string, string] }) {
  return (
    <g>
      {/* 6-pointed star */}
      <polygon
        points="100,164 103,176 115,176 105,184 109,196 100,188 91,196 95,184 85,176 97,176"
        fill="none" stroke={accent[1]} strokeWidth="1" strokeLinejoin="round"
      />
      {/* Inner sparkle dot */}
      <circle cx="100" cy="180" r="2" fill={accent[1]} opacity="0.5" />
      {/* Tiny corner sparkles */}
      <circle cx="88" cy="170" r="0.8" fill={accent[1]} opacity="0.4" />
      <circle cx="112" cy="170" r="0.8" fill={accent[1]} opacity="0.4" />
      <circle cx="100" cy="196" r="0.8" fill={accent[1]} opacity="0.4" />
    </g>
  );
}

function LegendaryOrnament({ accent }: { accent: [string, string, string] }) {
  return (
    <g>
      {/* Crown */}
      <path
        d="M 86 190 L 86 176 L 93 182 L 100 170 L 107 182 L 114 176 L 114 190 Z"
        fill="none" stroke={accent[1]} strokeWidth="1.2" strokeLinejoin="round"
      />
      {/* Crown band */}
      <line x1="86" y1="190" x2="114" y2="190" stroke={accent[1]} strokeWidth="1.5" />
      {/* Center jewel */}
      <circle cx="100" cy="185" r="2.5" fill={accent[1]} opacity="0.6" />
      <circle cx="100" cy="185" r="1.2" fill="white" opacity="0.4" />
      {/* Side jewels */}
      <circle cx="92" cy="187" r="1.2" fill={accent[1]} opacity="0.4" />
      <circle cx="108" cy="187" r="1.2" fill={accent[1]} opacity="0.4" />
    </g>
  );
}

const ORNAMENTS: Record<BoosterTier, typeof CommonOrnament> = {
  common: CommonOrnament,
  rare: RareOrnament,
  legendary: LegendaryOrnament,
};

// ── Component ─────────────────────────────────────────────────────

export function BoosterPacket({ tier, state, onComplete, className }: Props) {
  useEffect(() => {
    if (state !== 'opening') return;
    const id = setTimeout(onComplete, OPEN_DURATION_MS);
    return () => clearTimeout(id);
  }, [state, onComplete]);

  const opening = state === 'opening';
  const p = PALETTES[tier];
  const labels = TIER_LABELS[tier];
  const Ornament = ORNAMENTS[tier];
  const uid = `bp-${tier}`;

  return (
    <div
      className={clsx('pointer-events-none select-none', className)}
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
          <linearGradient id={`${uid}-foil`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={p.foil[0]} />
            <stop offset="25%" stopColor={p.foil[1]} />
            <stop offset="50%" stopColor={p.foil[2]} />
            <stop offset="75%" stopColor={p.foil[3]} />
            <stop offset="100%" stopColor={p.foil[4]} />
          </linearGradient>

          <linearGradient id={`${uid}-seal`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={p.seal[0]} />
            <stop offset="50%" stopColor={p.seal[1]} />
            <stop offset="100%" stopColor={p.seal[2]} />
          </linearGradient>

          <pattern id={`${uid}-crimp`} x="0" y="0" width="6" height="20" patternUnits="userSpaceOnUse">
            <line x1="3" y1="2" x2="3" y2="18" stroke={p.crimp} strokeWidth="0.6" opacity="0.55" />
          </pattern>

          <linearGradient id={`${uid}-inside`} x1="0%" y1="0%" x2="0%" y2="1">
            <stop offset="0%" stopColor={p.inside[0]} />
            <stop offset="100%" stopColor={p.inside[1]} />
          </linearGradient>

          <linearGradient id={`${uid}-accent`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={p.accent[0]} />
            <stop offset="50%" stopColor={p.accent[1]} />
            <stop offset="100%" stopColor={p.accent[2]} />
          </linearGradient>
        </defs>

        {/* ─── BODY ─────────────────────────────────────────────── */}
        <g className={clsx(opening && 'animate-packet-dissolve')}>
          {/* Main body */}
          <rect x="10" y="22" width="180" height="252" rx="6"
            fill={`url(#${uid}-foil)`} stroke={p.stroke} strokeWidth="1" />

          {/* Gloss stripes */}
          <path d="M 22 30 L 56 30 L 40 266 L 18 266 Z" fill="#FFFFFF" opacity={p.glossOpacity} />
          <path d="M 60 30 L 74 30 L 58 266 L 46 266 Z" fill="#FFFFFF" opacity={p.glossOpacity * 0.5} />

          {/* Interior */}
          <path d={INTERIOR_PATH} fill={`url(#${uid}-inside)`} opacity="0.75" />

          {/* Bottom seal */}
          <g>
            <rect x="10" y="250" width="180" height="20" rx="1" fill={`url(#${uid}-seal)`} />
            <rect x="10" y="250" width="180" height="20" fill={`url(#${uid}-crimp)`} />
            <line x1="12" y1="251.5" x2="188" y2="251.5" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.7" />
          </g>

          {/* Corner brackets */}
          <g stroke={`url(#${uid}-accent)`} strokeWidth="0.8" fill="none" opacity="0.7">
            <path d="M 20 94 L 20 88 L 26 88" />
            <path d="M 180 94 L 180 88 L 174 88" />
            <path d="M 20 240 L 20 246 L 26 246" />
            <path d="M 180 240 L 180 246 L 174 246" />
          </g>

          {/* Wordmark */}
          <text x="100" y="118" textAnchor="middle" fontFamily="var(--font-serif)"
            fontSize="22" fontWeight="600" fill={p.text} letterSpacing="3">
            {labels.top}
          </text>
          <text x="100" y="134" textAnchor="middle" fontFamily="var(--font-sans)"
            fontSize="6.5" fontWeight="400" fill={p.textSub} letterSpacing="3.5">
            {labels.mid}
          </text>

          {/* Separator */}
          <line x1="70" y1="144" x2="130" y2="144"
            stroke={`url(#${uid}-accent)`} strokeWidth="0.8" />

          {/* Center ornament ring + tier motif */}
          <g
            className={clsx(opening && 'animate-packet-seal-pop')}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          >
            <circle cx="100" cy="180" r="22" fill="none"
              stroke={`url(#${uid}-accent)`} strokeWidth="1" />
            <circle cx="100" cy="180" r="16" fill="none"
              stroke={p.accent[0]} strokeWidth="0.5" strokeDasharray="1.5 2.5" opacity="0.6" />
            <Ornament accent={p.accent} />
          </g>

          {/* Italic whisper */}
          <text x="100" y="218" textAnchor="middle" fontFamily="var(--font-serif)"
            fontSize="8.5" fontStyle="italic" fill={p.textSub} letterSpacing="0.6">
            sow · water · collect
          </text>

          {/* Stamp */}
          <text x="100" y="238" textAnchor="middle" fontFamily="var(--font-sans)"
            fontSize="7" fontWeight="600" fill={p.text} letterSpacing="3">
            {labels.stamp}
          </text>

          {/* Falling sprout emoji on open */}
          {opening && (
            <g className="animate-packet-seed-drop">
              <text x="100" y="68" textAnchor="middle" fontSize="14">🌱</text>
            </g>
          )}
        </g>

        {/* ─── FLAP ─────────────────────────────────────────────── */}
        <g className={clsx(opening && 'animate-packet-tear')}>
          <path d={FLAP_PATH} fill={`url(#${uid}-foil)`} stroke={p.stroke} strokeWidth="1" />
          <path d="M 22 30 L 56 30 L 44 58 L 22 58 Z" fill="#FFFFFF" opacity={p.glossOpacity + 0.05} />

          {/* Top seal */}
          <rect x="10" y="10" width="180" height="16" rx="1" fill={`url(#${uid}-seal)`} />
          <rect x="10" y="10" width="180" height="16" fill={`url(#${uid}-crimp)`} />
          <line x1="12" y1="24.5" x2="188" y2="24.5" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.7" />

          {/* Flap label */}
          <text x="100" y="46" textAnchor="middle" fontFamily="var(--font-sans)"
            fontSize="7" fontWeight="600" fill={p.textSub} letterSpacing="4">
            BOOSTER
          </text>
          <line x1="74" y1="52" x2="126" y2="52"
            stroke={`url(#${uid}-accent)`} strokeWidth="0.6" opacity="0.75" />
        </g>
      </svg>
    </div>
  );
}
