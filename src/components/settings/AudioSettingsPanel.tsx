import { Volume2, VolumeX } from "lucide-react";

import { useTranslation } from "../../hooks/useTranslation";
import { useAudioSettingsStore } from "../../store/useAudioSettingsStore";

export function AudioSettingsPanel() {
  const enabled = useAudioSettingsStore((state) => state.enabled);
  const setEnabled = useAudioSettingsStore((state) => state.setEnabled);
  const setVolume = useAudioSettingsStore((state) => state.setVolume);
  const volume = useAudioSettingsStore((state) => state.volume);
  const { t } = useTranslation();

  return (
    <section className="rounded-md border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {t.audio.eyebrow}
          </p>
          <h3 className="mt-1 text-xl font-semibold text-zinc-950 dark:text-white">
            {t.audio.title}
          </h3>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
            {t.audio.description}
          </p>
        </div>
        <button
          aria-pressed={enabled}
          className="inline-flex items-center gap-2 rounded-md border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          onClick={() => setEnabled(!enabled)}
          type="button"
        >
          {enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          {enabled ? t.settings.on : t.settings.off}
        </button>
      </div>

      <label className="mt-5 block max-w-sm">
        <span className="flex items-center justify-between text-sm font-medium text-zinc-700 dark:text-zinc-200">
          <span>{t.audio.volume}</span>
          <span>{Math.round(volume * 100)}%</span>
        </span>
        <input
          className="mt-3 w-full accent-teal-500"
          disabled={!enabled}
          max="1"
          min="0"
          onChange={(event) => setVolume(Number(event.target.value))}
          step="0.05"
          type="range"
          value={volume}
        />
      </label>
    </section>
  );
}
