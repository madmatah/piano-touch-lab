import React from 'react';

import { AppSidebar } from '@/components/navigation/AppSidebar';
import { AppSidebarTrigger } from '@/components/navigation/AppSidebarTrigger';
import { useAppNavigation } from '@/components/navigation/app-navigation';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

import { DemoProfileBanner } from './layout/DemoProfileBanner';
import { PageHeader } from './layout/PageHeader';
import { PianoIdentity } from './layout/PianoIdentity';

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

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'var(--ptl-sidebar-width)',
        } as React.CSSProperties
      }
    >
      <AppSidebar steps={steps} />
      <SidebarInset>
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
          data-slot="page-content"
          className={cn(
            variant === 'app' &&
              'flex w-full max-w-[1240px] flex-col gap-6 px-10 pt-8 pb-14 max-md:px-4 max-md:pt-6 max-md:pb-10',
            contentClassName,
          )}
        >
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
