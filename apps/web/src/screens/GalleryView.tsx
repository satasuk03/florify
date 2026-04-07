'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/Card';
import { RarityBadge } from '@/components/RarityBadge';
import { BackIcon } from '@/components/icons';
import { FloraImage } from '@/components/FloraImage';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { useGameStore } from '@/store/gameStore';
import { gameEventBus } from '@/lib/gameEventBus';
import { SPECIES, SpeciesCollection } from '@/data/species';
import type { SpeciesDef } from '@/data/species';
import type { Rarity } from '@florify/shared';
import { useT } from '@/i18n/useT';

/* ── Collection display names ───────────────────────────────────── */
const COLLECTION_LABELS: Record<SpeciesCollection, { th: string; en: string }> = {
  [SpeciesCollection.Original]: { th: 'Original', en: 'Original' },
  [SpeciesCollection.ChineseGarden]: { th: 'Chinese Garden', en: 'Chinese Garden' },
};

const RARITY_ORDER: Rarity[] = ['common', 'rare', 'legendary'];

const ALL_COLLECTIONS = Object.values(SpeciesCollection);

/* ── Icons (inline SVGs to avoid extra deps) ────────────────────── */
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-30">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

/* ── Main component ─────────────────────────────────────────────── */
export function GalleryView() {
  const t = useT();
  const collection = useGameStore((s) => s.state.collection);
  const unlocked = useGameStore((s) => s.uniqueSpeciesUnlocked());
  const hydrated = useGameStore((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated) return;
    gameEventBus.emit({ type: 'visit' });
  }, [hydrated]);
  const totalHarvested = collection.reduce((sum, c) => sum + c.count, 0);

  // Build a set of discovered speciesIds for quick lookup
  const discoveredSet = useMemo(
    () => new Set(collection.map((c) => c.speciesId)),
    [collection],
  );

  /* ── Filter state ────────────────────────────────────────────── */
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRarities, setSelectedRarities] = useState<Set<Rarity>>(
    new Set(RARITY_ORDER),
  );
  const [selectedCollections, setSelectedCollections] = useState<Set<SpeciesCollection>>(
    new Set(ALL_COLLECTIONS),
  );
  const [showMode, setShowMode] = useState<'all' | 'found' | 'missing'>('found');

  const toggleRarity = (r: Rarity) => {
    setSelectedRarities((prev) => {
      const next = new Set(prev);
      if (next.has(r)) next.delete(r);
      else next.add(r);
      return next;
    });
  };

  const toggleCollection = (c: SpeciesCollection) => {
    setSelectedCollections((prev) => {
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
      if (showMode === 'found' && !isFound) return false;
      if (showMode === 'missing' && isFound) return false;
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
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => {
      // Rarity: legendary first, then rare, then common
      const rarityRank: Record<Rarity, number> = { legendary: 0, rare: 1, common: 2 };
      const rDiff = rarityRank[a.rarity] - rarityRank[b.rarity];
      if (rDiff !== 0) return rDiff;
      // Within same rarity: higher ID first
      return b.id - a.id;
    });
  }, [search, selectedRarities, selectedCollections, showMode, discoveredSet]);

  const isDefaultFilters =
    selectedRarities.size === RARITY_ORDER.length &&
    selectedCollections.size === ALL_COLLECTIONS.length &&
    showMode === 'all';

  const activeFilterCount =
    (RARITY_ORDER.length - selectedRarities.size) +
    (ALL_COLLECTIONS.length - selectedCollections.size) +
    (showMode !== 'all' ? 1 : 0);

  return (
    <div className="min-h-full h-full overflow-y-auto bg-cream-50 safe-top safe-bottom px-4 pb-24 scrollbar-elegant">
      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="flex items-center justify-between py-4 animate-fade-down">
        <Link
          href="/"
          className="w-10 h-10 flex items-center justify-center text-ink-700 hover:bg-cream-100 rounded-full transition-all duration-300 ease-out hover:-translate-x-0.5"
          aria-label={t('gallery.back')}
        >
          <BackIcon />
        </Link>
        <h1 className="text-xl font-serif">{t('gallery.title')}</h1>
        <div className="w-10" aria-hidden />
      </header>

      {/* ── Stats row ───────────────────────────────────────────── */}
      <section className="grid grid-cols-2 gap-3 text-center mb-4">
        <Card className="p-3 animate-fade-up" style={{ animationDelay: '80ms' }}>
          <div className="text-3xl font-serif text-ink-900 tabular-nums">
            <AnimatedNumber value={totalHarvested} />
          </div>
          <div className="text-xs text-ink-500 mt-1">{t('gallery.harvested')}</div>
        </Card>
        <Card className="p-3 animate-fade-up" style={{ animationDelay: '160ms' }}>
          <div className="text-3xl font-serif text-ink-900 tabular-nums">
            <AnimatedNumber value={unlocked} /> / <AnimatedNumber value={SPECIES.length} duration={1400} />
          </div>
          <div className="text-xs text-ink-500 mt-1">{t('gallery.speciesUnlocked')}</div>
        </Card>
      </section>

      {/* ── Search bar ──────────────────────────────────────────── */}
      <section className="mt-4 animate-fade-up" style={{ animationDelay: '200ms' }}>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300">
              <SearchIcon />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('gallery.searchPlaceholder')}
              className="w-full pl-9 pr-3 py-2.5 bg-cream-100 border border-cream-300 rounded-xl text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none focus:border-clay-400 focus:ring-1 focus:ring-clay-400/30 transition-all duration-200"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-700 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
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
                ? 'bg-clay-500 border-clay-600 text-cream-50'
                : 'bg-cream-100 border-cream-300 text-ink-700 hover:bg-cream-200'
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
                {t('gallery.filterStatus')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {(['all', 'found', 'missing'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setShowMode(mode)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      showMode === mode
                        ? 'bg-leaf-500 text-cream-50 shadow-sm'
                        : 'bg-cream-200 text-ink-700 hover:bg-cream-300'
                    }`}
                  >
                    {t(`gallery.filter.${mode}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Rarity checkboxes */}
            <div>
              <h3 className="text-xs font-medium text-ink-500 uppercase tracking-wider mb-2">
                {t('gallery.filterRarity')}
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
                          ? 'bg-cream-200 text-ink-900 border border-cream-400'
                          : 'bg-cream-100 text-ink-300 border border-cream-200 line-through'
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all duration-200 ${
                          active
                            ? r === 'common'
                              ? 'bg-rarity-common border-rarity-common text-cream-50'
                              : r === 'rare'
                                ? 'bg-rarity-rare border-rarity-rare text-cream-50'
                                : 'bg-rarity-legendary border-rarity-legendary text-cream-50'
                            : 'border-cream-300 bg-cream-100'
                        }`}
                      >
                        {active && <CheckIcon />}
                      </span>
                      {r === 'common' ? t('gallery.rarity.common') : r === 'rare' ? t('gallery.rarity.rare') : t('gallery.rarity.legendary')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Collection checkboxes */}
            <div>
              <h3 className="text-xs font-medium text-ink-500 uppercase tracking-wider mb-2">
                {t('gallery.filterCollection')}
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
                          ? 'bg-cream-200 text-ink-900 border border-cream-400'
                          : 'bg-cream-100 text-ink-300 border border-cream-200 line-through'
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all duration-200 ${
                          active
                            ? 'bg-leaf-500 border-leaf-500 text-cream-50'
                            : 'border-cream-300 bg-cream-100'
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
                onClick={() => {
                  setSelectedRarities(new Set(RARITY_ORDER));
                  setSelectedCollections(new Set(ALL_COLLECTIONS));
                  setShowMode('all');
                }}
                className="text-xs text-clay-500 hover:text-clay-600 underline underline-offset-2 transition-colors"
              >
                {t('gallery.resetFilters')}
              </button>
            )}
          </Card>
        </section>
      )}

      {/* ── Result count ────────────────────────────────────────── */}
      <div className="flex items-center justify-between mt-4 mb-3 animate-fade-up" style={{ animationDelay: '340ms' }}>
        <span className="text-xs text-ink-500">
          {t('gallery.showing', { count: String(filtered.length), total: String(SPECIES.length) })}
        </span>
      </div>

      {/* ── Species grid ────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="text-center text-ink-500 text-sm mt-16 animate-fade-in">
          {search ? t('gallery.noResults') : t('gallery.empty')}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {filtered.map((sp, i) => {
            const isFound = discoveredSet.has(sp.id);
            const entry = isFound
              ? collection.find((c) => c.speciesId === sp.id)
              : null;

            return isFound ? (
              <Link
                key={sp.id}
                href={{ pathname: '/gallery/detail', query: { speciesId: String(sp.id) } }}
                className="group block animate-fade-up"
                style={{ animationDelay: `${Math.min(i, 12) * 40 + 100}ms` }}
              >
                <GalleryTile species={sp} count={entry?.count ?? 1} />
              </Link>
            ) : (
              <div
                key={sp.id}
                className="block animate-fade-up"
                style={{ animationDelay: `${Math.min(i, 12) * 40 + 100}ms` }}
              >
                <LockedTile species={sp} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Discovered tile ────────────────────────────────────────────── */
function GalleryTile({
  species,
  count,
}: {
  species: SpeciesDef;
  count: number;
}) {
  return (
    <div>
      <Card className="overflow-hidden aspect-[3/4] relative group-hover:-translate-y-1 group-hover:shadow-soft-md">
        <FloraImage
          speciesId={species.id}
          progress={1}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute top-1 right-1">
          <RarityBadge rarity={species.rarity} />
        </div>
        {count > 1 && (
          <div className="absolute bottom-1 left-1 bg-ink-900/60 text-cream-50 text-[10px] font-medium px-1.5 py-0.5 rounded-full backdrop-blur-sm">
            ×{count}
          </div>
        )}
      </Card>
      <div className="text-xs mt-1 text-ink-700 truncate">{species.name}</div>
    </div>
  );
}

/* ── Locked / undiscovered tile ─────────────────────────────────── */
function LockedTile({ species }: { species: SpeciesDef }) {
  return (
    <div>
      <Card className="overflow-hidden aspect-[3/4] relative bg-cream-200/60">
        {/* Silhouette layer — blurred, desaturated, darkened */}
        <div className="absolute inset-0 opacity-[0.07]">
          <FloraImage
            speciesId={species.id}
            progress={1}
            className="w-full h-full object-cover blur-[6px] scale-110"
          />
        </div>
        {/* Mystery overlay with grain texture */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-1.5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
          }}
        >
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
}
