import { SETTINGS_KEY, type Settings } from '@florify/shared';

const defaults: Settings = {
  sound: true,
  haptics: true,
  notifications: false,
};

export function loadSettings(): Settings {
  try {
    if (typeof window === 'undefined') return defaults;
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...defaults, ...(JSON.parse(raw) as Partial<Settings>) } : defaults;
  } catch {
    return defaults;
  }
}

export function saveSettings(s: Settings): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}
