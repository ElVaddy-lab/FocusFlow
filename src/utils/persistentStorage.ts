import type { StateStorage } from "zustand/middleware";

import type { PersistedStoreKey, RendererErrorReport } from "../types";
import { sanitizePersistedStoreValue } from "./persistedStoreMigrations";

const persistedStoreKeys = new Set<PersistedStoreKey>([
  "focusflow-goal",
  "focusflow-language",
  "focusflow-stats",
  "focusflow-strict-mode",
  "focusflow-tasks",
  "focusflow-theme",
  "focusflow-timer"
]);

function getLocalStorageValue(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setLocalStorageValue(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Electron-backed storage remains the durable source in packaged builds.
  }
}

function removeLocalStorageValue(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore unavailable localStorage.
  }
}

function isPersistedStoreKey(key: string): key is PersistedStoreKey {
  return persistedStoreKeys.has(key as PersistedStoreKey);
}

function reportStorageError(context: string, error: unknown): void {
  const payload: RendererErrorReport = {
    context,
    message: error instanceof Error ? error.message : String(error)
  };

  if (error instanceof Error && error.stack) {
    payload.stack = error.stack;
  }

  void window.focusFlow?.reportError?.(payload);
}

function sanitizeValue(key: string, value: string | null): string | null {
  if (value === null) {
    return null;
  }

  if (!isPersistedStoreKey(key)) {
    return value;
  }

  const sanitizedValue = sanitizePersistedStoreValue(key, value);

  if (sanitizedValue === null) {
    reportStorageError(
      `persistentStorage.sanitize:${key}`,
      new Error("Persisted store value could not be parsed or validated.")
    );
  }

  return sanitizedValue;
}

export const persistentStorage: StateStorage = {
  getItem: async (key) => {
    const localValue = sanitizeValue(key, getLocalStorageValue(key));

    if (!window.focusFlow?.getPersistedValue) {
      return localValue;
    }

    try {
      const persistedValue = sanitizeValue(
        key,
        await window.focusFlow.getPersistedValue(key)
      );

      if (persistedValue !== null) {
        return persistedValue;
      }

      if (localValue !== null) {
        await window.focusFlow.setPersistedValue(key, localValue);
      }
    } catch (error) {
      reportStorageError(`persistentStorage.getItem:${key}`, error);
    }

    return localValue;
  },
  removeItem: async (key) => {
    removeLocalStorageValue(key);

    try {
      await window.focusFlow?.removePersistedValue?.(key);
    } catch (error) {
      reportStorageError(`persistentStorage.removeItem:${key}`, error);
    }
  },
  setItem: async (key, value) => {
    setLocalStorageValue(key, value);

    try {
      await window.focusFlow?.setPersistedValue?.(key, value);
    } catch (error) {
      reportStorageError(`persistentStorage.setItem:${key}`, error);
    }
  }
};
