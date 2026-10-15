import { NavLink } from 'react-router-dom';

import { cn } from '@/lib/utils';

export interface SidebarStepItemProps {
  isActive: boolean;
  label: string;
  number: string;
  to: string;
  /** Counter or chevron shown at the end of the row. */
  trailing?: React.ReactNode;
}

/** One of the numbered steps of the workflow: 01 Measure, 02 Analyze… */
export const SidebarStepItem = ({
  isActive,
  label,
  number,
  to,
  trailing,
}: SidebarStepItemProps) => (
  <NavLink
    to={to}
    className={cn(
      'flex min-h-10 items-center gap-2.5 rounded-md px-2.5 text-[14.5px] font-medium text-foreground transition-colors short:min-h-8',
      'hover:bg-accent',
      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
      isActive && 'bg-accent shadow-[inset_0_0_0_1px_var(--input)]',
    )}
  >
    <span
      className={cn(
        'w-[18px] font-mono text-[11px] text-ptl-brass',
        // On the brass-tinted row of the page in hand, brass alone fell to
        // 4.3:1; a touch of ink brings it to 4.8.
        isActive &&
          'text-[color-mix(in_oklab,var(--ptl-brass)_88%,var(--foreground))]',
      )}
    >
      {number}
    </span>
    {label}
    {trailing}
  </NavLink>
);
