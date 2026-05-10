import { CalendarDays, Clock, Flame, Trophy } from "lucide-react";
import { useMemo } from "react";

import { useTranslation } from "../../hooks/useTranslation";
import { useStatsStore } from "../../store/useStatsStore";
import {
  getDailyFocusStats,
  getFocusMinutes,
  getStreakStats,
  getTodaySessions,
  getTotalFocusMinutes
} from "../../utils/statsUtils";
import { CalendarHeatmap } from "./CalendarHeatmap";

function formatFocusMinutes(
  minutes: number,
  units: { hourShort: string; minuteShort: string }
): string {
  if (minutes < 60) {
    return `${minutes}${units.minuteShort}`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return remainingMinutes > 0
    ? `${hours}${units.hourShort} ${remainingMinutes}${units.minuteShort}`
    : `${hours}${units.hourShort}`;
}

export function StatsDashboard() {
  const { language, t } = useTranslation();
  const sessions = useStatsStore((state) => state.sessions);
  const locale = language === "uk" ? "uk-UA" : "en-US";
  const dailyStats = useMemo(
    () => getDailyFocusStats(sessions, 7, new Date(), locale),
    [locale, sessions]
  );
  const todaySessions = useMemo(() => getTodaySessions(sessions), [sessions]);
  const streakStats = useMemo(() => getStreakStats(sessions), [sessions]);
  const totalMinutes = useMemo(() => getTotalFocusMinutes(sessions), [sessions]);
  const todayMinutes = getTotalFocusMinutes(todaySessions);
  const maxDailyMinutes = Math.max(
    1,
    ...dailyStats.map((stat) => stat.minutes)
  );
  const recentSessions = sessions.slice(0, 5);

  return (
    <section className="space-y-4" aria-labelledby="stats-dashboard-title">
      <div>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {t.stats.statistics}
        </p>
        <h3
          className="mt-1 text-xl font-semibold text-zinc-950 dark:text-white"
          id="stats-dashboard-title"
        >
          {t.stats.focusHistory}
        </h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-md border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <Clock
            aria-hidden="true"
            className="text-teal-600 dark:text-teal-300"
            size={20}
          />
          <p className="mt-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {t.stats.today}
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white">
            {formatFocusMinutes(todayMinutes, t.units)}
          </p>
        </article>

        <article className="rounded-md border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <CalendarDays
            aria-hidden="true"
            className="text-sky-600 dark:text-sky-300"
            size={20}
          />
          <p className="mt-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {t.stats.sessions}
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white">
            {sessions.length}
          </p>
        </article>

        <article className="rounded-md border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <Flame
            aria-hidden="true"
            className="text-red-600 dark:text-red-300"
            size={20}
          />
          <p className="mt-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {t.stats.currentStreak}
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white">
            {streakStats.currentStreak}{t.units.dayShort}
          </p>
        </article>

        <article className="rounded-md border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <Trophy
            aria-hidden="true"
            className="text-amber-600 dark:text-amber-300"
            size={20}
          />
          <p className="mt-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {t.stats.bestStreak}
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white">
            {streakStats.bestStreak}{t.units.dayShort}
          </p>
        </article>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <article className="rounded-md border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {t.stats.lastSevenDays}
              </p>
              <h4 className="mt-1 text-base font-semibold text-zinc-950 dark:text-white">
                {t.stats.productiveMinutes}
              </h4>
            </div>
            <span className="rounded-md border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-200">
              {formatFocusMinutes(totalMinutes, t.units)}
            </span>
          </div>

          <div className="mt-6 grid h-56 grid-cols-7 items-end gap-2">
            {dailyStats.map((stat) => {
              const heightPercent =
                stat.minutes > 0 ? Math.max(8, (stat.minutes / maxDailyMinutes) * 100) : 2;

              return (
                <div
                  className="flex h-full min-w-0 flex-col justify-end gap-2"
                  key={stat.date}
                >
                  <div className="flex min-h-0 flex-1 items-end">
                    <div
                      aria-label={`${stat.label}: ${stat.minutes} ${t.stats.minutes}`}
                      className="w-full rounded-t-md bg-teal-500 transition dark:bg-teal-400"
                      role="img"
                      style={{ height: `${heightPercent}%` }}
                      title={`${stat.sessions} ${t.stats.sessions.toLowerCase()}, ${stat.minutes} ${t.stats.minutes}`}
                    />
                  </div>
                  <div className="text-center">
                    <p className="truncate text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      {stat.label}
                    </p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      {stat.minutes}{t.units.minuteShort}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <article className="rounded-md border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {t.stats.recentSessions}
          </p>
          <h4 className="mt-1 text-base font-semibold text-zinc-950 dark:text-white">
            {t.stats.completedPomodoros}
          </h4>

          {recentSessions.length === 0 ? (
            <div className="mt-4 rounded-md border border-dashed border-zinc-300 p-4 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              {t.stats.noSessions}
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {recentSessions.map((session) => (
                <li
                  className="border-b border-zinc-200 pb-3 last:border-b-0 last:pb-0 dark:border-zinc-800"
                  key={session.id}
                >
                  <p className="break-words text-sm font-medium text-zinc-950 dark:text-white">
                    {session.taskTitle ?? t.stats.untitled}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {formatFocusMinutes(
                      getFocusMinutes(session.durationSeconds),
                      t.units
                    )}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>

      <CalendarHeatmap />
    </section>
  );
}
