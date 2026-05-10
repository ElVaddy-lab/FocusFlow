import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { DailyFocusGoal, FocusGoalMode } from "../types";
import { DEFAULT_DAILY_FOCUS_GOAL } from "../utils/goalUtils";
import { persistentStorage } from "../utils/persistentStorage";

interface GoalState extends DailyFocusGoal {
  setGoal: (goal: DailyFocusGoal) => void;
  setGoalMode: (mode: FocusGoalMode) => void;
}

export const useGoalStore = create<GoalState>()(
  persist(
    (set) => ({
      ...DEFAULT_DAILY_FOCUS_GOAL,
      setGoal: (goal) => set(goal),
      setGoalMode: (mode) => set({ mode })
    }),
    {
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<GoalState> | undefined;

        return {
          ...currentState,
          mode: persisted?.mode ?? currentState.mode,
          targetMinutes:
            persisted?.targetMinutes ?? currentState.targetMinutes,
          targetPomodoros:
            persisted?.targetPomodoros ?? currentState.targetPomodoros
        };
      },
      name: "focusflow-goal",
      partialize: (state) => ({
        mode: state.mode,
        targetMinutes: state.targetMinutes,
        targetPomodoros: state.targetPomodoros
      }),
      storage: createJSONStorage(() => persistentStorage)
    }
  )
);
