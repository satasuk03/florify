import { SETTINGS_KEY, type Settings } from '@florify/shared';

const defaults: Settings = {
  sound: true,
  haptics: true,
  notifications: false,
};

// Module-level cache so `loadSettings()` returns a stable reference
// between calls — required for `useSyncExternalStore` consumers,
// whose snapshot must be === stable when the underlying data hasn't
// changed. The cache is seeded lazily on first read and invalidated
// whenever `saveSettings()` is called.
let cached: Settings | null = null;
const listeners = new Set<() => void>();

function readFromStorage(): Settings {
  if (typeof window === 'undefined') return defaults;
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...defaults, ...(JSON.parse(raw) as Partial<Settings>) } : defaults;
  } catch {
    return defaults;
  }
}

export function loadSettings(): Settings {
  if (cached === null) cached = readFromStorage();
  return cached;
}

export function saveSettings(s: Settings): void {
  cached = s;
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  }
  listeners.forEach((l) => l());
}

export function subscribeSettings(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
