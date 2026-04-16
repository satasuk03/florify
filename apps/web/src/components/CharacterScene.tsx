'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Rarity } from '@florify/shared';
import { useGameStore } from '@/store/gameStore';
import { useT, useLanguage } from '@/i18n/useT';
import { CHARACTERS_BY_ID, characterImagePath } from '@/data/characters';
import { BACKGROUNDS_BY_ID, backgroundImagePath } from '@/data/backgrounds';
import { CoinIcon } from '@/components/icons';

const RARITY_COLOR: Record<Rarity, string> = {
  common: '#8B7355',
  rare: '#4A7A9C',
  legendary: '#9C7A2A',
};
const RARITY_BG: Record<Rarity, string> = {
  common: 'rgba(139,115,85,0.08)',
  rare: 'rgba(74,122,156,0.08)',
  legendary: 'rgba(156,122,42,0.10)',
};

const BG_MAX = 3;
const CHAR_MAX = 8;
const DRIFT_RATE = 0.00025;

type PickKind = 'character' | 'background';

export function CharacterScene() {
  const t = useT();
  const lang = useLanguage();
  const characters = useGameStore((s) => s.state.characters ?? []);
  const backgrounds = useGameStore((s) => s.state.backgrounds ?? []);
  const equippedCharacterId = useGameStore((s) => s.state.equippedCharacterId ?? null);
  const equippedBackgroundId = useGameStore((s) => s.state.equippedBackgroundId ?? null);
  const equipCharacter = useGameStore((s) => s.equipCharacter);
  const equipBackground = useGameStore((s) => s.equipBackground);
  const stats = useGameStore((s) => s.state.stats);
  const streak = useGameStore((s) => s.state.streak);
  const collection = useGameStore((s) => s.state.collection);
  const gold = useGameStore((s) => s.state.gold ?? 0);
  const sprouts = useGameStore((s) => s.state.sprouts);

  const [previewCharId, setPreviewCharId] = useState<number | null>(equippedCharacterId);
  const [previewBgId, setPreviewBgId] = useState<number | null>(equippedBackgroundId);
  const [sheetOpen, setSheetOpen] = useState(true);
  const [sheetTab, setSheetTab] = useState<'stats' | 'customize'>('stats');

  // ── Sheet drag ───────────────────────────────────────────────────
  // sheetOffset: 0 = fully open, positive = dragged down (toward closed).
  // The closed position peeks 10rem. Total travel = 50vh - 10rem.
  const [sheetOffset, setSheetOffset] = useState(0);
  const [sheetDragging, setSheetDragging] = useState(false);
  const sheetDragRef = useRef<{ startY: number; startOffset: number; moved: boolean } | null>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const wasDragRef = useRef(false);

  const getMaxOffset = () => typeof window !== 'undefined' ? window.innerHeight * 0.5 - 160 : 200;
  const SNAP_THRESHOLD = 60;

  useEffect(() => {
    const el = handleRef.current;
    if (!el) return;

    const onDown = (e: PointerEvent) => {
      sheetDragRef.current = { startY: e.clientY, startOffset: sheetOffset, moved: false };
      setSheetDragging(true);
      el.setPointerCapture(e.pointerId);
      e.preventDefault();
    };
    const onMove = (e: PointerEvent) => {
      const d = sheetDragRef.current;
      if (!d) return;
      const dy = e.clientY - d.startY;
      if (Math.abs(dy) > 4) d.moved = true;
      setSheetOffset(Math.max(0, d.startOffset + dy));
    };
    const onUp = () => {
      const d = sheetDragRef.current;
      if (!d) return;
      wasDragRef.current = d.moved;
      sheetDragRef.current = null;
      setSheetDragging(false);
      if (!d.moved) { setSheetOffset(0); return; } // tap — let onClick handle
      // Snap based on drag distance.
      setSheetOffset((cur) => {
        if (sheetOpen) {
          if (cur > SNAP_THRESHOLD) { setSheetOpen(false); return 0; }
          return 0;
        } else {
          if (cur < getMaxOffset() - SNAP_THRESHOLD) { setSheetOpen(true); return 0; }
          return 0;
        }
      });
    };

    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheetOpen, sheetOffset]);

  // ── Parallax ─────────────────────────────────────────────────────
  const sceneRef = useRef<HTMLDivElement>(null);
  const [parallax, setParallax] = useState({ x: 0, charX: 0 });
  const dragRef = useRef<{ startX: number; basis: number } | null>(null);
  const dragOffsetRef = useRef(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = (now - start) * DRIFT_RATE;
      const user = dragOffsetRef.current;
      setParallax({
        x: Math.sin(elapsed) * BG_MAX + user * 0.35,
        charX: Math.sin(elapsed + 1.1) * CHAR_MAX + user,
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    let raf = 0;
    const relax = () => {
      dragOffsetRef.current *= 0.9;
      if (Math.abs(dragOffsetRef.current) < 0.3) { dragOffsetRef.current = 0; return; }
      raf = requestAnimationFrame(relax);
    };
    const onDown = (e: PointerEvent) => {
      const el = sceneRef.current;
      if (!el) return;
      dragRef.current = { startX: e.clientX, basis: dragOffsetRef.current };
      el.setPointerCapture(e.pointerId);
      cancelAnimationFrame(raf);
    };
    const onMove = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      dragOffsetRef.current = Math.max(-CHAR_MAX * 1.2, Math.min(CHAR_MAX * 1.2, d.basis + (e.clientX - d.startX) * 0.6));
    };
    const onUp = () => { if (!dragRef.current) return; dragRef.current = null; raf = requestAnimationFrame(relax); };
    const el = sceneRef.current;
    if (!el) return;
    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => { el.removeEventListener('pointerdown', onDown); window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); window.removeEventListener('pointercancel', onUp); cancelAnimationFrame(raf); };
  }, []);

  const activeCharId = previewCharId ?? equippedCharacterId;
  const activeBgId = previewBgId ?? equippedBackgroundId;
  const charDef = activeCharId != null ? CHARACTERS_BY_ID[activeCharId] : null;
  const bgDef = activeBgId != null ? BACKGROUNDS_BY_ID[activeBgId] : null;

  const handleEquip = (kind: PickKind, id: number | null) => {
    if (kind === 'character') equipCharacter(id);
    else equipBackground(id);
  };

  return (
    <>
      {/* ── Full-bleed parallax scene ──────────────────────── */}
      <div ref={sceneRef} className="absolute inset-0 touch-none select-none cursor-grab active:cursor-grabbing">
        {bgDef ? (
          <div className="absolute inset-0 will-change-transform" style={{ transform: `translate3d(${parallax.x}px, 0, 0) scale(1.05)` }}>
            <Image src={backgroundImagePath(bgDef)} alt={lang === 'th' ? bgDef.nameTH : bgDef.nameEN} fill className="object-cover" unoptimized priority draggable={false} />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-sky-100 to-cream-100" />
        )}
        {charDef ? (
          <div className="absolute inset-x-0 bottom-[12%] h-[72%] flex items-end justify-center will-change-transform" style={{ transform: `translate3d(${parallax.charX}px, 0, 0)` }}>
            <div className="relative w-[55%] max-w-sm h-full">
              <Image src={characterImagePath(charDef)} alt={lang === 'th' ? charDef.nameTH : charDef.nameEN} fill className="object-contain object-bottom drop-shadow-md" unoptimized draggable={false} />
            </div>
          </div>
        ) : (
          <div className="absolute inset-x-0 bottom-[46vh] text-center text-cream-50/60 text-xs italic pointer-events-none">
            {t('cosmetics.placeholderCharacter')}
          </div>
        )}
      </div>

      {/* ── Bottom drawer ─────────────────────────────────── */}
      <div
        className={`absolute left-0 right-0 bottom-0 z-20 ${sheetDragging ? '' : 'transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]'}`}
        style={{
          transform: sheetDragging
            ? `translateY(${sheetOpen ? sheetOffset : getMaxOffset() - sheetOffset}px)`
            : sheetOpen
              ? 'translateY(0)'
              : `translateY(calc(50vh - 10rem))`,
        }}
      >
        {/* Sheet body */}
        <div
          className="overflow-hidden rounded-t-[1.75rem] pointer-events-auto"
          style={{
            background: 'linear-gradient(180deg, rgba(252,249,242,0.94) 0%, rgba(248,244,235,0.97) 100%)',
            backdropFilter: 'blur(24px) saturate(1.6)',
            WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
            boxShadow: '0 -8px 40px rgba(75,55,30,0.10), inset 0 1px 0 rgba(255,255,255,0.5)',
            height: '50vh',
          }}
        >
          <div
            className="h-full flex flex-col"
          >
            {/* ── Drag handle — drag to slide, tap to toggle ── */}
            <div
              ref={handleRef}
              onClick={() => { if (!wasDragRef.current) setSheetOpen((o) => !o); wasDragRef.current = false; }}
              className="w-full flex justify-center pt-3 pb-1.5 cursor-grab active:cursor-grabbing touch-none"
              role="button"
              aria-label={sheetOpen ? 'Collapse' : 'Expand'}
            >
              <div className="w-10 h-1 rounded-full bg-ink-900/15" />
            </div>

            {/* ── Tab bar ────────────────────────────────── */}
            <div className="flex mx-5 mt-1 mb-3 p-0.5 rounded-full" style={{ background: 'rgba(75,55,30,0.06)' }}>
              <SheetTabButton active={sheetTab === 'stats'} onClick={() => setSheetTab('stats')}>
                📊 {t('cosmetics.stats.title')}
              </SheetTabButton>
              <SheetTabButton active={sheetTab === 'customize'} onClick={() => setSheetTab('customize')}>
                ✨ {t('cosmetics.title')}
              </SheetTabButton>
            </div>

            {/* ── Tab content (scrollable, fixed height) ──── */}
            <div
              className="flex-1 min-h-0 overflow-y-auto scrollbar-elegant"
              style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.25rem)' }}
            >
            {sheetTab === 'stats' ? (
              <div key="stats" className="px-5 pb-2">
                {/* Primary stats — 2-column grid with staggered entrance */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <StatCard emoji="🌱" value={stats.totalPlanted} label={t('cosmetics.stats.planted')} color="#6B8E50" delay={0} />
                  <StatCard emoji="🌸" value={stats.totalHarvested} label={t('cosmetics.stats.harvested')} color="#C47A8A" delay={60} />
                  <StatCard emoji="💧" value={stats.totalWatered} label={t('cosmetics.stats.watered')} color="#5A9AB5" delay={120} />
                  <StatCard emoji="🔥" value={streak.currentStreak} label={t('cosmetics.stats.streak')} color="#D4874D" delay={180} />
                </div>
                {/* Rarity harvest count (includes duplicates) */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <RarityCard label={t('cosmetics.rarity.common')} value={stats.harvestByRarity.common} color="#8B7355" delay={240} />
                  <RarityCard label={t('cosmetics.rarity.rare')} value={stats.harvestByRarity.rare} color="#4A7A9C" delay={300} />
                  <RarityCard label={t('cosmetics.rarity.legendary')} value={stats.harvestByRarity.legendary} color="#9C7A2A" delay={360} />
                </div>
                {/* Secondary stats — compact row */}
                <div className="flex gap-1.5 animate-fade-up" style={{ animationDelay: '400ms' }}>
                  <StatChip icon={<CoinIcon size={14} />} value={gold} label={t('cosmetics.stats.gold')} />
                  <StatChip emoji="🌿" value={sprouts} label={t('cosmetics.stats.sprouts')} />
                  <StatChip emoji="📖" value={collection.length} label={t('cosmetics.stats.species')} />
                </div>
              </div>
            ) : (
              <div className="px-5 flex flex-col gap-5">
                <PickerRow
                  heading={t('cosmetics.tab.character')}
                  emptyLabel={t('cosmetics.empty.character')}
                  items={characters.map((c) => {
                    const def = CHARACTERS_BY_ID[c.id];
                    return def ? { id: c.id, count: c.count, img: characterImagePath(def), rarity: def.rarity, name: lang === 'th' ? def.nameTH : def.nameEN } : null;
                  }).filter((x): x is NonNullable<typeof x> => x !== null)}
                  previewedId={previewCharId}
                  equippedId={equippedCharacterId}
                  onPreview={setPreviewCharId}
                  onEquip={(id) => handleEquip('character', id)}
                  onUnequip={() => { handleEquip('character', null); setPreviewCharId(null); }}
                  imgFit="contain"
                />
                <PickerRow
                  heading={t('cosmetics.tab.background')}
                  emptyLabel={t('cosmetics.empty.background')}
                  items={backgrounds.map((b) => {
                    const def = BACKGROUNDS_BY_ID[b.id];
                    return def ? { id: b.id, count: b.count, img: backgroundImagePath(def), rarity: def.rarity, name: lang === 'th' ? def.nameTH : def.nameEN } : null;
                  }).filter((x): x is NonNullable<typeof x> => x !== null)}
                  previewedId={previewBgId}
                  equippedId={equippedBackgroundId}
                  onPreview={setPreviewBgId}
                  onEquip={(id) => handleEquip('background', id)}
                  onUnequip={() => { handleEquip('background', null); setPreviewBgId(null); }}
                  imgFit="cover"
                />
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Sub-components ──────────────────────────────────────────────────

function SheetTabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`flex-1 text-center py-1.5 rounded-full text-[11px] font-bold tracking-wide transition-all duration-200 ${
        active
          ? 'bg-cream-50 text-ink-900 shadow-sm'
          : 'text-ink-400 hover:text-ink-600'
      }`}
    >
      {children}
    </button>
  );
}

/** Animated counter that rolls up from 0 on mount. */
function useAnimatedCount(target: number, durationMs = 600) {
  const [display, setDisplay] = useState(0);
  const ref = useRef({ start: 0, raf: 0 });
  useEffect(() => {
    const { current: ctx } = ref;
    const startTime = performance.now();
    ctx.start = startTime;
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target));
      if (progress < 1) ctx.raf = requestAnimationFrame(tick);
    };
    ctx.raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ctx.raf);
  }, [target, durationMs]);
  return display;
}

