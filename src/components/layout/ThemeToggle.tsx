import type { ThemeMode } from "../../types";
import { useTranslation } from "../../hooks/useTranslation";

interface ThemeToggleProps {
  mode: ThemeMode;
  onToggle: () => void;
}

export function ThemeToggle({ mode, onToggle }: ThemeToggleProps) {
  const isDark = mode === "dark";
  const { t } = useTranslation();

  return (
    <label className="inline-flex cursor-pointer items-center gap-3 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-zinc-700">
      <span>{isDark ? t.common.dark : t.common.light}</span>
      <span className="relative inline-flex h-5 w-9 items-center rounded-full bg-zinc-200 transition dark:bg-teal-500">
        <input
          aria-label={t.settings.theme}
          checked={isDark}
          className="peer sr-only"
          onChange={onToggle}
          type="checkbox"
        />
        <span className="absolute left-1 h-3.5 w-3.5 rounded-full bg-white shadow-sm transition peer-checked:translate-x-4" />
      </span>
    </label>
  );
}
