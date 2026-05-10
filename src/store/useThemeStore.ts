import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { ThemeMode } from "../types";
import { persistentStorage } from "../utils/persistentStorage";
import { migratePersistedStoreState } from "../utils/persistedStoreMigrations";

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: "light",
      setMode: (mode) => set({ mode }),
      toggleMode: () =>
        set((state) => ({ mode: state.mode === "light" ? "dark" : "light" }))
    }),
    {
      name: "focusflow-theme",
      migrate: (persistedState) =>
        migratePersistedStoreState("focusflow-theme", persistedState),
      storage: createJSONStorage(() => persistentStorage),
      version: 1
    }
  )
);