function StatCard({ emoji, value, label, color, delay = 0 }: { emoji: string; value: number; label: string; color: string; delay?: number }) {
  const count = useAnimatedCount(value);
  return (
    <div
      className="rounded-2xl px-3.5 py-3 flex items-center gap-3 animate-fade-up"
      style={{ background: `${color}0d`, border: `1px solid ${color}18`, animationDelay: `${delay}ms` }}
    >
      <span className="text-lg">{emoji}</span>
      <div className="flex flex-col leading-none">
        <span className="font-mono text-lg font-bold tabular-nums" style={{ color }}>{count.toLocaleString()}</span>
        <span className="text-[9px] text-ink-400 font-semibold uppercase tracking-wider mt-0.5">{label}</span>
      </div>
    </div>
  );
}

function RarityCard({ label, value, color, delay = 0 }: { label: string; value: number; color: string; delay?: number }) {
  const count = useAnimatedCount(value);
  return (
    <div
      className="rounded-xl py-2.5 flex flex-col items-center gap-1 animate-fade-up"
      style={{ background: `${color}0d`, border: `1px solid ${color}18`, animationDelay: `${delay}ms` }}
    >
      <span className="font-mono text-xl font-bold tabular-nums" style={{ color }}>{count.toLocaleString()}</span>
      <span className="text-[8px] font-bold uppercase tracking-wider text-ink-400">{label}</span>
    </div>
  );
}

