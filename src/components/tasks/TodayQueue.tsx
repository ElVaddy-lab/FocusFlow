import { ArrowDown, ArrowUp, CalendarX, CheckCircle2 } from "lucide-react";
import { useMemo } from "react";

import { useTranslation } from "../../hooks/useTranslation";
import { useTaskStore } from "../../store/useTaskStore";
import { getTodayTasks } from "../../utils/taskUtils";
import { TaskPriorityBadge } from "./TaskPriorityBadge";

export function TodayQueue() {
  const { t } = useTranslation();
  const tasks = useTaskStore((state) => state.tasks);
  const moveTodayTask = useTaskStore((state) => state.moveTodayTask);
  const toggleTaskStatus = useTaskStore((state) => state.toggleTaskStatus);
  const toggleTaskToday = useTaskStore((state) => state.toggleTaskToday);
  const todayTasks = useMemo(() => getTodayTasks(tasks), [tasks]);

  return (
    <section className="space-y-4" aria-labelledby="today-queue-title">
      <div>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {t.task.todayEyebrow}
        </p>
        <h3
          className="mt-1 text-xl font-semibold text-zinc-950 dark:text-white"
          id="today-queue-title"
        >
          {t.task.todayQueue}
        </h3>
      </div>

      {todayTasks.length === 0 ? (
        <div className="rounded-md border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
          {t.task.todayEmpty}
        </div>
      ) : (
        <ul className="space-y-3">
          {todayTasks.map((task, index) => (
            <li
              className="rounded-md border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              key={task.id}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-3">
                  <input
                    checked={task.status === "completed"}
                    className="mt-1 h-4 w-4 rounded border-zinc-300 text-teal-600 focus:ring-teal-500 dark:border-zinc-700 dark:bg-zinc-950"
                    onChange={() => toggleTaskStatus(task.id)}
                    type="checkbox"
                  />
                  <span className="min-w-0">
                    <span className="block break-words text-sm font-semibold text-zinc-950 dark:text-white">
                      {task.title}
                    </span>
                    {task.notes && (
                      <span className="mt-1 block line-clamp-2 whitespace-pre-wrap break-words text-sm text-zinc-600 dark:text-zinc-300">
                        {task.notes}
                      </span>
                    )}
                    <span className="mt-2 flex flex-wrap items-center gap-2">
                      <TaskPriorityBadge priority={task.priority} />
                      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        {task.estimatedPomodoros}{" "}
                        {task.estimatedPomodoros === 1
                          ? t.task.pomodoroSingular
                          : t.task.pomodoroPlural}
                      </span>
                    </span>
                  </span>
                </label>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <button
                    aria-label={`${t.task.moveUp} ${task.title}`}
                    className="grid h-8 w-8 place-items-center rounded-md border border-zinc-300 text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    disabled={index === 0}
                    onClick={() => moveTodayTask(task.id, "up")}
                    title={t.task.moveUp}
                    type="button"
                  >
                    <ArrowUp aria-hidden="true" size={16} />
                  </button>
                  <button
                    aria-label={`${t.task.moveDown} ${task.title}`}
                    className="grid h-8 w-8 place-items-center rounded-md border border-zinc-300 text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    disabled={index === todayTasks.length - 1}
                    onClick={() => moveTodayTask(task.id, "down")}
                    title={t.task.moveDown}
                    type="button"
                  >
                    <ArrowDown aria-hidden="true" size={16} />
                  </button>
                  <button
                    className="inline-flex h-8 items-center gap-2 rounded-md border border-zinc-300 px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    onClick={() => toggleTaskToday(task.id)}
                    type="button"
                  >
                    <CalendarX aria-hidden="true" size={16} />
                    {t.task.removeToday}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {todayTasks.length > 0 && (
        <p className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <CheckCircle2 aria-hidden="true" size={16} />
          {todayTasks.length} {t.task.todayCount}
        </p>
      )}
    </section>
  );
}
