import { useEffect } from "react";

import type { useTimer } from "./useTimer";
import type { TimerCommand, TimerSnapshot } from "../types";

type TimerController = ReturnType<typeof useTimer>;

interface UseTimerBridgeOptions {
  activeTaskTitle: string | null;
  isStrictSessionActive: boolean;
  onLockedResetAttempt: () => void;
  timer: TimerController;
}

export function useTimerBridge({
  activeTaskTitle,
  isStrictSessionActive,
  onLockedResetAttempt,
  timer
}: UseTimerBridgeOptions) {
  useEffect(() => {
    const snapshot: TimerSnapshot = {
      activeTaskTitle,
      formattedTime: timer.formattedTime,
      mode: timer.mode,
      remainingSeconds: timer.remainingSeconds,
      status: timer.status
    };

    window.focusFlow?.publishTimerSnapshot(snapshot);
  }, [
    activeTaskTitle,
    timer.formattedTime,
    timer.mode,
    timer.remainingSeconds,
    timer.status
  ]);

  useEffect(() => {
    return window.focusFlow?.onTimerCommand((command) => {
      handleTimerCommand({
        command,
        isStrictSessionActive,
        onLockedResetAttempt,
        timer
      });
    });
  }, [isStrictSessionActive, onLockedResetAttempt, timer]);
}

function handleTimerCommand({
  command,
  isStrictSessionActive,
  onLockedResetAttempt,
  timer
}: {
  command: TimerCommand;
  isStrictSessionActive: boolean;
  onLockedResetAttempt: () => void;
  timer: TimerController;
}): void {
  if (command === "start") {
    timer.startTimer();
    return;
  }

  if (command === "pause") {
    if (isStrictSessionActive) {
      onLockedResetAttempt();
      return;
    }

    timer.pauseTimer();
    return;
  }

  if (command === "reset") {
    if (isStrictSessionActive) {
      onLockedResetAttempt();
      return;
    }

    timer.resetTimer();
  }
}
