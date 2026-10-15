import { format } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';
import { useEffect } from 'react';

import { usePianoProfileState } from '@/hooks/store/use-piano-profile-store';
import { usePrintDate } from '@/hooks/use-print-date';
import { useTranslation } from '@/hooks/use-translation';
import { printMarginsRule } from '@/lib/print/print-margins';

/**
 * Which piano, when, and which page, in the bottom margin of every printed
 * sheet.
 *
 * Renders nothing: the margin of a sheet is out of reach of the document, so
 * the words are handed to `@page` instead, for as long as a page is mounted.
 */
export const PrintMargins = () => {
  const { currentLanguage, t } = useTranslation();
  const { displayName, serialNumber } = usePianoProfileState();
  const printDate = usePrintDate();

  useEffect(() => {
    const identity = [
      'Piano Touch Lab',
      displayName,
      serialNumber
        ? t('S/N {{serialNumber}}', { ns: 'navigation', serialNumber })
        : null,
      t('Printed on {{date}}', {
        date: format(printDate, 'd MMMM yyyy', {
          locale: currentLanguage.startsWith('fr') ? fr : enUS,
        }),
      }),
    ]
      .filter(Boolean)
      .join(' · ');

    const style = document.createElement('style');
    style.media = 'print';
    style.textContent = printMarginsRule({ identity, pageLabel: t('page') });
    document.head.append(style);

    return () => {
      style.remove();
    };
  }, [currentLanguage, displayName, printDate, serialNumber, t]);

  return null;
};
