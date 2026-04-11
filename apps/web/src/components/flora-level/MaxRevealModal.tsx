"use client";

import { SPECIES_BY_ID } from "@/data/species";
import { FloraImage } from "@/components/FloraImage";
import { ShinyOverlay } from "@/components/flora-level/ShinyOverlay";
import type { Lang } from "@/components/LangToggle";

interface Props {
  speciesId: number;
  lang: Lang;
  labels: {
    shiny: string;
    epithet: string;
    hint: string;
    close: string;
  };
  onClose: () => void;
}

/**
 * One-shot modal announcing that a species has reached Flora Level 5.
 * Shows the species art with the rarity-specific Shiny shimmer. For
 * Legendary species, also announces the epithet in rainbow font.
 */
export function MaxRevealModal({ speciesId, lang, labels, onClose }: Props) {
  const species = SPECIES_BY_ID[speciesId];
  if (!species) return null;

  const epithet =
    species.rarity === "legendary" && species.epithet
      ? species.epithet[lang]
      : null;

  const glowColor =
    species.rarity === "legendary"
      ? "rgba(200, 140, 255, 0.55)"
      : species.rarity === "rare"
        ? "rgba(253, 233, 181, 0.65)"
        : "rgba(232, 236, 240, 0.65)";

  return (
    <div
      role="dialog"
      aria-modal
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      tabIndex={0}
    >
      <div
        className="relative bg-cream-50 rounded-3xl p-6 max-w-xs w-full mx-4 shadow-soft-lg animate-reveal-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-square mb-4">
          {/* Radial glow pulse behind the species art — sized to rarity */}
          <div
            aria-hidden
            className="absolute inset-0 rounded-full animate-reveal-glow pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${glowColor} 0%, transparent 65%)`,
            }}
          />
          <div className="relative animate-reveal-zoom w-full h-full">
            <ShinyOverlay
              rarity={species.rarity}
              maskSrc={`/floras/${species.folder}/stage-3.webp`}
            >
              <FloraImage
                speciesId={speciesId}
                progress={1}
                className="w-full h-full object-contain"
              />
            </ShinyOverlay>
          </div>
        </div>
        <h3
          className="text-center text-lg font-serif text-ink-900 animate-reveal-line"
          style={{ animationDelay: "280ms" }}
        >
          {species.name}
        </h3>
        <p
          className="text-center text-sm font-semibold text-amber-600 mt-1 animate-reveal-line"
          style={{ animationDelay: "380ms" }}
        >
          ✦ {labels.shiny} ✦
        </p>
        {epithet && (
          <>
            <p
              className="text-center text-base font-serif mt-3 fl-rainbow-text animate-reveal-line"
              style={{ animationDelay: "520ms" }}
            >
              ✦ {epithet} ✦
            </p>
            <p
              className="text-center text-xs text-ink-500 mt-2 animate-reveal-line"
              style={{ animationDelay: "640ms" }}
            >
              {labels.hint}
            </p>
          </>
        )}
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full py-2 rounded-xl bg-ink-900 text-cream-50 text-sm font-semibold animate-reveal-line hover:bg-ink-800 active:scale-[0.97] transition-transform"
          style={{ animationDelay: epithet ? "760ms" : "520ms" }}
        >
          {labels.close}
        </button>
      </div>
    </div>
  );
}
