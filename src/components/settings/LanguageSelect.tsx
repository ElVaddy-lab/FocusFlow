import type { AppLanguage } from "../../types";
import { useTranslation } from "../../hooks/useTranslation";

const languageOptions: Array<{ label: string; value: AppLanguage }> = [
  { label: "English", value: "en" },
  { label: "Українська", value: "uk" }
];

export function LanguageSelect() {
  const { language, setLanguage, t } = useTranslation();

  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
        {t.common.language}
      </span>
      <select
        className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-teal-400 dark:focus:ring-teal-950"
        onChange={(event) => setLanguage(event.target.value as AppLanguage)}
        value={language}
      >
        {languageOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
