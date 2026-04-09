"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { RarityBadge } from "@/components/RarityBadge";
import { FloraImage } from "@/components/FloraImage";
import { BackIcon } from "@/components/icons";
import { LangToggle, type Lang } from "@/components/LangToggle";
import {
  StageSelector,
  STAGE_PROGRESS,
  type Stage,
} from "@/components/StageSelector";
import { SPECIES, SpeciesCollection, COLLECTION_LABELS } from "@/data/species";
import { useT, useLanguage } from "@/i18n/useT";
import { shareSpecies } from "@/lib/shareSpecies";
import { gameEventBus } from "@/lib/gameEventBus";
import { useGameStore } from "@/store/gameStore";

/**
 * Floripedia — the public, species-only detail page behind a shared link.
 *
 * Unlike `DetailView`, this screen does NOT read from `useGameStore`. A
 * visitor who opens a shared URL may never have played Florify, so the
 * page has to render from `SPECIES` alone. That also keeps the page
 * safe during static export when there is no save data at build time.
 *
 * Route: `/floripedia/?id={speciesId}` (query-param, single static HTML).
 */

const STAGE_LABEL: Record<Lang, (s: Stage) => string> = {
  th: (s) => `ระยะ ${s}`,
  en: (s) => `Stage ${s}`,
};

interface Props {
  speciesId: number | null;
  harvester?: string | null;
  harvestedAt?: number | null;
}

export function FloripediaView({ speciesId, harvester, harvestedAt }: Props) {
  const t = useT();
  const appLang = useLanguage();
  const hydrated = useGameStore((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated) return;
    gameEventBus.emit({ type: "visit" });
  }, [hydrated]);
  // Local override — lets a visitor read the lore in their preferred
  // language without changing app-wide settings.
  const [lang, setLang] = useState<Lang>(appLang);
  const [stage, setStage] = useState<Stage>(3);
  const [toast, setToast] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const closeLightbox = useCallback(() => setLightbox(false), []);

  const species =
    speciesId != null && Number.isInteger(speciesId) && SPECIES[speciesId]
      ? SPECIES[speciesId]
      : null;

  if (!species) {
    return (
      <div className="h-full bg-cream-50 safe-top safe-bottom flex flex-col">
        <header className="flex items-center px-4 py-3">
          <Link
            href="/"
            className="w-10 h-10 flex items-center justify-center text-ink-700"
            aria-label={t("floripedia.home")}
          >
            <BackIcon />
          </Link>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-ink-500">
          <p>{t("floripedia.notFound")}</p>
          <Link href="/" className="text-ink-700 underline underline-offset-4">
            {t("floripedia.home")}
          </Link>
        </div>
      </div>
    );
  }

  const description =
    lang === "th" ? species.descriptionTH : species.descriptionEN;

  const handleShare = async () => {
    const result = await shareSpecies(species.id, {
      title: t("floripedia.shareTitle", { name: species.name }),
      text: t("floripedia.shareText", { name: species.name }),
    });
    if (result.kind === "copied") {
      setToast(t("floripedia.copied"));
      setTimeout(() => setToast(null), 2400);
    }
  };

  return (
    <div className="h-full bg-cream-50 flex flex-col safe-top safe-bottom overflow-hidden">
      <header className="flex items-center justify-between px-4 py-3 animate-fade-down">
        <Link
          href="/"
          className="w-10 h-10 flex items-center justify-center text-ink-700 hover:bg-cream-100 rounded-full transition-all duration-300 ease-out hover:-translate-x-0.5"
          aria-label={t("floripedia.home")}
        >
          <BackIcon />
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-cream-200/80 text-ink-600 px-2.5 py-0.5 rounded-full">
            {COLLECTION_LABELS[species.collection][lang]}
          </span>
          <RarityBadge rarity={species.rarity} />
        </div>
      </header>

      <div className="flex-1 min-h-0 flex items-center justify-center px-4 pb-2">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Specimen frame — mirrors DetailView so the two surfaces
              feel like siblings, not strangers. */}
          <div
            aria-hidden
            className="absolute inset-2 rounded-[2rem] bg-cream-100 border border-cream-300/70 shadow-soft-lg"
          />
          <div
            aria-hidden
            className="absolute inset-3 rounded-[1.75rem] bg-[radial-gradient(ellipse_at_center,_var(--color-cream-50)_0%,_var(--color-cream-100)_55%,_var(--color-cream-200)_100%)]"
          />
          <div aria-hidden className="absolute inset-5 pointer-events-none">
            <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cream-400/60 rounded-tl-md" />
            <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cream-400/60 rounded-tr-md" />
            <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cream-400/60 rounded-bl-md" />
            <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cream-400/60 rounded-br-md" />
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => setLightbox(true)}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") && setLightbox(true)
            }
            className="relative flex items-center justify-center max-h-[88%] max-w-[82%] h-full w-full cursor-zoom-in"
            aria-label="View fullscreen"
          >
            <FloraImage
              key={`${species.id}-${stage}`}
              speciesId={species.id}
              progress={STAGE_PROGRESS[stage]}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 animate-fade-up"
            style={{ animationDelay: "220ms" }}
          >
            <StageSelector
              stage={stage}
              onChange={setStage}
              label={STAGE_LABEL[lang]}
            />
          </div>
        </div>
      </div>

      <div
        className="mx-4 mb-4 rounded-3xl bg-cream-100/90 backdrop-blur border border-cream-200 shadow-soft-md animate-fade-up"
        style={{ animationDelay: "160ms" }}
      >
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h2 className="text-2xl font-serif text-ink-900 leading-tight">
              {species.name}
            </h2>
            <LangToggle lang={lang} onChange={setLang} />
          </div>

          <p
            key={lang}
            lang={lang}
            className="text-sm text-ink-700 leading-relaxed animate-fade-in"
          >
            {description}
          </p>

          {harvester && (
            <div className="mt-3 flex items-center gap-2 text-xs text-ink-500">
              <span>{t("floripedia.harvestedBy", { name: harvester })}</span>
              {harvestedAt && (
                <>
                  <span aria-hidden>·</span>
                  <time dateTime={new Date(harvestedAt).toISOString()}>
                    {new Date(harvestedAt).toLocaleDateString(
                      lang === "th" ? "th-TH" : "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </time>
                </>
              )}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-cream-300/70 flex justify-end gap-2">
            <Link href="/">
              <Button variant="primary" size="md">
                {t("floripedia.startPlaying")}
              </Button>
            </Link>
            <Button variant="secondary" size="md" onClick={handleShare}>
              {t("floripedia.share")}
            </Button>
          </div>
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-zoom-out animate-fade-in"
          onClick={closeLightbox}
          onKeyDown={(e) => e.key === "Escape" && closeLightbox()}
          role="dialog"
          aria-modal
          aria-label="Fullscreen image"
          tabIndex={0}
          ref={(el) => el?.focus()}
        >
          <FloraImage
            speciesId={species.id}
            progress={STAGE_PROGRESS[stage]}
            className="max-h-[90vh] max-w-[90vw] object-contain drop-shadow-[0_0_60px_rgba(255,255,255,0.1)]"
          />
        </div>
      )}

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed inset-x-0 bottom-8 flex justify-center z-50"
        >
          <div className="animate-fade-up bg-ink-900/90 text-cream-50 text-sm px-4 py-2 rounded-full shadow-soft-lg">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
