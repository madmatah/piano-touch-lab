import { forwardRef } from 'react';
import { SidebarMenuButton } from '../ui/sidebar';

export interface AppSidebarMenuButtonProps {
  isActive?: boolean;
  children: React.ReactNode;
}

export const AppSidebarMenuButton = forwardRef(
  (props: AppSidebarMenuButtonProps, ref: React.Ref<HTMLButtonElement>) => {
    return (
      <SidebarMenuButton
        ref={ref}
        asChild
        className="text-sm h-8 [&>svg]:size-4 xl:text-base xl:h-10 xl:[&>svg]:size-5"
        {...props}
      />
    );
  },
);
