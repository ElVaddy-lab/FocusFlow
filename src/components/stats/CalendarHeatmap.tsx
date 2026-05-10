import { useMemo } from "react";

import { useTranslation } from "../../hooks/useTranslation";
import { useStatsStore } from "../../store/useStatsStore";
import { getCalendarHeatmapStats } from "../../utils/statsUtils";

const intensityClasses = [
  "bg-zinc-100 dark:bg-zinc-800",
  "bg-teal-100 dark:bg-teal-950",
  "bg-teal-300 dark:bg-teal-800",
  "bg-teal-500 dark:bg-teal-500",
  "bg-teal-700 dark:bg-teal-300"
];

export function CalendarHeatmap() {
  const { language, t } = useTranslation();
  const sessions = useStatsStore((state) => state.sessions);
  const locale = language === "uk" ? "uk-UA" : "en-US";
  const days = useMemo(
    () => getCalendarHeatmapStats(sessions, 84, new Date(), locale),
    [locale, sessions]
  );

  return (
    <article className="rounded-md border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {t.stats.lastTwelveWeeks}
          </p>
          <h4 className="mt-1 text-base font-semibold text-zinc-950 dark:text-white">
            {t.stats.calendarHeatmap}
          </h4>
        </div>
        <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
          <span>{t.stats.less}</span>
          {intensityClasses.map((className, index) => (
            <span
              aria-hidden="true"
              className={["h-3 w-3 rounded-sm", className].join(" ")}
              key={index}
            />
          ))}
          <span>{t.stats.more}</span>
        </div>
      </div>

      <div className="mt-5 grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto pb-1">
        {days.map((day) => (
          <div
            aria-label={`${day.label}: ${day.minutes} ${t.stats.minutes}, ${day.sessions} ${t.stats.sessions.toLowerCase()}`}
            className={[
              "h-4 w-4 shrink-0 rounded-sm border border-white dark:border-zinc-900",
              intensityClasses[day.intensity]
            ].join(" ")}
            key={day.date}
            role="img"
            title={`${day.label}: ${day.minutes} ${t.stats.minutes}, ${day.sessions} ${t.stats.sessions.toLowerCase()}`}
          />
        ))}
      </div>
    </article>
  );
}
