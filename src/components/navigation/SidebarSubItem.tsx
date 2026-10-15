import { NavLink } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface SidebarSubItemProps {
  isActive: boolean;
  isDisabled?: boolean;
  label: string;
  tag?: string;
  to: string;
}

/** A page inside a step, indented under it. */
export const SidebarSubItem = ({
  isActive,
  isDisabled,
  label,
  tag,
  to,
}: SidebarSubItemProps) => (
  <NavLink
    to={to}
    aria-disabled={isDisabled ?? undefined}
    tabIndex={isDisabled ? -1 : undefined}
    className={cn(
      'flex min-h-9 items-center gap-2.5 rounded-md py-1 pr-2.5 pl-[38px] text-sm text-muted-foreground transition-colors short:min-h-7 short:py-0.5',
      'hover:bg-accent hover:text-foreground',
      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
      isActive &&
        'bg-accent font-semibold text-foreground shadow-[inset_0_0_0_1px_var(--input)]',
      isDisabled && 'pointer-events-none opacity-50',
    )}
  >
    <span>{label}</span>
    {tag ? (
      <Badge variant="monoOutline" className="ml-auto">
        {tag}
      </Badge>
    ) : null}
  </NavLink>
);
