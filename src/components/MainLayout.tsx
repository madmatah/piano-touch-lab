import React, { type ReactElement } from 'react';
import { AppSidebar } from '@/components/navigation/AppSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppHeader } from './AppHeader';
import { DemoProfileInformationCard } from './demo-profile-information/DemoProfileInformationCard';

export interface MainLayoutProps {
  pageTitle?: string;
  pageIcon?: ReactElement<React.HTMLAttributes<HTMLElement>>;
  shouldDisplayDemoCard?: boolean;
  children: React.ReactNode;
}

export const MainLayout = ({
  pageTitle,
  pageIcon,
  children,
  shouldDisplayDemoCard = true,
}: MainLayoutProps) => {
  return (
    <SidebarProvider
      style={
        {
          '--header-height': 'calc(var(--spacing) * 12)',
          '--sidebar-width': 'var(--ptl-sidebar-width)',
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        {shouldDisplayDemoCard ? <DemoProfileInformationCard /> : null}
        <AppHeader title={pageTitle} icon={pageIcon} />
        <div className="flex-1 w-full p-6 pl-10">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};
