import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type {
  AutoStartMode,
  CompletedPomodoroEvent,
  CompletedTimerEvent,
  TimerDurations,
  TimerMode,
  TimerStatus
} from "../types";
import {
  DEFAULT_TIMER_DURATIONS,
  getNextTimerMode,
  minutesToSeconds,
  shouldAutoStartNextMode
} from "../utils/timerUtils";
import { persistentStorage } from "../utils/persistentStorage";
import { migratePersistedStoreState } from "../utils/persistedStoreMigrations";

interface TimerState {
  activeTaskId: string | null;
  autoStartMode: AutoStartMode;
  completedWorkSessions: number;
  durations: TimerDurations;
  lastCompletedPomodoro: CompletedPomodoroEvent | null;
  lastCompletedTimerEvent: CompletedTimerEvent | null;
  mode: TimerMode;
  remainingSeconds: number;
  status: TimerStatus;
  pauseTimer: () => void;
  resetTimer: () => void;
  setActiveTaskId: (taskId: string | null) => void;
  setAutoStartMode: (mode: AutoStartMode) => void;
  setDurationMinutes: (mode: TimerMode, minutes: number) => void;
  setMode: (mode: TimerMode) => void;
  startTimer: () => void;
  tick: () => void;
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set) => ({
      activeTaskId: null,
      autoStartMode: "manual",
      completedWorkSessions: 0,
      durations: DEFAULT_TIMER_DURATIONS,
      lastCompletedPomodoro: null,
      lastCompletedTimerEvent: null,
      mode: "work",
      remainingSeconds: DEFAULT_TIMER_DURATIONS.work,
      status: "idle",
      pauseTimer: () =>
        set((state) =>
          state.status === "running" ? { status: "paused" } : state
        ),
      resetTimer: () =>
        set((state) => ({
          remainingSeconds: state.durations[state.mode],
          status: "idle"
        })),
      setActiveTaskId: (taskId) => set({ activeTaskId: taskId }),
      setAutoStartMode: (autoStartMode) => set({ autoStartMode }),
      setDurationMinutes: (mode, minutes) =>
        set((state) => {
          const nextDuration = minutesToSeconds(minutes);
          const durations = {
            ...state.durations,
            [mode]: nextDuration
          };

          if (state.mode !== mode) {
            return { durations };
          }

          return {
            durations,
            remainingSeconds: nextDuration,
            status: "idle"
          };
        }),
      setMode: (mode) =>
        set((state) => ({
          mode,
          remainingSeconds: state.durations[mode],
          status: "idle"
        })),
      startTimer: () =>
        set((state) =>
          state.remainingSeconds > 0 ? { status: "running" } : state
        ),
      tick: () =>
        set((state) => {
          if (state.status !== "running") {
            return state;
          }

          if (state.remainingSeconds > 1) {
            return { remainingSeconds: state.remainingSeconds - 1 };
          }

          const completedWorkSessions =
            state.mode === "work"
              ? state.completedWorkSessions + 1
              : state.completedWorkSessions;
          const nextMode = getNextTimerMode(state.mode, completedWorkSessions);
          const completedAt = new Date().toISOString();
          const lastCompletedTimerEvent = {
            completedAt,
            durationSeconds: state.durations[state.mode],
            id: `timer-${completedAt}-${state.mode}`,
            mode: state.mode,
            nextMode,
            taskId: state.activeTaskId
          };
          const lastCompletedPomodoro =
            state.mode === "work"
              ? {
                  completedAt,
                  durationSeconds: state.durations.work,
                  id: `pomodoro-${completedAt}-${completedWorkSessions}`,
                  taskId: state.activeTaskId
                }
              : state.lastCompletedPomodoro;

          return {
            completedWorkSessions,
            lastCompletedPomodoro,
            lastCompletedTimerEvent,
            mode: nextMode,
            remainingSeconds: state.durations[nextMode],
            status: shouldAutoStartNextMode(state.autoStartMode, nextMode)
              ? "running"
              : "idle"
          };
        })
    }),
    {
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<TimerState> | undefined;

        return {
          ...currentState,
          activeTaskId: persisted?.activeTaskId ?? currentState.activeTaskId,
          autoStartMode:
            persisted?.autoStartMode ?? currentState.autoStartMode,
          durations: {
            ...currentState.durations,
            ...persisted?.durations
          },
          remainingSeconds:
            persisted?.durations?.work ?? currentState.remainingSeconds
        };
      },
      name: "focusflow-timer",
      partialize: (state) => ({
        activeTaskId: state.activeTaskId,
        autoStartMode: state.autoStartMode,
        durations: state.durations
      }),
      migrate: (persistedState) =>
        migratePersistedStoreState("focusflow-timer", persistedState),
      storage: createJSONStorage(() => persistentStorage),
      version: 1
    }
  )
);
