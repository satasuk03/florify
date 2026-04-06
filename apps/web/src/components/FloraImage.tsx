'use client';

import { useState } from 'react';
import { SPECIES } from '@/data/species';

/**
 * 2D flora renderer. Picks one of three stage webps based on growth
 * progress [0..1] and renders it as a plain `<img>`. The app is a
 * static export (see `next.config.js`) so `next/image` buys nothing
 * here — the webps are already the right size and format.
 *
 * When the stage number changes (1→2, 2→3) we remount the <img> via
 * a `key` tied to the stage, which replays the `animate-flora-stage-in`
 * CSS animation — a short fade + subtle scale pop so growth reads as
 * a distinct reward moment instead of a silent src swap.
 *
 * Shows a small spinner while the image is loading.
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
  if (!species) return null;
  const stage = stageFromProgress(progress);
  const src = `/floras/${species.folder}/stage-${stage}.webp`;
  const [loaded, setLoaded] = useState(false);

  return (
    // key on wrapper so loaded state resets when stage changes
    <div key={stage} className="relative inline-flex items-center justify-center">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flora-spinner" />
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt ?? species.name}
        className={`${className ?? ''} animate-flora-stage-in`}
        loading="lazy"
        decoding="async"
        draggable={false}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
