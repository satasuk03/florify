"use client";

import type { CSSProperties, ReactNode } from 'react';
import type { Rarity } from '@florify/shared';

interface Props {
  rarity: Rarity;
  children: ReactNode;
  /**
   * Optional image URL used to CLIP the shimmer to the image's alpha
   * channel via `mask-image`. Pass this when the child image uses
   * `object-contain` (letterboxed) so the shimmer only paints on the
   * visible flora pixels. Omit when the child fills its box edge-to-edge
   * via `object-cover`.
   */
  maskSrc?: string;
}

/**
 * Wraps species art with a runtime shimmer overlay. Used only at Flora
 * Level 5. The shimmer palette varies by rarity:
 *   common    → silver
 *   rare      → gold
 *   legendary → purple
 *
 * Pure CSS — no Canvas, no new image assets, no JS per frame.
 */
export function ShinyOverlay({ rarity, children, maskSrc }: Props) {
  const maskStyle: CSSProperties | undefined = maskSrc
    ? {
        WebkitMaskImage: `url(${maskSrc})`,
        maskImage: `url(${maskSrc})`,
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }
    : undefined;

  return (
    <div className="relative w-full h-full">
      {children}
      <div
        aria-hidden
        className={`shiny-overlay shiny-${rarity} absolute inset-0 pointer-events-none`}
        style={maskStyle}
      />
    </div>
  );
}
