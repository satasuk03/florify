"use client";

import { useState, useMemo, useEffect, useRef, useCallback, memo } from "react";
import Link from "next/link";
import { RarityBadge } from "@/components/RarityBadge";
import { BackIcon } from "@/components/icons";
import { FloraImage } from "@/components/FloraImage";
import { ShinyOverlay } from "@/components/flora-level/ShinyOverlay";
import { MergeBurst } from "@/components/flora-level/MergeBurst";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { useGameStore, canMergeFloraLevel } from "@/store/gameStore";
import { gameEventBus } from "@/lib/gameEventBus";
import {
  SPECIES,
  SpeciesCollection,
  ALL_COLLECTIONS,
  COLLECTION_LABELS,
} from "@/data/species";
import type { SpeciesDef } from "@/data/species";
import type { Rarity } from "@florify/shared";
import { FLORA_MAX_LEVEL } from "@florify/shared";
import { useT } from "@/i18n/useT";
import type { DictKey } from "@/i18n/dict";
import { useGalleryFilters } from "@/hooks/useSessionState";

const RARITY_ORDER: Rarity[] = ["common", "rare", "legendary"];

/* ── Level → star mapping ───────────────────────────────────────── */
function starCount(level: number): number {
  return level <= 3 ? level : 3;
}
function starSrc(level: number): string {
  if (level <= 3) return "/icons/star-gold.svg";
  if (level === 4) return "/icons/star-blue.svg";
  return "/icons/star-rainbow.svg";
}

/* ── Icons (inline SVGs to avoid extra deps) ────────────────────── */
function SearchIcon({ size = 13 }: { size?: number }) {
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
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function FilterIcon({ size = 14 }: { size?: number }) {
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
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="15" y2="12" />
      <line x1="3" y1="18" x2="9" y2="18" />
    </svg>
  );
}

function PressedSilhouette() {
  return (
    <svg
      viewBox="0 0 100 120"
      width="100%"
      height="100%"
      className="block"
      aria-hidden
    >
      <g fill="#c5b8a0" fillOpacity="0.55">
        <path
          d="M50 115 Q 50 85, 50 58"
          stroke="#c5b8a0"
          strokeOpacity="0.55"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
        <path d="M50 88 Q 28 82, 24 96 Q 40 98, 50 88 Z" />
        <path d="M50 78 Q 72 72, 76 86 Q 60 90, 50 78 Z" />
        <g transform="translate(50, 48)">
          {[0, 72, 144, 216, 288].map((deg, i) => (
            <ellipse
              key={i}
              cx="0"
              cy="-14"
              rx="8"
              ry="15"
              transform={`rotate(${deg})`}
            />
          ))}
          <circle cx="0" cy="0" r="6" fill="#9c8f7b" />
        </g>
      </g>
    </svg>
  );
}

/* ── Rarity diamond gem for tile corners ────────────────────────── */
function RarityGem({ rarity, size = 11 }: { rarity: Rarity; size?: number }) {
  const fill =
    rarity === "legendary"
      ? "#d4a24c"
      : rarity === "rare"
        ? "#7a9cb8"
        : "#b8a888";
  const edge =
    rarity === "legendary"
      ? "#8a6422"
      : rarity === "rare"
        ? "#3f6884"
        : "#7a6f58";
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className="block">
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

/* ── Progress ring ──────────────────────────────────────────────── */
function ProgressWreath({
  unlocked,
  total,
  harvested,
  chaptersDone,
  chaptersTotal,
}: {
  unlocked: number;
  total: number;
  harvested: number;
  chaptersDone: number;
  chaptersTotal: number;
}) {
  const pct = total === 0 ? 0 : unlocked / total;
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - pct);
  return (
    <section className="grid grid-cols-[110px_1fr] gap-3.5 items-center bg-cream-100 border border-cream-300 rounded-md p-3.5 mb-4">
      <div className="relative w-[110px] h-[110px]">
        <svg
          viewBox="0 0 120 120"
          width="100%"
          height="100%"
          aria-hidden
          className="-rotate-90"
        >
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#d1c0a0"
            strokeWidth="4"
            strokeOpacity="0.55"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#6b8e4e"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 900ms cubic-bezier(0.22,1,0.36,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="font-serif font-semibold text-[26px] text-ink-900 tabular-nums leading-none tracking-tight">
            <AnimatedNumber value={unlocked} />
            <span className="text-sm text-ink-500 font-medium">/{total}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <WreathStat
          value={harvested.toLocaleString()}
          label="total pressed"
          translationKey="gallery.totalPressed"
        />
        <WreathStat
          value={`${Math.round(pct * 100)}%`}
          label="catalogued"
          translationKey="gallery.catalogued"
        />
        <WreathStat
          value={chaptersDone}
          valueSuffix={`/${chaptersTotal}`}
          label="chapters"
          translationKey="gallery.chapters"
        />
      </div>
    </section>
  );
}

