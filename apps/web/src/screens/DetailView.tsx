"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { RarityBadge } from "@/components/RarityBadge";
import { BackIcon } from "@/components/icons";
import { FloraImage } from "@/components/FloraImage";
import { LangToggle, type Lang } from "@/components/LangToggle";
import {
  StageSelector,
  STAGE_PROGRESS,
  type Stage,
} from "@/components/StageSelector";
import { useGameStore } from "@/store/gameStore";
import { SPECIES, SpeciesCollection, COLLECTION_LABELS } from "@/data/species";
import { toast } from "@/lib/toast";
import { FloraLevelSection } from "@/components/flora-level/FloraLevelSection";
import { MaxRevealModal } from "@/components/flora-level/MaxRevealModal";
import { ShinyOverlay } from "@/components/flora-level/ShinyOverlay";
import { FLORA_MAX_LEVEL } from "@florify/shared";

/**
 * Detail view for a single harvested tree. Reads `id` from the parent
 * page via props (the page grabs it from `useSearchParams`). Shows the
 * pre-rendered stage-3 flora image.
 *
 * Uses the query-param routing pattern instead of a dynamic route
 * because Next.js 16 static export forbids `dynamicParams: true`.
 */

const COPY = {
  th: {
    notFound: "ไม่พบต้นไม้",
    count: "ปลูกแล้ว",
    countUnit: "ต้น",
    waterings: "รดน้ำรวม",
    waterUnit: "หยด",
    firstHarvested: "ได้รับครั้งแรก",
    lastHarvested: "ได้รับล่าสุด",
    locale: "th-TH" as const,
    stageLabel: (n: Stage) => `ระยะ ${n}`,
    setAsProfile: "ตั้งเป็นรูปโปรไฟล์",
    updateProfile: (s: Stage) => `อัปเดตเป็น Stage ${s}`,
    removeProfile: "ลบรูปโปรไฟล์",
    profileToastSet: "ตั้งเป็นรูปโปรไฟล์แล้ว 🌼",
    profileToastRemoved: "ลบรูปโปรไฟล์แล้ว",
    floraLevelTitle: "เลเวลต้นไม้",
    floraLevelMerge: (n: number) => `รวม ×${n}`,
    floraLevelMax: "เต็มเลเวลแล้ว ✦",
    maxRevealShiny: "ปลดล็อก Shiny",
    maxRevealEpithet: "ปลดล็อกฉายา",
    maxRevealHint: "เลือกเป็นฉายาได้ที่หน้าปรับแต่งพาสปอร์ต",
    maxRevealClose: "ปิด",
  },
  en: {
    notFound: "Tree not found",
    count: "Harvested",
    countUnit: "times",
    waterings: "Total waterings",
    waterUnit: "drops",
    firstHarvested: "First obtained",
    lastHarvested: "Last obtained",
    locale: "en-US" as const,
    stageLabel: (n: Stage) => `Stage ${n}`,
    setAsProfile: "Set as profile picture",
    updateProfile: (s: Stage) => `Update to Stage ${s}`,
    removeProfile: "Remove profile picture",
    profileToastSet: "Profile picture set 🌼",
    profileToastRemoved: "Profile picture removed",
    floraLevelTitle: "Flora Level",
    floraLevelMerge: (n: number) => `Merge ×${n}`,
    floraLevelMax: "Max Level ✦",
    maxRevealShiny: "Shiny Unlocked",
    maxRevealEpithet: "Epithet Unlocked",
    maxRevealHint: "Choose this title from your passport customization.",
    maxRevealClose: "Close",
  },
};

