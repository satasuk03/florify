'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DetailView } from '@/screens/DetailView';

/**
 * Detail page — uses `?id=` query param instead of `[id]` dynamic
 * route because Next.js 16 static export forbids `dynamicParams: true`.
 *
 * `useSearchParams` requires a Suspense boundary in the App Router, so
 * we wrap the inner reader.
 */
export default function GalleryDetailPage() {
  return (
    <Suspense fallback={<div className="h-full bg-cream-50" aria-hidden />}>
      <DetailPageInner />
    </Suspense>
  );
}

function DetailPageInner() {
  const params = useSearchParams();
  const id = params.get('id');
  return <DetailView id={id} />;
}
