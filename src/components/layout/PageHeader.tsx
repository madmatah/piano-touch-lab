import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { AppSidebarTrigger } from '@/components/navigation/AppSidebarTrigger';
import {
  locateInNavigation,
  type NavigationStep,
} from '@/components/navigation/app-navigation';
import { useTranslation } from '@/hooks/use-translation';

import { Breadcrumb, type Crumb } from './Breadcrumb';

export interface PageHeaderProps {
  /** What sits on the right of the bar: an identity, an indicator, an action. */
  right?: React.ReactNode;
  /** The navigation model, built once by the layout. */
  steps: NavigationStep[];
}

/**
 * The thin bar above every page: where you are on the left, what you can do
 * about it on the right. The page title lives in the page itself, not here.
 */
export const PageHeader = ({ right, steps }: PageHeaderProps) => {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const crumbs = useMemo<Crumb[]>(() => {
    if (pathname === '/help') {
      return [{ text: t('Help', { ns: 'navigation' }), tone: 'leaf' }];
    }

    const { link, step } = locateInNavigation(steps, pathname);
    if (!step) {
      return [];
    }

    return [
      { text: step.number, tone: 'step' },
      { text: step.label, tone: link ? 'mid' : 'leaf' },
      ...(link ? [{ text: link.label, tone: 'leaf' as const }] : []),
    ];
  }, [pathname, steps, t]);

  return (
    <div
      data-slot="page-header"
      className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-10 py-3.5 max-md:px-4 print:hidden"
    >
      <div className="flex items-center gap-2">
        <AppSidebarTrigger className="-ml-1" />
        <Breadcrumb crumbs={crumbs} />
      </div>
      <div className="flex flex-wrap items-center gap-3.5">{right}</div>
    </div>
  );
};
