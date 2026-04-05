'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { Rarity, TreeInstance } from '@florify/shared';
import { Button } from '@/components/Button';
import { RarityBadge } from '@/components/RarityBadge';
import { FloraImage } from '@/components/FloraImage';
import { HarvestConfetti } from '@/components/HarvestConfetti';
import { SPECIES } from '@/data/species';
import { useT, useLanguage } from '@/i18n/useT';
import { shareSpecies } from '@/lib/shareSpecies';
import type { DictKey } from '@/i18n/dict';

/**
 * Full-screen harvest celebration.
 *
 * Triggered from PlotView when `waterTree()` returns `harvested`. The
 * background glow is tinted by rarity so legendary feels different
 * from common at a glance — part of the chase mechanic.
 *
 * Shows the grown plant's image + a description snippet and offers a
 * Share action that opens the matching Floripedia page so friends can
 * see the same flora without installing anything.
 */

interface Props {
  tree: TreeInstance | null;
  onDismiss: () => void;
}

const GLOW: Record<Rarity, string> = {
  common: 'radial-gradient(closest-side, rgba(184, 168, 136, 0.45), rgba(251, 248, 243, 0) 70%)',
  rare: 'radial-gradient(closest-side, rgba(122, 156, 184, 0.5), rgba(251, 248, 243, 0) 70%)',
  legendary: 'radial-gradient(closest-side, rgba(212, 162, 76, 0.65), rgba(251, 248, 243, 0) 70%)',
};

const HEADLINE_KEY: Record<Rarity, DictKey> = {
  common: 'harvest.headline.common',
  rare: 'harvest.headline.rare',
  legendary: 'harvest.headline.legendary',
};

/** Trim a description down to a single glanceable teaser. Cuts at a
 *  word boundary so we don't leave a mangled syllable behind. */
function excerpt(text: string, max: number): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const lastSpace = slice.lastIndexOf(' ');
  const cut = lastSpace > max * 0.6 ? slice.slice(0, lastSpace) : slice;
  return `${cut.trimEnd()}…`;
}

interface FlyState {
  src: string;
  alt: string;
  style: CSSProperties;
}

/** Duration of the fly-to-gallery animation in ms. Must match the
 *  `harvest-fly-to-gallery` keyframe duration in `globals.css` so the
 *  overlay dismisses the frame the clone lands, not before. */
const FLY_DURATION_MS = 720;

