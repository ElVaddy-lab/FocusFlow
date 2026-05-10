import { useEffect } from "react";

import { useTimerStore } from "../store/useTimerStore";
import { formatSeconds, getTimerProgress } from "../utils/timerUtils";

export function useTimer() {
  const activeTaskId = useTimerStore((state) => state.activeTaskId);
  const autoStartMode = useTimerStore((state) => state.autoStartMode);
  const completedWorkSessions = useTimerStore(
    (state) => state.completedWorkSessions
  );
  const durations = useTimerStore((state) => state.durations);
  const lastCompletedPomodoro = useTimerStore(
    (state) => state.lastCompletedPomodoro
  );
  const mode = useTimerStore((state) => state.mode);
  const remainingSeconds = useTimerStore((state) => state.remainingSeconds);
  const status = useTimerStore((state) => state.status);
  const pauseTimer = useTimerStore((state) => state.pauseTimer);
  const resetTimer = useTimerStore((state) => state.resetTimer);
  const setActiveTaskId = useTimerStore((state) => state.setActiveTaskId);
  const setAutoStartMode = useTimerStore((state) => state.setAutoStartMode);
  const setDurationMinutes = useTimerStore(
    (state) => state.setDurationMinutes
  );
  const setMode = useTimerStore((state) => state.setMode);
  const startTimer = useTimerStore((state) => state.startTimer);
  const tick = useTimerStore((state) => state.tick);

  useEffect(() => {
    if (status !== "running") {
      return undefined;
    }

    const intervalId = window.setInterval(tick, 1000);

    return () => window.clearInterval(intervalId);
  }, [status, tick]);

  const durationSeconds = durations[mode];

  return {
    activeTaskId,
    autoStartMode,
    completedWorkSessions,
    durationSeconds,
    durations,
    formattedTime: formatSeconds(remainingSeconds),
    lastCompletedPomodoro,
    mode,
    pauseTimer,
    progress: getTimerProgress(remainingSeconds, durationSeconds),
    remainingSeconds,
    resetTimer,
    setActiveTaskId,
    setAutoStartMode,
    setDurationMinutes,
    setMode,
    startTimer,
    status
  };
}
