import { useState } from "react";

import { useTranslation } from "../../hooks/useTranslation";
import type { BackupResult } from "../../types";

export function BackupPanel() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<BackupResult | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  async function runBackupAction(action: "export" | "import"): Promise<void> {
    setIsBusy(true);

    try {
      const result =
        action === "export"
          ? await window.focusFlow?.exportBackup?.()
          : await window.focusFlow?.importBackup?.();

      setStatus(
        result ?? {
          message: t.backup.unavailable,
          success: false
        }
      );
    } catch (error) {
      setStatus({
        message: error instanceof Error ? error.message : t.backup.failed,
        success: false
      });
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <section className="rounded-md border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {t.backup.eyebrow}
          </p>
          <h3 className="mt-1 text-xl font-semibold text-zinc-950 dark:text-white">
            {t.backup.title}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            {t.backup.description}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            className="h-9 rounded-md border border-zinc-300 px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            disabled={isBusy}
            onClick={() => void runBackupAction("import")}
            type="button"
          >
            {t.backup.import}
          </button>
          <button
            className="h-9 rounded-md bg-teal-600 px-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-teal-500 dark:text-zinc-950 dark:hover:bg-teal-400"
            disabled={isBusy}
            onClick={() => void runBackupAction("export")}
            type="button"
          >
            {t.backup.export}
          </button>
        </div>
      </div>

      {status && (
        <p
          className={[
            "mt-4 rounded-md border px-3 py-2 text-sm",
            status.success
              ? "border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200"
              : "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
          ].join(" ")}
          role="status"
        >
          {status.message}
          {status.importedStores !== undefined
            ? ` ${status.importedStores} ${t.backup.storesImported}`
            : ""}
        </p>
      )}
    </section>
  );
}
