import { useTranslation as useI18nTranslation } from 'react-i18next';

export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();

  const changeLanguage = (lng: string) => {
    void i18n.changeLanguage(lng);
  };

  return {
    changeLanguage,
    // The language the interface is shown in, not the one the browser asked
    // for: a German browser reads an English interface, and its numbers must
    // be written the English way to match.
    currentLanguage: i18n.resolvedLanguage ?? i18n.language,
    isReady: i18n.isInitialized,
    t,
  };
};
