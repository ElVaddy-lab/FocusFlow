import { useState } from "react";

import { useTranslation } from "../../hooks/useTranslation";
import type { Task } from "../../types";
import { TaskForm } from "./TaskForm";

interface TaskItemProps {
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onUpdate: (
    id: string,
    input: Pick<Task, "title" | "estimatedPomodoros">
  ) => void;
  task: Task;
}

export function TaskItem({
  onDelete,
  onToggleStatus,
  onUpdate,
  task
}: TaskItemProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const isCompleted = task.status === "completed";

  if (isEditing) {
    return (
      <li>
        <TaskForm
          initialEstimatedPomodoros={task.estimatedPomodoros}
          initialTitle={task.title}
          onCancel={() => setIsEditing(false)}
          onSubmit={(input) => {
            onUpdate(task.id, input);
            setIsEditing(false);
          }}
          submitLabel={t.common.save}
        />
      </li>
    );
  }

  return (
    <li className="rounded-md border border-zinc-200 bg-white p-4 shadow-sm transition dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-3">
          <input
            checked={isCompleted}
            className="mt-1 h-4 w-4 rounded border-zinc-300 text-teal-600 focus:ring-teal-500 dark:border-zinc-700 dark:bg-zinc-950"
            onChange={() => onToggleStatus(task.id)}
            type="checkbox"
          />
          <span className="min-w-0">
            <span
              className={[
                "block break-words text-sm font-semibold",
                isCompleted
                  ? "text-zinc-400 line-through dark:text-zinc-500"
                  : "text-zinc-950 dark:text-white"
              ].join(" ")}
            >
              {task.title}
            </span>
            <span className="mt-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {task.estimatedPomodoros}{" "}
              {task.estimatedPomodoros === 1
                ? t.task.pomodoroSingular
                : t.task.pomodoroPlural}
            </span>
          </span>
        </label>

        <div className="flex shrink-0 gap-2">
          <button
            className="h-8 rounded-md border border-zinc-300 px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            onClick={() => setIsEditing(true)}
            type="button"
          >
            {t.common.edit}
          </button>
          <button
            className="h-8 rounded-md border border-red-200 px-3 text-sm font-medium text-red-700 transition hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950"
            onClick={() => onDelete(task.id)}
            type="button"
          >
            {t.common.delete}
          </button>
        </div>
      </div>
    </li>
  );
}
