'use client';

import { SPECIES } from '@/data/species';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * 2D flora renderer. Picks one of three stage webps based on growth
 * progress [0..1] and renders it as a plain `<img>`. The app is a
 * static export (see `next.config.js`) so `next/image` buys nothing
 * here — the webps are already the right size and format.
 *
 * When the stage number changes (1→2, 2→3) we remount the <img> via
 * a `key` tied to the stage, which replays the `animate-flora-stage-in`
 * CSS animation — a short fade + subtle scale pop so growth reads as
 * a distinct reward moment instead of a silent src swap. Honors
 * `useReducedMotion()`.
 */

interface Props {
  speciesId: number;
  progress: number; // 0..1
  className?: string;
  alt?: string;
}

function stageFromProgress(progress: number): 1 | 2 | 3 {
  if (progress < 1 / 3) return 1;
  if (progress < 2 / 3) return 2;
  return 3;
}

export function FloraImage({ speciesId, progress, className, alt }: Props) {
  const species = SPECIES[speciesId];
  const reduced = useReducedMotion();
  if (!species) return null;
  const stage = stageFromProgress(progress);
  const src = `/floras/${species.folder}/stage-${stage}.webp`;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      // Remount on stage change so the entry animation replays. For
      // the very first render (no prior stage) this is harmless — the
      // fade-in just doubles as a load-in.
      key={reduced ? undefined : stage}
      src={src}
      alt={alt ?? species.name}
      className={
        reduced ? className : `${className ?? ''} animate-flora-stage-in`
      }
      loading="lazy"
      decoding="async"
      draggable={false}
    />
  );
}
