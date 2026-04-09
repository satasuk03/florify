"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { ACHIEVEMENTS } from "@/data/achievements";
import { SPECIES } from "@/data/species";
import type {
  AchievementCondition,
  AchievementDef,
  PlayerState,
} from "@florify/shared";
import { useLanguage } from "@/i18n/useT";

const CATEGORIES: { label: string; filter: (d: AchievementDef) => boolean }[] =
  [
    {
      label: "🌿 Collection",
      filter: (d) => d.id.startsWith("collect_") || d.id.startsWith("set_"),
    },
    { label: "🌾 Harvest", filter: (d) => d.id.startsWith("harvest_") },
    { label: "💧 Watering", filter: (d) => d.id.startsWith("water_") },
    { label: "🌱 Sprouts", filter: (d) => d.id.startsWith("sprout_") },
    { label: "🔥 Streaks", filter: (d) => d.id.startsWith("streak_") },
    { label: "⚡ Combos", filter: (d) => d.id.startsWith("combo") },
    { label: "🎁 Seed Packets", filter: (d) => d.id.startsWith("seedpacket_") },
    {
      label: "📋 Missions",
      filter: (d) =>
        d.id.startsWith("mission_") || d.id.startsWith("daily_all_"),
    },
  ];

interface AchievementsTabProps {
  scrollRef?: React.RefObject<HTMLDivElement | null>;
}

