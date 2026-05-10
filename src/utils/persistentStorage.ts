import type { StateStorage } from "zustand/middleware";

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

export const persistentStorage: StateStorage = {
  getItem: async (key) => {
    const localValue = getLocalStorageValue(key);

    if (!window.focusFlow?.getPersistedValue) {
      return localValue;
    }

    const persistedValue = await window.focusFlow.getPersistedValue(key);

    if (persistedValue !== null) {
      return persistedValue;
    }

    if (localValue !== null) {
      await window.focusFlow.setPersistedValue(key, localValue);
    }

    return localValue;
  },
  removeItem: async (key) => {
    removeLocalStorageValue(key);
    await window.focusFlow?.removePersistedValue?.(key);
  },
  setItem: async (key, value) => {
    setLocalStorageValue(key, value);
    await window.focusFlow?.setPersistedValue?.(key, value);
  }
};
