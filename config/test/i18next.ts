import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import enNavigation from '../../src/locales/en/navigation.json';
import enTranslation from '../../src/locales/en/translation.json';

/*
 * The hooks under test translate through react-i18next, which wants an
 * instance to hand them. English, whose texts are the keys themselves: a test
 * reads what an English reader is shown.
 */
await i18next.use(initReactI18next).init({
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  lng: 'en',
  resources: {
    en: { navigation: enNavigation, translation: enTranslation },
  },
});
