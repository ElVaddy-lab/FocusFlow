import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2, Pencil, Target } from "lucide-react";

import { useTranslation } from "../../hooks/useTranslation";
import { useGoalStore } from "../../store/useGoalStore";
import { useStatsStore } from "../../store/useStatsStore";
import type { DailyFocusGoal, FocusGoalMode } from "../../types";
import {
  getDailyGoalProgress,
  getDailyGoalTarget,
  isValidDailyGoalValue,
  MAX_DAILY_GOAL_MINUTES,
  MAX_DAILY_GOAL_POMODOROS,
  MIN_DAILY_GOAL_MINUTES,
  MIN_DAILY_GOAL_POMODOROS
} from "../../utils/goalUtils";
import {
  getTodaySessions,
  getTotalFocusMinutes
} from "../../utils/statsUtils";

function getGoalValue(goal: DailyFocusGoal, mode: FocusGoalMode): number {
  return mode === "minutes" ? goal.targetMinutes : goal.targetPomodoros;
}

function getGoalRange(mode: FocusGoalMode): { max: number; min: number } {
  return mode === "minutes"
    ? { max: MAX_DAILY_GOAL_MINUTES, min: MIN_DAILY_GOAL_MINUTES }
    : { max: MAX_DAILY_GOAL_POMODOROS, min: MIN_DAILY_GOAL_POMODOROS };
}

