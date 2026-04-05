'use client';

import { useSyncExternalStore } from 'react';
import type { Language } from '@florify/shared';
import { loadSettings, subscribeSettings } from '@/store/settingsStore';
import { dict, type DictKey } from './dict';

/**
 * Client-side i18n hook. Reads the active language from `settingsStore`
 * (localStorage-backed) via `useSyncExternalStore` so any component that
 * calls `useT()` re-renders the moment the user toggles the language.
 *
 * Kept intentionally tiny — no library, no routing, no server boundary.
 * Compatible with Next.js `output: 'export'` because the language lives
 * entirely in the client; the static build ships both dictionaries in
 * the JS bundle and picks one on mount.
 */
const getServerSnapshot = (): Language => 'th';

export function useLanguage(): Language {
  return useSyncExternalStore(
    subscribeSettings,
    () => loadSettings().language,
    getServerSnapshot,
  );
}

export function useT() {
  const language = useLanguage();
  return (key: DictKey, vars?: Record<string, string | number>): string => {
    const table = dict[language] ?? dict.th;
    let str: string = table[key] ?? dict.th[key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replace(`{${k}}`, String(v));
      }
    }
    return str;
  };
}
