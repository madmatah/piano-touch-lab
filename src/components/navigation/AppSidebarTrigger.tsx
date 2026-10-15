import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { useSidebar } from '../ui/sidebar';
import { Menu } from 'lucide-react';

/**
 * The handle that brings the navigation back.
 *
 * On a phone the sidebar is a drawer and the handle is always needed. On a
 * desktop the sidebar is part of the page, so the handle stays out of the
 * way — until someone folds the sidebar away with ⌘B, which is the one state
 * the design has no other way out of. On a phone it is the only door to
 * the navigation, so it gets a fingertip's 44 px, as the mobile mockup does.
 */
export const AppSidebarTrigger = ({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) => {
  const { isMobile, openMobile, state, toggleSidebar } = useSidebar();
  const { t } = useTranslation();

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      aria-expanded={isMobile ? openMobile : state === 'expanded'}
      className={cn(
        'size-11 print:hidden lg:size-7',
        // Asked of the sidebar rather than of a breakpoint: below `lg` it is
        // a drawer, open or shut on its own, and the handle is the way back.
        !isMobile && state === 'expanded' && 'hidden',
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <Menu />
      <span className="sr-only">{t('Navigation', { ns: 'navigation' })}</span>
    </Button>
  );
};