export function AchievementsTab({ scrollRef }: AchievementsTabProps) {
  const state = useGameStore((s) => s.state);
  const claimAchievement = useGameStore((s) => s.claimAchievement);
  const claimAllAchievements = useGameStore((s) => s.claimAllAchievements);
  const lang = useLanguage();

  const unclaimedCount = useMemo(
    () => Object.values(state.achievements).filter((a) => !a.claimedAt).length,
    [state.achievements],
  );

  const totalUnlocked = Object.keys(state.achievements).length;

  // Claim reward overlay
  const [claimReward, setClaimReward] = useState<{
    amount: number;
    key: number;
  } | null>(null);

  const handleClaim = useCallback(
    (id: string) => {
      const amount = claimAchievement(id);
      if (amount > 0) {
        setClaimReward({ amount, key: Date.now() });
      }
    },
    [claimAchievement],
  );

  const handleClaimAll = useCallback(() => {
    const amount = claimAllAchievements();
    if (amount > 0) {
      setClaimReward({ amount, key: Date.now() });
    }
  }, [claimAllAchievements]);

  // Auto-dismiss overlay
  useEffect(() => {
    if (!claimReward) return;
    const id = setTimeout(() => setClaimReward(null), 2000);
    return () => clearTimeout(id);
  }, [claimReward]);

  // Scroll-to-top
  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    const el = scrollRef?.current;
    if (!el) return;
    const onScroll = () => setShowScrollTop(el.scrollTop > 400);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [scrollRef]);

  const scrollToTop = useCallback(() => {
    scrollRef?.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [scrollRef]);

  // Track stagger index across all rows
  let rowIndex = 0;

  return (
    <div className="space-y-4">
      <div
        className="flex items-center gap-3 animate-fade-up"
        style={{ animationDelay: "0ms" }}
      >
        <p className="text-sm text-ink-500 shrink-0">
          {totalUnlocked}/{ACHIEVEMENTS.length}
        </p>
        <div className="flex-1 h-2 bg-cream-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-clay-400 rounded-full"
            style={{
              width: `${(totalUnlocked / ACHIEVEMENTS.length) * 100}%`,
              animation:
                "progress-fill 1000ms cubic-bezier(0.22, 1, 0.36, 1) 200ms both",
            }}
          />
        </div>
      </div>

      {/* Unclaimed section */}
      {unclaimedCount > 0 &&
        (() => {
          const unclaimedDefs = ACHIEVEMENTS.filter(
            (d) =>
              state.achievements[d.id] && !state.achievements[d.id]!.claimedAt,
          );
          return (
            <div className="animate-fade-up" style={{ animationDelay: "60ms" }}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-ink-700">
                  🎁 Unclaimed ({unclaimedCount})
                </h3>
                {unclaimedCount > 1 && (
                  <ClaimAllButton
                    count={unclaimedCount}
                    onClick={handleClaimAll}
                  />
                )}
              </div>
              <div className="space-y-2">
                {unclaimedDefs.map((def, i) => (
                  <AchievementRow
                    key={`unclaimed-${def.id}`}
                    def={def}
                    progress={state.achievements[def.id]}
                    state={state}
                    lang={lang}
                    onClaim={() => handleClaim(def.id)}
                    delay={120 + i * 40}
                  />
                ))}
              </div>
            </div>
          );
        })()}

      {CATEGORIES.map((cat, catIdx) => {
        const defs = ACHIEVEMENTS.filter(cat.filter);
        const catDelay = 100 + catIdx * 60;
        return (
          <div
            key={cat.label}
            className="animate-fade-up"
            style={{ animationDelay: `${catDelay}ms` }}
          >
            <h3 className="text-sm font-semibold text-ink-700 mb-2">
              {cat.label}
            </h3>
            <div className="space-y-2">
              {defs.map((def) => {
                const delay = catDelay + 40 + rowIndex++ * 20;
                return (
                  <AchievementRow
                    key={def.id}
                    def={def}
                    progress={state.achievements[def.id]}
                    state={state}
                    lang={lang}
                    onClaim={() => handleClaim(def.id)}
                    delay={Math.min(delay, 800)}
                  />
                );
              })}
            </div>
          </div>
        );
      })}

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="sticky bottom-4 left-full z-20 w-10 h-10 rounded-full bg-cream-100/90 border border-cream-300 shadow-soft-md backdrop-blur-sm flex items-center justify-center text-ink-600 hover:bg-cream-200 transition-all duration-200 animate-fade-up"
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

      {/* Claim reward overlay */}
      {claimReward && (
        <div
          key={claimReward.key}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <div
            className="relative flex flex-col items-center gap-2 bg-cream-50/95 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-soft-lg border border-cream-300"
            style={{
              animation:
                "achievement-claim 600ms cubic-bezier(.22,.68,.36,1.2) both",
            }}
          >
            <ClaimConfetti />
            <div
              className="text-3xl font-bold text-clay-500"
              style={{ animation: "fade-up 400ms ease-out both" }}
            >
              +{claimReward.amount} 🌱
            </div>
            <div
              className="text-sm text-ink-500"
              style={{ animation: "fade-up 400ms ease-out 100ms both" }}
            >
              Sprouts claimed!
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** mulberry32 — tiny deterministic PRNG. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CONFETTI_PALETTE = [
  "#D4A24C",
  "#E3C07A",
  "#C7825A",
  "#D89872",
  "#A8C49A",
  "#6B8E4E",
];

/** Lightweight confetti burst for achievement claims. Reuses existing CSS keyframes. */
function ClaimConfetti() {
  const [seed] = useState(() => Date.now());
  const [alive, setAlive] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => setAlive(false), 1600);
    return () => clearTimeout(id);
  }, []);

  const particles = useMemo(() => {
    const rand = mulberry32(seed);
    return Array.from({ length: 16 }, (_, i) => ({
      dx: (rand() - 0.5) * 200,
      dy: -(40 + rand() * 120),
      rot: (rand() - 0.5) * 720,
      delay: Math.floor(rand() * 200),
      size: 6 + Math.floor(rand() * 6),
      color: CONFETTI_PALETTE[i % CONFETTI_PALETTE.length]!,
      isSparkle: i > 11,
    }));
  }, [seed]);

  if (!alive) return null;

  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none overflow-visible z-10"
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {particles.map((p, i) =>
          p.isSparkle ? (
            <span
              key={i}
              className="animate-confetti-sparkle absolute left-0 top-0 block w-2 h-2 rounded-full"
              style={{
                background: `radial-gradient(circle, ${p.color} 0%, ${p.color}00 70%)`,
                ["--dx" as string]: `${p.dx}px`,
                ["--dy" as string]: `${p.dy}px`,
                animationDelay: `${p.delay}ms`,
              }}
            />
          ) : (
            <span
              key={i}
              className="animate-confetti-leaf absolute left-0 top-0 block"
              style={{
                width: `${p.size}px`,
                height: `${p.size * 1.4}px`,
                background: p.color,
                borderRadius: "60% 10% 60% 10% / 60% 10% 60% 10%",
                ["--dx" as string]: `${p.dx}px`,
                ["--dy" as string]: `${p.dy}px`,
                ["--rot" as string]: `${p.rot}deg`,
                animationDelay: `${p.delay}ms`,
              }}
            />
          ),
        )}
      </div>
    </div>
  );
}

function ClaimAllButton({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) {
  const [pressed, setPressed] = useState(false);
  const handleClick = useCallback(() => {
    setPressed(true);
    onClick();
  }, [onClick]);

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className="text-xs font-semibold bg-clay-500 text-cream-50 px-3 py-1 rounded-lg hover:bg-clay-400 transition-colors shadow-soft-md overflow-hidden relative"
        style={
          pressed
            ? {
                animation:
                  "achievement-claim 600ms cubic-bezier(.22,.68,.36,1.2) both",
              }
            : undefined
        }
      >
        Claim All ({count})
        {pressed && (
          <span
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              animation: "water-btn-shine 400ms ease-out 80ms both",
              background:
                "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.45) 50%, transparent 65%)",
            }}
          />
        )}
      </button>
      {pressed && <ClaimConfetti />}
    </div>
  );
}

