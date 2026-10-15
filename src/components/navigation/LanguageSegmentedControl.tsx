import { useCallback } from 'react';

import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

const LANGUAGES = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
] as const;

/**
 * The language switch of the sidebar footer: two ISO codes in one segment.
 *
 * The codes are not translated — `FR` reads as French in every language.
 */
export const LanguageSegmentedControl = ({
  className,
}: {
  className?: string;
}) => {
  const { changeLanguage, currentLanguage, t } = useTranslation();

  const select = useCallback(
    (code: string) => () => changeLanguage(code),
    [changeLanguage],
  );

  return (
    <div
      role="group"
      aria-label={t('Language', { ns: 'navigation' })}
      className={cn(
        'inline-flex overflow-hidden rounded-md border border-input',
        className,
      )}
    >
      {LANGUAGES.map((language) => {
        const isSelected = currentLanguage.startsWith(language.code);
        return (
          <button
            key={language.code}
            type="button"
            aria-label={language.name}
            aria-pressed={isSelected}
            onClick={select(language.code)}
            className={cn(
              'cursor-pointer px-[9px] py-1.5 font-mono text-[11px] transition-colors',
              isSelected
                ? 'bg-primary text-primary-foreground'
                : 'bg-transparent text-muted-foreground hover:bg-accent',
            )}
          >
            {language.code.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
};
