'use client';

import { useEffect } from 'react';
import { clsx } from 'clsx';
import type { CosmeticType } from '@florify/shared';

/**
 * Cosmetic box packet — structural sibling of BoosterPacket.
 *
 * Shares the exact same pack geometry (body, gloss, seal crimps, tear
 * line, flap, interior, dissolve) and reuses the `animate-packet-*`
 * CSS classes. Only the palette, typography, and ornament change so
 * cosmetic boxes read as a distinct SKU without reinventing the
 * animation pipeline.
 */

interface Props {
  type: CosmeticType;
  state: 'idle' | 'opening';
  onComplete: () => void;
  className?: string;
}

const OPEN_DURATION_MS = 1380;

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

interface Palette {
  foil: [string, string, string, string, string];
  seal: [string, string, string];
  crimp: string;
  stroke: string;
  inside: [string, string];
  accent: [string, string, string];
  text: string;
  textSub: string;
  glossOpacity: number;
}

const PALETTES: Record<CosmeticType, Palette> = {
  character: {
    // Warm rose / terracotta — evokes portraits and fabric.
    foil: ['#FBEBE2', '#F3D4C4', '#FBE3D3', '#ECC4AE', '#F6DCC9'],
    seal: ['#D39579', '#ECC4AE', '#B87855'],
    crimp: '#9E6343',
    stroke: '#D19880',
    inside: ['#3E2418', '#5B3826'],
    accent: ['#B25D3A', '#E8A078', '#8A3F22'],
    text: '#3A1E12',
    textSub: '#8A5038',
    glossOpacity: 0.28,
  },
  background: {
    // Cool sky + meadow — evokes parallax scenery.
    foil: ['#E6EFE9', '#CFDDD3', '#E8F1EA', '#B8CDBF', '#D4E2D8'],
    seal: ['#8FA89A', '#B8CDBF', '#728B7C'],
    crimp: '#5D7466',
    stroke: '#9AB3A3',
    inside: ['#1F2E27', '#3A4E43'],
    accent: ['#5A8470', '#9ABFA8', '#3A6450'],
    text: '#1A2A23',
    textSub: '#506D5E',
    glossOpacity: 0.26,
  },
};

const LABELS: Record<CosmeticType, { top: string; mid: string; stamp: string; whisper: string }> = {
  character: {
    top: 'FLORIFY',
    mid: 'CHARACTER · BOX',
    stamp: 'GARDENER',
    whisper: 'meet · your · kindred',
  },
  background: {
    top: 'FLORIFY',
    mid: 'SCENERY · BOX',
    stamp: 'LANDSCAPE',
    whisper: 'set · the · scene',
  },
};

function CharacterOrnament({ accent }: { accent: [string, string, string] }) {
  return (
    <g>
      {/* Silhouette bust inside circle */}
      <circle cx="100" cy="178" r="5" fill="none" stroke={accent[1]} strokeWidth="1.2" />
      <path d="M 90 196 C 92 188 108 188 110 196" fill="none" stroke={accent[1]} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="100" cy="178" r="1.5" fill={accent[1]} opacity="0.45" />
    </g>
  );
}

function BackgroundOrnament({ accent }: { accent: [string, string, string] }) {
  return (
    <g>
      {/* Mini landscape: sun + hill */}
      <circle cx="100" cy="176" r="4" fill="none" stroke={accent[1]} strokeWidth="1.2" />
      <path d="M 86 196 Q 94 184 100 190 Q 106 184 114 196 Z" fill="none" stroke={accent[1]} strokeWidth="1.2" strokeLinejoin="round" />
      <line x1="86" y1="196" x2="114" y2="196" stroke={accent[1]} strokeWidth="0.8" opacity="0.7" />
    </g>
  );
}

const ORNAMENTS: Record<CosmeticType, typeof CharacterOrnament> = {
  character: CharacterOrnament,
  background: BackgroundOrnament,
};

const CENTER_EMOJI: Record<CosmeticType, string> = {
  character: '🧑‍🌾',
  background: '🏞️',
};

