import React, { useMemo, type ReactElement } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar';
import { Badge } from '../ui/badge';
import type { MenuItemBadge } from './AppSidebar.types';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '../ui/tooltip';

export interface AppSidebarItemProps {
  destinationUrl: string;
  label: string;
  badge?: MenuItemBadge;
  icon?: ReactElement<React.HTMLAttributes<HTMLElement>>;
}

export const AppSidebarItem: React.FC<AppSidebarItemProps> = (
  props: AppSidebarItemProps,
) => {
  const { pathname } = useLocation();
  const isActive = pathname === props.destinationUrl;
  const badge = props.badge;

  const iconClassName = isActive
    ? 'scale-120 transition transition-duration-200'
    : 'group-hover/item:stroke-primary group-hover/item:scale-120 transition transition-duration-200';
  const icon =
    props.icon && React.isValidElement(props.icon)
      ? React.cloneElement(props.icon, {
          className: iconClassName,
        })
      : props.icon;

  const badgeElement = useMemo(() => {
    if (!badge) {
      return null;
    }
    if (!badge.tooltipContent) {
      return <Badge variant={badge.variant}>{badge.label}</Badge>;
    }
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant={badge.variant}>{badge.label}</Badge>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            align="center"
            sideOffset={2}
            backgroundColor="bg-purple-100"
            textColor="text-purple-900"
            arrowClassName="bg-purple-100 fill-purple-100"
            className="border-0 border-purple-900"
            avoidCollisions={true}
          >
            {badge.tooltipContent}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }, [badge]);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <NavLink to={props.destinationUrl} className="group/item ">
          {icon ?? null}
          <span>{props.label}</span>
          {badgeElement}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
