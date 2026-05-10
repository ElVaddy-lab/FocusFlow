import { Maximize2, Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

import { useTranslation } from "../../hooks/useTranslation";
import type { TimerSnapshot } from "../../types";

const defaultSnapshot: TimerSnapshot = {
  activeTaskTitle: null,
  formattedTime: "00:00",
  mode: "work",
  remainingSeconds: 0,
  status: "idle"
};

export function MiniTimerWindow() {
  const { t } = useTranslation();
  const [snapshot, setSnapshot] = useState<TimerSnapshot>(defaultSnapshot);
  const isRunning = snapshot.status === "running";

  useEffect(() => {
    return window.focusFlow?.onTimerSnapshot((nextSnapshot) => {
      setSnapshot({
        activeTaskTitle: nextSnapshot.activeTaskTitle,
        formattedTime: nextSnapshot.formattedTime,
        mode: nextSnapshot.mode as TimerSnapshot["mode"],
        remainingSeconds: nextSnapshot.remainingSeconds,
        status: nextSnapshot.status as TimerSnapshot["status"]
      });
    });
  }, []);

  return (
    <main className="grid min-h-screen place-items-center bg-zinc-950 p-4 text-white">
      <section className="w-full space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase text-teal-300">
              {t.timer.modes[snapshot.mode].label}
            </p>
            <h1 className="mt-1 truncate text-sm font-medium text-zinc-300">
              {snapshot.activeTaskTitle ?? t.timer.noFocusTask}
            </h1>
          </div>
          <span className="rounded-md border border-zinc-700 px-2 py-1 text-xs font-medium text-zinc-300">
            {t.timer.status[snapshot.status]}
          </span>
        </div>

        <p className="text-center text-5xl font-semibold tracking-normal">
          {snapshot.formattedTime}
        </p>

        <div className="grid grid-cols-3 gap-2">
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-teal-500 text-sm font-semibold text-zinc-950 transition hover:bg-teal-400"
            onClick={() =>
              void window.focusFlow?.sendTimerCommand(
                isRunning ? "pause" : "start"
              )
            }
            type="button"
          >
            {isRunning ? (
              <Pause aria-hidden="true" size={17} />
            ) : (
              <Play aria-hidden="true" size={17} />
            )}
            {isRunning ? t.common.pause : t.common.start}
          </button>
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-700 text-sm font-medium text-zinc-200 transition hover:bg-zinc-900"
            onClick={() => void window.focusFlow?.sendTimerCommand("reset")}
            type="button"
          >
            <RotateCcw aria-hidden="true" size={17} />
            {t.common.reset}
          </button>
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-700 text-sm font-medium text-zinc-200 transition hover:bg-zinc-900"
            onClick={() => void window.focusFlow?.showMainWindow()}
            type="button"
          >
            <Maximize2 aria-hidden="true" size={17} />
            {t.timer.open}
          </button>
        </div>
      </section>
    </main>
  );
}
