import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import frNavigation from '../locales/fr/navigation.json';
import frTranslation from '../locales/fr/translation.json';

import enNavigation from '../locales/en/navigation.json';
import enTranslation from '../locales/en/translation.json';

const resources = {
  en: {
    navigation: enNavigation,
    translation: enTranslation,
  },
  fr: {
    navigation: frNavigation,
    translation: frTranslation,
  },
};

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: process.env.NODE_ENV === 'development',
    detection: {
      caches: ['localStorage'],
      order: ['localStorage', 'navigator', 'htmlTag'],
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources,
  });

export default i18n;
