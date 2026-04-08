import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { haptic } from '@/lib/haptics';
import { saveSettings } from '@/store/settingsStore';

describe('haptic', () => {
  const originalNavigator = globalThis.navigator;
  let vibrate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vibrate = vi.fn();
    Object.defineProperty(globalThis, 'navigator', {
      value: { ...originalNavigator, vibrate },
      configurable: true,
    });
    window.localStorage.clear();
  });

  afterEach(() => {
    Object.defineProperty(globalThis, 'navigator', {
      value: originalNavigator,
      configurable: true,
    });
  });

  it('calls navigator.vibrate for the tap pattern', () => {
    haptic('tap');
    expect(vibrate).toHaveBeenCalledWith(10);
  });

  it('uses a multi-pulse pattern for water', () => {
    haptic('water');
    expect(vibrate).toHaveBeenCalledWith([20, 40, 20]);
  });

  it('uses a flourish pattern for harvest', () => {
    haptic('harvest');
    expect(vibrate).toHaveBeenCalledWith([30, 60, 30, 60, 100]);
  });

  it('is a no-op when user has disabled haptics', () => {
    saveSettings({ sound: true, haptics: false, notifications: false, language: 'th', hasSeenWelcome: true });
    haptic('tap');
    expect(vibrate).not.toHaveBeenCalled();
  });

  it('is a no-op when navigator.vibrate is missing (iOS Safari)', () => {
    Object.defineProperty(globalThis, 'navigator', {
      value: { ...originalNavigator },
      configurable: true,
    });
    // Should not throw
    expect(() => haptic('tap')).not.toThrow();
  });
});
