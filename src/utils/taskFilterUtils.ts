import type { Task, TaskFilterState } from "../types";

export function filterTasks(tasks: Task[], filters: TaskFilterState): Task[] {
  const query = filters.query.trim().toLowerCase();

  return tasks.filter((task) => {
    const matchesQuery =
      query.length === 0 ||
      task.title.toLowerCase().includes(query) ||
      task.notes.toLowerCase().includes(query);
    const matchesPriority =
      filters.priority === "all" || task.priority === filters.priority;
    const matchesStatus =
      filters.status === "all" || task.status === filters.status;
    const matchesToday =
      filters.today === "all" ||
      (filters.today === "today" && task.isToday) ||
      (filters.today === "notToday" && !task.isToday);

    return matchesQuery && matchesPriority && matchesStatus && matchesToday;
  });
}
