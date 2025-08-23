import React, { type ReactElement } from 'react';
import { AppSidebar } from '@/components/navigation/AppSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppHeader } from './AppHeader';

export interface MainLayoutProps {
  pageTitle?: string;
  pageIcon?: ReactElement<React.HTMLAttributes<HTMLElement>>;
  children: React.ReactNode;
}

export const MainLayout = ({
  pageTitle,
  pageIcon,
  children,
}: MainLayoutProps) => {
  return (
    <SidebarProvider
      style={
        {
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <AppHeader title={pageTitle} icon={pageIcon} />
        <div className="flex-1 w-full p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};
