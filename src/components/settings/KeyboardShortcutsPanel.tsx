import { Keyboard } from "lucide-react";

import { useTranslation } from "../../hooks/useTranslation";

const shortcuts = [
  ["Ctrl+Alt+S", "startPause"],
  ["Ctrl+Alt+R", "reset"],
  ["Ctrl+Alt+M", "mini"],
  ["Ctrl+Alt+T", "showMain"],
  ["Space", "timerSpace"],
  ["Escape", "escape"]
] as const;

export function KeyboardShortcutsPanel() {
  const { t } = useTranslation();

  return (
    <section className="rounded-md border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start gap-3">
        <span className="mt-1 rounded-md border border-zinc-200 p-2 text-zinc-600 dark:border-zinc-700 dark:text-zinc-300">
          <Keyboard aria-hidden="true" className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {t.shortcuts.eyebrow}
          </p>
          <h3 className="mt-1 text-xl font-semibold text-zinc-950 dark:text-white">
            {t.shortcuts.title}
          </h3>
        </div>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {shortcuts.map(([accelerator, key]) => (
          <div
            className="flex items-center justify-between gap-3 rounded-md border border-zinc-200 px-3 py-2 dark:border-zinc-800"
            key={accelerator}
          >
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {t.shortcuts.items[key]}
            </span>
            <kbd className="rounded-md border border-zinc-300 bg-zinc-50 px-2 py-1 text-xs font-semibold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200">
              {accelerator}
            </kbd>
          </div>
        ))}
      </div>
    </section>
  );
}