export function DailyGoalProgress() {
  const { t } = useTranslation();
  const mode = useGoalStore((state) => state.mode);
  const targetMinutes = useGoalStore((state) => state.targetMinutes);
  const targetPomodoros = useGoalStore((state) => state.targetPomodoros);
  const setGoal = useGoalStore((state) => state.setGoal);
  const sessions = useStatsStore((state) => state.sessions);
  const [isEditing, setIsEditing] = useState(false);
  const [draftMode, setDraftMode] = useState<FocusGoalMode>(mode);
  const [draftGoal, setDraftGoal] = useState<DailyFocusGoal>({
    mode,
    targetMinutes,
    targetPomodoros
  });
  const [draftValue, setDraftValue] = useState(
    String(getGoalTargetValue(mode, targetMinutes, targetPomodoros))
  );
  const [error, setError] = useState<string | null>(null);

  const goal = useMemo<DailyFocusGoal>(
    () => ({ mode, targetMinutes, targetPomodoros }),
    [mode, targetMinutes, targetPomodoros]
  );
  const todaySessions = useMemo(() => getTodaySessions(sessions), [sessions]);
  const todayMinutes = getTotalFocusMinutes(todaySessions);
  const progress = getDailyGoalProgress(
    goal,
    todayMinutes,
    todaySessions.length
  );
  const activeGoalLabel =
    mode === "minutes" ? t.goal.modes.minutes : t.goal.modes.pomodoros;
  const remainingLabel =
    mode === "minutes" ? t.goal.remainingMinutes : t.goal.remainingPomodoros;
  const completeLabel =
    mode === "minutes" ? t.goal.completeMinutes : t.goal.completePomodoros;

  function startEditing(): void {
    const nextGoal = { mode, targetMinutes, targetPomodoros };

    setDraftGoal(nextGoal);
    setDraftMode(mode);
    setDraftValue(String(getDailyGoalTarget(nextGoal)));
    setError(null);
    setIsEditing(true);
  }

  function cancelEditing(): void {
    setIsEditing(false);
    setError(null);
  }

  function selectDraftMode(nextMode: FocusGoalMode): void {
    setDraftMode(nextMode);
    setDraftValue(String(getGoalValue(draftGoal, nextMode)));
    setError(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const parsedValue = Number(draftValue);

    if (!isValidDailyGoalValue(draftMode, parsedValue)) {
      setError(t.goal.invalid);
      return;
    }

    setGoal({
      ...draftGoal,
      mode: draftMode,
      [draftMode === "minutes" ? "targetMinutes" : "targetPomodoros"]:
        parsedValue
    });
    setError(null);
    setIsEditing(false);
  }

  return (
    <section
      className="rounded-md border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      aria-labelledby="daily-goal-title"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            <Target
              aria-hidden="true"
              className="text-teal-600 dark:text-teal-300"
              size={17}
            />
            {t.goal.eyebrow}
          </p>
          <h3
            className="mt-1 text-xl font-semibold text-zinc-950 dark:text-white"
            id="daily-goal-title"
          >
            {t.goal.title}
          </h3>
        </div>

        {!isEditing && (
          <button
            className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-300 px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            onClick={startEditing}
            type="button"
          >
            <Pencil aria-hidden="true" size={16} />
            {t.common.edit}
          </button>
        )}
      </div>

      <div
        className={[
          "mt-5 grid gap-4",
          isEditing ? "lg:grid-cols-[minmax(0,1fr)_220px]" : ""
        ].join(" ")}
      >
        <div>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {activeGoalLabel}
              </p>
              <p className="mt-1 text-3xl font-semibold text-zinc-950 dark:text-white">
                {progress.current} / {progress.target}
              </p>
            </div>
            <span className="rounded-md border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-700 dark:border-zinc-700 dark:text-zinc-200">
              {Math.round(progress.percent)}%
            </span>
          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              aria-label={`${t.goal.progress}: ${Math.round(
                progress.percent
              )}%`}
              className="h-full rounded-full bg-teal-500 transition-all dark:bg-teal-400"
              role="progressbar"
              style={{ width: `${progress.percent}%` }}
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={Math.round(progress.percent)}
            />
          </div>

          <p className="mt-3 inline-flex min-h-6 items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            {progress.isComplete && (
              <CheckCircle2
                aria-hidden="true"
                className="text-teal-600 dark:text-teal-300"
                size={17}
              />
            )}
            {progress.isComplete
              ? completeLabel
              : `${progress.remaining} ${remainingLabel}`}
          </p>
        </div>

        {isEditing && (
          <form
            className="rounded-md border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-2 gap-2">
              {(["minutes", "pomodoros"] as FocusGoalMode[]).map(
                (option) => (
                  <button
                    className={[
                      "h-9 rounded-md border px-2 text-sm font-medium transition",
                      draftMode === option
                        ? "border-teal-500 bg-teal-50 text-teal-700 dark:border-teal-400 dark:bg-teal-950 dark:text-teal-200"
                        : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    ].join(" ")}
                    key={option}
                    onClick={() => selectDraftMode(option)}
                    type="button"
                  >
                    {t.goal.modes[option]}
                  </button>
                )
              )}
            </div>

            <label className="mt-3 grid gap-2">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                {t.goal.target}
              </span>
              <input
                className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-teal-400 dark:focus:ring-teal-950"
                inputMode="numeric"
                max={getGoalRange(draftMode).max}
                min={getGoalRange(draftMode).min}
                onChange={(event) => {
                  setDraftValue(event.target.value);
                  setError(null);
                }}
                type="number"
                value={draftValue}
              />
            </label>

            <p
              className="mt-2 min-h-5 text-sm text-red-600 dark:text-red-300"
              role={error ? "alert" : undefined}
            >
              {error}
            </p>

            <div className="mt-3 flex justify-end gap-2">
              <button
                className="h-9 rounded-md border border-zinc-300 px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                onClick={cancelEditing}
                type="button"
              >
                {t.common.cancel}
              </button>
              <button
                className="h-9 rounded-md bg-teal-600 px-3 text-sm font-semibold text-white transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-300 dark:bg-teal-500 dark:text-zinc-950 dark:hover:bg-teal-400"
                type="submit"
              >
                {t.common.save}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

function getGoalTargetValue(
  mode: FocusGoalMode,
  targetMinutes: number,
  targetPomodoros: number
): number {
  return mode === "minutes" ? targetMinutes : targetPomodoros;
}
