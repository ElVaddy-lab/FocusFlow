import { Lock, Maximize2, Pause, Play, RotateCcw } from "lucide-react";

import type { useTimer } from "../../hooks/useTimer";
import { useTranslation } from "../../hooks/useTranslation";
import type { Task } from "../../types";
import { TimerAutoStartSettings } from "./TimerAutoStartSettings";
import { TimerDurationSettings } from "./TimerDurationSettings";
import { TimerModeTabs } from "./TimerModeTabs";
import { TimerProgressRing } from "./TimerProgressRing";
import { TimerTaskSelect } from "./TimerTaskSelect";

type TimerController = ReturnType<typeof useTimer>;

interface TimerPanelProps {
  isStrictSessionActive: boolean;
  onLockedResetAttempt: () => void;
  tasks: Task[];
  timer: TimerController;
}

export function TimerPanel({
  isStrictSessionActive,
  onLockedResetAttempt,
  tasks,
  timer
}: TimerPanelProps) {
  const { t } = useTranslation();
  const isRunning = timer.status === "running";
  const activeTask = tasks.find((task) => task.id === timer.activeTaskId);
  const modeLabel = t.timer.modes[timer.mode].label;

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="rounded-md border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {modeLabel}
            </p>
            <h3 className="mt-1 text-xl font-semibold text-zinc-950 dark:text-white">
              {activeTask?.title ?? t.timer.noFocusTask}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {isStrictSessionActive && (
              <span className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
                <Lock aria-hidden="true" size={16} />
                {t.timer.strict}
              </span>
            )}
            <span className="rounded-md border border-zinc-200 px-3 py-2 text-sm font-medium capitalize text-zinc-700 dark:border-zinc-700 dark:text-zinc-200">
              {t.timer.status[timer.status]}
            </span>
          </div>
        </div>

        <div className="mt-8">
          <TimerProgressRing progress={timer.progress}>
            <p className="text-5xl font-semibold text-zinc-950 dark:text-white">
              {timer.formattedTime}
            </p>
            <p className="mt-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {t.timer.session} {timer.completedWorkSessions + 1}
            </p>
          </TimerProgressRing>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {isRunning ? (
            <button
              className={[
                "inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-semibold transition focus:outline-none focus:ring-2",
                isStrictSessionActive
                  ? "bg-red-600 text-white hover:bg-red-700 focus:ring-red-300 dark:bg-red-500 dark:text-zinc-950 dark:hover:bg-red-400"
                  : "bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-300 dark:bg-teal-500 dark:text-zinc-950 dark:hover:bg-teal-400"
              ].join(" ")}
              onClick={
                isStrictSessionActive
                  ? onLockedResetAttempt
                  : timer.pauseTimer
              }
              type="button"
            >
              {isStrictSessionActive ? (
                <Lock aria-hidden="true" size={18} />
              ) : (
                <Pause aria-hidden="true" size={18} />
              )}
              {isStrictSessionActive ? t.timer.locked : t.common.pause}
            </button>
          ) : (
            <button
              className="inline-flex h-10 items-center gap-2 rounded-md bg-teal-600 px-4 text-sm font-semibold text-white transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-300 dark:bg-teal-500 dark:text-zinc-950 dark:hover:bg-teal-400"
              onClick={timer.startTimer}
              type="button"
            >
              <Play aria-hidden="true" size={18} />
              {t.common.start}
            </button>
          )}

          <button
            className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            onClick={
              isStrictSessionActive ? onLockedResetAttempt : timer.resetTimer
            }
            type="button"
          >
            <RotateCcw aria-hidden="true" size={18} />
            {t.common.reset}
          </button>
          <button
            className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            onClick={() => void window.focusFlow?.openMiniTimer()}
            type="button"
          >
            <Maximize2 aria-hidden="true" size={18} />
            {t.timer.mini}
          </button>
        </div>
      </div>

      <aside className="space-y-5">
        <TimerTaskSelect
          activeTaskId={timer.activeTaskId}
          disabled={isRunning || isStrictSessionActive}
          onSelectTask={timer.setActiveTaskId}
          tasks={tasks}
        />

        <TimerModeTabs
          activeMode={timer.mode}
          disabled={isRunning || isStrictSessionActive}
          onSelectMode={timer.setMode}
        />

        <TimerAutoStartSettings
          disabled={isStrictSessionActive}
          mode={timer.autoStartMode}
          onChangeMode={timer.setAutoStartMode}
        />

        <TimerDurationSettings
          disabled={isRunning || isStrictSessionActive}
          durations={timer.durations}
          onChangeDuration={timer.setDurationMinutes}
        />
      </aside>
    </section>
  );
}
