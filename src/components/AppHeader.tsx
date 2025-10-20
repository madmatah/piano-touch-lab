import { Separator } from './ui/separator';
import { useSidebar } from './ui/sidebar';
import { AppSidebarTrigger } from './navigation/AppSidebarTrigger';
import React, { type ReactElement } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { usePianoProfileState } from '@/hooks/store/use-piano-profile-store';

export interface AppHeaderProps {
  title?: string;
  icon?: ReactElement<React.HTMLAttributes<HTMLElement>>;
}

export const AppHeader = ({ title, icon }: AppHeaderProps) => {
  const { isMobile } = useSidebar();
  const { displayName } = usePianoProfileState();
  const { t } = useTranslation();
  const iconElement =
    icon && React.isValidElement(icon)
      ? React.cloneElement(icon, {
          className: 'w-11 h-11 stroke-primary pr-2',
        })
      : icon;

  return (
    <>
      {isMobile ? (
        <div className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            {isMobile ? (
              <>
                <AppSidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mx-2 data-[orientation=vertical]:h-4"
                />
              </>
            ) : null}
            <div className="flex flex-row items-center justify-between w-full">
              <h1 className="text-base font-medium flex-1">
                {t('Piano Touch Lab')}
              </h1>
              <div className="text-sm text-muted-foreground align-end truncate overflow-hidden flex-1">
                {displayName || ''}
              </div>
            </div>
          </div>
        </div>
      ) : null}{' '}
      {title ? (
        <header className="pt-8 print:hidden">
          <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance flex items-center justify-center gap-2 mb-5">
            {iconElement ?? null} {title}
          </h1>
        </header>
      ) : null}
    </>
  );
};
