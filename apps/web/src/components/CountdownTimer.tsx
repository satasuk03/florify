'use client';

import { useEffect, useState } from 'react';

export function CountdownTimer({ until }: { until: number }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const ms = Math.max(0, until - now);
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return (
    <span className="tabular-nums font-mono text-ink-700">
      {m}:{s.toString().padStart(2, '0')}
    </span>
  );
}
