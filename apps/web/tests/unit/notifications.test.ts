import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  canNotify,
  cancelCooldownNotification,
  requestNotificationPermission,
  scheduleCooldownNotification,
} from '@/lib/notifications';
import { saveSettings } from '@/store/settingsStore';

/**
 * jsdom doesn't provide the Notification API natively, so we install a
 * minimal fake and manipulate `Notification.permission` per test.
 */

class FakeNotification {
  static permission: NotificationPermission = 'default';
  static requestPermission = vi.fn(async () => FakeNotification.permission);
  constructor(public title: string, public options?: NotificationOptions) {
    FakeNotification.instances.push({ title, options });
  }
  static instances: Array<{ title: string; options?: NotificationOptions }> = [];
}

describe('notifications', () => {
  beforeEach(() => {
    FakeNotification.permission = 'default';
    FakeNotification.instances = [];
    vi.stubGlobal('Notification', FakeNotification);
    window.localStorage.clear();
    saveSettings({ sound: true, haptics: true, notifications: true });
    vi.useFakeTimers();
  });

  afterEach(() => {
    cancelCooldownNotification();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  describe('requestNotificationPermission', () => {
    it('returns true when already granted', async () => {
      FakeNotification.permission = 'granted';
      expect(await requestNotificationPermission()).toBe(true);
    });

    it('returns false when denied', async () => {
      FakeNotification.permission = 'denied';
      expect(await requestNotificationPermission()).toBe(false);
    });

    it('requests permission when default', async () => {
      FakeNotification.permission = 'default';
      FakeNotification.requestPermission.mockResolvedValueOnce('granted');
      const result = await requestNotificationPermission();
      expect(result).toBe(true);
      expect(FakeNotification.requestPermission).toHaveBeenCalled();
    });
  });

  describe('canNotify', () => {
    it('requires permission + settings both true', () => {
      FakeNotification.permission = 'granted';
      expect(canNotify()).toBe(true);

      saveSettings({ sound: true, haptics: true, notifications: false });
      expect(canNotify()).toBe(false);
    });

    it('returns false when permission is not granted', () => {
      FakeNotification.permission = 'default';
      expect(canNotify()).toBe(false);
    });
  });

  describe('scheduleCooldownNotification', () => {
    it('fires a Notification after the delta elapses', () => {
      FakeNotification.permission = 'granted';
      const when = Date.now() + 5000;
      scheduleCooldownNotification(when);
      expect(FakeNotification.instances).toHaveLength(0);
      vi.advanceTimersByTime(5001);
      expect(FakeNotification.instances).toHaveLength(1);
      expect(FakeNotification.instances[0]?.title).toMatch(/พร้อมรดน้ำ/);
    });

    it('does nothing when notifications setting is off', () => {
      FakeNotification.permission = 'granted';
      saveSettings({ sound: true, haptics: true, notifications: false });
      scheduleCooldownNotification(Date.now() + 1000);
      vi.advanceTimersByTime(2000);
      expect(FakeNotification.instances).toHaveLength(0);
    });

    it('cancels previous timer on re-schedule', () => {
      FakeNotification.permission = 'granted';
      scheduleCooldownNotification(Date.now() + 5000);
      scheduleCooldownNotification(Date.now() + 10_000);
      vi.advanceTimersByTime(5100);
      expect(FakeNotification.instances).toHaveLength(0);
      vi.advanceTimersByTime(5000);
      expect(FakeNotification.instances).toHaveLength(1);
    });

    it('cancelCooldownNotification prevents scheduled fire', () => {
      FakeNotification.permission = 'granted';
      scheduleCooldownNotification(Date.now() + 5000);
      cancelCooldownNotification();
      vi.advanceTimersByTime(10_000);
      expect(FakeNotification.instances).toHaveLength(0);
    });
  });
});
