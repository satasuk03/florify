'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FloripediaView } from '@/screens/FloripediaView';

/**
 * Floripedia — public per-species page reached via a shared link.
 *
 * Uses `?id=` query param instead of `[id]` dynamic route because
 * Next.js 16 static export forbids `dynamicParams: true`. One HTML
 * file is emitted for `/floripedia/` and the client reads the id at
 * runtime.
 *
 * `useSearchParams` requires a Suspense boundary in the App Router.
 */
export default function FloripediaPage() {
  return (
    <Suspense fallback={<div className="h-full bg-cream-50" aria-hidden />}>
      <FloripediaPageInner />
    </Suspense>
  );
}

function FloripediaPageInner() {
  const params = useSearchParams();
  const raw = params.get('id');
  const parsed = raw == null ? null : Number(raw);
  const speciesId = parsed != null && Number.isFinite(parsed) ? parsed : null;
  return <FloripediaView speciesId={speciesId} />;
}
