import { FormEvent, useState } from "react";

import { useTranslation } from "../../hooks/useTranslation";
import type { TaskInput } from "../../types";
import {
  MAX_ESTIMATED_POMODOROS,
  MIN_ESTIMATED_POMODOROS,
  normalizeEstimatedPomodoros,
  normalizeTaskTitle
} from "../../utils/taskValidation";

interface TaskFormProps {
  initialEstimatedPomodoros?: number;
  initialTitle?: string;
  onCancel?: () => void;
  onSubmit: (input: TaskInput) => void;
  submitLabel: string;
}

export function TaskForm({
  initialEstimatedPomodoros = 1,
  initialTitle = "",
  onCancel,
  onSubmit,
  submitLabel
}: TaskFormProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState(initialTitle);
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(
    String(initialEstimatedPomodoros)
  );
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const normalizedTitle = normalizeTaskTitle(title);
    const normalizedEstimate = normalizeEstimatedPomodoros(
      Number(estimatedPomodoros)
    );

    if (!normalizedTitle) {
      setError(t.task.errorTitle);
      return;
    }

    setError(null);
    onSubmit({
      title: normalizedTitle,
      estimatedPomodoros: normalizedEstimate
    });

    if (!initialTitle) {
      setTitle("");
      setEstimatedPomodoros(String(MIN_ESTIMATED_POMODOROS));
    }
  }

  return (
    <form
      className="grid gap-3 rounded-md border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_150px]">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
            {t.task.fieldTitle}
          </span>
          <input
            className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-teal-400 dark:focus:ring-teal-950"
            maxLength={120}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={t.task.placeholder}
            type="text"
            value={title}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
            {t.task.fieldEstimate}
          </span>
          <input
            className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-teal-400 dark:focus:ring-teal-950"
            inputMode="numeric"
            max={MAX_ESTIMATED_POMODOROS}
            min={MIN_ESTIMATED_POMODOROS}
            onChange={(event) => setEstimatedPomodoros(event.target.value)}
            type="number"
            value={estimatedPomodoros}
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p
          className="min-h-5 text-sm text-red-600 dark:text-red-300"
          role={error ? "alert" : undefined}
        >
          {error}
        </p>

        <div className="flex gap-2">
          {onCancel && (
            <button
              className="h-9 rounded-md border border-zinc-300 px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              onClick={onCancel}
              type="button"
            >
              {t.common.cancel}
            </button>
          )}
          <button
            className="h-9 rounded-md bg-teal-600 px-3 text-sm font-semibold text-white transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-300 dark:bg-teal-500 dark:text-zinc-950 dark:hover:bg-teal-400"
            type="submit"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
