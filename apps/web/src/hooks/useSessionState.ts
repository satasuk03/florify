import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "florify:gallery-filters";

interface GalleryFilters {
  search: string;
  showFilters: boolean;
  selectedRarities: string[];
  selectedCollections: string[];
  showMode: "all" | "found" | "missing";
  showPending: boolean;
  showMaxed: boolean;
}

const DEFAULT_FILTERS: GalleryFilters = {
  search: "",
  showFilters: false,
  selectedRarities: [],
  selectedCollections: [],
  showMode: "found",
  showPending: false,
  showMaxed: false,
};

function loadFilters(): GalleryFilters | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GalleryFilters;
  } catch {
    return null;
  }
}

function saveFilters(filters: GalleryFilters) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  } catch {
    // ignore quota errors
  }
}

export function useGalleryFilters(
  allRarities: string[],
  allCollections: string[],
) {
  const saved = loadFilters();

  const [search, setSearch] = useState(saved?.search ?? DEFAULT_FILTERS.search);
  const [showFilters, setShowFilters] = useState(
    saved?.showFilters ?? DEFAULT_FILTERS.showFilters,
  );
  const [selectedRarities, setSelectedRarities] = useState<Set<string>>(
    () =>
      new Set(
        saved?.selectedRarities && saved.selectedRarities.length > 0
          ? saved.selectedRarities
          : allRarities,
      ),
  );
  const [selectedCollections, setSelectedCollections] = useState<Set<string>>(
    () =>
      new Set(
        saved?.selectedCollections && saved.selectedCollections.length > 0
          ? saved.selectedCollections
          : allCollections,
      ),
  );
  const [showMode, setShowMode] = useState<"all" | "found" | "missing">(
    saved?.showMode ?? DEFAULT_FILTERS.showMode,
  );
  const [showPending, setShowPending] = useState(
    saved?.showPending ?? DEFAULT_FILTERS.showPending,
  );
  const [showMaxed, setShowMaxed] = useState(
    saved?.showMaxed ?? DEFAULT_FILTERS.showMaxed,
  );

  // Persist to sessionStorage whenever any filter changes
  useEffect(() => {
    saveFilters({
      search,
      showFilters,
      selectedRarities: [...selectedRarities],
      selectedCollections: [...selectedCollections],
      showMode,
      showPending,
      showMaxed,
    });
  }, [
    search,
    showFilters,
    selectedRarities,
    selectedCollections,
    showMode,
    showPending,
    showMaxed,
  ]);

  const resetFilters = useCallback(() => {
    setSelectedRarities(new Set(allRarities));
    setSelectedCollections(new Set(allCollections));
    setShowMode("found");
    setShowPending(false);
    setShowMaxed(false);
  }, [allRarities, allCollections]);

  return {
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
  };
}
