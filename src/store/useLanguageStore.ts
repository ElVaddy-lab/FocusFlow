import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { AppLanguage } from "../types";
import { persistentStorage } from "../utils/persistentStorage";
import { migratePersistedStoreState } from "../utils/persistedStoreMigrations";

interface LanguageState {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (language) => set({ language })
    }),
    {
      name: "focusflow-language",
      migrate: (persistedState) =>
        migratePersistedStoreState("focusflow-language", persistedState),
      storage: createJSONStorage(() => persistentStorage),
      version: 1
    }
  )
);
