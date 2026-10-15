import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'bun:test';
import i18next, { type i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';

import { useTranslation } from '@/hooks/use-translation';

const resources = {
  en: { translation: { Hello: 'Hello' } },
  fr: { translation: { Hello: 'Bonjour' } },
};

const instanceIn = async (lng: string): Promise<i18n> => {
  const instance = i18next.createInstance();
  await instance.init({ fallbackLng: 'en', lng, resources });
  return instance;
};

describe('The useTranslation hook', () => {
  let instance: i18n;
  let result: string;

  const currentLanguageWith = (provided: i18n) =>
    renderHook(() => useTranslation(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <I18nextProvider i18n={provided}>{children}</I18nextProvider>
      ),
    }).result.current.currentLanguage;

  describe('When the browser asks for a language the interface speaks', () => {
    beforeEach(async () => {
      instance = await instanceIn('fr-FR');
      result = currentLanguageWith(instance);
    });

    it('should give that language', () => {
      expect(result).toBe('fr');
    });
  });

  describe('When the browser asks for a language the interface does not speak', () => {
    beforeEach(async () => {
      instance = await instanceIn('de-DE');
      result = currentLanguageWith(instance);
    });

    it('should give the language the interface falls back to', () => {
      expect(result).toBe('en');
    });
  });
});
