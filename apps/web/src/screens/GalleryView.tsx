"use client";

import { useState, useMemo, useEffect, useRef, useCallback, memo } from "react";
import Link from "next/link";
import { Card } from "@/components/Card";
import { RarityBadge } from "@/components/RarityBadge";
import { BackIcon } from "@/components/icons";
import { FloraImage } from "@/components/FloraImage";
import { ShinyOverlay } from "@/components/flora-level/ShinyOverlay";
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
import { useGalleryFilters } from "@/hooks/useSessionState";

const RARITY_ORDER: Rarity[] = ["common", "rare", "legendary"];

/* ── Icons (inline SVGs to avoid extra deps) ────────────────────── */
function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
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

function FilterIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-30"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

/* ── Main component ─────────────────────────────────────────────── */
export function GalleryView() {
  const t = useT();
  const collection = useGameStore((s) => s.state.collection);
  const floraLevels = useGameStore((s) => s.state.floraLevels);
  const unlocked = useGameStore((s) => s.uniqueSpeciesUnlocked());
  const hydrated = useGameStore((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated) return;
    gameEventBus.emit({ type: "visit" });
  }, [hydrated]);
  const totalHarvested = collection.reduce((sum, c) => sum + c.count, 0);

  // Build maps for quick lookup — O(1) instead of O(n) per tile
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
      // Rarity filter
      if (!selectedRarities.has(sp.rarity)) return false;
      // Collection filter
      if (!selectedCollections.has(sp.collection)) return false;
      // Found/missing filter
      const isFound = discoveredSet.has(sp.id);
      if (showMode === "found" && !isFound) return false;
      if (showMode === "missing" && isFound) return false;
      // Flora Level filters
      const entry = floraLevels[sp.id];
      if (showPending) {
        if (!canMergeFloraLevel(entry)) return false;
      }
      if (showMaxed) {
        if (!entry || entry.level !== FLORA_MAX_LEVEL) return false;
      }
      // Search
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
      // Rarity: legendary first, then rare, then common
      const rarityRank: Record<Rarity, number> = {
        legendary: 0,
        rare: 1,
        common: 2,
      };
      const rDiff = rarityRank[a.rarity] - rarityRank[b.rarity];
      if (rDiff !== 0) return rDiff;
      // Within same rarity: higher ID first
      return b.id - a.id;
    });
  }, [search, selectedRarities, selectedCollections, showMode, discoveredSet, showPending, showMaxed, floraLevels]);

  /* ── Total species per collection (for progression display) ───── */
  const collectionTotals = useMemo(() => {
    const totals = new Map<SpeciesCollection, number>();
    for (const col of ALL_COLLECTIONS) {
      totals.set(col, SPECIES.filter((sp) => sp.collection === col).length);
    }
    return totals;
  }, []);

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
    showMode === "all" &&
    !showPending &&
    !showMaxed;

  const activeFilterCount =
    RARITY_ORDER.length -
    selectedRarities.size +
    (ALL_COLLECTIONS.length - selectedCollections.size) +
    (showMode !== "all" ? 1 : 0) +
    (showPending ? 1 : 0) +
    (showMaxed ? 1 : 0);

  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      className="relative min-h-full h-full overflow-y-auto bg-cream-50 safe-top safe-bottom px-4 pb-24 scrollbar-elegant"
    >
      {/* ── Header (sticky) ─────────────────────────────────────── */}
      <header className="sticky top-0 z-20 flex items-center justify-between py-3 bg-cream-50/90 backdrop-blur-sm -mx-4 px-4 animate-fade-down">
        <Link
          href="/"
          className="w-10 h-10 flex items-center justify-center text-ink-700 hover:bg-cream-100 rounded-full transition-all duration-300 ease-out hover:-translate-x-0.5"
          aria-label={t("gallery.back")}
        >
          <BackIcon />
        </Link>
        <h1 className="text-xl font-serif">{t("gallery.title")}</h1>
        <div className="w-10" aria-hidden />
      </header>

      {/* ── Stats row ───────────────────────────────────────────── */}
      <section className="grid grid-cols-2 gap-3 text-center mb-4">
        <Card
          className="p-3 animate-fade-up"
          style={{ animationDelay: "80ms" }}
        >
          <div className="text-3xl font-serif text-ink-900 tabular-nums">
            <AnimatedNumber value={totalHarvested} />
          </div>
          <div className="text-xs text-ink-500 mt-1">
            {t("gallery.harvested")}
          </div>
        </Card>
        <Card
          className="p-3 animate-fade-up"
          style={{ animationDelay: "160ms" }}
        >
          <div className="text-3xl font-serif text-ink-900 tabular-nums">
            <AnimatedNumber value={unlocked} /> /{" "}
            <AnimatedNumber value={SPECIES.length} duration={1400} />
          </div>
          <div className="text-xs text-ink-500 mt-1">
            {t("gallery.speciesUnlocked")}
          </div>
        </Card>
      </section>

      {/* ── Search bar ──────────────────────────────────────────── */}
      <section
        className="mt-4 animate-fade-up"
        style={{ animationDelay: "200ms" }}
      >
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300">
              <SearchIcon />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("gallery.searchPlaceholder")}
              className="w-full pl-9 pr-3 py-2.5 bg-cream-100 border border-cream-300 rounded-xl text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none focus:border-clay-400 focus:ring-1 focus:ring-clay-400/30 transition-all duration-200"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-700 transition-colors"
              >
                <svg
                  width="14"
                  height="14"
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
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
              showFilters || !isDefaultFilters
                ? "bg-clay-500 border-clay-600 text-cream-50"
                : "bg-cream-100 border-cream-300 text-ink-700 hover:bg-cream-200"
            }`}
          >
            <FilterIcon />
            {activeFilterCount > 0 && (
              <span className="bg-cream-50/90 text-clay-600 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </section>

      {/* ── Filter panel ────────────────────────────────────────── */}
      {showFilters && (
        <section className="mt-3 animate-fade-up">
          <Card className="p-4 space-y-4">
            {/* Discovery status */}
            <div>
              <h3 className="text-xs font-medium text-ink-500 uppercase tracking-wider mb-2">
                {t("gallery.filterStatus")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {(["all", "found", "missing"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setShowMode(mode)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      showMode === mode
                        ? "bg-leaf-500 text-cream-50 shadow-sm"
                        : "bg-cream-200 text-ink-700 hover:bg-cream-300"
                    }`}
                  >
                    {t(`gallery.filter.${mode}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Flora level filters */}
            <div>
              <h3 className="text-xs font-medium text-ink-500 uppercase tracking-wider mb-2">
                {t("gallery.filterStatus")} Lv
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setShowPending((v) => !v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    showPending
                      ? "bg-yellow-400 text-ink-900 shadow-sm"
                      : "bg-cream-200 text-ink-700 hover:bg-cream-300"
                  }`}
                >
                  ● {t("gallery.filter.pending")}
                </button>
                <button
                  type="button"
                  onClick={() => setShowMaxed((v) => !v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    showMaxed
                      ? "bg-amber-500 text-cream-50 shadow-sm"
                      : "bg-cream-200 text-ink-700 hover:bg-cream-300"
                  }`}
                >
                  ✦ {t("gallery.filter.maxed")}
                </button>
              </div>
            </div>

            {/* Rarity checkboxes */}
            <div>
              <h3 className="text-xs font-medium text-ink-500 uppercase tracking-wider mb-2">
                {t("gallery.filterRarity")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {RARITY_ORDER.map((r) => {
                  const active = selectedRarities.has(r);
                  return (
                    <button
                      key={r}
                      onClick={() => toggleRarity(r)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                        active
                          ? "bg-cream-200 text-ink-900 border border-cream-400"
                          : "bg-cream-100 text-ink-300 border border-cream-200 line-through"
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all duration-200 ${
                          active
                            ? r === "common"
                              ? "bg-rarity-common border-rarity-common text-cream-50"
                              : r === "rare"
                                ? "bg-rarity-rare border-rarity-rare text-cream-50"
                                : "bg-rarity-legendary border-rarity-legendary text-cream-50"
                            : "border-cream-300 bg-cream-100"
                        }`}
                      >
                        {active && <CheckIcon />}
                      </span>
                      {r === "common"
                        ? t("gallery.rarity.common")
                        : r === "rare"
                          ? t("gallery.rarity.rare")
                          : t("gallery.rarity.legendary")}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Collection checkboxes */}
            <div>
              <h3 className="text-xs font-medium text-ink-500 uppercase tracking-wider mb-2">
                {t("gallery.filterCollection")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {ALL_COLLECTIONS.map((c) => {
                  const active = selectedCollections.has(c);
                  return (
                    <button
                      key={c}
                      onClick={() => toggleCollection(c)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                        active
                          ? "bg-cream-200 text-ink-900 border border-cream-400"
                          : "bg-cream-100 text-ink-300 border border-cream-200 line-through"
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all duration-200 ${
                          active
                            ? "bg-leaf-500 border-leaf-500 text-cream-50"
                            : "border-cream-300 bg-cream-100"
                        }`}
                      >
                        {active && <CheckIcon />}
                      </span>
                      {COLLECTION_LABELS[c].en}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reset filters */}
            {!isDefaultFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-clay-500 hover:text-clay-600 underline underline-offset-2 transition-colors"
              >
                {t("gallery.resetFilters")}
              </button>
            )}
          </Card>
        </section>
      )}

      {/* ── Result count ────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between mt-4 mb-3 animate-fade-up"
        style={{ animationDelay: "340ms" }}
      >
        <span className="text-xs text-ink-500">
          {t("gallery.showing", {
            count: String(filtered.length),
            total: String(SPECIES.length),
          })}
        </span>
      </div>

      {/* ── Species grid grouped by collection ────────────────── */}
      {filtered.length === 0 ? (
        <div className="text-center text-ink-500 text-sm mt-16 animate-fade-in">
          {search ? t("gallery.noResults") : t("gallery.empty")}
        </div>
      ) : (
        <div className="space-y-6">
          {groupedByCollection.map((group, gi) => {
            const label = COLLECTION_LABELS[group.collection];
            const countInGroup = group.species.filter((sp) =>
              discoveredSet.has(sp.id),
            ).length;
            return (
              <section key={group.collection}>
                {/* Section header — hide if only one collection visible */}
                {groupedByCollection.length > 1 && (
                  <div className="sticky top-[52px] z-10 flex items-center gap-2 mb-3 py-2 bg-cream-50/90 backdrop-blur-sm -mx-4 px-4">
                    <h2 className="text-sm font-serif text-ink-800">
                      {label.en}
                    </h2>
                    <span className="text-[10px] text-ink-400 tabular-nums">
                      {countInGroup}/
                      {collectionTotals.get(group.collection) ??
                        group.species.length}
                    </span>
                    <div className="flex-1 border-b border-cream-300/60" />
                  </div>
                )}
                <div className="grid grid-cols-3 gap-3">
                  {group.species.map((sp, i) => {
                    const isFound = discoveredSet.has(sp.id);
                    const collEntry = isFound
                      ? collectionMap.get(sp.id)
                      : undefined;
                    // Only animate first 12 tiles of the first group
                    const animate = gi === 0 && i < 12;

                    // Flora level data for this tile
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
                            containIntrinsicSize: "auto 140px",
                          } as React.CSSProperties
                        }
                      >
                        <GalleryTile
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
                            containIntrinsicSize: "auto 140px",
                          } as React.CSSProperties
                        }
                      >
                        <LockedTile species={sp} />
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
    </div>
  );
}

/* ── Discovered tile ────────────────────────────────────────────── */
const GalleryTile = memo(function GalleryTile({
  species,
  count,
  level,
  canMerge,
}: {
  species: SpeciesDef;
  count: number;
  level: number | null;
  canMerge: boolean;
}) {
  const frameTier =
    level === null || level <= 1
      ? null
      : level <= 2
        ? "fl-frame-tier-1"
        : level <= 4
          ? "fl-frame-tier-2"
          : "fl-frame-tier-3";
  const frameRarity = `fl-frame-${species.rarity}`;

  return (
    <div>
      <Card
        className={`overflow-hidden aspect-[3/4] relative group-hover:shadow-soft-md`}
      >
        {level === FLORA_MAX_LEVEL ? (
          <ShinyOverlay rarity={species.rarity}>
            <FloraImage
              speciesId={species.id}
              progress={1}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
          </ShinyOverlay>
        ) : (
          <FloraImage
            speciesId={species.id}
            progress={1}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        )}
        {/* Flora Level frame overlay — sits above image, below badges */}
        {frameTier !== null && (
          <div
            aria-hidden
            className={`fl-frame-overlay ${frameTier} ${frameRarity}`}
          />
        )}
        {/* Rarity badge — top-right */}
        <div className="absolute top-1 right-1">
          <RarityBadge rarity={species.rarity} />
        </div>
        {/* Pending merge dot — below rarity badge, top-right */}
        {canMerge && (
          <span
            aria-label="pending merges"
            className="absolute top-7 right-1.5 w-2 h-2 rounded-full bg-yellow-400 animate-pulse"
          />
        )}
        {/* Harvest count — bottom-left (existing position preserved) */}
        {count > 1 && (
          <div className="absolute bottom-1 left-1 bg-ink-900/60 text-cream-50 text-[10px] font-medium px-1.5 py-0.5 rounded-full backdrop-blur-sm">
            ×{count}
          </div>
        )}
        {/* Level badge — bottom-right */}
        {level !== null && (
          <span
            className={`absolute bottom-1 right-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
              level === FLORA_MAX_LEVEL
                ? "bg-cream-50/90 text-amber-700 ring-1 ring-amber-400"
                : "bg-cream-50/80 text-ink-700"
            }`}
          >
            {level === FLORA_MAX_LEVEL ? "✦ Lv 5 ✦" : `Lv ${level}`}
          </span>
        )}
      </Card>
      <div className="text-xs mt-1 text-ink-700 truncate">{species.name}</div>
    </div>
  );
});

/* ── Locked / undiscovered tile ─────────────────────────────────── */
const LockedTile = memo(function LockedTile({
  species,
}: {
  species: SpeciesDef;
}) {
  return (
    <div>
      <Card className="overflow-hidden aspect-[3/4] relative bg-cream-200/60">
        {/* Mystery overlay — CSS-only, no image load for locked species */}
        <div className="absolute inset-0 bg-cream-300/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
          <LockIcon />
          <span className="text-[9px] text-ink-300 font-medium">???</span>
        </div>
        <div className="absolute top-1 right-1">
          <RarityBadge rarity={species.rarity} />
        </div>
      </Card>
      <div className="text-xs mt-1 text-ink-300 truncate italic">???</div>
    </div>
  );
});