function AchievementRow({
  def,
  progress,
  state,
  lang,
  onClaim,
  delay = 0,
}: {
  def: AchievementDef;
  progress?: { unlockedAt: string; claimedAt?: string };
  state: PlayerState;
  lang: "th" | "en";
  onClaim: () => void;
  delay?: number;
}) {
  const isUnlocked = !!progress;
  const isClaimed = !!progress?.claimedAt;
  const [justClaimed, setJustClaimed] = useState(false);

  const handleClaim = useCallback(() => {
    setJustClaimed(true);
    onClaim();
  }, [onClaim]);
  const currentValue = getProgress(def.condition, state) ?? 0;
  const target = def.condition.target ?? 1;
  const pct = Math.min(100, Math.round((currentValue / target) * 100));

  const sproutReward = def.rewards.reduce(
    (sum, r) => sum + (r.type === "sprouts" ? r.amount : 0),
    0,
  );

  return (
    <div
      className={`rounded-xl p-3 transition-colors relative animate-fade-up ${
        isClaimed
          ? "bg-cream-100"
          : isUnlocked
            ? "bg-cream-100 border border-clay-400"
            : "bg-cream-100"
      }`}
      style={
        justClaimed
          ? {
              animation:
                "achievement-claim 600ms cubic-bezier(.22,.68,.36,1.2) both",
            }
          : { animationDelay: `${delay}ms` }
      }
    >
      {justClaimed && <ClaimConfetti />}
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium truncate ${isUnlocked ? "text-ink-900" : "text-ink-500"}`}
          >
            {def.name}
          </p>
          <p className="text-xs text-ink-400 truncate">
            {def.description[lang]}
          </p>
        </div>
        <div className="flex-shrink-0">
          {isClaimed ? (
            <span className="text-xs text-ink-400">🌱 {sproutReward} ✅</span>
          ) : isUnlocked ? (
            <button
              onClick={handleClaim}
              className="text-xs font-semibold bg-clay-500 text-cream-50 px-3 py-1 rounded-lg hover:bg-clay-400 transition-colors shadow-soft-md overflow-hidden relative"
            >
              + 🌱 {sproutReward}
              {justClaimed && (
                <span
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    animation: "water-btn-shine 400ms ease-out 80ms both",
                    background:
                      "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.45) 50%, transparent 65%)",
                  }}
                />
              )}
            </button>
          ) : (
            <span className="text-xs text-ink-400">🌱 {sproutReward}</span>
          )}
        </div>
      </div>
      {!isClaimed && (
        <div className="mt-2">
          <div className="h-1.5 bg-cream-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${isUnlocked ? "bg-clay-400" : "bg-clay-400/50"}`}
              style={{
                width: `${pct}%`,
                animation: `progress-fill 800ms cubic-bezier(0.22, 1, 0.36, 1) ${delay + 200}ms both`,
              }}
            />
          </div>
          <p className="text-[10px] text-ink-400 mt-0.5 text-right">
            {currentValue.toLocaleString()}/{target.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}

function getProgress(cond: AchievementCondition, state: PlayerState): number {
  switch (cond.type) {
    case "species_unlocked":
      return state.collection.length;
    case "species_by_rarity":
      return state.collection.filter((s) => s.rarity === cond.rarity).length;
    case "species_by_collection": {
      const ids = new Set(
        SPECIES.filter((s) => s.collection === cond.collection).map(
          (s) => s.id,
        ),
      );
      return state.collection.filter((s) => ids.has(s.speciesId)).length;
    }
    case "harvest_total":
      return state.stats.totalHarvested;
    case "harvest_by_rarity":
      return state.stats.harvestByRarity[cond.rarity];
    case "total_watered":
      return state.stats.totalWatered;
    case "sprouts_gained":
      return state.stats.sproutsGained;
    case "sprouts_spent":
      return state.stats.sproutsSpent;
    case "streak":
      return state.streak.longestStreak;
    case "combo": {
      const key = `combo${cond.level}` as keyof typeof state.stats.comboCount;
      return state.stats.comboCount[key];
    }
    case "seed_packets":
      return state.stats.seedPacketsOpened[cond.tier];
    case "missions_completed":
      return state.stats.missionsCompleted ?? 0;
    case "all_daily_completed":
      return state.stats.allDailyMissionsCompleted ?? 0;
    default:
      return 0;
  }
}
