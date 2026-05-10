import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { BlockedSite } from "../types";
import { createBlockedSite } from "../utils/blockerUtils";
import { persistentStorage } from "../utils/persistentStorage";

interface StrictModeState {
  blockedSites: BlockedSite[];
  enabled: boolean;
  lockedResetAttempts: number;
  addBlockedSite: (input: string) => boolean;
  removeBlockedSite: (id: string) => void;
  recordLockedResetAttempt: () => void;
  setEnabled: (enabled: boolean) => void;
  toggleEnabled: () => void;
}

const defaultBlockedSites: BlockedSite[] = [
  { id: "youtube.com", domain: "youtube.com" },
  { id: "x.com", domain: "x.com" },
  { id: "reddit.com", domain: "reddit.com" }
];

export const useStrictModeStore = create<StrictModeState>()(
  persist(
    (set, get) => ({
      blockedSites: defaultBlockedSites,
      enabled: false,
      lockedResetAttempts: 0,
      addBlockedSite: (input) => {
        const site = createBlockedSite(input);

        if (!site) {
          return false;
        }

        if (get().blockedSites.some((blocked) => blocked.id === site.id)) {
          return false;
        }

        set((state) => ({ blockedSites: [...state.blockedSites, site] }));
        return true;
      },
      removeBlockedSite: (id) =>
        set((state) => ({
          blockedSites: state.blockedSites.filter((site) => site.id !== id)
        })),
      recordLockedResetAttempt: () =>
        set((state) => ({
          lockedResetAttempts: state.lockedResetAttempts + 1
        })),
      setEnabled: (enabled) => set({ enabled }),
      toggleEnabled: () => set((state) => ({ enabled: !state.enabled }))
    }),
    {
      name: "focusflow-strict-mode",
      storage: createJSONStorage(() => persistentStorage)
    }
  )
);
