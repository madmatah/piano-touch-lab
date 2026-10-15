import React from 'react';

import { AppSidebar } from '@/components/navigation/AppSidebar';
import { AppSidebarTrigger } from '@/components/navigation/AppSidebarTrigger';
import { useAppNavigation } from '@/components/navigation/app-navigation';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

import { DemoProfileBanner } from './layout/DemoProfileBanner';
import { PageHeader } from './layout/PageHeader';
import { useDocumentTitle } from './layout/hooks/use-document-title';
import { PianoIdentity } from './layout/PianoIdentity';
import { PrintMargins } from './print/PrintMargins';

export interface MainLayoutProps {
  children: React.ReactNode;
  /** Replaces the default content container, for pages that run full-bleed. */
  contentClassName?: string;
  /** What sits on the right of the thin header bar. */
  headerRight?: React.ReactNode;
  /** Hides the demo strip on pages that are not about the instrument. */
  shouldDisplayDemoBanner?: boolean;
  /** `bare` drops the header bar and the content container (the home page). */
  variant?: 'app' | 'bare';
}

export const MainLayout = ({
  children,
  contentClassName,
  headerRight,
  shouldDisplayDemoBanner = true,
  variant = 'app',
}: MainLayoutProps) => {
  // Built here and handed down: deciding which pages are open means designing
  // the whole keyboard, and the sidebar and the breadcrumb both read it.
  const steps = useAppNavigation();
  useDocumentTitle(steps);
  const { t } = useTranslation();

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'var(--ptl-sidebar-width)',
        } as React.CSSProperties
      }
    >
      {/*
       * The first stop of the keyboard: past the sidebar, the header and the
       * banner, some twenty-five Tabs before a figure. Hidden until focused.
       */}
      <a
        href="#page-content"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-card focus-visible:px-4 focus-visible:py-2.5 focus-visible:text-sm focus-visible:font-semibold focus-visible:shadow-md"
      >
        {t('Skip to content')}
      </a>
      <AppSidebar steps={steps} />
      <PrintMargins />
      {/*
       * `min-w-0`: beside the sidebar, the page is a flex item, and a flex
       * item refuses by default to be narrower than the widest thing in it.
       * A figure holds a plot that will not go under 640px — it scrolls
       * sideways in its own frame instead — and without this that floor was
       * pushing the whole page, sidebar and header and all, off the right of
       * a window between 768 and 1010px wide.
       */}
      <SidebarInset className="min-w-0">
        {variant === 'app' ? (
          <PageHeader steps={steps} right={headerRight ?? <PianoIdentity />} />
        ) : (
          // The bare pages have no header bar to hold it, and the drawer
          // would otherwise have no handle at all on a phone. No wrapper:
          // the handle takes no room on the pages that do not show it.
          <AppSidebarTrigger className="mt-4 ml-4" />
        )}
        {shouldDisplayDemoBanner ? <DemoProfileBanner /> : null}
        {/*
         * A div, not a `main`: the sidebar inset above is already the page's
         * `main` landmark, and nesting two is invalid.
         */}
        <div
          id="page-content"
          tabIndex={-1}
          data-slot="page-content"
          className={cn(
            variant === 'app' &&
              'flex w-full max-w-[1720px] flex-col gap-6 px-10 pt-8 pb-14 max-md:px-4 max-md:pt-6 max-md:pb-10',
            contentClassName,
          )}
        >
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
