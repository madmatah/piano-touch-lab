import {
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import React, { type ReactElement } from 'react';
import { NavLink } from 'react-router-dom';

export interface MainMenuItemProps {
  destinationUrl: string;
  label: string;
  icon?: ReactElement<React.HTMLAttributes<HTMLElement>>;
}

export const MainMenuItem: React.FC<MainMenuItemProps> = (
  props: MainMenuItemProps,
) => {
  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild>
        <NavLink
          to={props.destinationUrl}
          className="group/item flex flex-row gap items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-accent focus:bg-accent focus:text-accent-foreground transition-colors"
        >
          {props.icon && (
            <span className="mr-1">
              {React.isValidElement(props.icon)
                ? React.cloneElement(props.icon, {
                    className:
                      'group-hover/item:stroke-primary group-hover/item:scale-120 transition transition-duration-50',
                  })
                : props.icon}
            </span>
          )}
          {props.label}
        </NavLink>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};
