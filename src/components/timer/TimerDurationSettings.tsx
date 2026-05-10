import type { TimerDurations, TimerMode } from "../../types";
import { useTranslation } from "../../hooks/useTranslation";
import {
  MAX_TIMER_MINUTES,
  MIN_TIMER_MINUTES,
  TIMER_MODE_OPTIONS,
  secondsToMinutes
} from "../../utils/timerUtils";

interface TimerDurationSettingsProps {
  disabled: boolean;
  durations: TimerDurations;
  onChangeDuration: (mode: TimerMode, minutes: number) => void;
}

export function TimerDurationSettings({
  disabled,
  durations,
  onChangeDuration
}: TimerDurationSettingsProps) {
  const { t } = useTranslation();

  return (
    <section className="grid gap-3" aria-labelledby="timer-durations-title">
      <h3
        className="text-sm font-semibold text-zinc-950 dark:text-white"
        id="timer-durations-title"
      >
        {t.timer.sessionLengths}
      </h3>

      <div className="grid gap-3 sm:grid-cols-3">
        {TIMER_MODE_OPTIONS.map((option) => (
          <label className="grid gap-2" key={option.id}>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
              {t.timer.modes[option.id].label}
            </span>
            <input
              className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-teal-400 dark:focus:ring-teal-950"
              disabled={disabled}
              inputMode="numeric"
              max={MAX_TIMER_MINUTES}
              min={MIN_TIMER_MINUTES}
              onChange={(event) =>
                onChangeDuration(option.id, Number(event.target.value))
              }
              type="number"
              value={secondsToMinutes(durations[option.id])}
            />
          </label>
        ))}
      </div>
    </section>
  );
}
