import { describe, expect, it } from 'bun:test';
import i18next from 'i18next';

import { keepDocumentLanguage } from './document-language';

/** A private instance: the application's own is never initialised in tests. */
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

describe('The language of the document', () => {
  it('should be the one the interface starts in', async () => {
    expect((await startIn('fr')).root.lang).toBe('fr');
  });

  it('should follow the reader to another language', async () => {
    const { instance, root } = await startIn('fr');
    await instance.changeLanguage('en');
    expect(root.lang).toBe('en');
  });

  it('should name the language, not the region the browser asked for', async () => {
    expect((await startIn('fr-FR')).root.lang).toBe('fr');
  });

  it('should be the fallback for a language the interface does not speak', async () => {
    expect((await startIn('de')).root.lang).toBe('en');
  });
});