export function DetailView({ speciesId }: { speciesId: number | null }) {
  const [lang, setLang] = useState<Lang>("th");
  const [stage, setStage] = useState<Stage>(3);
  const [lightbox, setLightbox] = useState(false);
  const [maxRevealSpecies, setMaxRevealSpecies] = useState<number | null>(null);
  const t = COPY[lang];

  const closeLightbox = useCallback(() => setLightbox(false), []);

  const entry = useGameStore((s) =>
    speciesId != null
      ? (s.state.collection.find((c) => c.speciesId === speciesId) ?? null)
      : null,
  );
  const floraLevel = useGameStore((s) =>
    speciesId != null ? (s.state.floraLevels[speciesId]?.level ?? null) : null,
  );
  const avatar = useGameStore((s) => s.state.passportCustomization.avatar);
  const setPassportAvatar = useGameStore((s) => s.setPassportAvatar);

  const isCurrentSpecies =
    avatar != null && speciesId != null && avatar.speciesId === speciesId;
  const isCurrentStage = isCurrentSpecies && avatar.stage === stage;
  const profileButtonLabel = isCurrentStage
    ? t.removeProfile
    : isCurrentSpecies
      ? t.updateProfile(stage)
      : t.setAsProfile;

  const handleProfileClick = useCallback(() => {
    if (speciesId == null) return;
    if (isCurrentStage) {
      setPassportAvatar(null);
      toast(t.profileToastRemoved);
    } else {
      setPassportAvatar({ speciesId, stage });
      toast(t.profileToastSet);
    }
  }, [
    speciesId,
    stage,
    isCurrentStage,
    setPassportAvatar,
    t.profileToastSet,
    t.profileToastRemoved,
  ]);

  if (!entry) {
    return (
      <div className="h-full bg-cream-50 safe-top safe-bottom flex flex-col">
        <header className="flex items-center px-4 py-3">
          <Link
            href="/gallery"
            className="w-10 h-10 flex items-center justify-center text-ink-700"
            aria-label="Back to gallery"
          >
            <BackIcon />
          </Link>
        </header>
        <div className="flex-1 flex items-center justify-center text-ink-500">
          {t.notFound}
        </div>
      </div>
    );
  }

  const species = SPECIES[entry.speciesId];
  const description =
    lang === "th" ? species?.descriptionTH : species?.descriptionEN;

  return (
    <div className="h-full bg-cream-50 flex flex-col safe-top safe-bottom overflow-hidden">
      <header className="flex items-center justify-between px-4 py-3 animate-fade-down">
        <Link
          href="/gallery"
          className="w-10 h-10 flex items-center justify-center text-ink-700 hover:bg-cream-100 rounded-full transition-all duration-300 ease-out hover:-translate-x-0.5"
          aria-label="Back to gallery"
        >
          <BackIcon />
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-cream-200/80 text-ink-600 px-2.5 py-0.5 rounded-full">
            {
              COLLECTION_LABELS[
                species?.collection ?? SpeciesCollection.Original
              ][lang]
            }
          </span>
          <RarityBadge rarity={entry.rarity} />
        </div>
      </header>

      <div className="flex-1 min-h-0 flex items-center justify-center px-4 pb-2">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Specimen frame: layered cream card with a soft radial inner
              glow, a hairline border, and a gentle outer shadow — reads
              as a botanical plate rather than a bare image. */}
          <div
            aria-hidden
            className="absolute inset-2 rounded-[2rem] bg-cream-100 border border-cream-300/70 shadow-soft-lg"
          />
          <div
            aria-hidden
            className="absolute inset-3 rounded-[1.75rem] bg-[radial-gradient(ellipse_at_center,_var(--color-cream-50)_0%,_var(--color-cream-100)_55%,_var(--color-cream-200)_100%)]"
          />
          {/* Corner tick marks — a tiny hint of a specimen plate. */}
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
            {floraLevel === FLORA_MAX_LEVEL && species ? (
              <ShinyOverlay
                rarity={entry.rarity}
                maskSrc={`/floras/${species.folder}/stage-${stage}.webp`}
              >
                <FloraImage
                  key={`${entry.speciesId}-${stage}`}
                  speciesId={entry.speciesId}
                  progress={STAGE_PROGRESS[stage]}
                  className="w-full h-full object-contain drop-shadow-[0_18px_30px_rgba(75,55,30,0.18)]"
                />
              </ShinyOverlay>
            ) : (
              <FloraImage
                key={`${entry.speciesId}-${stage}`}
                speciesId={entry.speciesId}
                progress={STAGE_PROGRESS[stage]}
                className="max-h-full max-w-full object-contain drop-shadow-[0_18px_30px_rgba(75,55,30,0.18)]"
              />
            )}
          </div>

          {/* Profile picture toggle — top-right of the specimen frame */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleProfileClick();
            }}
            aria-label={profileButtonLabel}
            className={`absolute top-6 right-10 z-10 px-3 h-8 rounded-full text-xs font-medium shadow-soft-md transition-all hover:scale-[1.03] active:scale-95 whitespace-nowrap ${
              isCurrentStage
                ? "bg-cream-100 text-ink-700 border border-cream-300 hover:bg-cream-200"
                : isCurrentSpecies
                  ? "bg-cream-50 text-clay-600 border border-clay-300 hover:bg-cream-100"
                  : "bg-clay-500 text-cream-50 hover:bg-clay-400"
            }`}
          >
            {profileButtonLabel}
          </button>

          {/* Stage selector floats over the bottom edge of the frame. */}
          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 animate-fade-up"
            style={{ animationDelay: "220ms" }}
          >
            <StageSelector
              stage={stage}
              onChange={setStage}
              label={t.stageLabel}
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
              {species?.name ?? "Unknown"}
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

          <div className="mt-4 pt-4 border-t border-cream-300/70">
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-xs">
              <dt className="text-ink-500">{t.count}</dt>
              <dd className="text-ink-700 text-right">
                {entry.count} {t.countUnit}
              </dd>

              <dt className="text-ink-500">{t.waterings}</dt>
              <dd className="text-ink-700 text-right">
                {entry.totalWaterings} {t.waterUnit}
              </dd>

              <dt className="text-ink-500">{t.firstHarvested}</dt>
              <dd className="text-ink-700 text-right">
                {new Date(entry.firstHarvestedAt).toLocaleDateString(t.locale)}
              </dd>

              <dt className="text-ink-500">{t.lastHarvested}</dt>
              <dd className="text-ink-700 text-right">
                {new Date(entry.lastHarvestedAt).toLocaleDateString(t.locale)}
              </dd>
            </dl>
          </div>

          {entry && speciesId != null && (
            <FloraLevelSection
              speciesId={speciesId}
              rarity={entry.rarity}
              onMaxReveal={setMaxRevealSpecies}
              labels={{
                title: t.floraLevelTitle,
                merge: t.floraLevelMerge,
                max: t.floraLevelMax,
              }}
            />
          )}
        </div>
      </div>

      {maxRevealSpecies !== null && (
        <MaxRevealModal
          speciesId={maxRevealSpecies}
          lang={lang}
          labels={{
            shiny: t.maxRevealShiny,
            epithet: t.maxRevealEpithet,
            hint: t.maxRevealHint,
            close: t.maxRevealClose,
          }}
          onClose={() => setMaxRevealSpecies(null)}
        />
      )}

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
            speciesId={entry.speciesId}
            progress={STAGE_PROGRESS[stage]}
            className="max-h-[90vh] max-w-[90vw] object-contain drop-shadow-[0_0_60px_rgba(255,255,255,0.1)]"
          />
        </div>
      )}
    </div>
  );
}
