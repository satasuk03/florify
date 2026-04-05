'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SeedPacket } from '@/components/SeedPacket';
import { Button } from '@/components/Button';

/**
 * Debug harness for the seed-packet opening animation.
 *
 * Lets you replay the `idle → opening → onComplete` sequence without
 * touching the store, cooldowns, or actually planting a tree. Not
 * linked from the main UI — navigate to /debug/pack directly.
 */
export default function PackDebugPage() {
  const [state, setState] = useState<'idle' | 'opening'>('idle');
  const [plays, setPlays] = useState(0);

  const play = () => {
    if (state !== 'idle') return;
    setState('opening');
  };

  const handleComplete = () => {
    setPlays((n) => n + 1);
    // Small delay before resetting so the "done" state is briefly
    // visible in the log before the packet re-mounts for replay.
    setTimeout(() => setState('idle'), 400);
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
        <h1 className="font-serif text-lg text-ink-900">Pack Debug</h1>
        <div className="w-12" aria-hidden />
      </header>

      <div className="flex-1 flex items-center justify-center px-8">
        <SeedPacket
          state={state}
          onComplete={handleComplete}
          className="w-[min(70vw,320px)]"
        />
      </div>

      <div className="px-6 pb-8 flex flex-col items-center gap-3">
        <div className="text-xs text-ink-500 tracking-wider tabular-nums">
          state: <span className="font-medium text-ink-900">{state}</span> ·
          plays: <span className="font-medium text-ink-900">{plays}</span>
        </div>
        <Button
          size="lg"
          onClick={play}
          disabled={state !== 'idle'}
          className="min-w-[220px]"
        >
          เปิดซอง
        </Button>
        <p className="text-xs text-ink-500 text-center max-w-xs mt-1">
          เปิดซ้ำได้ไม่จำกัด · ไม่กระทบ store หรือ cooldown จริง
        </p>
      </div>
    </main>
  );
}