function WreathStat({
  value,
  valueSuffix,
  translationKey,
}: {
  value: string | number;
  valueSuffix?: string;
  label: string;
  translationKey: DictKey;
}) {
  const t = useT();
  return (
    <div className="flex items-baseline justify-between gap-2.5 pb-1.5 border-b border-dotted border-cream-400 last:border-none last:pb-0">
      <div className="font-serif font-semibold text-[18px] text-ink-900 tabular-nums tracking-tight">
        {value}
        {valueSuffix && (
          <span className="text-ink-500 text-xs font-medium">
            {valueSuffix}
          </span>
        )}
      </div>
      <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-ink-500">
        {t(translationKey)}
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────── */
export function GalleryView() {
  const t = useT();
  const collection = useGameStore((s) => s.state.collection);
  const floraLevels = useGameStore((s) => s.state.floraLevels);
  const unlocked = useGameStore((s) => s.uniqueSpeciesUnlocked());
  const hydrated = useGameStore((s) => s.hydrated);
  const mergeAllFloraLevels = useGameStore((s) => s.mergeAllFloraLevels);

  useEffect(() => {
    if (!hydrated) return;
    gameEventBus.emit({ type: "visit" });
  }, [hydrated]);
  const totalHarvested = collection.reduce((sum, c) => sum + c.count, 0);

  const discoveredSet = useMemo(
    () => new Set(collection.map((c) => c.speciesId)),
    [collection],
  );
  const collectionMap = useMemo(
    () => new Map(collection.map((c) => [c.speciesId, c])),
    [collection],
  );

  /* ── Filter state (persisted to sessionStorage) ──────────────── */
  const {
    search,
    setSearch,
    showFilters,
    setShowFilters,
    selectedRarities,
    setSelectedRarities,
    selectedCollections,
    setSelectedCollections,
    showMode,
    setShowMode,
    showPending,
    setShowPending,
    showMaxed,
    setShowMaxed,
    resetFilters,
  } = useGalleryFilters(RARITY_ORDER, ALL_COLLECTIONS);

  const toggleRarity = (r: Rarity) => {
    setSelectedRarities((prev: Set<string>) => {
      const next = new Set(prev);
      if (next.has(r)) next.delete(r);
      else next.add(r);
      return next;
    });
  };

  const toggleCollection = (c: SpeciesCollection) => {
    setSelectedCollections((prev: Set<string>) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  };

  /* ── Filtered + searched species list ────────────────────────── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return SPECIES.filter((sp) => {
      if (!selectedRarities.has(sp.rarity)) return false;
      if (!selectedCollections.has(sp.collection)) return false;
      const isFound = discoveredSet.has(sp.id);
      if (showMode === "found" && !isFound) return false;
      if (showMode === "missing" && isFound) return false;
      const entry = floraLevels[sp.id];
      if (showPending && !canMergeFloraLevel(entry)) return false;
      if (showMaxed && (!entry || entry.level !== FLORA_MAX_LEVEL)) return false;
      if (q) {
        const collLabel = COLLECTION_LABELS[sp.collection];
        const haystack = [
          sp.name,
          sp.descriptionEN,
          sp.descriptionTH,
          collLabel.en,
          collLabel.th,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => {
      const rarityRank: Record<Rarity, number> = {
        legendary: 0,
        rare: 1,
        common: 2,
      };
      const rDiff = rarityRank[a.rarity] - rarityRank[b.rarity];
      if (rDiff !== 0) return rDiff;
      return b.id - a.id;
    });
  }, [
    search,
    selectedRarities,
    selectedCollections,
    showMode,
    discoveredSet,
    showPending,
    showMaxed,
    floraLevels,
  ]);

  /* ── Total species per collection (for progression display) ───── */
  const collectionTotals = useMemo(() => {
    const totals = new Map<SpeciesCollection, number>();
    for (const col of ALL_COLLECTIONS) {
      totals.set(col, SPECIES.filter((sp) => sp.collection === col).length);
    }
    return totals;
  }, []);

  /* ── Total unlocked per collection (for chapter counters) ────── */
  const collectionUnlocked = useMemo(() => {
    const counts = new Map<SpeciesCollection, number>();
    for (const col of ALL_COLLECTIONS) counts.set(col, 0);
    for (const c of collection) {
      const sp = SPECIES[c.speciesId];
      if (!sp) continue;
      counts.set(sp.collection, (counts.get(sp.collection) ?? 0) + 1);
    }
    return counts;
  }, [collection]);

  const chaptersDone = useMemo(() => {
    let done = 0;
    for (const col of ALL_COLLECTIONS) {
      const u = collectionUnlocked.get(col) ?? 0;
      const total = collectionTotals.get(col) ?? 0;
      if (total > 0 && u >= total) done += 1;
    }
    return done;
  }, [collectionUnlocked, collectionTotals]);

  /* ── Merge-all bar state ─────────────────────────────────────── */
  const mergeableCount = useMemo(() => {
    let n = 0;
    for (const entry of Object.values(floraLevels)) {
      if (canMergeFloraLevel(entry)) n += 1;
    }
    return n;
  }, [floraLevels]);

  const [mergeBurstKey, setMergeBurstKey] = useState(0);
  const [mergeBurstActive, setMergeBurstActive] = useState(false);
  const [frozenMergeCount, setFrozenMergeCount] = useState(0);

  const handleMergeAll = useCallback(() => {
    if (mergeableCount === 0) return;
    setFrozenMergeCount(mergeableCount);
    setMergeBurstKey((k) => k + 1);
    setMergeBurstActive(true);
    mergeAllFloraLevels();
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate?.(35);
    }
    window.setTimeout(() => setMergeBurstActive(false), 1700);
  }, [mergeableCount, mergeAllFloraLevels]);

  /* ── Group filtered species by collection (newest first) ─────── */
  const groupedByCollection = useMemo(() => {
    const groups: { collection: SpeciesCollection; species: SpeciesDef[] }[] =
      [];
    for (const col of ALL_COLLECTIONS) {
      const items = filtered.filter((sp) => sp.collection === col);
      if (items.length > 0) groups.push({ collection: col, species: items });
    }
    return groups;
  }, [filtered]);

  /* ── Featured hero: most recently harvested species ──────────── */
  const hero = useMemo(() => {
    const first = collection[0];
    if (!first) return null;
    const sp = SPECIES[first.speciesId];
    if (!sp) return null;
    const entry = floraLevels[sp.id];
    return {
      species: sp,
      count: first.count,
      level: entry?.level ?? null,
    };
  }, [collection, floraLevels]);

  /* ── Scroll-to-top ────────────────────────────────────────────── */
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollTicking = useRef(false);

  const onScroll = useCallback(() => {
    if (scrollTicking.current) return;
    scrollTicking.current = true;
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el) setShowScrollTop(el.scrollTop > 400);
      scrollTicking.current = false;
    });
  }, []);

  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const isDefaultFilters =
    selectedRarities.size === RARITY_ORDER.length &&
    selectedCollections.size === ALL_COLLECTIONS.length &&
    showMode === "found" &&
    !showPending &&
    !showMaxed;

  const activeFilterCount =
    RARITY_ORDER.length -
    selectedRarities.size +
    (ALL_COLLECTIONS.length - selectedCollections.size) +
    (showMode !== "found" ? 1 : 0) +
    (showPending ? 1 : 0) +
    (showMaxed ? 1 : 0);

  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      className="relative min-h-full h-full overflow-y-auto bg-cream-50 safe-top safe-bottom px-4 pt-3 pb-24 scrollbar-elegant"
    >
      {/* Paper texture underlay */}
      <div aria-hidden className="hb-paper" />

      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="relative z-[1] grid grid-cols-[36px_1fr_36px] items-center gap-2 py-2 pb-3.5 animate-fade-down">
        <Link
          href="/"
          className="w-9 h-9 flex items-center justify-center rounded-full bg-cream-100 border border-cream-300 text-ink-700 hover:bg-cream-200 transition-all duration-300"
          aria-label={t("gallery.back")}
        >
          <BackIcon />
        </Link>
        <div className="text-center">
          <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-ink-500">
            {t("gallery.eyebrow")}
          </div>
          <h1 className="font-serif font-semibold text-[20px] text-ink-900 tracking-tight leading-tight mt-0.5">
            {t("gallery.heading.a")}{" "}
            <em className="italic font-medium text-clay-500">
              {t("gallery.heading.b")}
            </em>
          </h1>
        </div>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`relative w-9 h-9 flex items-center justify-center rounded-full border text-ink-700 transition-all duration-300 ${
            showFilters || !isDefaultFilters
              ? "bg-clay-500 border-clay-600 text-cream-50"
              : "bg-cream-100 border-cream-300 hover:bg-cream-200"
          }`}
          aria-label="Filters"
        >
          <FilterIcon />
          {activeFilterCount > 0 && !showFilters && (
            <span className="absolute -top-1 -right-1 bg-clay-600 text-cream-50 text-[9px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </header>

      {/* ── Hero plate ──────────────────────────────────────────── */}
      {hero && <HerbariumHero hero={hero} />}

      {/* ── Progress wreath ─────────────────────────────────────── */}
      <ProgressWreath
        unlocked={unlocked}
        total={SPECIES.length}
        harvested={totalHarvested}
        chaptersDone={chaptersDone}
        chaptersTotal={ALL_COLLECTIONS.length}
      />

      {/* ── Merge-all bar ───────────────────────────────────────── */}
      {(mergeableCount > 0 || mergeBurstActive) && (
        <MergeAllBar
          count={mergeBurstActive ? frozenMergeCount : mergeableCount}
          burstKey={mergeBurstKey}
          burstActive={mergeBurstActive}
          onClick={handleMergeAll}
          locked={mergeBurstActive}
        />
      )}

      {/* ── Search row ──────────────────────────────────────────── */}
      <section className="flex items-center gap-2 mb-4 relative z-[1]">
        <div className="flex-1 flex items-center gap-2 bg-cream-100 border border-cream-300 rounded-full px-3 py-1.5 text-ink-500">
          <SearchIcon />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("gallery.searchPlaceholder")}
            className="flex-1 bg-transparent border-none outline-none text-[13px] text-ink-900 placeholder:text-ink-300 placeholder:italic"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-ink-300 hover:text-ink-700"
              aria-label="Clear search"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
        <div className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-ink-500 whitespace-nowrap">
          {t("gallery.showingShort")}{" "}
          <b className="text-ink-900 font-semibold">{filtered.length}</b>/
          {SPECIES.length}
        </div>
      </section>

      {/* ── Chapters ───────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="text-center text-ink-500 text-sm mt-16 animate-fade-in relative z-[1]">
          {search ? t("gallery.noResults") : t("gallery.empty")}
        </div>
      ) : (
        <div className="relative z-[1]">
          {groupedByCollection.map((group, gi) => {
            const label = COLLECTION_LABELS[group.collection];
            const chapterIndex = ALL_COLLECTIONS.indexOf(group.collection) + 1;
            const total = collectionTotals.get(group.collection) ?? 0;
            const found = collectionUnlocked.get(group.collection) ?? 0;
            return (
              <section
                key={group.collection}
                className="mb-5 animate-fade-up"
                style={{ animationDelay: `${gi * 60}ms` }}
              >
                <div className="sticky top-0 z-10 -mx-4 px-4 py-2 mb-2.5 bg-cream-50/90 backdrop-blur-sm border-b border-cream-300">
                  <div className="grid grid-cols-[10px_1fr_auto] gap-2.5 items-center">
                    <span className="w-[3px] h-6 bg-clay-500 rounded-sm" />
                    <div className="flex flex-col">
                      <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-ink-500">
                        {t("gallery.chapterLabel", { n: String(chapterIndex) })}
                      </span>
                      <span className="font-serif font-semibold text-[17px] text-ink-900 tracking-tight">
                        {label.en}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-ink-700 tracking-wider tabular-nums">
                      {found}
                      <span className="text-ink-300">/{total}</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {group.species.map((sp, i) => {
                    const isFound = discoveredSet.has(sp.id);
                    const collEntry = isFound
                      ? collectionMap.get(sp.id)
                      : undefined;
                    const animate = gi === 0 && i < 12;
                    const floraEntry = floraLevels[sp.id];
                    const level = floraEntry?.level ?? null;
                    const canMerge = canMergeFloraLevel(floraEntry);

                    return isFound ? (
                      <Link
                        key={sp.id}
                        href={{
                          pathname: "/gallery/detail",
                          query: { speciesId: String(sp.id) },
                        }}
                        className={`group block ${animate ? "animate-fade-up" : ""}`}
                        style={
                          {
                            animationDelay: animate
                              ? `${i * 40 + 100}ms`
                              : undefined,
                            contentVisibility: "auto",
                            containIntrinsicSize: "auto 160px",
                          } as React.CSSProperties
                        }
                      >
                        <PlateTile
                          species={sp}
                          count={collEntry?.count ?? 1}
                          level={level}
                          canMerge={canMerge}
                        />
                      </Link>
                    ) : (
                      <div
                        key={sp.id}
                        className={`block ${animate ? "animate-fade-up" : ""}`}
                        style={
                          {
                            animationDelay: animate
                              ? `${i * 40 + 100}ms`
                              : undefined,
                            contentVisibility: "auto",
                            containIntrinsicSize: "auto 160px",
                          } as React.CSSProperties
                        }
                      >
                        <PlateTile species={sp} locked />
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* ── Scroll to top FAB ──────────────────────────────────── */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="sticky bottom-6 left-full z-20 -mr-1 w-10 h-10 rounded-full bg-cream-100/90 border border-cream-300 shadow-soft-md backdrop-blur-sm flex items-center justify-center text-ink-600 hover:bg-cream-200 transition-all duration-200 animate-fade-up"
          aria-label="Scroll to top"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      )}

      {/* ── Filter bottom sheet ────────────────────────────────── */}
      {showFilters && (
        <FilterSheet
          onClose={() => setShowFilters(false)}
          showMode={showMode}
          setShowMode={setShowMode}
          showPending={showPending}
          setShowPending={setShowPending}
          showMaxed={showMaxed}
          setShowMaxed={setShowMaxed}
          selectedRarities={selectedRarities}
          toggleRarity={toggleRarity}
          selectedCollections={selectedCollections}
          toggleCollection={toggleCollection}
          isDefaultFilters={isDefaultFilters}
          resetFilters={resetFilters}
        />
      )}
    </div>
  );
}

