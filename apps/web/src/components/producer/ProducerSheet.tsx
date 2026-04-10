"use client";

import { useEffect, useRef, useState } from "react";
import {
  PRODUCER_MAX_LEVEL,
  SPROUT_PRODUCER_UPGRADE_COST,
  SPROUT_PRODUCER_YIELD,
  WATER_PRODUCER_UPGRADE_COST,
  WATER_PRODUCER_YIELD,
} from "@florify/shared";
import { useGameStore } from "@/store/gameStore";
import { useT } from "@/i18n/useT";
import { ProducerClaimBurst } from "./ProducerClaimBurst";
import { FactoryPuffs } from "./FactoryPuffs";

// ── Animated number helpers ──────────────────────────────────────────
// Smoothly interpolates from the previous value to the target using
// requestAnimationFrame + easeOutCubic. Short tweens (600ms) keep up
// with 1Hz ticks while still feeling natural on big jumps (claim reset,
// upgrade yield bump). Returns { value, popKey } — popKey increments on
// significant deltas so consumers can trigger CSS pop animations.
function useAnimatedNumber(target: number, duration = 600, popThreshold = 2) {
  const [value, setValue] = useState(target);
  const [popKey, setPopKey] = useState(0);
  const fromRef = useRef(target);
  const lastTargetRef = useRef(target);
  const startRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (target === lastTargetRef.current) return;
    // Trigger pop burst on meaningful jumps (claim/upgrade), not on
    // every incremental 1-unit tick.
    if (Math.abs(target - lastTargetRef.current) >= popThreshold) {
      setPopKey((k) => k + 1);
    }
    fromRef.current = value;
    startRef.current = performance.now();
    lastTargetRef.current = target;

    const tick = () => {
      const elapsed = performance.now() - startRef.current;
      const t = Math.min(1, elapsed / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const next = fromRef.current + (target - fromRef.current) * eased;
      setValue(next);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration, popThreshold]);

  return { value: Math.round(value), popKey };
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ProducerSheet({ open, onClose }: Props) {
  const t = useT();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-ink-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center animate-overlay-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t("producer.title")}
    >
      <div
        className="w-full sm:max-w-md bg-cream-50 rounded-t-3xl sm:rounded-3xl shadow-soft-lg max-h-[92dvh] overflow-y-auto scrollbar-elegant animate-sheet-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative header with gradient */}
        <div className="relative overflow-hidden rounded-t-3xl">
          <div className="absolute inset-0 bg-gradient-to-b from-clay-400/12 via-clay-400/4 to-transparent pointer-events-none" />
          <div className="relative px-6 pt-5 pb-4">
            <Header onClose={onClose} />
          </div>
        </div>

        <div className="px-6 pb-7 flex flex-col gap-6">
          <ClaimSection />
          <Divider />
          <UpgradeSection />
        </div>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-cream-200" />
      <div className="h-1 w-1 rounded-full bg-clay-400/60" aria-hidden />
      <div className="h-px flex-1 bg-cream-200" />
    </div>
  );
}

function Header({ onClose }: { onClose: () => void }) {
  const t = useT();
  return (
    <div className="flex justify-between items-start">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="font-serif text-2xl text-ink-900 tracking-tight">
            {t("producer.title")}
          </h2>
          <span className="text-[10px] uppercase tracking-[0.18em] text-clay-500 font-semibold mt-1.5">
            IDLE
          </span>
        </div>
        <div className="text-xs text-ink-400 mt-1">
          {t("producer.subtitle")}
        </div>
      </div>
      <button
        onClick={onClose}
        aria-label={t("producer.close")}
        className="text-ink-400 text-xl leading-none w-9 h-9 flex items-center justify-center hover:bg-cream-100 rounded-full transition-colors -mt-0.5 -mr-1"
      >
        ✕
      </button>
    </div>
  );
}

// ── Claim Section ────────────────────────────────────────────────────

