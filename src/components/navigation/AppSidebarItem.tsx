import React, { type ReactElement } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar';

export interface AppSidebarItemProps {
  destinationUrl: string;
  label: string;
  icon?: ReactElement<React.HTMLAttributes<HTMLElement>>;
}

export const AppSidebarItem: React.FC<AppSidebarItemProps> = (
  props: AppSidebarItemProps,
) => {
  const { pathname } = useLocation();
  const isActive = pathname === props.destinationUrl;

  const iconClassName = isActive
    ? 'scale-120 transition transition-duration-200'
    : 'group-hover/item:stroke-primary group-hover/item:scale-120 transition transition-duration-200';
  const icon =
    props.icon && React.isValidElement(props.icon)
      ? React.cloneElement(props.icon, {
          className: iconClassName,
        })
      : props.icon;
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <NavLink to={props.destinationUrl} className="group/item ">
          {icon ?? null}
          <span>{props.label}</span>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
