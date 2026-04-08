'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { SproutIndicator } from '@/components/SproutIndicator';
import { useGameStore } from '@/store/gameStore';
import { DEBUG_MODE } from '@/lib/debug';
import { scheduleSave } from '@/store/debouncedSave';

const AMOUNTS = [10, 100, 500, 1000] as const;

/**
 * Debug harness for sprout currency.
 * Add/remove sprouts without playing. Only functional when DEBUG_MODE is true.
 */
export default function SproutsDebugPage() {
  const sprouts = useGameStore((s) => s.state.sprouts);
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
    setLastAction(`+${amount}`);
  };

  const setSprouts = (amount: number) => {
    const s = useGameStore.getState().state;
    const next = { ...s, sprouts: amount, updatedAt: Date.now() };
    useGameStore.setState({ state: next });
    scheduleSave(next);
    setLastAction(`= ${amount}`);
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
        <h1 className="font-serif text-lg text-ink-900">Sprout Debug</h1>
        <div className="w-12" aria-hidden />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
        <SproutIndicator />

        <div className="text-center">
          <div className="font-mono text-4xl font-bold text-ink-900 tabular-nums">
            🌱 {sprouts}
          </div>
          {lastAction && (
            <div className="text-sm text-leaf-600 font-medium mt-1 animate-fade-up">
              {lastAction}
            </div>
          )}
        </div>

        {/* Add buttons */}
        <div className="w-full max-w-xs space-y-3">
          <div className="text-xs text-ink-400 uppercase tracking-wider text-center">Add</div>
          <div className="grid grid-cols-2 gap-2">
            {AMOUNTS.map((amt) => (
              <Button key={amt} size="lg" onClick={() => addSprouts(amt)} className="w-full">
                +{amt} 🌱
              </Button>
            ))}
          </div>
        </div>

        {/* Set buttons */}
        <div className="w-full max-w-xs space-y-3">
          <div className="text-xs text-ink-400 uppercase tracking-wider text-center">Set to</div>
          <div className="grid grid-cols-3 gap-2">
            <Button size="lg" variant="secondary" onClick={() => setSprouts(0)} className="w-full">
              0
            </Button>
            <Button size="lg" variant="secondary" onClick={() => setSprouts(500)} className="w-full">
              500
            </Button>
            <Button size="lg" variant="secondary" onClick={() => setSprouts(5000)} className="w-full">
              5000
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6 pb-8 text-center">
        <p className="text-xs text-ink-500">
          Debug only · เปลี่ยนค่า sprout โดยไม่ต้องเก็บเกี่ยว
        </p>
      </div>
    </main>
  );
}
