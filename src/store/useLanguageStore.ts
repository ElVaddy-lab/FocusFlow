import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { AppLanguage } from "../types";

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
      name: "focusflow-language"
    }
  )
);
