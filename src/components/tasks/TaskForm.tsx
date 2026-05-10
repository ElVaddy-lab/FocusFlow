import { FormEvent, useState } from "react";

import { useTranslation } from "../../hooks/useTranslation";
import type { TaskInput, TaskPriority } from "../../types";
import {
  MAX_ESTIMATED_POMODOROS,
  MAX_TASK_NOTES_LENGTH,
  MIN_ESTIMATED_POMODOROS,
  normalizeEstimatedPomodoros,
  normalizeTaskNotes,
  normalizeTaskPriority,
  normalizeTaskTitle
} from "../../utils/taskValidation";

interface TaskFormProps {
  initialEstimatedPomodoros?: number;
  initialNotes?: string;
  initialPriority?: TaskPriority;
  initialTitle?: string;
  onCancel?: () => void;
  onSubmit: (input: TaskInput) => void;
  submitLabel: string;
}

export function TaskForm({
  initialEstimatedPomodoros = 1,
  initialNotes = "",
  initialPriority = "medium",
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
  const [notes, setNotes] = useState(initialNotes);
  const [priority, setPriority] = useState<TaskPriority>(initialPriority);
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
      estimatedPomodoros: normalizedEstimate,
      notes: normalizeTaskNotes(notes),
      priority: normalizeTaskPriority(priority)
    });

    if (!initialTitle) {
      setTitle("");
      setEstimatedPomodoros(String(MIN_ESTIMATED_POMODOROS));
      setNotes("");
      setPriority("medium");
    }
  }

  return (
    <form
      className="grid gap-3 rounded-md border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      onKeyDown={(event) => {
        if (event.key === "Escape" && onCancel) {
          event.preventDefault();
          onCancel();
        }
      }}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_150px_160px]">
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

        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
            {t.task.fieldPriority}
          </span>
          <select
            className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-teal-400 dark:focus:ring-teal-950"
            onChange={(event) =>
              setPriority(normalizeTaskPriority(event.target.value))
            }
            value={priority}
          >
            <option value="high">{t.task.priority.high}</option>
            <option value="medium">{t.task.priority.medium}</option>
            <option value="low">{t.task.priority.low}</option>
          </select>
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
          {t.task.fieldNotes}
        </span>
        <textarea
          className="min-h-24 resize-y rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-teal-400 dark:focus:ring-teal-950"
          maxLength={MAX_TASK_NOTES_LENGTH}
          onChange={(event) => setNotes(event.target.value)}
          placeholder={t.task.notesPlaceholder}
          value={notes}
        />
      </label>

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