function ClaimSection() {
  const t = useT();
  const producerState = useGameStore((s) => s.producerState);
  const claimProducer = useGameStore((s) => s.claimProducer);
  const lastClaimAt = useGameStore((s) => s.state.producer.lastClaimAt);
  const sproutLevel = useGameStore((s) => s.state.producer.sproutLevel);
  const waterLevel = useGameStore((s) => s.state.producer.waterLevel);

  const [, forceTick] = useState(0);
  const computed = producerState();
  useEffect(() => {
    if (computed.isFull) return;
    const id = setInterval(() => forceTick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [computed.isFull, lastClaimAt, sproutLevel, waterLevel]);

  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - computed.elapsedRatio);
  const nothingReady = computed.sproutReady === 0 && computed.waterReady === 0;
  const { value: pct, popKey: pctPop } = useAnimatedNumber(
    Math.round(computed.elapsedRatio * 100),
    700,
    5,
  );

  // Juicy claim state — burst + button shake + haptic buzz on each click.
  const [burstKey, setBurstKey] = useState(0);
  const [shaking, setShaking] = useState(false);

  const handleClaim = () => {
    if (nothingReady) return;
    claimProducer();
    setBurstKey((k) => k + 1);
    setShaking(true);
    window.setTimeout(() => setShaking(false), 500);
    // Mobile haptic — tiny buzz on supported devices.
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate?.(35);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5">
      {/* ── Hero ring ────────────────────────────────────── */}
      <div className="relative h-[144px] w-[144px]">
        {/* Ambient factory puffs — subtle emoji float emitted from the
            top of the ring every few seconds while still accumulating. */}
        <FactoryPuffs active={!computed.isFull} />
        {/* Soft radial glow behind the ring — intensifies when full */}
        <div
          className={
            "absolute inset-0 rounded-full blur-xl transition-opacity duration-500 " +
            (computed.isFull
              ? "bg-clay-400/30 opacity-100 animate-pulse"
              : "bg-clay-400/10 opacity-70")
          }
          aria-hidden
        />
        <svg
          className="relative -rotate-90"
          viewBox="0 0 140 140"
          width="144"
          height="144"
          aria-hidden
        >
          {/* Track */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="7"
            className="text-ink-900/8"
          />
          {/* Fill */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className={
              computed.isFull
                ? "text-clay-500 transition-[stroke-dashoffset] duration-500 ease-out"
                : "text-clay-400 transition-[stroke-dashoffset] duration-500 ease-out"
            }
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div
            key={pctPop}
            className="font-serif text-[40px] font-semibold text-ink-800 tabular-nums leading-none animate-count-pop"
          >
            {pct}
            <span className="text-xl text-ink-500 font-normal">%</span>
          </div>
          <div
            className={
              "text-[10px] uppercase tracking-[0.18em] font-semibold mt-1.5 " +
              (computed.isFull ? "text-clay-500 animate-pulse" : "text-ink-400")
            }
          >
            {computed.isFull ? t("producer.full") : t("producer.filling")}
          </div>
        </div>
      </div>

      {/* ── Reward pills ──────────────────────────────────── */}
      <div className="flex items-stretch gap-2.5 w-full max-w-xs">
        <RewardPill
          emoji="🌱"
          ready={computed.sproutReady}
          cap={computed.sproutYield}
          tint="leaf"
        />
        <RewardPill
          emoji="💧"
          ready={computed.waterReady}
          cap={computed.waterYield}
          tint="sky"
        />
      </div>

      {/* ── Countdown ─────────────────────────────────────── */}
      <Countdown isFull={computed.isFull} nextFullAt={computed.nextFullAt} />

      {/* ── Claim button + burst overlay ───────────────────── */}
      <div className="relative w-full max-w-xs">
        <button
          type="button"
          onClick={handleClaim}
          disabled={nothingReady}
          className={
            "relative w-full h-14 rounded-2xl font-serif text-lg font-semibold transition-all duration-300 ease-out active:scale-[0.96] overflow-hidden " +
            (shaking ? "animate-claim-press " : "") +
            (nothingReady
              ? "bg-cream-200 text-ink-400 cursor-not-allowed"
              : "bg-clay-500 text-cream-50 hover:bg-clay-400 shadow-soft-md hover:shadow-soft-lg shine-on-hover")
          }
        >
          {/* Glow overlay when full — telegraphs that it's "ready now" */}
          {computed.isFull && !nothingReady && (
            <span
              className="absolute inset-0 bg-gradient-to-t from-clay-500 to-clay-400 opacity-0 hover:opacity-100 transition-opacity duration-300"
              aria-hidden
            />
          )}
          <span className="relative">
            {nothingReady ? t("producer.nothingReady") : t("producer.claim")}
          </span>
        </button>
        {/* Particle burst — overflows the button so emojis fly out freely */}
        {burstKey > 0 && <ProducerClaimBurst key={burstKey} playKey={burstKey} />}
      </div>
    </div>
  );
}

function RewardPill({
  emoji,
  ready,
  cap,
  tint,
}: {
  emoji: string;
  ready: number;
  cap: number;
  tint: "leaf" | "sky";
}) {
  const { value: readyAnim, popKey: readyPop } = useAnimatedNumber(ready, 600, 3);
  // Bounce the emoji whenever the number makes a big jump (claim/upgrade).
  const [bounceKey, setBounceKey] = useState(0);
  const prevPop = useRef(readyPop);
  useEffect(() => {
    if (readyPop !== prevPop.current) {
      prevPop.current = readyPop;
      setBounceKey((k) => k + 1);
    }
  }, [readyPop]);

  return (
    <div
      className={
        "flex-1 rounded-2xl border px-4 py-2.5 flex items-center gap-2.5 transition-colors " +
        (tint === "leaf"
          ? "bg-leaf-500/5 border-leaf-500/15"
          : "bg-sky-600/5 border-sky-600/15")
      }
    >
      <div
        className={
          "shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-lg " +
          (tint === "leaf" ? "bg-leaf-500/10" : "bg-sky-600/10")
        }
        aria-hidden
      >
        <span key={bounceKey} className="inline-block animate-drop-bounce">
          {emoji}
        </span>
      </div>
      <div className="flex flex-col min-w-0">
        <div
          key={readyPop}
          className="font-serif text-lg font-semibold text-ink-800 tabular-nums leading-none animate-count-pop"
        >
          +{readyAnim}
        </div>
        <div className="text-[10px] text-ink-400 tabular-nums mt-0.5">
          / {cap}
        </div>
      </div>
    </div>
  );
}

function Countdown({
  isFull,
  nextFullAt,
}: {
  isFull: boolean;
  nextFullAt: number | null;
}) {
  const t = useT();
  if (isFull || nextFullAt === null) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-clay-500 font-semibold">
        <span className="h-1.5 w-1.5 rounded-full bg-clay-500 animate-pulse" />
        {t("producer.readyToClaim")}
      </div>
    );
  }
  const ms = Math.max(0, nextFullAt - Date.now());
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return (
    <div className="text-xs text-ink-400 tabular-nums">
      {t("producer.nextFullIn", { time: `${h}h ${m}m` })}
    </div>
  );
}

// ── Upgrade Section ──────────────────────────────────────────────────

function UpgradeSection() {
  const t = useT();
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="text-[11px] uppercase tracking-[0.18em] text-ink-500 font-semibold">
          {t("producer.upgradesTitle")}
        </div>
        <div className="h-px flex-1 bg-cream-200" />
      </div>
      <UpgradeCard track="sprout" />
      <UpgradeCard track="water" />
    </div>
  );
}

