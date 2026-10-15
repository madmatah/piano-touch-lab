import { format } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';

import { useKeyboard } from '@/hooks/keyboard/use-keyboard';
import { usePianoProfileState } from '@/hooks/store/use-piano-profile-store';
import { useTranslation } from '@/hooks/use-translation';

/**
 * The masthead of a printed sheet: what the document is on the left, which
 * instrument and when on the right.
 *
 * Hidden on screen — the page already says all of this in its own chrome,
 * which print hides.
 */
export const PrintHeader = ({ title }: { title: string }) => {
  const { currentLanguage, t } = useTranslation();
  const { brand, keyCount, model, serialNumber } = usePianoProfileState();
  const { keyboard } = useKeyboard();

  const keys = keyboard.getKeys();
  const range =
    keys.length > 0 ? `${keys[0]!.name}–${keys[keys.length - 1]!.name}` : null;

  const specification = [
    serialNumber
      ? t('S/N {{serialNumber}}', { ns: 'navigation', serialNumber })
      : null,
    t('{{count}} keys', { count: keyCount, ns: 'navigation' }),
    range,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <header className="ptl-print-only flex items-end justify-between gap-5 border-b-2 border-ptl-rule-strong pb-3.5">
      <div className="flex flex-col gap-1">
        <span className="font-serif text-[15px]">
          Piano Touch <em className="italic">Lab</em>
        </span>
        <h1 className="m-0 font-serif text-[34px] leading-none">{title}</h1>
      </div>
      <div className="flex flex-col items-end gap-[3px] text-[13px]">
        <span className="font-serif text-[18px]">
          {brand}
          {brand && model ? ' ' : null}
          {model ? <em className="italic">{model}</em> : null}
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {specification}
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {t('Printed on {{date}}', {
            date: format(new Date(), 'd MMMM yyyy', {
              locale: currentLanguage.startsWith('fr') ? fr : enUS,
            }),
          })}
        </span>
      </div>
    </header>
  );
};
