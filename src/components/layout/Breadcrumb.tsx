import { Fragment } from 'react';

import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

export interface Crumb {
  text: string;
  tone: 'step' | 'mid' | 'leaf';
}

const toneClassName: Record<Crumb['tone'], string> = {
  leaf: 'text-foreground',
  mid: '',
  step: 'text-ptl-brass',
};

/** The route, in monospaced capitals: `02 / ANALYZE / FRONT WEIGHT`. */
export const Breadcrumb = ({ crumbs }: { crumbs: Crumb[] }) => {
  const { t } = useTranslation();

  return (
    <nav
      aria-label={t('Breadcrumb', { ns: 'navigation' })}
      className="flex flex-wrap items-center gap-2 font-mono text-xs tracking-[0.06em] text-muted-foreground uppercase"
    >
      {crumbs.map((crumb, index) => (
        <Fragment key={`${crumb.text}-${String(index)}`}>
          {index > 0 ? (
            <span aria-hidden="true" className="text-input">
              /
            </span>
          ) : null}
          <span className={cn(toneClassName[crumb.tone])}>{crumb.text}</span>
        </Fragment>
      ))}
    </nav>
  );
};
