"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { BackIcon } from "@/components/icons";
import { FloraImage } from "@/components/FloraImage";
import { LangToggle, type Lang } from "@/components/LangToggle";
import { STAGE_PROGRESS, type Stage } from "@/components/StageSelector";
import { MaxRevealModal } from "@/components/flora-level/MaxRevealModal";
import { MergeBurst } from "@/components/flora-level/MergeBurst";
import { ShinyOverlay } from "@/components/flora-level/ShinyOverlay";
import { useGameStore, canMergeFloraLevel } from "@/store/gameStore";
import {
  SPECIES,
  ALL_COLLECTIONS,
  COLLECTION_LABELS,
} from "@/data/species";
import { FLORA_LEVEL_CURVE, FLORA_MAX_LEVEL } from "@florify/shared";
import type { Rarity } from "@florify/shared";
import { useT } from "@/i18n/useT";
import type { DictKey } from "@/i18n/dict";
import { toast } from "@/lib/toast";

/**
 * Detail view for a single harvested species. Reads `speciesId` from
 * the parent page (query param). Design: a herbarium specimen page
 * with a dashed plate holding a three-stage triptych (tap a cell to
 * pick which stage becomes the passport portrait), taxonomy block,
 * field-note dossier, collection ledger, flora-level star strip, and
 * a dark ink CTA. See `apps/web/designs/detail-page.html`.
 */

const STAGES: readonly Stage[] = [1, 2, 3];
const ROMAN_LOWER: Record<Stage, string> = { 1: "i", 2: "ii", 3: "iii" };
const STAGE_NAME_KEY: Record<Stage, DictKey> = {
  1: "detail.stageSeedling",
  2: "detail.stageBudding",
  3: "detail.stageBloom",
};

const RARITY_KEY: Record<Rarity, DictKey> = {
  common: "gallery.rarity.common",
  rare: "gallery.rarity.rare",
  legendary: "gallery.rarity.legendary",
};

function toRoman(n: number): string {
  if (n <= 0) return "";
  const table: ReadonlyArray<readonly [number, string]> = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let result = "";
  let remaining = Math.floor(n);
  for (const [val, sym] of table) {
    while (remaining >= val) {
      result += sym;
      remaining -= val;
    }
  }
  return result;
}

function ShareIcon({ size = 17 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="18" cy="5" r="2.2" />
      <circle cx="6" cy="12" r="2.2" />
      <circle cx="18" cy="19" r="2.2" />
      <line x1="8" y1="11" x2="16" y2="6.5" />
      <line x1="8" y1="13" x2="16" y2="17.5" />
    </svg>
  );
}

function ArrowIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14" />
      <polyline points="13 5 20 12 13 19" />
    </svg>
  );
}

function RarityGem({ rarity, size = 10 }: { rarity: Rarity; size?: number }) {
  const fill =
    rarity === "legendary" ? "#d4a24c" : rarity === "rare" ? "#7a9cb8" : "#b8a888";
  const edge =
    rarity === "legendary" ? "#8a6422" : rarity === "rare" ? "#3f6884" : "#7a6f58";
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden>
      <path
        d="M8 1 L14 8 L8 15 L2 8 Z"
        fill={fill}
        stroke={edge}
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      <path d="M8 1 L11 8 L8 4 L5 8 Z" fill="#fff" fillOpacity="0.35" />
    </svg>
  );
}

const STAR_SRC = {
  gold: "/icons/star-gold.svg",
  blue: "/icons/star-blue.svg",
  rainbow: "/icons/star-rainbow.svg",
} as const;