/* ── Hero plate ─────────────────────────────────────────────────── */
function HerbariumHero({
  hero,
}: {
  hero: { species: SpeciesDef; count: number; level: number | null };
}) {
  const t = useT();
  const { species, count, level } = hero;
  return (
    <section className="relative mb-4 mx-1 px-4 py-5 rounded-md bg-[#fefbf4] border border-cream-300 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_4px_12px_rgba(75,55,30,0.08)]">
      <span className="hb-tape tl" aria-hidden />
      <span className="hb-tape tr" aria-hidden />
      <span className="hb-tape bl" aria-hidden />
      <span className="hb-tape br" aria-hidden />

      {/* Plate with triptych */}
      <Link
        href={{
          pathname: "/gallery/detail",
          query: { speciesId: String(species.id) },
        }}
        className="hb-hero-plate relative block aspect-[16/11] w-full px-3.5 pt-4 pb-2.5"
      >
        <div className="relative grid grid-cols-3 gap-1.5 w-full h-full items-stretch">
          {([1, 2, 3] as const).map((stage) => (
            <div
              key={stage}
              className="flex flex-col items-center gap-1 min-w-0"
            >
              <div className="flex-1 w-full aspect-[9/16] flex items-end justify-center overflow-hidden">
                <FloraImage
                  speciesId={species.id}
                  progress={stage === 1 ? 0.1 : stage === 2 ? 0.5 : 1}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="font-mono text-[8px] tracking-[0.14em] uppercase text-ink-500">
                Stage {stage}
              </div>
            </div>
          ))}
        </div>
      </Link>

      {/* Meta row */}
      <div className="mt-3.5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-ink-500">
            {t("gallery.plateNo", {
              n: String(species.id).padStart(3, "0"),
            })}
          </span>
          {level !== null && <StarRow level={level} size={11} />}
        </div>
        <div className="font-serif italic font-medium text-[26px] text-ink-900 tracking-tight leading-none mt-1">
          {species.name}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap font-mono text-[10px] text-ink-500 mt-1.5 tracking-wider">
          <span className={`hb-rar hb-rar-${species.rarity}`}>
            {species.rarity}
          </span>
          <span className="opacity-50">·</span>
          <span>{COLLECTION_LABELS[species.collection].en}</span>
          <span className="opacity-50">·</span>
          <span className="text-ink-700">
            {t("gallery.pressed", { n: String(count) })}
          </span>
        </div>
      </div>

      {/* LATEST wax stamp */}
      <div className="absolute top-7 right-6 rotate-[-14deg] z-[3] pointer-events-none">
        <div className="hb-stamp-ring">
          <div className="hb-stamp-inner">
            <div className="font-serif font-bold text-[10.5px] tracking-[0.08em] leading-none">
              {t("gallery.latest")}
            </div>
            <div className="font-mono text-[7px] tracking-[0.18em] mt-1 opacity-75">
              MMXXV
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Star row (handles level 1-5) ───────────────────────────────── */
function StarRow({ level, size = 8 }: { level: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-[1px]">
      {Array.from({ length: starCount(level) }).map((_, i) => (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          key={i}
          src={starSrc(level)}
          alt=""
          width={size}
          height={size}
          aria-hidden
          draggable={false}
        />
      ))}
    </span>
  );
}

/* ── Plate tile (shared for found + locked) ─────────────────────── */
type PlateTileProps =
  | {
      species: SpeciesDef;
      locked: true;
      count?: never;
      level?: never;
      canMerge?: never;
    }
  | {
      species: SpeciesDef;
      locked?: false;
      count: number;
      level: number | null;
      canMerge: boolean;
    };

const PlateTile = memo(function PlateTile(props: PlateTileProps) {
  const { species, locked } = props;
  const rarityFrame =
    species.rarity === "legendary"
      ? "hb-frame-legendary"
      : species.rarity === "rare"
        ? "hb-frame-rare"
        : "";

  return (
    <div
      className={`relative bg-[#fefbf4] border border-cream-300 rounded-[4px] px-2 pt-2 pb-1.5 shadow-soft-sm hover:-translate-y-px hover:shadow-soft-md transition-all duration-300 ${
        locked ? "bg-cream-100" : ""
      } ${rarityFrame}`}
    >
      <div className={`hb-tile-inner ${locked ? "locked" : ""}`}>
        {locked ? (
          <PressedSilhouette />
        ) : props.level === FLORA_MAX_LEVEL ? (
          <ShinyOverlay rarity={species.rarity}>
            <FloraImage
              speciesId={species.id}
              progress={1}
              className="w-full h-full object-contain"
            />
          </ShinyOverlay>
        ) : (
          <FloraImage
            speciesId={species.id}
            progress={1}
            className="w-full h-full object-contain"
          />
        )}

        {!locked && (
          <div className="absolute top-1 right-1 z-[1]">
            <RarityGem rarity={species.rarity} size={11} />
          </div>
        )}
        {!locked && props.level === FLORA_MAX_LEVEL && (
          <div className="hb-tile-maxglow" aria-hidden />
        )}
        {!locked && props.canMerge && (
          <span
            aria-label="pending merges"
            className="absolute top-1.5 left-1.5 w-[6px] h-[6px] rounded-full bg-yellow-400 animate-pulse shadow-[0_0_6px_rgba(251,214,74,0.8)]"
          />
        )}
      </div>

      <div className="mt-1 px-0.5">
        <div className="flex items-center justify-between gap-1">
          <span className="font-mono text-[8px] tracking-[0.1em] text-ink-500">
            N. {String(species.id).padStart(3, "0")}
          </span>
          {!locked && props.level !== null && (
            <StarRow level={props.level} size={8} />
          )}
        </div>
        <div
          className={`font-serif italic font-medium text-[12.5px] tracking-tight leading-tight mt-0.5 truncate ${
            locked ? "text-ink-300" : "text-ink-900"
          }`}
        >
          {locked ? "— — —" : species.name}
        </div>
        {!locked && props.count > 1 && (
          <div className="font-mono text-[9px] text-clay-500 mt-0.5">
            ×{props.count}
          </div>
        )}
      </div>
    </div>
  );
});

/* ── Merge-all bar ──────────────────────────────────────────────── */
function MergeAllBar({
  count,
  burstKey,
  burstActive,
  onClick,
  locked,
}: {
  count: number;
  burstKey: number;
  burstActive: boolean;
  onClick: () => void;
  locked: boolean;
}) {
  const t = useT();
  const disabled = count === 0 || locked;
  return (
    <section className="relative flex items-center justify-between gap-3 bg-cream-100 border border-cream-300 rounded-md px-3.5 py-2.5 mb-4 animate-fade-up">
      <div className="flex items-center gap-2 min-w-0">
        <span
          aria-hidden
          className="w-[8px] h-[8px] rounded-full bg-yellow-400 animate-pulse shadow-[0_0_8px_rgba(251,214,74,0.8)] shrink-0"
        />
        <span className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-ink-700 truncate">
          {t("gallery.mergeAll.ready", { n: String(count) })}
        </span>
      </div>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="relative shrink-0 bg-clay-500 hover:bg-clay-600 disabled:opacity-60 disabled:hover:bg-clay-500 text-cream-50 rounded-full px-4 py-1.5 font-sans font-semibold text-[12px] tracking-wide transition-colors"
      >
        ✦ {t("gallery.mergeAll.action")}
      </button>
      {burstActive && <MergeBurst playKey={burstKey} />}
    </section>
  );
}

/* ── Filter bottom sheet ────────────────────────────────────────── */
function FilterSheet({
  onClose,
  showMode,
  setShowMode,
  showPending,
  setShowPending,
  showMaxed,
  setShowMaxed,
  selectedRarities,
  toggleRarity,
  selectedCollections,
  toggleCollection,
  isDefaultFilters,
  resetFilters,
}: {
  onClose: () => void;
  showMode: "all" | "found" | "missing";
  setShowMode: (m: "all" | "found" | "missing") => void;
  showPending: boolean;
  setShowPending: (fn: (v: boolean) => boolean) => void;
  showMaxed: boolean;
  setShowMaxed: (fn: (v: boolean) => boolean) => void;
  selectedRarities: Set<string>;
  toggleRarity: (r: Rarity) => void;
  selectedCollections: Set<string>;
  toggleCollection: (c: SpeciesCollection) => void;
  isDefaultFilters: boolean;
  resetFilters: () => void;
}) {
  const t = useT();
  return (
    <>
      <div
        className="fixed inset-0 bg-ink-900/45 z-40 animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed left-0 right-0 bottom-0 z-50 bg-cream-50 rounded-t-3xl pt-2.5 pb-6 px-5 border-t border-cream-300 shadow-[0_-8px_24px_rgba(75,55,30,0.15)] animate-sheet-up safe-bottom max-w-[430px] mx-auto">
        <div className="w-9 h-1 bg-cream-400 rounded-full mx-auto mb-3.5" />
        <div className="font-serif font-semibold text-[17px] text-ink-900 text-center tracking-tight mb-4">
          {t("gallery.filterPlates")}
        </div>

        <div className="mb-3.5">
          <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-ink-500 mb-2">
            {t("gallery.filterStatus")}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(["all", "found", "missing"] as const).map((mode) => (
              <Chip
                key={mode}
                active={showMode === mode}
                onClick={() => setShowMode(mode)}
              >
                {t(`gallery.filter.${mode}`)}
              </Chip>
            ))}
            <Chip active={showPending} onClick={() => setShowPending((v) => !v)}>
              ● {t("gallery.filter.pending")}
            </Chip>
            <Chip active={showMaxed} onClick={() => setShowMaxed((v) => !v)}>
              ✦ {t("gallery.filter.maxed")}
            </Chip>
          </div>
        </div>

        <div className="mb-3.5">
          <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-ink-500 mb-2">
            {t("gallery.filterRarity")}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {RARITY_ORDER.map((r) => {
              const dotBg =
                r === "common"
                  ? "var(--color-rarity-common)"
                  : r === "rare"
                    ? "var(--color-rarity-rare)"
                    : "var(--color-rarity-legendary)";
              return (
                <Chip
                  key={r}
                  active={selectedRarities.has(r)}
                  onClick={() => toggleRarity(r)}
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ background: dotBg }}
                  />
                  {t(`gallery.rarity.${r}`)}
                </Chip>
              );
            })}
          </div>
        </div>

        <div className="mb-3.5">
          <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-ink-500 mb-2">
            {t("gallery.filterChapter")}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {ALL_COLLECTIONS.map((c) => (
              <Chip
                key={c}
                active={selectedCollections.has(c)}
                onClick={() => toggleCollection(c)}
              >
                {COLLECTION_LABELS[c].en}
              </Chip>
            ))}
          </div>
        </div>

        {!isDefaultFilters && (
          <button
            onClick={resetFilters}
            className="text-xs text-clay-500 hover:text-clay-600 underline underline-offset-2 mb-2 block"
          >
            {t("gallery.resetFilters")}
          </button>
        )}

        <button
          onClick={onClose}
          style={{ marginBottom: 24 }}
          className="w-full bg-clay-500 hover:bg-clay-600 text-cream-50 rounded-full py-3 font-sans font-semibold text-sm transition-colors mt-2"
        >
          {t("gallery.applyFilters")}
        </button>
      </div>
    </>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[12px] font-medium transition-all duration-200 ${
        active
          ? "bg-cream-200 text-ink-900 border-cream-400"
          : "bg-cream-100 text-ink-300 border-cream-300"
      }`}
    >
      {children}
    </button>
  );
}
