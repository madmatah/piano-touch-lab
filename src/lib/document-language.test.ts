import { beforeEach, describe, expect, it } from 'bun:test';
import i18next, { type i18n } from 'i18next';

import { keepDocumentLanguage } from './document-language';

const startIn = async (lng: string) => {
  const root = document.createElement('html');
  const instance = i18next.createInstance();
  keepDocumentLanguage(instance, root);
  await instance.init({
    fallbackLng: 'en',
    lng,
    resources: {
      en: { translation: { Hello: 'Hello' } },
      fr: { translation: { Hello: 'Bonjour' } },
    },
  });
  return { instance, root };
};

describe('The keepDocumentLanguage() function', () => {
  let result: { instance: i18n; root: HTMLElement };

  describe('When the interface starts in a language it speaks', () => {
    beforeEach(async () => {
      result = await startIn('fr');
    });

    it('should give the document that language', () => {
      expect(result.root.lang).toBe('fr');
    });
  });

  describe('When the reader changes language', () => {
    beforeEach(async () => {
      result = await startIn('fr');
      await result.instance.changeLanguage('en');
    });

    it('should follow them', () => {
      expect(result.root.lang).toBe('en');
    });
  });

  describe('When the browser asks for a language in a region', () => {
    beforeEach(async () => {
      result = await startIn('fr-FR');
    });

    it('should name the language, not the region', () => {
      expect(result.root.lang).toBe('fr');
    });
  });

  describe('When the browser asks for a language the interface does not speak', () => {
    beforeEach(async () => {
      result = await startIn('de');
    });

    it('should give the document the fallback', () => {
      expect(result.root.lang).toBe('en');
    });
  });
});
