import { Search } from "lucide-react";

import { useTranslation } from "../../hooks/useTranslation";
import type { TaskFilterState, TaskPriority, TaskStatus } from "../../types";

interface TaskFiltersProps {
  filters: TaskFilterState;
  onChange: (filters: TaskFilterState) => void;
}

export function TaskFilters({ filters, onChange }: TaskFiltersProps) {
  const { t } = useTranslation();

  function updateFilter<Key extends keyof TaskFilterState>(
    key: Key,
    value: TaskFilterState[Key]
  ): void {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="grid gap-3 rounded-md border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 lg:grid-cols-[minmax(0,1fr)_150px_150px_150px]">
      <label className="relative">
        <span className="sr-only">{t.task.search}</span>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
        />
        <input
          className="h-10 w-full rounded-md border border-zinc-300 bg-white pl-9 pr-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-teal-400 dark:focus:ring-teal-950"
          onChange={(event) => updateFilter("query", event.target.value)}
          placeholder={t.task.searchPlaceholder}
          type="search"
          value={filters.query}
        />
      </label>

      <select
        className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-teal-400 dark:focus:ring-teal-950"
        onChange={(event) =>
          updateFilter("priority", event.target.value as "all" | TaskPriority)
        }
        value={filters.priority}
      >
        <option value="all">{t.task.allPriorities}</option>
        <option value="high">{t.task.priority.high}</option>
        <option value="medium">{t.task.priority.medium}</option>
        <option value="low">{t.task.priority.low}</option>
      </select>

      <select
        className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-teal-400 dark:focus:ring-teal-950"
        onChange={(event) =>
          updateFilter("status", event.target.value as "all" | TaskStatus)
        }
        value={filters.status}
      >
        <option value="all">{t.task.allStatuses}</option>
        <option value="todo">{t.task.active}</option>
        <option value="completed">{t.task.completed}</option>
      </select>

      <select
        className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-teal-400 dark:focus:ring-teal-950"
        onChange={(event) =>
          updateFilter(
            "today",
            event.target.value as TaskFilterState["today"]
          )
        }
        value={filters.today}
      >
        <option value="all">{t.task.allTasks}</option>
        <option value="today">{t.task.todayOnly}</option>
        <option value="notToday">{t.task.notTodayOnly}</option>
      </select>
    </div>
  );
}
