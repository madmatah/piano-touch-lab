import React from 'react';

import { AppSidebar } from '@/components/navigation/AppSidebar';
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
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'var(--ptl-sidebar-width)',
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        {variant === 'app' ? (
          <PageHeader right={headerRight ?? <PianoIdentity />} />
        ) : null}
        {shouldDisplayDemoBanner ? <DemoProfileBanner /> : null}
        <main
          className={cn(
            variant === 'app' &&
              'flex w-full max-w-[1240px] flex-col gap-6 px-10 pt-8 pb-14 max-md:px-4 max-md:pt-6 max-md:pb-10',
            contentClassName,
          )}
        >
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};
