'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { FloristCardData } from '@/store/gameStore';
import { decodePassportLink } from '@/lib/passportLink';
import { SPECIES_BY_RARITY } from '@/data/species';
import { PassportCard } from '@/components/florist-card/PassportCard';
import { Button } from '@/components/Button';

const TOTAL_SPECIES =
  SPECIES_BY_RARITY.common.length +
  SPECIES_BY_RARITY.rare.length +
  SPECIES_BY_RARITY.legendary.length;

/**
 * Public passport viewer — renders a shared Florist Card directly from
 * the URL fragment. This route has no dependency on localStorage, so
 * recipients who've never opened Florify still see the sender's card.
 *
 * Why client-only and hash-based:
 * - `next.config.ts` sets `output: 'export'`, so there's no server to
 *   read a query param at request time; the fragment is the only place
 *   the hosting layer lets us stash data anyway.
 * - The decode uses `DecompressionStream` which is a browser API, so
 *   it has to run after hydration regardless.
 */

type ViewState =
  | { phase: 'loading' }
  | { phase: 'ok'; data: FloristCardData }
  | { phase: 'error'; reason: string };

export default function PassportSharePage() {
  const [view, setView] = useState<ViewState>({ phase: 'loading' });
  const [cardWidth, setCardWidth] = useState(320);

  // Decode the hash once on mount. `location.hash` is only available
  // after hydration — during SSG the page is a static shell.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const hash = window.location.hash;
      const result = await decodePassportLink(hash);
      if (cancelled) return;
      if (result.ok) {
        setView({ phase: 'ok', data: result.data });
      } else {
        setView({ phase: 'error', reason: result.reason });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Responsive card width — matches the in-app modal so the shared
  // view doesn't look jarringly different.
  useEffect(() => {
    const update = () => {
      const w = Math.min(Math.max(window.innerWidth - 48, 240), 380);
      setCardWidth(w);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <main className="min-h-dvh bg-cream-50 flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        <h1 className="font-serif text-3xl text-ink-900 text-center">
          Florify Passport
        </h1>

        {view.phase === 'loading' && (
          <div className="text-ink-500 text-sm">กำลังโหลด…</div>
        )}

        {view.phase === 'ok' && (
          <>
            <PassportCard data={view.data} maxWidth={cardWidth} />
            <p className="text-center text-sm text-ink-600 font-serif italic">
              {view.data.displayName} · {view.data.speciesUnlocked}/{TOTAL_SPECIES} species
            </p>
            {view.data.sharedAt && (
              <p className="text-center text-xs text-ink-400">
                ข้อมูลเมื่อ {new Date(view.data.sharedAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            )}
          </>
        )}

        {view.phase === 'error' && (
          <div className="bg-cream-100 border border-cream-300 rounded-2xl p-6 text-center">
            <div className="text-ink-900 font-medium mb-2">
              เปิดลิงค์พาสปอร์ตไม่ได้
            </div>
            <div className="text-sm text-ink-600">{view.reason}</div>
          </div>
        )}

        <Link href="/" className="w-full">
          <Button variant="primary" size="md" className="w-full">
            เริ่มสะสมพาสปอร์ตของคุณเอง 🌱
          </Button>
        </Link>
      </div>
    </main>
  );
}
