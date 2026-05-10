import type { DailyFocusStat, PomodoroSession, StreakStats } from "../types";

export function toDateKey(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getFocusMinutes(seconds: number): number {
  return Math.round(seconds / 60);
}

export function getTodaySessions(
  sessions: PomodoroSession[],
  now = new Date()
): PomodoroSession[] {
  const todayKey = toDateKey(now);

  return sessions.filter((session) => toDateKey(session.completedAt) === todayKey);
}

export function getTotalFocusMinutes(sessions: PomodoroSession[]): number {
  return sessions.reduce(
    (total, session) => total + getFocusMinutes(session.durationSeconds),
    0
  );
}

export function getDailyFocusStats(
  sessions: PomodoroSession[],
  dayCount = 7,
  now = new Date(),
  locale?: string
): DailyFocusStat[] {
  const dayFormatter = new Intl.DateTimeFormat(locale, {
    weekday: "short"
  });
  const statsByDate = sessions.reduce<Record<string, DailyFocusStat>>(
    (stats, session) => {
      const date = toDateKey(session.completedAt);
      const existing = stats[date] ?? {
        date,
        label: dayFormatter.format(new Date(session.completedAt)),
        minutes: 0,
        sessions: 0
      };

      stats[date] = {
        ...existing,
        minutes: existing.minutes + getFocusMinutes(session.durationSeconds),
        sessions: existing.sessions + 1
      };

      return stats;
    },
    {}
  );

  return Array.from({ length: dayCount }, (_, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (dayCount - 1 - index));
    const dateKey = toDateKey(date);

    return (
      statsByDate[dateKey] ?? {
        date: dateKey,
        label: dayFormatter.format(date),
        minutes: 0,
        sessions: 0
      }
    );
  });
}

export function getStreakStats(
  sessions: PomodoroSession[],
  now = new Date()
): StreakStats {
  const activeDates = new Set(
    sessions.map((session) => toDateKey(session.completedAt))
  );
  const todayKey = toDateKey(now);
  const activeToday = activeDates.has(todayKey);
  let currentStreak = 0;
  const cursor = new Date(now);

  while (activeDates.has(toDateKey(cursor))) {
    currentStreak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  const sortedDates = Array.from(activeDates).sort();
  let bestStreak = 0;
  let runningStreak = 0;
  let previousDate: Date | null = null;

  sortedDates.forEach((dateKey) => {
    const date = new Date(`${dateKey}T00:00:00`);

    if (!previousDate) {
      runningStreak = 1;
    } else {
      const nextExpectedDate = new Date(previousDate);
      nextExpectedDate.setDate(previousDate.getDate() + 1);
      runningStreak =
        toDateKey(nextExpectedDate) === dateKey ? runningStreak + 1 : 1;
    }

    bestStreak = Math.max(bestStreak, runningStreak);
    previousDate = date;
  });

  return {
    activeToday,
    bestStreak,
    currentStreak
  };
}
