'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { useGameStore } from '@/store/gameStore';
import { DEBUG_MODE } from '@/lib/debug';
import { scheduleSave } from '@/store/debouncedSave';
import { MAX_WATER_DROPS } from '@florify/shared';

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
      </div>
    </main>
  );
}
