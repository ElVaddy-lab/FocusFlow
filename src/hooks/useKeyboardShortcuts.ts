import { useEffect } from "react";

import type { useTimer } from "./useTimer";

type TimerController = ReturnType<typeof useTimer>;

interface KeyboardShortcutOptions {
  activeSection: "dashboard" | "timer" | "settings";
  isStrictSessionActive: boolean;
  onLockedResetAttempt: () => void;
  timer: TimerController;
}

export function useKeyboardShortcuts({
  activeSection,
  isStrictSessionActive,
  onLockedResetAttempt,
  timer
}: KeyboardShortcutOptions): void {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (activeSection !== "timer" || isEditableTarget(event.target)) {
        return;
      }

      if (event.code === "Space") {
        event.preventDefault();

        if (timer.status === "running") {
          if (isStrictSessionActive) {
            onLockedResetAttempt();
            return;
          }

          timer.pauseTimer();
          return;
        }

        timer.startTimer();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeSection, isStrictSessionActive, onLockedResetAttempt, timer]);
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  );
}
