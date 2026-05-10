import { translations } from "../i18n/translations";
import { useLanguageStore } from "../store/useLanguageStore";

export function useTranslation() {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  return {
    language,
    setLanguage,
    t: translations[language]
  };
}
