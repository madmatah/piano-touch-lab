import { useTranslation as useI18nTranslation } from 'react-i18next';

export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();

  const changeLanguage = (lng: string) => {
    void i18n.changeLanguage(lng);
  };

  return {
    changeLanguage,
    currentLanguage: i18n.language,
    isReady: i18n.isInitialized,
    t,
  };
};
