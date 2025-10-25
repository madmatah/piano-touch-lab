import type { LucideIcon } from 'lucide-react';

export type SubmenuItem = {
  icon?: LucideIcon;
  name: string;
  isHidden?: boolean;
  isDisabled?: boolean;
} & ({ url: string; onClick?: never } | { onClick: () => void; url?: never });

export type MenuEntry = {
  icon: LucideIcon;
  name: string;
  badge?: MenuItemBadge;
} & (
  | { url: string; submenu?: never; shouldOpenFirstEntry?: never }
  | { submenu: SubmenuItem[]; url?: never; shouldOpenFirstEntry?: boolean }
);

export interface MenuItemBadge {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  tooltipContent?: string | React.ReactNode;
}
