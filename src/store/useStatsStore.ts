import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { PomodoroSession } from "../types";

interface StatsState {
  sessions: PomodoroSession[];
  clearSessions: () => void;
  recordPomodoroSession: (session: PomodoroSession) => void;
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set) => ({
      sessions: [],
      clearSessions: () => set({ sessions: [] }),
      recordPomodoroSession: (session) =>
        set((state) => {
          if (state.sessions.some((existing) => existing.id === session.id)) {
            return state;
          }

          return {
            sessions: [session, ...state.sessions]
          };
        })
    }),
    {
      name: "focusflow-stats",
      partialize: (state) => ({ sessions: state.sessions })
    }
  )
);
