import { useSyncExternalStore } from 'react';
import { Appearance } from 'react-native';

export type AppColorScheme = 'light' | 'dark';

export const COLOR_SCHEME_STORAGE_KEY = 'timesheets:color-scheme';
const subscribers = new Set<() => void>();

function canUseDOM() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export function getStoredColorScheme(): AppColorScheme | null {
  if (!canUseDOM()) {
    return null;
  }

  try {
    const value = window.localStorage.getItem(COLOR_SCHEME_STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

export function getInitialColorScheme(): AppColorScheme {
  const stored = getStoredColorScheme();

  if (stored) {
    return stored;
  }

  if (canUseDOM() && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
}

export function applyDocumentColorScheme(colorScheme: AppColorScheme) {
  if (!canUseDOM()) {
    return;
  }

  const backgroundColor = colorScheme === 'dark' ? '#020617' : '#f1f5f9';

  document.documentElement.classList.toggle('dark', colorScheme === 'dark');
  document.documentElement.classList.toggle('light', colorScheme === 'light');
  document.documentElement.style.colorScheme = colorScheme;
  document.documentElement.style.backgroundColor = backgroundColor;

  if (document.body) {
    document.body.style.backgroundColor = backgroundColor;
  }

  document.getElementById('root')?.style.setProperty('background-color', backgroundColor);
}

function safeSetNativeColorScheme(colorScheme: AppColorScheme) {
  const maybeSetColorScheme = Appearance.setColorScheme;

  if (typeof maybeSetColorScheme === 'function') {
    maybeSetColorScheme(colorScheme);
  }
}

function notifyColorSchemeChange() {
  subscribers.forEach((callback) => callback());
}

function subscribeColorScheme(callback: () => void) {
  subscribers.add(callback);

  const appearanceSubscription = Appearance.addChangeListener?.(() => {
    if (!getStoredColorScheme()) {
      applyDocumentColorScheme(getInitialColorScheme());
      callback();
    }
  });

  const mediaQuery = canUseDOM() ? window.matchMedia?.('(prefers-color-scheme: dark)') : undefined;
  const mediaQueryCallback = () => {
    if (!getStoredColorScheme()) {
      applyDocumentColorScheme(getInitialColorScheme());
      callback();
    }
  };

  mediaQuery?.addEventListener?.('change', mediaQueryCallback);

  return () => {
    subscribers.delete(callback);
    appearanceSubscription?.remove?.();
    mediaQuery?.removeEventListener?.('change', mediaQueryCallback);
  };
}

export function initializeColorScheme() {
  const colorScheme = getInitialColorScheme();
  applyDocumentColorScheme(colorScheme);
  safeSetNativeColorScheme(colorScheme);
}

export function setStoredColorScheme(colorScheme: AppColorScheme) {
  if (canUseDOM()) {
    try {
      window.localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, colorScheme);
    } catch {
      // Keep the in-memory/native appearance update even when browser storage is unavailable.
    }
  }

  applyDocumentColorScheme(colorScheme);
  safeSetNativeColorScheme(colorScheme);
  notifyColorSchemeChange();
}

export function useAppColorScheme(): AppColorScheme {
  return useSyncExternalStore(subscribeColorScheme, getInitialColorScheme, () => 'light');
}