export function HarvestOverlay({ tree, onDismiss }: Props) {
  const t = useT();
  const lang = useLanguage();
  const [toast, setToast] = useState<string | null>(null);
  const [collecting, setCollecting] = useState(false);
  const [flying, setFlying] = useState<FlyState | null>(null);
  const [lastTreeId, setLastTreeId] = useState<string | null>(null);
  const floraWrapRef = useRef<HTMLDivElement | null>(null);

  // Reset collecting/flying state whenever a fresh tree arrives. The
  // component stays mounted between harvests (parent passes `tree=null`
  // to hide), so without this the second harvest would open mid-
  // animation. Render-phase setState is the sanctioned pattern for
  // "reset state when a prop changes":
  // https://react.dev/reference/react/useState#storing-information-from-previous-renders
  if (tree && tree.id !== lastTreeId) {
    setLastTreeId(tree.id);
    setCollecting(false);
    setFlying(null);
  }

  // Auto-dismiss on Escape
  useEffect(() => {
    if (!tree) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [tree, onDismiss]);

  if (!tree) return null;

  const species = SPECIES[tree.speciesId];
  const headline = t(HEADLINE_KEY[tree.rarity]);
  const description = species
    ? lang === 'th'
      ? species.descriptionTH
      : species.descriptionEN
    : '';
  const teaser = description ? excerpt(description, 110) : '';

  const handleCollect = () => {
    // Guard against double-taps while the animation is mid-flight.
    if (collecting) return;

    const wrap = floraWrapRef.current;
    const img = wrap?.querySelector('img') ?? null;
    const target = document.getElementById('fly-target-gallery');

    // Graceful degradation — if we can't measure either rect (overlay
    // opened without a rendered plot, reduced-motion user, etc.) just
    // dismiss immediately so the player isn't stuck behind a dialog.
    if (!img || !target || !species) {
      onDismiss();
      return;
    }

    const from = img.getBoundingClientRect();
    const to = target.getBoundingClientRect();

    // Translate between centers; scale to target's shortest edge so the
    // clone nests inside the corner button rather than overlapping it.
    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);
    const scale = Math.min(to.width / from.width, to.height / from.height);

    setCollecting(true);
    setFlying({
      src: `/floras/${species.folder}/stage-3.webp`,
      alt: species.name,
      style: {
        position: 'fixed',
        left: `${from.left}px`,
        top: `${from.top}px`,
        width: `${from.width}px`,
        height: `${from.height}px`,
        ['--fly-dx' as string]: `${dx}px`,
        ['--fly-dy' as string]: `${dy}px`,
        ['--fly-scale' as string]: `${scale}`,
        transformOrigin: '50% 50%',
      },
    });

    window.setTimeout(onDismiss, FLY_DURATION_MS);
  };

  const handleShare = async () => {
    if (!species) return;
    const result = await shareSpecies(species.id, {
      title: t('floripedia.shareTitle', { name: species.name }),
      text: t('floripedia.shareText', { name: species.name }),
    });
    if (result.kind === 'copied') {
      setToast(t('floripedia.copied'));
      setTimeout(() => setToast(null), 2400);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Harvest celebration"
      className="fixed inset-0 z-50 flex items-center justify-center bg-cream-50/85 backdrop-blur-sm animate-overlay-in"
      onClick={onDismiss}
    >
      {/* Rarity-tinted radial glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none animate-pulse-slow"
        style={{ background: GLOW[tree.rarity] }}
      />

      {/* Rarity-tiered leaf/sparkle burst. Keyed on tree.id so a fresh
          harvest replays the animation and a deterministic PRNG keeps
          particle positions stable across strict-mode re-renders. */}
      <HarvestConfetti rarity={tree.rarity} playKey={tree.id} />

      <div
        className={`relative flex flex-col items-center gap-4 px-8 text-center max-w-md animate-scale-in transition-opacity duration-300 ease-out ${
          collecting ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ animationDelay: '80ms' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Children fade up with a gentle stagger so the reveal feels
            orchestrated rather than all-at-once. The flora wrapper
            holds a ref the collect handler uses to measure the starting
            rect for the fly-to-gallery animation, and stays visible
            (via opacity on the parent container) until the clone takes
            over so there's no flicker between the real image and the
            clone. */}
        {species && (
          <div
            ref={floraWrapRef}
            className="animate-fade-up"
            style={{
              animationDelay: '120ms',
              visibility: flying ? 'hidden' : 'visible',
            }}
          >
            <FloraImage
              key={species.id}
              speciesId={species.id}
              progress={1}
              className="h-36 w-36 object-contain"
              alt={species.name}
            />
          </div>
        )}

        <div className="animate-fade-up" style={{ animationDelay: '200ms' }}>
          <RarityBadge rarity={tree.rarity} />
        </div>
        <h2
          className="font-serif text-3xl text-ink-900 animate-fade-up"
          style={{ animationDelay: '260ms' }}
        >
          {headline}
        </h2>
        <p
          className="font-serif text-2xl text-ink-700 animate-fade-up"
          style={{ animationDelay: '320ms' }}
        >
          {species?.name ?? 'Unknown species'}
        </p>

        {teaser && (
          <p
            lang={lang}
            className="text-sm text-ink-600 leading-relaxed max-w-xs animate-fade-up"
            style={{ animationDelay: '380ms' }}
          >
            {teaser}
          </p>
        )}

        <p
          className="text-xs text-ink-500 max-w-xs animate-fade-up"
          style={{ animationDelay: '440ms' }}
        >
          {t('harvest.waterings', { count: tree.requiredWaterings })}
        </p>

        <div
          className="flex flex-col sm:flex-row items-stretch gap-2 mt-2 animate-fade-up"
          style={{ animationDelay: '500ms' }}
        >
          <Button
            size="lg"
            onClick={handleCollect}
            disabled={collecting}
            className="min-w-[180px]"
          >
            {t('harvest.collect')}
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={handleShare}
            disabled={collecting}
            className="min-w-[140px]"
          >
            {t('harvest.share')}
          </Button>
        </div>
      </div>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center"
        >
          <div className="animate-fade-up bg-ink-900/90 text-cream-50 text-sm px-4 py-2 rounded-full shadow-soft-lg">
            {toast}
          </div>
        </div>
      )}

      {/* Fly-to-gallery clone. Rendered above the overlay (z-[60]) so
          the fading backdrop doesn't mask the arc. Uses the same webp
          path as the in-overlay FloraImage, so the first paint of the
          clone is already warm in the browser cache. */}
      {flying && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={flying.src}
          alt={flying.alt}
          aria-hidden
          draggable={false}
          className="pointer-events-none z-[60] object-contain animate-harvest-fly-to-gallery"
          style={flying.style}
        />
      )}
    </div>
  );
}
