import { FormEvent, useMemo, useState } from "react";
import { Copy, Plus, Shield, X } from "lucide-react";

import { useTranslation } from "../../hooks/useTranslation";
import { useStrictModeStore } from "../../store/useStrictModeStore";
import {
  createHostsEntries,
  createWindowsHostsScript
} from "../../utils/blockerUtils";

export function StrictModePanel() {
  const { t } = useTranslation();
  const [domainInput, setDomainInput] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle"
  );
  const blockedSites = useStrictModeStore((state) => state.blockedSites);
  const enabled = useStrictModeStore((state) => state.enabled);
  const lockedResetAttempts = useStrictModeStore(
    (state) => state.lockedResetAttempts
  );
  const addBlockedSite = useStrictModeStore((state) => state.addBlockedSite);
  const removeBlockedSite = useStrictModeStore(
    (state) => state.removeBlockedSite
  );
  const toggleEnabled = useStrictModeStore((state) => state.toggleEnabled);

  const hostsEntries = useMemo(
    () => createHostsEntries(blockedSites),
    [blockedSites]
  );
  const windowsHostsScript = useMemo(
    () => createWindowsHostsScript(blockedSites),
    [blockedSites]
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (!addBlockedSite(domainInput)) {
      setFormError(t.settings.domainError);
      return;
    }

    setDomainInput("");
    setFormError(null);
  }

  async function handleCopyScript(): Promise<void> {
    if (!windowsHostsScript) {
      return;
    }

    try {
      await navigator.clipboard.writeText(windowsHostsScript);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  }

  return (
    <section className="space-y-5" aria-labelledby="strict-mode-title">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {t.settings.focusMode}
          </p>
          <h3
            className="mt-1 text-xl font-semibold text-zinc-950 dark:text-white"
            id="strict-mode-title"
          >
            {t.settings.strictMode}
          </h3>
        </div>

        <label className="inline-flex cursor-pointer items-center gap-3 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-zinc-700">
          <Shield aria-hidden="true" size={18} />
          <span>{enabled ? t.settings.on : t.settings.off}</span>
          <span className="relative inline-flex h-5 w-9 items-center rounded-full bg-zinc-200 transition dark:bg-zinc-800">
            <input
              aria-label={t.settings.toggleStrict}
              checked={enabled}
              className="peer sr-only"
              onChange={toggleEnabled}
              type="checkbox"
            />
            <span className="absolute left-1 h-3.5 w-3.5 rounded-full bg-white shadow-sm transition peer-checked:translate-x-4 peer-checked:bg-teal-500" />
          </span>
        </label>
      </div>

      <dl className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-md border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {t.settings.blockedSites}
          </dt>
          <dd className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white">
            {blockedSites.length}
          </dd>
        </div>
        <div className="rounded-md border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {t.settings.lockouts}
          </dt>
          <dd className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white">
            {lockedResetAttempts}
          </dd>
        </div>
        <div className="rounded-md border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {t.settings.hostsEntries}
          </dt>
          <dd className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white">
            {hostsEntries ? blockedSites.length * 2 : 0}
          </dd>
        </div>
      </dl>

      <div className="rounded-md border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {t.settings.blacklist}
            </p>
            <h3 className="mt-1 text-xl font-semibold text-zinc-950 dark:text-white">
              {t.settings.blockedDomains}
            </h3>
          </div>
        </div>

        <form
          className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"
          onSubmit={handleSubmit}
        >
          <label className="grid gap-2">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
              {t.settings.domain}
            </span>
            <input
              className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-teal-400 dark:focus:ring-teal-950"
              onChange={(event) => setDomainInput(event.target.value)}
              placeholder="example.com"
              type="text"
              value={domainInput}
            />
          </label>
          <button
            className="inline-flex h-10 items-center justify-center gap-2 self-end rounded-md bg-teal-600 px-4 text-sm font-semibold text-white transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-300 dark:bg-teal-500 dark:text-zinc-950 dark:hover:bg-teal-400"
            type="submit"
          >
            <Plus aria-hidden="true" size={18} />
            {t.common.add}
          </button>
        </form>

        <p
          className="mt-2 min-h-5 text-sm text-red-600 dark:text-red-300"
          role={formError ? "alert" : undefined}
        >
          {formError}
        </p>

        <ul className="mt-3 grid gap-2">
          {blockedSites.map((site) => (
            <li
              className="flex items-center justify-between gap-3 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950"
              key={site.id}
            >
              <span className="min-w-0 break-words text-sm font-medium text-zinc-800 dark:text-zinc-100">
                {site.domain}
              </span>
              <button
                aria-label={`${t.common.delete} ${site.domain}`}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-zinc-500 transition hover:bg-zinc-200 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                onClick={() => removeBlockedSite(site.id)}
                title={t.common.delete}
                type="button"
              >
                <X aria-hidden="true" size={18} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-md border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {t.settings.desktopBlocker}
            </p>
            <h3 className="mt-1 text-xl font-semibold text-zinc-950 dark:text-white">
              {t.settings.windowsHostsScript}
            </h3>
          </div>
          <button
            className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-300 px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            disabled={!windowsHostsScript}
            onClick={handleCopyScript}
            type="button"
          >
            <Copy aria-hidden="true" size={16} />
            {t.common.copy}
          </button>
        </div>

        <textarea
          className="mt-4 min-h-48 w-full resize-y rounded-md border border-zinc-300 bg-zinc-50 p-3 font-mono text-xs text-zinc-800 outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          readOnly
          value={windowsHostsScript}
        />
        <p
          className="mt-2 min-h-5 text-sm text-zinc-500 dark:text-zinc-400"
          role={copyState === "failed" ? "alert" : undefined}
        >
          {copyState === "copied" && t.common.copied}
          {copyState === "failed" && t.common.failedClipboard}
        </p>
      </div>
    </section>
  );
}