function StatChip({ emoji, icon, value, label }: { emoji?: string; icon?: React.ReactNode; value: number; label: string }) {
  return (
    <div className="flex-shrink-0 flex items-center gap-1.5 rounded-xl bg-ink-900/[0.04] px-2.5 py-1.5">
      {icon ?? <span className="text-xs">{emoji}</span>}
      <div className="flex flex-col leading-none">
        <span className="font-mono text-[13px] font-bold text-ink-800 tabular-nums">{value.toLocaleString()}</span>
        <span className="text-[8px] text-ink-400 font-medium uppercase tracking-wider mt-0.5">{label}</span>
      </div>
    </div>
  );
}

interface PickerItem {
  id: number;
  count: number;
  img: string;
  rarity: Rarity;
  name: string;
}

function PickerRow({
  heading,
  emptyLabel,
  items,
  previewedId,
  equippedId,
  onPreview,
  onEquip,
  onUnequip,
  imgFit,
}: {
  heading: string;
  emptyLabel: string;
  items: PickerItem[];
  previewedId: number | null;
  equippedId: number | null;
  onPreview: (id: number) => void;
  onEquip: (id: number) => void;
  onUnequip: () => void;
  imgFit: 'cover' | 'contain';
}) {
  const t = useT();
  const lang = useLanguage();
  const previewed = items.find((i) => i.id === previewedId) ?? null;
  const canEquip = previewed && previewed.id !== equippedId;

  return (
    <section className="animate-fade-up">
      {/* Section heading with clay accent line */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-1 h-4 rounded-full bg-clay-500" />
        <h2 className="flex-1 font-serif text-sm font-bold text-ink-800">{heading}</h2>
        {items.length > 0 && previewed && (
          canEquip ? (
            <button
              type="button"
              onClick={() => onEquip(previewed.id)}
              className="rounded-full px-4 py-1.5 text-[11px] font-bold bg-clay-500 text-cream-50 shadow-sm transition-all active:scale-95 hover:bg-clay-600"
            >
              {t('cosmetics.equip')}
            </button>
          ) : (
            <button
              type="button"
              onClick={onUnequip}
              className="rounded-full px-4 py-1.5 text-[11px] font-bold text-clay-500 border border-clay-400/30 bg-clay-400/[0.06] transition-all active:scale-95"
            >
              ✓ {t('cosmetics.equipped')}
            </button>
          )
        )}
      </div>

      {items.length === 0 ? (
        <div
          className="flex items-center gap-3 py-5 px-4 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(199,130,90,0.05) 0%, rgba(199,130,90,0.02) 100%)',
            border: '1.5px dashed var(--color-clay-400)',
            borderColor: 'rgba(199,130,90,0.25)',
          }}
        >
          <div className="flex-1 text-xs text-ink-400 italic">{emptyLabel}</div>
          <Link
            href="/shop"
            className="flex-shrink-0 rounded-full px-4 py-1.5 bg-clay-500 text-cream-50 text-[11px] font-bold shadow-sm hover:bg-clay-600 transition-colors"
          >
            {t('cosmetics.gotoShop')}
          </Link>
        </div>
      ) : (
        <div className="flex gap-2.5 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1">
          {items.map((it, i) => {
            const isEquipped = equippedId === it.id;
            const isPreviewed = previewedId === it.id;
            return (
              <button
                key={it.id}
                type="button"
                onClick={() => onPreview(it.id)}
                className={`relative flex-shrink-0 w-[76px] rounded-2xl overflow-hidden transition-all duration-250 animate-fade-up ${
                  isPreviewed
                    ? 'scale-[0.95]'
                    : 'hover:scale-[1.03]'
                }`}
                style={{
                  animationDelay: `${i * 50}ms`,
                  border: isPreviewed
                    ? '2.5px solid var(--color-clay-500)'
                    : isEquipped
                      ? `2px solid ${RARITY_COLOR[it.rarity]}`
                      : '1.5px solid rgba(75,55,30,0.08)',
                  boxShadow: isPreviewed
                    ? '0 4px 16px rgba(199,130,90,0.25)'
                    : isEquipped
                      ? `0 2px 8px ${RARITY_COLOR[it.rarity]}30`
                      : '0 1px 3px rgba(75,55,30,0.06)',
                }}
                aria-label={it.name}
              >
                {/* Image */}
                <div
                  className="relative w-full aspect-square"
                  style={{ background: RARITY_BG[it.rarity] }}
                >
                  <Image
                    src={it.img}
                    alt={it.name}
                    fill
                    className={imgFit === 'contain' ? 'object-contain p-1.5' : 'object-cover'}
                    unoptimized
                  />
                  {it.count > 1 && (
                    <div className="absolute top-1 right-1 rounded-full bg-ink-900/70 text-cream-50 text-[8px] font-bold px-1.5 py-px tabular-nums backdrop-blur-sm">
                      ×{it.count}
                    </div>
                  )}
                </div>
                {/* Name strip */}
                <div
                  className="px-1.5 py-1.5 text-center"
                  style={{
                    background: isPreviewed ? 'rgba(199,130,90,0.08)' : 'rgba(75,55,30,0.02)',
                  }}
                >
                  <div className="text-[9px] font-semibold text-ink-700 truncate leading-tight">
                    {it.name}
                  </div>
                  {isEquipped && (
                    <div className="text-[7px] font-bold uppercase tracking-wider mt-0.5" style={{ color: RARITY_COLOR[it.rarity] }}>
                      ✓
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