function formatDate(ms: number, lang: Lang) {
  const locale = lang === "th" ? "th-TH" : "en-GB";
  return new Date(ms).toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function DetailView({ speciesId }: { speciesId: number | null }) {
  const t = useT();
  const [lang, setLang] = useState<Lang>("th");
  const [stage, setStage] = useState<Stage>(3);
  const [lightboxStage, setLightboxStage] = useState<Stage | null>(null);
  const [maxRevealSpecies, setMaxRevealSpecies] = useState<number | null>(null);
  const [animatingLevel, setAnimatingLevel] = useState<number | null>(null);
  const [burstKey, setBurstKey] = useState(0);
  const [shaking, setShaking] = useState(false);

  const entry = useGameStore((s) =>
    speciesId != null
      ? (s.state.collection.find((c) => c.speciesId === speciesId) ?? null)
      : null,
  );
  const floraEntry = useGameStore((s) =>
    speciesId != null ? (s.state.floraLevels[speciesId] ?? null) : null,
  );
  const avatar = useGameStore((s) => s.state.passportCustomization.avatar);
  const setPassportAvatar = useGameStore((s) => s.setPassportAvatar);
  const mergeFloraLevel = useGameStore((s) => s.mergeFloraLevel);

  const isCurrentSpecies =
    avatar != null && speciesId != null && avatar.speciesId === speciesId;
  const isCurrentStage = isCurrentSpecies && avatar.stage === stage;

  const handleProfileClick = useCallback(() => {
    if (speciesId == null) return;
    if (isCurrentStage) {
      setPassportAvatar(null);
      toast(t("detail.profileToastRemoved"));
    } else {
      setPassportAvatar({ speciesId, stage });
      toast(t("detail.profileToastSet"));
    }
  }, [speciesId, stage, isCurrentStage, setPassportAvatar, t]);

  const handleShare = useCallback(async () => {
    if (speciesId == null || typeof window === "undefined") return;
    const url = `${window.location.origin}/floripedia?id=${speciesId}`;
    try {
      await navigator.clipboard.writeText(url);
      toast(t("detail.linkCopied"));
    } catch {
      toast(t("detail.linkCopyFailed"));
    }
  }, [speciesId, t]);

  const canMerge = canMergeFloraLevel(floraEntry ?? undefined);

  const handleLevelCardClick = useCallback(() => {
    if (speciesId == null || !canMerge) return;
    const before = floraEntry?.level ?? 1;
    mergeFloraLevel(speciesId);
    const after =
      useGameStore.getState().state.floraLevels[speciesId]?.level ?? before;

    setBurstKey((k) => k + 1);
    setShaking(true);
    window.setTimeout(() => setShaking(false), 500);
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate?.(35);
    }

    if (after > before) {
      let current = before;
      const step = () => {
        current += 1;
        setAnimatingLevel(current);
        if (current < after) {
          window.setTimeout(step, 200);
        } else {
          window.setTimeout(() => setAnimatingLevel(null), 200);
        }
      };
      window.setTimeout(step, 50);
    }
    if (before < FLORA_MAX_LEVEL && after === FLORA_MAX_LEVEL) {
      const delay = 200 * Math.max(1, after - before) + 200;
      window.setTimeout(() => setMaxRevealSpecies(speciesId), delay);
    }
  }, [speciesId, canMerge, floraEntry, mergeFloraLevel]);

  if (!entry) {
    return (
      <div className="h-full bg-cream-50 safe-top safe-bottom flex flex-col">
        <header className="flex items-center px-4 py-3">
          <Link
            href="/gallery"
            className="w-10 h-10 flex items-center justify-center text-ink-700"
            aria-label={t("detail.back")}
          >
            <BackIcon />
          </Link>
        </header>
        <div className="flex-1 flex items-center justify-center text-ink-500">
          {t("detail.notFound")}
        </div>
      </div>
    );
  }

  const species = SPECIES[entry.speciesId];
  if (!species) {
    return (
      <div className="h-full bg-cream-50 flex items-center justify-center text-ink-500">
        {t("detail.notFound")}
      </div>
    );
  }

  const collectionLabel = COLLECTION_LABELS[species.collection][lang];
  const description =
    lang === "th" ? species.descriptionTH : species.descriptionEN;
  const epithetText = species.epithet ? species.epithet[lang] : null;

  const collectionSpecies = SPECIES.filter(
    (s) => s.collection === species.collection,
  );
  const plateIdx = collectionSpecies.findIndex((s) => s.id === species.id);
  const folioPos = plateIdx >= 0 ? toRoman(plateIdx + 1).toLowerCase() : "";
  const folioTotal = toRoman(collectionSpecies.length).toLowerCase();
  const chapterRoman = toRoman(ALL_COLLECTIONS.indexOf(species.collection) + 1);
  const plateNo = String(species.id).padStart(3, "0");

  const level = floraEntry?.level ?? null;
  const pendingMerges = floraEntry?.pendingMerges ?? 0;
  const displayLevel = animatingLevel ?? level ?? 0;
  const isMax = level != null && level >= FLORA_MAX_LEVEL;
  const levelCost = !isMax && level != null ? (FLORA_LEVEL_CURVE[level - 1] ?? 0) : 0;
  const levelFill = isMax ? 1 : levelCost === 0 ? 0 : Math.min(pendingMerges / levelCost, 1);
  const shinyPct = Math.round(levelFill * 100);
  const showEpithet = !!epithetText && isMax;

  const ctaLabel = isCurrentStage
    ? t("detail.cta.removeAvatar")
    : isCurrentSpecies
      ? t("detail.cta.updateAvatar")
      : t("detail.cta.setAvatar");

  return (
    <div className="relative h-full overflow-y-auto overflow-x-hidden bg-cream-50 safe-top safe-bottom scrollbar-elegant">
      <div aria-hidden className="hb-paper" />

      {/* ── Topbar ──────────────────────────────────────────────── */}
      <header className="relative z-[1] grid grid-cols-[38px_1fr_38px] items-center gap-3 px-[18px] pt-3 pb-3.5 animate-fade-down">
        <Link
          href="/gallery"
          aria-label={t("detail.back")}
          className="w-[38px] h-[38px] rounded-full border border-cream-300 bg-cream-100/70 backdrop-blur flex items-center justify-center text-ink-700 hover:bg-cream-200 transition-all duration-300 ease-out hover:-translate-x-0.5"
        >
          <BackIcon size={16} />
        </Link>
        <div className="text-center min-w-0 px-1">
          <div className="font-mono text-[9px] tracking-[0.26em] uppercase text-ink-500">
            {t("detail.eyebrow")}
          </div>
          <h2 className="font-serif italic font-medium text-[15px] text-ink-900 mt-[2px] leading-tight truncate">
            {t("detail.subtitleOfFolio", { collection: collectionLabel })}
          </h2>
        </div>
        <button
          type="button"
          onClick={handleShare}
          aria-label={t("detail.share")}
          className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-ink-700 hover:bg-cream-100 transition-colors"
        >
          <ShareIcon />
        </button>
      </header>

      {/* ── Specimen plate ──────────────────────────────────────── */}
      <section
        className="relative z-[1] mx-[18px] mt-0.5 px-3.5 pt-5 pb-3.5 rounded-[5px] border border-dashed border-cream-400 shadow-soft-md animate-fade-up"
        style={{
          animationDelay: "80ms",
          background: "radial-gradient(circle at 50% 42%, #fefcf5 0%, #f2ebd8 96%)",
        }}
      >
        <span className="hb-tape tl" aria-hidden />
        <span className="hb-tape tr" aria-hidden />
        <span className="hb-tape bl" aria-hidden />
        <span className="hb-tape br" aria-hidden />
        <div aria-hidden className="absolute inset-[14px] pointer-events-none">
          <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-cream-400" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-cream-400" />
          <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-cream-400" />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-cream-400" />
        </div>

        <div className="flex items-center justify-between px-1 pb-2.5 font-mono text-[9px] tracking-[0.22em] uppercase text-ink-500">
          <span className="inline-flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-[color:var(--color-rarity-legendary)] shadow-[0_0_6px_rgba(212,162,76,0.5)]" />
            {t("detail.plateNo", { n: plateNo })}
          </span>
          <span>
            {t("detail.folioPosition", {
              chapter: chapterRoman,
              pos: folioPos,
              total: folioTotal,
            })}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 px-1">
          {STAGES.map((s) => {
            const selected = s === stage;
            return (
              <button
                key={s}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-label={t("detail.stageLabel", { n: String(s) })}
                onClick={() => {
                  if (selected) setLightboxStage(s);
                  else setStage(s);
                }}
                className="flex flex-col items-stretch gap-1.5 min-w-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-clay-500 rounded-[2px]"
              >
                <div
                  className={`relative w-full aspect-[9/16] flex items-center justify-center p-1.5 rounded-[2px] overflow-hidden transition-all duration-300 ease-out ${
                    selected
                      ? "border-[1.5px] border-clay-500 bg-cream-50/70 shadow-soft-sm"
                      : "border border-cream-300/70 bg-gradient-to-b from-white/35 to-cream-200/20 hover:border-cream-400"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`absolute inset-[3px] rounded-[1px] pointer-events-none border border-dashed ${
                      selected ? "border-clay-400/55" : "border-cream-300/45"
                    }`}
                  />
                  {isMax ? (
                    <ShinyOverlay
                      rarity={species.rarity}
                      maskSrc={`/floras/${species.folder}/stage-${s}.webp`}
                    >
                      <FloraImage
                        speciesId={species.id}
                        progress={STAGE_PROGRESS[s]}
                        className="w-full h-full object-contain drop-shadow-[0_8px_12px_rgba(75,55,30,0.16)]"
                      />
                    </ShinyOverlay>
                  ) : (
                    <FloraImage
                      speciesId={species.id}
                      progress={STAGE_PROGRESS[s]}
                      className="max-h-full max-w-full object-contain drop-shadow-[0_8px_12px_rgba(75,55,30,0.16)]"
                    />
                  )}
                </div>
                <div
                  className={`font-mono text-[8.5px] tracking-[0.22em] uppercase inline-flex items-center gap-1 justify-center ${
                    selected ? "text-clay-600" : "text-ink-500"
                  }`}
                >
                  <b
                    className={`font-medium ${
                      selected ? "text-clay-600" : "text-ink-900"
                    }`}
                  >
                    {ROMAN_LOWER[s]}.
                  </b>
                  <span className="w-1.5 h-px bg-cream-400" />
                  {t(STAGE_NAME_KEY[s])}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-3 mx-1.5 pt-1.5 border-t border-cream-300">
          <div className="grid grid-cols-[repeat(21,minmax(0,1fr))] items-end">
            {Array.from({ length: 21 }).map((_, i) => (
              <i
                key={i}
                aria-hidden
                className={`block w-px justify-self-center ${
                  i % 5 === 0 ? "h-2 bg-ink-500/50" : "h-1 bg-cream-400"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1 px-px font-mono text-[7.5px] tracking-[0.22em] text-ink-300">
            <span>0</span>
            <span>5 {t("detail.ruler")}</span>
            <span>10</span>
          </div>
        </div>
      </section>

      {/* ── Name & honorific ────────────────────────────────────── */}
      <section
        className="relative z-[1] px-[22px] pt-5 pb-1.5 flex flex-col gap-1 animate-fade-up"
        style={{ animationDelay: "180ms" }}
      >
        <div className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.22em] uppercase text-ink-500">
          <span aria-hidden className="w-3.5 h-px bg-clay-500/70" />
          <span>{collectionLabel}</span>
        </div>
        <h1 className="font-serif italic font-medium text-[38px] leading-none tracking-[-0.018em] text-ink-900 mt-1">
          {species.name}
        </h1>
        {showEpithet && (
          <div className="inline-flex items-center gap-2.5 font-serif italic font-medium text-[14.5px] leading-[1.15] mt-1 self-start">
            <span aria-hidden className="text-clay-500 text-[11px] not-italic">⟡</span>
            <span className="fl-foil-gold">{epithetText}</span>
          </div>
        )}
        <div className="flex items-center gap-2 flex-wrap mt-3">
          <span
            className={`hb-rar hb-rar-${species.rarity} inline-flex items-center gap-1.5`}
          >
            <RarityGem rarity={species.rarity} />
            {t(RARITY_KEY[species.rarity])}
          </span>
        </div>
      </section>

      {/* ── Dossier ─────────────────────────────────────────────── */}
      <section
        className="relative z-[1] mx-[18px] mt-3.5 mb-3 rounded-[22px] bg-cream-100/85 backdrop-blur border border-cream-200 shadow-soft-md animate-fade-up"
        style={{ animationDelay: "260ms" }}
      >
        <div className="px-[18px] pt-4 pb-2.5 border-b border-dashed border-cream-300 flex items-center justify-between gap-2.5">
          <span className="inline-flex items-center gap-[7px] font-mono text-[9px] tracking-[0.24em] uppercase text-ink-500">
            <span aria-hidden className="w-[3px] h-2.5 bg-clay-500 rounded-[1px]" />
            {t("detail.fieldNote")}
          </span>
          <LangToggle lang={lang} onChange={setLang} />
        </div>
        <p
          key={lang}
          lang={lang}
          className="px-[18px] py-3.5 font-serif font-light text-[14px] leading-[1.68] text-ink-700 tracking-[0.003em] animate-fade-in detail-dropcap"
        >
          {description}
        </p>
      </section>

      {/* ── Ledger ──────────────────────────────────────────────── */}
      <section
        className="relative z-[1] mx-[18px] px-[18px] pt-3.5 pb-3 rounded-[18px] bg-cream-100 border border-cream-200 animate-fade-up"
        style={{ animationDelay: "340ms" }}
      >
        <div className="flex items-center justify-between pb-2.5 font-mono text-[9px] tracking-[0.24em] uppercase text-ink-500">
          <span>{t("detail.collectionRecord")}</span>
          <span className="font-serif italic font-medium text-[13px] text-ink-900 tracking-normal normal-case">
            {t("detail.pressings", { n: entry.count })}
          </span>
        </div>
        <dl className="flex flex-col gap-[7px] m-0">
          <LedgerRow
            label={t("detail.waterExpended")}
            value={String(entry.totalWaterings)}
            unit={t("detail.drops")}
          />
          <LedgerRow
            label={t("detail.firstObtained")}
            value={formatDate(entry.firstHarvestedAt, lang)}
          />
          <LedgerRow
            label={t("detail.lastObtained")}
            value={formatDate(entry.lastHarvestedAt, lang)}
          />
        </dl>
      </section>

      {/* ── Flora Level card ────────────────────────────────────── */}
      {level != null && (
        <LevelCard
          level={displayLevel}
          isMax={isMax}
          pendingMerges={pendingMerges}
          canMerge={canMerge}
          fillPct={shinyPct}
          maxLabel={t("detail.maxLevel")}
          title={t("detail.floraLevel")}
          levelOf={t("detail.levelOf", {
            level: toRoman(displayLevel),
            max: toRoman(FLORA_MAX_LEVEL),
          })}
          mergeReadyLabel={t("detail.mergeReady", { n: pendingMerges })}
          progressLabel={t("detail.shinyProgress", { pct: shinyPct })}
          shaking={shaking}
          burstKey={burstKey}
          onActivate={handleLevelCardClick}
        />
      )}

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section
        className="relative z-[1] mx-[18px] mt-4 mb-7 animate-fade-up"
        style={{ animationDelay: "500ms" }}
      >
        <button
          type="button"
          onClick={handleProfileClick}
          aria-label={ctaLabel}
          className="group shine-on-hover flex w-full items-center justify-between rounded-full bg-clay-500 hover:bg-clay-600 text-cream-50 pl-[22px] pr-5 py-[15px] font-sans font-semibold text-[14px] tracking-[0.005em] shadow-soft-md transition-all duration-200 ease-out hover:-translate-y-px active:translate-y-0 active:bg-clay-600"
        >
          <span className="inline-flex items-center gap-3">
            <span className="font-mono text-[9px] tracking-[0.2em] uppercase px-2 py-[3px] rounded-full bg-cream-50/15 border border-cream-50/25 text-cream-50">
              {t("detail.stageLabel", { n: ROMAN_LOWER[stage] })}
            </span>
            <span>{ctaLabel}</span>
          </span>
          <span className="w-[30px] h-[30px] rounded-full bg-cream-50/15 inline-flex items-center justify-center transition-transform duration-200 group-hover:translate-x-[3px]">
            <ArrowIcon />
          </span>
        </button>
      </section>

      <div
        className="relative z-[1] text-center px-[18px] pb-5 animate-fade-in"
        style={{ animationDelay: "600ms" }}
      >
        <span className="font-serif italic text-[11px] tracking-[0.06em] text-ink-300 inline-flex items-center gap-2">
          <span aria-hidden className="w-[18px] h-px bg-cream-400" />
          {t("detail.signature")}
          <span aria-hidden className="w-[18px] h-px bg-cream-400" />
        </span>
      </div>

      {maxRevealSpecies !== null && (
        <MaxRevealModal
          speciesId={maxRevealSpecies}
          lang={lang}
          labels={{
            shiny: t("detail.maxRevealShiny"),
            epithet: t("detail.maxRevealEpithet"),
            hint: t("detail.maxRevealHint"),
            close: t("detail.maxRevealClose"),
          }}
          onClose={() => setMaxRevealSpecies(null)}
        />
      )}

      {lightboxStage !== null && (
        <FloraLightbox
          speciesId={species.id}
          folder={species.folder}
          rarity={species.rarity}
          stage={lightboxStage}
          showShiny={isMax}
          closeLabel={t("detail.maxRevealClose")}
          onClose={() => setLightboxStage(null)}
        />
      )}
    </div>
  );
}

interface FloraLightboxProps {
  speciesId: number;
  folder: string;
  rarity: Rarity;
  stage: Stage;
  showShiny: boolean;
  closeLabel: string;
  onClose: () => void;
}

function FloraLightbox({
  speciesId,
  folder,
  rarity,
  stage,
  showShiny,
  closeLabel,
  onClose,
}: FloraLightboxProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Flora · fullscreen"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-sm animate-overlay-in p-3"
    >
      <div className="relative pointer-events-none max-w-[90vw] max-h-[90vh] flex items-center justify-center">
        {showShiny ? (
          <ShinyOverlay
            rarity={rarity}
            maskSrc={`/floras/${folder}/stage-${stage}.webp`}
          >
            <FloraImage
              speciesId={speciesId}
              progress={STAGE_PROGRESS[stage]}
              className="max-h-[90vh] max-w-[90vw] object-contain drop-shadow-[0_0_60px_rgba(255,255,255,0.1)]"
            />
          </ShinyOverlay>
        ) : (
          <FloraImage
            speciesId={speciesId}
            progress={STAGE_PROGRESS[stage]}
            className="max-h-[90vh] max-w-[90vw] object-contain drop-shadow-[0_0_60px_rgba(255,255,255,0.1)]"
          />
        )}
      </div>
      <button
        type="button"
        aria-label={closeLabel}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 w-11 h-11 rounded-full bg-black/55 text-white text-xl leading-none flex items-center justify-center backdrop-blur-sm hover:bg-black/75 transition-colors"
      >
        ✕
      </button>
    </div>
  );
}

function LedgerRow({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <div className="flex items-baseline gap-2">
      <dt className="font-sans text-[12.5px] text-ink-500 whitespace-nowrap">
        {label}
      </dt>
      <span
        aria-hidden
        className="flex-1 border-b border-dotted border-cream-400 relative -top-[3px]"
      />
      <dd className="m-0 font-mono text-[11.5px] font-medium text-ink-900 tabular-nums">
        {value}
        {unit && (
          <small className="ml-1 font-sans text-[9.5px] text-ink-500 font-normal tracking-[0.08em] uppercase">
            {unit}
          </small>
        )}
      </dd>
    </div>
  );
}

interface LevelCardProps {
  level: number;
  isMax: boolean;
  pendingMerges: number;
  canMerge: boolean;
  fillPct: number;
  title: string;
  levelOf: string;
  maxLabel: string;
  mergeReadyLabel: string;
  progressLabel: string;
  shaking: boolean;
  burstKey: number;
  onActivate: () => void;
}

function LevelCard({
  level,
  isMax,
  pendingMerges,
  canMerge,
  fillPct,
  title,
  levelOf,
  maxLabel,
  mergeReadyLabel,
  progressLabel,
  shaking,
  burstKey,
  onActivate,
}: LevelCardProps) {
  const cardStyle: CSSProperties = {
    animationDelay: "420ms",
    background:
      "linear-gradient(180deg, #fffcf4 0%, var(--color-cream-100) 100%)",
    width: "calc(100% - 36px)",
  };
  const base =
    "relative z-[1] block text-left mx-[18px] my-3 px-[18px] pt-[15px] pb-4 rounded-[18px] border border-cream-200 overflow-hidden animate-fade-up";
  const interactive = canMerge
    ? "cursor-pointer hover:-translate-y-px hover:shadow-soft-md transition-all"
    : "";
  const shakeCls = shaking ? "animate-claim-press" : "";
  const className = `${base} ${interactive} ${shakeCls}`.trim();

  const body = (
    <>
      <span
        aria-hidden
        className="absolute -top-10 -right-12 w-[180px] h-[180px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(212,162,76,.22), transparent 65%)",
        }}
      />

      <div className="relative z-[1] flex items-baseline justify-between gap-2.5">
        <span className="font-mono text-[9px] tracking-[0.24em] uppercase text-ink-500">
          {title}
        </span>
        <span className="font-serif italic font-medium text-[22px] leading-none text-ink-900 inline-flex items-baseline gap-0.5">
          {isMax ? (
            <span className="text-amber-600">{maxLabel}</span>
          ) : (
            <>
              {toRoman(level)}
              <small className="font-mono text-[10px] text-ink-500 font-normal not-italic">
                /{toRoman(FLORA_MAX_LEVEL)}
              </small>
            </>
          )}
        </span>
      </div>
      <span className="sr-only">{levelOf}</span>

      <div className="relative z-[1] mt-3 flex items-center gap-1.5">
        {Array.from({ length: FLORA_MAX_LEVEL }).map((_, i) => {
          const pos = i + 1;
          const filled = pos <= level;
          const tier = pos <= 3 ? "gold" : pos === 4 ? "blue" : "rainbow";
          const isCurrent = filled && pos === level;
          return (
            <span
              key={pos}
              aria-label={`Level ${pos} ${filled ? "filled" : "empty"}`}
              aria-current={isCurrent ? "true" : undefined}
              className={`relative w-6 h-6 inline-flex items-center justify-center ${
                isCurrent && !isMax ? "animate-pulse-slow" : ""
              }`}
            >
              {filled ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={STAR_SRC[tier]}
                  alt=""
                  width={22}
                  height={22}
                  aria-hidden
                  draggable={false}
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={STAR_SRC.gold}
                  alt=""
                  width={22}
                  height={22}
                  aria-hidden
                  draggable={false}
                  className="opacity-25 grayscale"
                />
              )}
            </span>
          );
        })}
        <span className="flex-1" />
        {canMerge && !isMax && (
          <span
            className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.16em] uppercase text-clay-600 px-2 py-[3px] rounded-full bg-clay-500/10 border border-clay-500/30"
          >
            <span
              aria-hidden
              className="w-[5px] h-[5px] rounded-full bg-clay-500 animate-pulse"
            />
            {mergeReadyLabel}
          </span>
        )}
      </div>

      {!isMax && (
        <div className="relative z-[1] mt-3 flex items-center gap-2.5">
          <div className="flex-1 h-[5px] rounded-full bg-cream-200 overflow-hidden shadow-[inset_0_1px_2px_rgba(75,55,30,0.08)]">
            <div
              className="h-full rounded-full transition-[width] duration-700 ease-out"
              style={{
                width: `${fillPct}%`,
                background:
                  "linear-gradient(90deg, var(--color-clay-400), var(--color-clay-600))",
              }}
            />
          </div>
          <span className="font-mono text-[10px] text-ink-700 tabular-nums tracking-[0.08em]">
            {progressLabel}
          </span>
        </div>
      )}

      {isMax && (
        <div className="relative z-[1] mt-3 text-[11px] text-amber-600 font-medium tracking-wide">
          ✦ {maxLabel}
        </div>
      )}

      <span className="sr-only">pending merges: {pendingMerges}</span>

      {burstKey > 0 && <MergeBurst key={burstKey} playKey={burstKey} />}
    </>
  );

  if (canMerge) {
    return (
      <button
        type="button"
        onClick={onActivate}
        aria-label={mergeReadyLabel}
        className={className}
        style={cardStyle}
      >
        {body}
      </button>
    );
  }
  return (
    <div className={className} style={cardStyle}>
      {body}
    </div>
  );
}

