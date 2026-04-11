"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ACHIEVEMENTS } from "@/data/achievements";
import { useGameStore } from "@/store/gameStore";
import { CheckIcon } from "@/components/icons";
import { useLanguage } from "@/i18n/useT";
import type { PassportTitleSource } from "@florify/shared";
import { FLORA_MAX_LEVEL } from "@florify/shared";
import { SPECIES_BY_ID } from "@/data/species";
import type { SpeciesDef } from "@/data/species";

interface Props {
  onClose: () => void;
  /** Text shown for the "Auto" fallback, e.g. "Gardener". */
  currentRank: string;
}

/** Match globals.css `sheet-down` / `overlay-out` duration. */
const EXIT_DURATION_MS = 260;

type TitleTab = 'achievements' | 'legendary';

/**
 * Modal for picking the passport title from claimed achievements or Legendary epithets.
 *
 * Opens over FloristCardSheet (z-50 > sheet's z-40). Writes immediately
 * on selection via setPassportTitle, then closes.
 */
export function TitleChangeModal({ onClose, currentRank }: Props) {
  const state = useGameStore((s) => s.state);
  const setPassportTitle = useGameStore((s) => s.setPassportTitle);
  const titleSource = state.passportCustomization.titleSource;
  const floraLevels = state.floraLevels;
  const collection = state.collection;
  const lang = useLanguage();

  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<TitleTab>(
    titleSource.type === 'epithet' ? 'legendary' : 'achievements',
  );
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef<number | null>(null);

  // Play the exit animation, then signal the parent to unmount us.
  const beginClose = useCallback(() => {
    if (closing) return;
    setClosing(true);
    closeTimer.current = window.setTimeout(() => {
      onClose();
    }, EXIT_DURATION_MS);
  }, [closing, onClose]);

  useEffect(
    () => () => {
      if (closeTimer.current != null) window.clearTimeout(closeTimer.current);
    },
    [],
  );

  const claimed = useMemo(
    () => ACHIEVEMENTS.filter((a) => state.achievements[a.id]?.claimedAt),
    [state.achievements],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return claimed;
    return claimed.filter((a) => {
      if (a.name.toLowerCase().includes(q)) return true;
      if (a.description.th.toLowerCase().includes(q)) return true;
      if (a.description.en.toLowerCase().includes(q)) return true;
      return false;
    });
  }, [claimed, query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") beginClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [beginClose]);

  const handlePick = (source: PassportTitleSource) => {
    setPassportTitle(source);
    beginClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-ink-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center ${
        closing ? "animate-overlay-out" : "animate-overlay-in"
      }`}
      onClick={beginClose}
      role="dialog"
      aria-modal="true"
      aria-label="เลือกฉายา"
    >
      <div
        className={`w-full sm:max-w-md bg-cream-50 rounded-t-3xl sm:rounded-3xl p-6 shadow-soft-lg max-h-[80dvh] flex flex-col ${
          closing ? "animate-sheet-down" : "animate-sheet-up"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-serif text-ink-900">เลือกฉายา</h2>
          <button
            onClick={beginClose}
            aria-label="Close"
            className="text-ink-500 text-2xl leading-none w-10 h-10 flex items-center justify-center hover:bg-cream-100 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Segmented tab control */}
        <div className="flex rounded-xl bg-cream-200 p-1 mb-3 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setTab('achievements')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              tab === 'achievements' ? 'bg-cream-50 text-ink-900 shadow-sm' : 'text-ink-500'
            }`}
          >
            Achievements
          </button>
          <button
            type="button"
            onClick={() => setTab('legendary')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              tab === 'legendary' ? 'bg-cream-50 text-ink-900 shadow-sm' : 'text-ink-500'
            }`}
          >
            Legendary
          </button>
        </div>

        {tab === 'achievements' && (
          <>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหาจากชื่อหรือคำอธิบาย"
              className="w-full px-4 py-2.5 rounded-lg bg-cream-100 border border-cream-200 text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-clay-400 mb-3"
              autoFocus
            />

            {/* Inner padding + extra column gap keeps the ring-2 + hover
                borders on active/hovered rows from getting clipped by the
                scroll container's overflow edge. */}
            <div className="flex-1 overflow-y-auto scrollbar-elegant p-1 flex flex-col gap-2">
              {/* Auto fallback — always on top, never filtered out */}
              <TitleRow
                label={`Auto — ${currentRank}`}
                description="ใช้ rank ของคุณเป็นฉายาโดยอัตโนมัติ"
                selected={titleSource.type === 'auto'}
                onClick={() => handlePick({ type: 'auto' })}
              />

              {claimed.length === 0 && (
                <p className="text-xs text-ink-500 mt-3 text-center">
                  ยังไม่มี Achievement ที่เคลม — ไปเคลมที่แท็บ 🏆 ก่อนนะ
                </p>
              )}

              {filtered.map((a) => (
                <TitleRow
                  key={a.id}
                  label={a.name}
                  description={a.description.th}
                  selected={titleSource.type === 'achievement' && titleSource.id === a.id}
                  onClick={() => handlePick({ type: 'achievement', id: a.id })}
                />
              ))}

              {claimed.length > 0 && filtered.length === 0 && (
                <p className="text-xs text-ink-500 mt-3 text-center">
                  ไม่เจอฉายาที่ตรงกับคำค้น
                </p>
              )}
            </div>
          </>
        )}

        {tab === 'legendary' && (() => {
          type LegendaryRow = { id: number; species: SpeciesDef; level: 1 | 2 | 3 | 4 | 5 };
          const legendaryRows = (collection
            .filter((c) => c.rarity === 'legendary')
            .map((c) => {
              const sp = SPECIES_BY_ID[c.speciesId];
              const level = floraLevels[c.speciesId]?.level ?? 1;
              return { id: c.speciesId, species: sp, level };
            })
            .filter((row) => row.species != null) as LegendaryRow[])
            .sort((a, b) => {
              const aUnlocked = a.level === FLORA_MAX_LEVEL && a.species.epithet != null ? 0 : 1;
              const bUnlocked = b.level === FLORA_MAX_LEVEL && b.species.epithet != null ? 0 : 1;
              if (aUnlocked !== bUnlocked) return aUnlocked - bUnlocked;
              if (aUnlocked === 1) return b.level - a.level; // locked: higher level first
              return a.id - b.id;
            });

          if (legendaryRows.length === 0) {
            return (
              <div className="flex-1 overflow-y-auto scrollbar-elegant p-1 flex items-center justify-center">
                <p className="text-xs text-ink-500 text-center max-w-xs">
                  เก็บพันธุ์ Legendary ก่อนจึงจะมีฉายาให้เลือก
                </p>
              </div>
            );
          }

          return (
            <div className="flex-1 overflow-y-auto scrollbar-elegant p-1 flex flex-col gap-2">
              {legendaryRows.map(({ id, species, level }) => {
                const unlocked = level === FLORA_MAX_LEVEL && species.epithet != null;
                const epithetText = species.epithet ? species.epithet[lang] : species.name;
                const selected =
                  titleSource.type === 'epithet' && titleSource.speciesId === id;
                return (
                  <button
                    key={id}
                    type="button"
                    disabled={!unlocked}
                    onClick={() =>
                      unlocked && handlePick({ type: 'epithet', speciesId: id })
                    }
                    className={`text-left px-3.5 py-3 rounded-lg transition-colors flex items-center gap-2 border-2 ${
                      unlocked
                        ? selected
                          ? 'bg-clay-100 border-clay-400'
                          : 'bg-cream-50 border-cream-200 hover:bg-cream-100'
                        : 'bg-cream-100/50 border-cream-200/50 text-ink-400 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      {unlocked ? (
                        <>
                          <div className="font-serif text-sm fl-rainbow-text">
                            ✦ {epithetText} ✦
                          </div>
                          <div className="text-[11px] text-ink-500 mt-0.5">{species.name}</div>
                        </>
                      ) : (
                        <>
                          <div className="font-semibold text-sm">🔒 {species.name}</div>
                          <div className="text-[11px] text-ink-400 mt-0.5">Lv {level}/{FLORA_MAX_LEVEL}</div>
                        </>
                      )}
                    </div>
                    {selected && unlocked && (
                      <span className="shrink-0 w-6 h-6 rounded-full bg-clay-500 text-cream-50 flex items-center justify-center">
                        <CheckIcon size={14} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })()}
      </div>
    </div>
  );
}

function TitleRow({
  label,
  description,
  selected,
  onClick,
}: {
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left px-3.5 py-3 rounded-lg transition-colors flex items-start gap-2 border-2 ${
        selected
          ? "bg-clay-100 text-ink-900 border-clay-400"
          : "bg-cream-50 text-ink-700 hover:bg-cream-100 border-cream-200"
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm">{label}</div>
        {description && (
          <div className="text-xs text-ink-500 mt-0.5">{description}</div>
        )}
      </div>
      {selected && (
        <span className="shrink-0 w-6 h-6 rounded-full bg-clay-500 text-cream-50 flex items-center justify-center mt-0.5">
          <CheckIcon size={14} />
        </span>
      )}
    </button>
  );
}
