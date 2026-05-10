import { useMemo, useState } from "react";

import { useTranslation } from "../../hooks/useTranslation";
import { useTaskStore } from "../../store/useTaskStore";
import type { TaskFilterState } from "../../types";
import { filterTasks } from "../../utils/taskFilterUtils";
import { TaskFilters } from "./TaskFilters";
import { TaskForm } from "./TaskForm";
import { TaskItem } from "./TaskItem";

const defaultFilters: TaskFilterState = {
  priority: "all",
  query: "",
  status: "all",
  today: "all"
};

export function TaskList() {
  const { t } = useTranslation();
  const tasks = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const toggleTaskToday = useTaskStore((state) => state.toggleTaskToday);
  const toggleTaskStatus = useTaskStore((state) => state.toggleTaskStatus);
  const clearCompletedTasks = useTaskStore(
    (state) => state.clearCompletedTasks
  );
  const [filters, setFilters] = useState<TaskFilterState>(defaultFilters);

  const completedCount = useMemo(
    () => tasks.filter((task) => task.status === "completed").length,
    [tasks]
  );
  const remainingCount = tasks.length - completedCount;
  const filteredTasks = useMemo(
    () => filterTasks(tasks, filters),
    [filters, tasks]
  );

  return (
    <section className="space-y-4" aria-labelledby="task-manager-title">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {t.task.manager}
          </p>
          <h3
            className="mt-1 text-xl font-semibold text-zinc-950 dark:text-white"
            id="task-manager-title"
          >
            {t.task.title}
          </h3>
        </div>

        {completedCount > 0 && (
          <button
            className="h-9 rounded-md border border-zinc-300 px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            onClick={clearCompletedTasks}
            type="button"
          >
            {t.task.clearCompleted}
          </button>
        )}
      </div>

      <TaskForm onSubmit={addTask} submitLabel={t.task.addTask} />
      <TaskFilters filters={filters} onChange={setFilters} />

      <div className="flex flex-wrap gap-3 text-sm text-zinc-600 dark:text-zinc-300">
        <span>
          {remainingCount} {t.task.active}
        </span>
        <span>
          {completedCount} {t.task.completed}
        </span>
        <span>
          {tasks.length} {t.task.total}
        </span>
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-md border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
          {t.task.empty}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="rounded-md border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
          {t.task.noMatches}
        </div>
      ) : (
        <ul className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              onDelete={deleteTask}
              onToggleToday={toggleTaskToday}
              onToggleStatus={toggleTaskStatus}
              onUpdate={updateTask}
              task={task}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
