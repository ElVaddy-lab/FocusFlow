import type { TimerMode } from "../../types";
import { useTranslation } from "../../hooks/useTranslation";
import { TIMER_MODE_OPTIONS } from "../../utils/timerUtils";

interface TimerModeTabsProps {
  activeMode: TimerMode;
  disabled: boolean;
  onSelectMode: (mode: TimerMode) => void;
}

export function TimerModeTabs({
  activeMode,
  disabled,
  onSelectMode
}: TimerModeTabsProps) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-2 sm:grid-cols-3" role="tablist">
      {TIMER_MODE_OPTIONS.map((option) => {
        const isActive = option.id === activeMode;
        const modeCopy = t.timer.modes[option.id];

        return (
          <button
            aria-selected={isActive}
            className={[
              "rounded-md border px-3 py-2 text-left transition disabled:cursor-not-allowed disabled:opacity-60",
              isActive
                ? "border-teal-400 bg-teal-50 text-teal-900 dark:border-teal-500 dark:bg-teal-950 dark:text-teal-100"
                : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            ].join(" ")}
            disabled={disabled}
            key={option.id}
            onClick={() => onSelectMode(option.id)}
            role="tab"
            type="button"
          >
            <span className="block text-sm font-semibold">
              {modeCopy.label}
            </span>
            <span className="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">
              {modeCopy.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
