import type { AutoStartMode } from "../../types";
import { useTranslation } from "../../hooks/useTranslation";

const autoStartModes: AutoStartMode[] = ["manual", "breaks", "all"];

interface TimerAutoStartSettingsProps {
  disabled: boolean;
  mode: AutoStartMode;
  onChangeMode: (mode: AutoStartMode) => void;
}

export function TimerAutoStartSettings({
  disabled,
  mode,
  onChangeMode
}: TimerAutoStartSettingsProps) {
  const { t } = useTranslation();

  return (
    <section className="grid gap-3" aria-labelledby="timer-auto-start-title">
      <h3
        className="text-sm font-semibold text-zinc-950 dark:text-white"
        id="timer-auto-start-title"
      >
        {t.timer.autoStart.title}
      </h3>

      <div className="grid gap-2">
        {autoStartModes.map((option) => (
          <button
            className={[
              "rounded-md border px-3 py-2 text-left text-sm transition disabled:cursor-not-allowed disabled:opacity-60",
              mode === option
                ? "border-teal-500 bg-teal-50 text-teal-700 dark:border-teal-400 dark:bg-teal-950 dark:text-teal-200"
                : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-800"
            ].join(" ")}
            disabled={disabled}
            key={option}
            onClick={() => onChangeMode(option)}
            type="button"
          >
            <span className="block font-semibold">
              {t.timer.autoStart.modes[option].label}
            </span>
            <span className="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">
              {t.timer.autoStart.modes[option].description}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