function UpgradeCard({ track }: { track: "sprout" | "water" }) {
  const t = useT();
  const sprouts = useGameStore((s) => s.state.sprouts);
  const currentLevel = useGameStore((s) =>
    track === "sprout" ? s.state.producer.sproutLevel : s.state.producer.waterLevel,
  );
  const upgradeProducer = useGameStore((s) => s.upgradeProducer);

  const yieldArray = track === "sprout" ? SPROUT_PRODUCER_YIELD : WATER_PRODUCER_YIELD;
  const costArray =
    track === "sprout" ? SPROUT_PRODUCER_UPGRADE_COST : WATER_PRODUCER_UPGRADE_COST;

  const currentYield = yieldArray[currentLevel - 1]!;
  const isMaxed = currentLevel >= PRODUCER_MAX_LEVEL;
  const nextYield = isMaxed ? null : yieldArray[currentLevel]!;
  const nextCost = isMaxed ? null : costArray[currentLevel]!;
  const canAfford = nextCost !== null && sprouts >= nextCost;
  const { value: yieldAnim, popKey: yieldPop } = useAnimatedNumber(currentYield, 700, 1);

  const emoji = track === "sprout" ? "🌱" : "💧";
  const trackLabel =
    track === "sprout" ? t("producer.sproutTrack") : t("producer.waterTrack");
  const isLeaf = track === "sprout";

  const handleUpgrade = () => {
    if (isMaxed || !canAfford) return;
    upgradeProducer(track);
  };

  return (
    <div
      className={
        "relative rounded-2xl border p-3.5 flex items-center gap-3 overflow-hidden " +
        (isLeaf
          ? "bg-gradient-to-br from-leaf-500/6 to-cream-50 border-leaf-500/20"
          : "bg-gradient-to-br from-sky-600/6 to-cream-50 border-sky-600/20")
      }
    >
      {/* Icon badge */}
      <div
        className={
          "shrink-0 h-12 w-12 rounded-xl border flex items-center justify-center shadow-soft-sm text-2xl " +
          (isLeaf
            ? "bg-cream-50 border-leaf-500/25"
            : "bg-cream-50 border-sky-600/25")
        }
        aria-hidden
      >
        {emoji}
      </div>

      <div className="flex-1 min-w-0">
        {/* Title + level badge */}
        <div className="flex items-center gap-2">
          <div className="font-serif text-sm font-semibold text-ink-800 truncate">
            {trackLabel}
          </div>
          <div
            className={
              "px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider " +
              (isMaxed
                ? "bg-gradient-to-br from-amber-400 to-amber-500 text-cream-50 shadow-sm"
                : isLeaf
                  ? "bg-leaf-500/12 text-leaf-500"
                  : "bg-sky-600/12 text-sky-600")
            }
          >
            LV {currentLevel}/{PRODUCER_MAX_LEVEL}
          </div>
        </div>

        {/* Level dot strip */}
        <LevelDots current={currentLevel} tint={isLeaf ? "leaf" : "sky"} />

        {/* Yield readout */}
        <div className="text-[11px] text-ink-500 mt-1 tabular-nums flex items-center gap-1">
          <span
            key={yieldPop}
            className="font-semibold text-ink-700 inline-block animate-count-pop"
          >
            {yieldAnim}
          </span>
          <span className="text-ink-400">/24h</span>
          {nextYield !== null && (
            <>
              <span className="text-ink-300 mx-0.5">→</span>
              <span
                className={
                  "font-semibold " + (isLeaf ? "text-leaf-500" : "text-sky-600")
                }
              >
                {nextYield}
              </span>
              <span className="text-ink-400">/24h</span>
            </>
          )}
        </div>
      </div>

      {/* Cost / Upgrade button */}
      <button
        type="button"
        onClick={handleUpgrade}
        disabled={isMaxed || !canAfford}
        className={
          "shrink-0 h-11 min-w-[56px] rounded-xl px-3 text-sm font-bold transition-all duration-200 flex flex-col items-center justify-center gap-0 active:scale-[0.96] " +
          (isMaxed
            ? "bg-gradient-to-br from-amber-400 to-amber-500 text-cream-50 shadow-soft-sm cursor-default"
            : canAfford
              ? "bg-clay-500 text-cream-50 hover:bg-clay-400 shadow-soft-sm hover:shadow-soft-md"
              : "bg-cream-100 text-ink-400 cursor-not-allowed border border-cream-300")
        }
      >
        {isMaxed ? (
          <span className="text-[11px] tracking-wider">
            {t("producer.maxed")}
          </span>
        ) : (
          <div className="flex items-center gap-1">
            <span aria-hidden>🌱</span>
            <span className="tabular-nums">{nextCost}</span>
          </div>
        )}
      </button>
    </div>
  );
}

