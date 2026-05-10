import type { TaskPriority } from "../../types";
import { useTranslation } from "../../hooks/useTranslation";

const priorityClasses: Record<TaskPriority, string> = {
  high: "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200",
  low: "border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300",
  medium:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200"
};

interface TaskPriorityBadgeProps {
  priority: TaskPriority;
}

export function TaskPriorityBadge({ priority }: TaskPriorityBadgeProps) {
  const { t } = useTranslation();

  return (
    <span
      className={[
        "inline-flex h-6 items-center rounded-md border px-2 text-xs font-semibold",
        priorityClasses[priority]
      ].join(" ")}
    >
      {t.task.priority[priority]}
    </span>
  );
}
