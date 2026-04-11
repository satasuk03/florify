'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { useGameStore } from '@/store/gameStore';
import { DEBUG_MODE } from '@/lib/debug';
import { scheduleSave } from '@/store/debouncedSave';
import {
  MAX_WATER_DROPS,
  PRODUCER_MAX_LEVEL,
  PRODUCER_PERIOD_MS,
  SPROUT_PRODUCER_YIELD,
  WATER_PRODUCER_YIELD,
  FLORA_MAX_LEVEL,
  MAX_PENDING_MERGES,
} from '@florify/shared';
import { ACHIEVEMENTS } from '@/data/achievements';
import { SPECIES } from '@/data/species';

const SPROUT_AMOUNTS = [100, 500, 1000, 5000] as const;
const DROP_AMOUNTS = [10, 25, 50] as const;

export default function DebugPage() {
  const sprouts = useGameStore((s) => s.state.sprouts);
  const waterDrops = useGameStore((s) => s.waterDrops());
  const missions = useGameStore((s) => s.state.dailyMissions.missions);
  const [lastAction, setLastAction] = useState('');

  if (!DEBUG_MODE) {
    return (
      <main className="min-h-full h-full flex items-center justify-center bg-cream-50 safe-top safe-bottom">
        <div className="text-center">
          <p className="text-ink-500 text-sm">Debug mode is disabled.</p>
          <p className="text-ink-400 text-xs mt-1">Set NEXT_PUBLIC_DEBUG_MODE=true in .env</p>
          <Link href="/" className="text-sm text-ink-500 hover:text-ink-700 underline underline-offset-2 mt-4 inline-block">
            ← Home
          </Link>
        </div>
      </main>
    );
  }

  const addSprouts = (amount: number) => {
    const s = useGameStore.getState().state;
    const next = { ...s, sprouts: s.sprouts + amount, updatedAt: Date.now() };
    useGameStore.setState({ state: next });
    scheduleSave(next);
    setLastAction(`+${amount} 🌱`);
  };

  const addDrops = (amount: number) => {
    const s = useGameStore.getState().state;
    const next = { ...s, waterDrops: Math.min(s.waterDrops + amount, MAX_WATER_DROPS), lastDropRegenAt: Date.now(), updatedAt: Date.now() };
    useGameStore.setState({ state: next });
    scheduleSave(next);
    setLastAction(`+${amount} 💧`);
  };

  const completeMission = (index: number) => {
    const s = useGameStore.getState().state;
    const mission = s.dailyMissions.missions[index];
    if (!mission || mission.completed) return;
    const updated = [...s.dailyMissions.missions];
    updated[index] = { ...mission, progress: mission.target, completed: true };
    const next = {
      ...s,
      dailyMissions: { ...s.dailyMissions, missions: updated },
      updatedAt: Date.now(),
    };
    useGameStore.setState({ state: next });
    scheduleSave(next);
    setLastAction(`Mission ${index + 1} ✓`);
  };

  const completeAllMissions = () => {
    const s = useGameStore.getState().state;
    const updated = s.dailyMissions.missions.map((m) => ({
      ...m,
      progress: m.target,
      completed: true,
    }));
    const next = {
      ...s,
      dailyMissions: { ...s.dailyMissions, missions: updated },
      updatedAt: Date.now(),
    };
    useGameStore.setState({ state: next });
    scheduleSave(next);
    setLastAction('All missions ✓');
  };

  return (
    <main className="min-h-full h-full overflow-y-auto bg-cream-50 safe-top safe-bottom flex flex-col">
      <header className="flex items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-sm text-ink-500 hover:text-ink-700 underline underline-offset-2"
        >
          ← Home
        </Link>
        <h1 className="font-serif text-lg text-ink-900">Debug</h1>
        <div className="w-12" aria-hidden />
      </header>

      <div className="flex-1 flex flex-col gap-8 px-6 pb-8">
        {/* Current values */}
        <div className="flex justify-center gap-6">
          <div className="text-center">
            <div className="font-mono text-2xl font-bold text-ink-900 tabular-nums">🌱 {sprouts}</div>
            <div className="text-xs text-ink-400 mt-0.5">Sprouts</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-2xl font-bold text-ink-900 tabular-nums">💧 {waterDrops}</div>
            <div className="text-xs text-ink-400 mt-0.5">Drops</div>
          </div>
        </div>

        {lastAction && (
          <div className="text-center text-sm text-leaf-600 font-medium animate-fade-up">
            {lastAction}
          </div>
        )}

        {/* Sprouts */}
        <section className="w-full max-w-xs mx-auto space-y-3">
          <div className="text-xs text-ink-400 uppercase tracking-wider text-center">Add Sprouts</div>
          <div className="grid grid-cols-2 gap-2">
            {SPROUT_AMOUNTS.map((amt) => (
              <Button key={amt} size="md" onClick={() => addSprouts(amt)} className="w-full">
                +{amt} 🌱
              </Button>
            ))}
          </div>
        </section>

        {/* Water drops */}
        <section className="w-full max-w-xs mx-auto space-y-3">
          <div className="text-xs text-ink-400 uppercase tracking-wider text-center">Add Drops</div>
          <div className="grid grid-cols-3 gap-2">
            {DROP_AMOUNTS.map((amt) => (
              <Button key={amt} size="md" variant="secondary" onClick={() => addDrops(amt)} className="w-full">
                +{amt} 💧
              </Button>
            ))}
          </div>
        </section>

        {/* Missions */}
        <section className="w-full max-w-xs mx-auto space-y-3">
          <div className="text-xs text-ink-400 uppercase tracking-wider text-center">Missions</div>
          {missions.length === 0 ? (
            <p className="text-xs text-ink-400 text-center">No missions today — visit plot first</p>
          ) : (
            <>
              <div className="space-y-2">
                {missions.map((m, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex-1 text-sm text-ink-700 truncate">
                      {m.templateId} ({m.progress}/{m.target})
                    </div>
                    <Button
                      size="md"
                      variant={m.completed ? 'ghost' : 'secondary'}
                      onClick={() => completeMission(i)}
                      disabled={m.completed}
                      className="!min-w-0 !px-3 !h-9 text-xs"
                    >
                      {m.completed ? '✓' : 'Done'}
                    </Button>
                  </div>
                ))}
              </div>
              <Button size="md" onClick={completeAllMissions} className="w-full">
                Complete All
              </Button>
            </>
          )}
        </section>
        {/* Producer */}
        <section className="w-full max-w-xs mx-auto space-y-3">
          <div className="text-xs text-ink-400 uppercase tracking-wider text-center">Producer</div>
          <ProducerDebug setLastAction={setLastAction} />
        </section>

        {/* Achievements */}
        <section className="w-full max-w-xs mx-auto space-y-3">
          <div className="text-xs text-ink-400 uppercase tracking-wider text-center">Achievements</div>
          <AchievementDebug setLastAction={setLastAction} />
        </section>

        {/* Conjure species */}
        <section className="w-full max-w-xs mx-auto space-y-3">
          <div className="text-xs text-ink-400 uppercase tracking-wider text-center">Conjure Species</div>
          <ConjureDebug setLastAction={setLastAction} />
        </section>
      </div>
    </main>
  );
}

