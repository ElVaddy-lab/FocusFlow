import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { AudioSettings } from "../types";
import { persistentStorage } from "../utils/persistentStorage";
import { migratePersistedStoreState } from "../utils/persistedStoreMigrations";

interface AudioSettingsState extends AudioSettings {
  setEnabled: (enabled: boolean) => void;
  setVolume: (volume: number) => void;
}

export const useAudioSettingsStore = create<AudioSettingsState>()(
  persist(
    (set) => ({
      enabled: true,
      setEnabled: (enabled) => set({ enabled }),
      setVolume: (volume) =>
        set({ volume: Math.min(1, Math.max(0, Number(volume) || 0)) }),
      volume: 0.6
    }),
    {
      name: "focusflow-audio-settings",
      migrate: (persistedState) =>
        migratePersistedStoreState("focusflow-audio-settings", persistedState),
      storage: createJSONStorage(() => persistentStorage),
      version: 1
    }
  )
);