export function CosmeticBoxPacket({ type, state, onComplete, className }: Props) {
  useEffect(() => {
    if (state !== 'opening') return;
    const id = setTimeout(onComplete, OPEN_DURATION_MS);
    return () => clearTimeout(id);
  }, [state, onComplete]);

  const opening = state === 'opening';
  const p = PALETTES[type];
  const labels = LABELS[type];
  const Ornament = ORNAMENTS[type];
  const uid = `cb-${type}`;

  return (
    <div className={clsx('pointer-events-none select-none', className)} aria-hidden>
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

        <g className={clsx(opening && 'animate-packet-dissolve')}>
          <rect x="10" y="22" width="180" height="252" rx="6"
            fill={`url(#${uid}-foil)`} stroke={p.stroke} strokeWidth="1" />
          <path d="M 22 30 L 56 30 L 40 266 L 18 266 Z" fill="#FFFFFF" opacity={p.glossOpacity} />
          <path d="M 60 30 L 74 30 L 58 266 L 46 266 Z" fill="#FFFFFF" opacity={p.glossOpacity * 0.5} />
          <path d={INTERIOR_PATH} fill={`url(#${uid}-inside)`} opacity="0.75" />
          <g>
            <rect x="10" y="250" width="180" height="20" rx="1" fill={`url(#${uid}-seal)`} />
            <rect x="10" y="250" width="180" height="20" fill={`url(#${uid}-crimp)`} />
            <line x1="12" y1="251.5" x2="188" y2="251.5" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.7" />
          </g>
          <g stroke={`url(#${uid}-accent)`} strokeWidth="0.8" fill="none" opacity="0.7">
            <path d="M 20 94 L 20 88 L 26 88" />
            <path d="M 180 94 L 180 88 L 174 88" />
            <path d="M 20 240 L 20 246 L 26 246" />
            <path d="M 180 240 L 180 246 L 174 246" />
          </g>

          <text x="100" y="118" textAnchor="middle" fontFamily="var(--font-serif)"
            fontSize="22" fontWeight="600" fill={p.text} letterSpacing="3">
            {labels.top}
          </text>
          <text x="100" y="134" textAnchor="middle" fontFamily="var(--font-sans)"
            fontSize="6.5" fontWeight="400" fill={p.textSub} letterSpacing="3.5">
            {labels.mid}
          </text>
          <line x1="70" y1="144" x2="130" y2="144" stroke={`url(#${uid}-accent)`} strokeWidth="0.8" />

          <g
            className={clsx(opening && 'animate-packet-seal-pop')}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          >
            <circle cx="100" cy="180" r="22" fill="none" stroke={`url(#${uid}-accent)`} strokeWidth="1" />
            <circle cx="100" cy="180" r="16" fill="none" stroke={p.accent[0]} strokeWidth="0.5" strokeDasharray="1.5 2.5" opacity="0.6" />
            <Ornament accent={p.accent} />
          </g>

          <text x="100" y="218" textAnchor="middle" fontFamily="var(--font-serif)"
            fontSize="8.5" fontStyle="italic" fill={p.textSub} letterSpacing="0.6">
            {labels.whisper}
          </text>
          <text x="100" y="238" textAnchor="middle" fontFamily="var(--font-sans)"
            fontSize="7" fontWeight="600" fill={p.text} letterSpacing="3">
            {labels.stamp}
          </text>

          {opening && (
            <g className="animate-packet-seed-drop">
              <text x="100" y="68" textAnchor="middle" fontSize="14">{CENTER_EMOJI[type]}</text>
            </g>
          )}
        </g>

        <g className={clsx(opening && 'animate-packet-tear')}>
          <path d={FLAP_PATH} fill={`url(#${uid}-foil)`} stroke={p.stroke} strokeWidth="1" />
          <path d="M 22 30 L 56 30 L 44 58 L 22 58 Z" fill="#FFFFFF" opacity={p.glossOpacity + 0.05} />
          <rect x="10" y="10" width="180" height="16" rx="1" fill={`url(#${uid}-seal)`} />
          <rect x="10" y="10" width="180" height="16" fill={`url(#${uid}-crimp)`} />
          <line x1="12" y1="24.5" x2="188" y2="24.5" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.7" />
          <text x="100" y="46" textAnchor="middle" fontFamily="var(--font-sans)"
            fontSize="7" fontWeight="600" fill={p.textSub} letterSpacing="4">
            COSMETIC
          </text>
          <line x1="74" y1="52" x2="126" y2="52" stroke={`url(#${uid}-accent)`} strokeWidth="0.6" opacity="0.75" />
        </g>
      </svg>
    </div>
  );
}
