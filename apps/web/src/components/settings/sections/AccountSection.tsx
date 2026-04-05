'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { DISPLAY_NAME_MAX_LENGTH, useGameStore } from '@/store/gameStore';

/**
 * Account section — currently just a rename field. When cloud auth
 * lands, sign-in/out controls will slot in alongside this input.
 *
 * Writes go through the store debounced (300ms after last keystroke)
 * so typing doesn't thrash localStorage.
 */
export function AccountSection() {
  const displayName = useGameStore((s) => s.state.displayName);
  const setDisplayName = useGameStore((s) => s.setDisplayName);
  const [draft, setDraft] = useState(displayName);

  // Keep the local draft in sync when the store value changes from
  // elsewhere (e.g. after an import or reset).
  useEffect(() => {
    setDraft(displayName);
  }, [displayName]);

  // Debounced write: wait until the user stops typing for 300ms.
  useEffect(() => {
    if (draft === displayName) return;
    const id = setTimeout(() => setDisplayName(draft), 300);
    return () => clearTimeout(id);
  }, [draft, displayName, setDisplayName]);

  return (
    <section>
      <h2 className="text-sm font-medium text-ink-500 uppercase tracking-wider mb-3">
        Account
      </h2>
      <Card className="p-4">
        <label htmlFor="display-name" className="block text-sm text-ink-700 mb-2">
          ชื่อของคุณ
        </label>
        <input
          id="display-name"
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={DISPLAY_NAME_MAX_LENGTH}
          placeholder="Guest"
          className="w-full px-3 py-2 rounded-lg bg-cream-100 border border-cream-300 text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-clay-500 transition-colors"
        />
        <div className="text-xs text-ink-500 mt-1.5">
          ชื่อนี้จะโชว์บน Florist Card ของคุณ (สูงสุด {DISPLAY_NAME_MAX_LENGTH} ตัวอักษร)
        </div>
      </Card>
    </section>
  );
}
