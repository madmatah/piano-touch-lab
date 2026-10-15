import { NavLink } from 'react-router-dom';

import { useTranslation } from '@/hooks/use-translation';

/** The wordmark, with its rule-and-caption underline. */
export const SidebarBrand = () => {
  const { t } = useTranslation();

  return (
    <NavLink to="/" className="flex flex-col gap-2.5 px-2 text-foreground">
      <span className="font-serif text-[28px] leading-none font-medium">
        Piano Touch <span className="ptl-accent">Lab</span>
      </span>
      <span className="flex items-center gap-2">
        <span className="h-px flex-1 bg-input" />
        <span className="ptl-label text-[9.5px]">
          {t('Action balancing', { ns: 'navigation' })}
        </span>
        <span className="h-px flex-1 bg-input" />
      </span>
    </NavLink>
  );
};
