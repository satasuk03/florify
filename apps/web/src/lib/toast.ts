'use client';

import { create } from 'zustand';

/**
 * Minimal toast system. One message at a time — the app has nowhere
 * near enough notifications to justify a queue. Toasts live in the
 * store for ~3 seconds, then clear themselves.
 */

interface ToastState {
  message: string | null;
  show: (message: string, durationMs?: number) => void;
  clear: () => void;
}

let dismissTimer: ReturnType<typeof setTimeout> | null = null;

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  show: (message, durationMs = 3000) => {
    if (dismissTimer) clearTimeout(dismissTimer);
    set({ message });
    dismissTimer = setTimeout(() => {
      set({ message: null });
      dismissTimer = null;
    }, durationMs);
  },
  clear: () => {
    if (dismissTimer) {
      clearTimeout(dismissTimer);
      dismissTimer = null;
    }
    set({ message: null });
  },
}));

export function toast(message: string, durationMs?: number): void {
  useToastStore.getState().show(message, durationMs);
}
