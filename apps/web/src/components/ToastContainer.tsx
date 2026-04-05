'use client';

import { useToastStore } from '@/lib/toast';

export function ToastContainer() {
  const message = useToastStore((s) => s.message);
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed left-0 right-0 bottom-0 z-50 flex justify-center safe-bottom"
    >
      {message && (
        <div
          // Re-key on message so the animation replays for each new toast.
          key={message}
          role="status"
          className="mx-4 mb-6 max-w-md rounded-xl bg-ink-900/90 text-cream-50 text-sm px-4 py-3 shadow-soft-lg backdrop-blur-sm animate-toast-in"
        >
          {message}
        </div>
      )}
    </div>
  );
}