function LevelDots({
  current,
  tint,
}: {
  current: number;
  tint: "leaf" | "sky";
}) {
  const dots = Array.from({ length: PRODUCER_MAX_LEVEL });
  // Track the newest unlocked dot so we can scale it in on unlock.
  const [justUnlocked, setJustUnlocked] = useState<number | null>(null);
  const prevCurrent = useRef(current);
  useEffect(() => {
    if (current > prevCurrent.current) {
      const idx = current - 1;
      setJustUnlocked(idx);
      const id = setTimeout(() => setJustUnlocked(null), 600);
      prevCurrent.current = current;
      return () => clearTimeout(id);
    }
    prevCurrent.current = current;
  }, [current]);

  return (
    <div className="flex items-center gap-[3px] mt-1.5">
      {dots.map((_, i) => {
        const filled = i < current;
        const isNew = justUnlocked === i;
        return (
          <span
            key={i}
            className={
              "h-1 w-[7px] rounded-full transition-[background-color,width,height] duration-500 " +
              (filled
                ? tint === "leaf"
                  ? "bg-leaf-500"
                  : "bg-sky-600"
                : "bg-cream-200") +
              (isNew ? " animate-count-pop" : "")
            }
            aria-hidden
          />
        );
      })}
    </div>
  );
}
