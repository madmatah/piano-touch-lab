import type { i18n } from 'i18next';

/**
 * Keeps `<html lang>` on the language the interface is actually shown in.
 *
 * Screen readers pick their voice from it, and the page is served as English:
 * left alone, French would be read out with an English voice. i18next
 * announces the language it settles on at start-up and on every switch — the
 * resolved one, so a browser set to German is told the page is in English.
 */
export const keepDocumentLanguage = (
  instance: i18n,
  root: HTMLElement = document.documentElement,
): void => {
  instance.on('languageChanged', () => {
    root.lang = instance.resolvedLanguage ?? instance.language;
  });
};