function ConjureDebug({ setLastAction }: { setLastAction: (s: string) => void }) {
  const collection = useGameStore((s) => s.state.collection);
  const floraLevels = useGameStore((s) => s.state.floraLevels);
  const [query, setQuery] = useState('');

  const filtered = (() => {
    const q = query.trim().toLowerCase();
    if (!q) return SPECIES.slice(0, 30);
    const matches = SPECIES.filter(
      (sp) => sp.name.toLowerCase().includes(q) || String(sp.id) === q,
    );
    return matches.slice(0, 60);
  })();

  const addSpecies = (speciesId: number) => {
    const s = useGameStore.getState().state;
    const sp = SPECIES.find((x) => x.id === speciesId);
    if (!sp) return;
    const now = Date.now();
    const idx = s.collection.findIndex((c) => c.speciesId === speciesId);
    const isNew = idx < 0;

    let nextCollection: typeof s.collection;
    if (isNew) {
      nextCollection = [
        {
          speciesId,
          rarity: sp.rarity,
          count: 1,
          totalWaterings: 0,
          firstHarvestedAt: now,
          lastHarvestedAt: now,
        },
        ...s.collection,
      ];
    } else {
      const existing = s.collection[idx]!;
      const merged = {
        ...existing,
        count: existing.count + 1,
        lastHarvestedAt: now,
      };
      nextCollection = [
        merged,
        ...s.collection.slice(0, idx),
        ...s.collection.slice(idx + 1),
      ];
    }

    const nextFloraLevels = { ...s.floraLevels };
    const existingFL = nextFloraLevels[speciesId];
    if (!existingFL) {
      nextFloraLevels[speciesId] = { level: 1, pendingMerges: 0 };
    } else if (existingFL.level < FLORA_MAX_LEVEL) {
      nextFloraLevels[speciesId] = {
        level: existingFL.level,
        pendingMerges: Math.min(
          existingFL.pendingMerges + 1,
          MAX_PENDING_MERGES,
        ),
      };
    }

    const next = {
      ...s,
      collection: nextCollection,
      floraLevels: nextFloraLevels,
      updatedAt: now,
    };
    useGameStore.setState({ state: next });
    scheduleSave(next);
    const count = nextCollection[0]!.count;
    setLastAction(`+1 ${sp.name} ${isNew ? '(new!)' : `×${count}`}`);
  };

  const rarityDot: Record<typeof SPECIES[number]['rarity'], string> = {
    common: 'bg-leaf-500',
    rare: 'bg-clay-400',
    legendary: 'bg-amber-500',
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search name or id…"
        className="w-full h-9 px-3 text-sm rounded-lg border border-cream-300 bg-white text-ink-900 placeholder:text-ink-400"
      />
      <div className="max-h-64 overflow-y-auto space-y-1 scrollbar-elegant">
        {filtered.length === 0 && (
          <p className="text-xs text-ink-400 text-center py-2">No match</p>
        )}
        {filtered.map((sp) => {
          const collected = collection.find((c) => c.speciesId === sp.id);
          const fl = floraLevels[sp.id];
          return (
            <div key={sp.id} className="flex items-center gap-2 text-xs">
              <span
                className={`inline-block w-2 h-2 rounded-full shrink-0 ${rarityDot[sp.rarity]}`}
                aria-hidden
              />
              <span className="flex-1 truncate text-ink-700">
                #{sp.id} {sp.name}
              </span>
              {fl && (
                <span className="shrink-0 text-[10px] text-ink-400 tabular-nums">
                  Lv{fl.level}
                  {fl.pendingMerges > 0 && `+${fl.pendingMerges}`}
                </span>
              )}
              {collected && (
                <span className="shrink-0 text-[10px] text-ink-400 tabular-nums">
                  ×{collected.count}
                </span>
              )}
              <button
                onClick={() => addSpecies(sp.id)}
                className="shrink-0 px-2 py-0.5 rounded bg-clay-500 text-cream-50 hover:bg-clay-400"
              >
                Add
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProducerDebug({ setLastAction }: { setLastAction: (s: string) => void }) {
  const producer = useGameStore((s) => s.state.producer);

  const setFillRatio = (ratio: number) => {
    const s = useGameStore.getState().state;
    const now = Date.now();
    // Reduce lastClaimAt backwards so elapsed time = ratio * PRODUCER_PERIOD_MS.
    const lastClaimAt = now - Math.floor(ratio * PRODUCER_PERIOD_MS);
    const next = {
      ...s,
      producer: { ...s.producer, lastClaimAt },
      updatedAt: now,
    };
    useGameStore.setState({ state: next });
    scheduleSave(next);
    setLastAction(`Producer → ${Math.round(ratio * 100)}%`);
  };

  const bumpLevel = (track: 'sprout' | 'water', delta: number) => {
    const s = useGameStore.getState().state;
    const key = track === 'sprout' ? 'sproutLevel' : 'waterLevel';
    const current = s.producer[key];
    const nextLevel = Math.min(PRODUCER_MAX_LEVEL, Math.max(1, current + delta));
    if (nextLevel === current) return;
    const next = {
      ...s,
      producer: { ...s.producer, [key]: nextLevel },
      updatedAt: Date.now(),
    };
    useGameStore.setState({ state: next });
    scheduleSave(next);
    setLastAction(`${track} Lv ${current} → ${nextLevel}`);
  };

  const sproutYield = SPROUT_PRODUCER_YIELD[producer.sproutLevel - 1];
  const waterYield = WATER_PRODUCER_YIELD[producer.waterLevel - 1];

  return (
    <div className="space-y-3">
      {/* Fill ratio buttons */}
      <div className="text-[10px] text-ink-400 text-center uppercase tracking-wider">Fill</div>
      <div className="grid grid-cols-5 gap-1.5">
        {[0, 0.25, 0.5, 0.75, 1].map((r) => (
          <Button
            key={r}
            size="md"
            variant="secondary"
            onClick={() => setFillRatio(r)}
            className="!min-w-0 !px-0 text-xs"
          >
            {Math.round(r * 100)}%
          </Button>
        ))}
      </div>

      {/* Sprout track */}
      <div className="flex items-center gap-2">
        <div className="flex-1 text-xs text-ink-700 tabular-nums">
          🌱 Lv {producer.sproutLevel}/{PRODUCER_MAX_LEVEL} · {sproutYield}/24h
        </div>
        <button
          onClick={() => bumpLevel('sprout', -1)}
          disabled={producer.sproutLevel <= 1}
          className="h-8 w-8 rounded bg-cream-200 text-ink-700 hover:bg-cream-300 disabled:opacity-40"
        >
          −
        </button>
        <button
          onClick={() => bumpLevel('sprout', 1)}
          disabled={producer.sproutLevel >= PRODUCER_MAX_LEVEL}
          className="h-8 w-8 rounded bg-clay-500 text-cream-50 hover:bg-clay-400 disabled:opacity-40"
        >
          +
        </button>
      </div>

      {/* Water track */}
      <div className="flex items-center gap-2">
        <div className="flex-1 text-xs text-ink-700 tabular-nums">
          💧 Lv {producer.waterLevel}/{PRODUCER_MAX_LEVEL} · {waterYield}/24h
        </div>
        <button
          onClick={() => bumpLevel('water', -1)}
          disabled={producer.waterLevel <= 1}
          className="h-8 w-8 rounded bg-cream-200 text-ink-700 hover:bg-cream-300 disabled:opacity-40"
        >
          −
        </button>
        <button
          onClick={() => bumpLevel('water', 1)}
          disabled={producer.waterLevel >= PRODUCER_MAX_LEVEL}
          className="h-8 w-8 rounded bg-clay-500 text-cream-50 hover:bg-clay-400 disabled:opacity-40"
        >
          +
        </button>
      </div>
    </div>
  );
}

function AchievementDebug({ setLastAction }: { setLastAction: (s: string) => void }) {
  const achievements = useGameStore((s) => s.state.achievements);
  const [filter, setFilter] = useState('');

  const unlockAll = () => {
    const s = useGameStore.getState().state;
    const now = new Date().toISOString();
    const updated = { ...s.achievements };
    for (const def of ACHIEVEMENTS) {
      if (!updated[def.id]) {
        updated[def.id] = { unlockedAt: now };
      }
    }
    const next = { ...s, achievements: updated, updatedAt: Date.now() };
    useGameStore.setState({ state: next });
    scheduleSave(next);
    setLastAction(`Unlocked all 🏆`);
  };

  const unlockOne = (id: string) => {
    const s = useGameStore.getState().state;
    if (s.achievements[id]) return;
    const now = new Date().toISOString();
    const next = {
      ...s,
      achievements: { ...s.achievements, [id]: { unlockedAt: now } },
      updatedAt: Date.now(),
    };
    useGameStore.setState({ state: next });
    scheduleSave(next);
    setLastAction(`Unlocked ${id} 🏆`);
  };

  const resetAll = () => {
    const s = useGameStore.getState().state;
    const next = { ...s, achievements: {}, updatedAt: Date.now() };
    useGameStore.setState({ state: next });
    scheduleSave(next);
    setLastAction('Reset achievements 🗑️');
  };

  const unlockedCount = Object.keys(achievements).length;
  const claimedCount = Object.values(achievements).filter((a) => a.claimedAt).length;

  const filtered = filter
    ? ACHIEVEMENTS.filter((d) => d.id.includes(filter) || d.name.toLowerCase().includes(filter.toLowerCase()))
    : ACHIEVEMENTS;

  return (
    <div className="space-y-3">
      <div className="text-center text-xs text-ink-500">
        {unlockedCount}/{ACHIEVEMENTS.length} unlocked · {claimedCount} claimed
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button size="md" onClick={unlockAll} className="w-full">
          Unlock All
        </Button>
        <Button size="md" variant="secondary" onClick={resetAll} className="w-full">
          Reset All
        </Button>
      </div>

      <input
        type="text"
        placeholder="Filter achievements..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full h-9 px-3 text-sm rounded-lg border border-cream-300 bg-white text-ink-900 placeholder:text-ink-400"
      />

      <div className="max-h-64 overflow-y-auto space-y-1 scrollbar-elegant">
        {filtered.map((def) => {
          const progress = achievements[def.id];
          const isUnlocked = !!progress;
          const isClaimed = !!progress?.claimedAt;
          return (
            <div key={def.id} className="flex items-center gap-2 text-xs">
              <span className="flex-1 truncate text-ink-700">
                {isClaimed ? '✅' : isUnlocked ? '🔓' : '🔒'} {def.name}
              </span>
              {!isUnlocked && (
                <button
                  onClick={() => unlockOne(def.id)}
                  className="shrink-0 px-2 py-0.5 rounded bg-clay-500 text-cream-50 hover:bg-clay-400"
                >
                  Unlock
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
