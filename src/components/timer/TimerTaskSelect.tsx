import { useEffect, useMemo } from "react";

import { useTranslation } from "../../hooks/useTranslation";
import type { Task } from "../../types";
import { sortTasksForFocusSelect } from "../../utils/taskUtils";

interface TimerTaskSelectProps {
  activeTaskId: string | null;
  disabled: boolean;
  onSelectTask: (taskId: string | null) => void;
  tasks: Task[];
}

export function TimerTaskSelect({
  activeTaskId,
  disabled,
  onSelectTask,
  tasks
}: TimerTaskSelectProps) {
  const { t } = useTranslation();
  const availableTasks = useMemo(
    () => sortTasksForFocusSelect(tasks),
    [tasks]
  );

  useEffect(() => {
    if (
      activeTaskId &&
      !availableTasks.some((task) => task.id === activeTaskId)
    ) {
      onSelectTask(null);
    }
  }, [activeTaskId, availableTasks, onSelectTask]);

  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-zinc-950 dark:text-white">
        {t.timer.focusTask}
      </span>
      <select
        className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-teal-400 dark:focus:ring-teal-950"
        disabled={disabled || availableTasks.length === 0}
        onChange={(event) => onSelectTask(event.target.value || null)}
        value={activeTaskId ?? ""}
      >
        <option value="">
          {availableTasks.length === 0
            ? t.timer.noActiveTasks
            : t.timer.noTaskSelected}
        </option>
        {availableTasks.map((task) => (
          <option key={task.id} value={task.id}>
            {[
              task.isToday ? t.task.todayShort : null,
              t.task.priority[task.priority],
              task.title
            ]
              .filter(Boolean)
              .join(" - ")}
          </option>
        ))}
      </select>
    </label>
  );
}
