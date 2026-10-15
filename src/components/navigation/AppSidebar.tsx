import { ChevronDown, ChevronRight, CircleQuestionMark } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useMeasuredKeyCount } from '@/hooks/keyboard/use-measured-key-count';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

import { LanguageSegmentedControl } from './LanguageSegmentedControl';
import { SidebarBrand } from './SidebarBrand';
import { SidebarFileGroup } from './SidebarFileGroup';
import { SidebarPianoCard } from './SidebarPianoCard';
import { SidebarStepItem } from './SidebarStepItem';
import { SidebarSubItem } from './SidebarSubItem';
import type { NavigationStep } from './app-navigation';

export const AppSidebar = ({ steps }: { steps: NavigationStep[] }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { measured, total } = useMeasuredKeyCount();

  const [pianoStep, ...workflowSteps] = steps;

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-border">
      <SidebarContent className="gap-6 overflow-y-auto px-3.5 pt-[26px] pb-5">
        <SidebarBrand />
        {pianoStep ? <SidebarPianoCard label={pianoStep.label} /> : null}

        <nav
          aria-label={t('Workflow', { ns: 'navigation' })}
          className="flex flex-col gap-0.5"
        >
          {workflowSteps.map((step) => {
            const isActive =
              pathname === step.section ||
              pathname.startsWith(`${step.section}/`);
            const hasLinks = step.links.length > 0;

            return (
              <div key={step.section} className="flex flex-col gap-0.5">
                <SidebarStepItem
                  isActive={isActive && !hasLinks}
                  label={step.label}
                  number={step.number ?? ''}
                  to={step.to}
                  trailing={
                    hasLinks ? (
                      isActive ? (
                        <ChevronDown className="ml-auto size-3.5 text-ptl-ink-3" />
                      ) : (
                        <ChevronRight className="ml-auto size-3.5 text-ptl-ink-3" />
                      )
                    ) : (
                      <span className="ml-auto font-mono text-[11px] text-ptl-ink-3">
                        {measured}/{total}
                      </span>
                    )
                  }
                />
                {isActive && hasLinks
                  ? step.links.map((link) => (
                      <SidebarSubItem
                        key={link.to}
                        isActive={pathname === link.to}
                        isDisabled={link.isDisabled}
                        label={link.label}
                        tag={link.tag}
                        to={link.to}
                      />
                    ))
                  : null}
              </div>
            );
          })}
        </nav>

        <SidebarFileGroup />
      </SidebarContent>

      <SidebarFooter className="px-3.5 pt-0 pb-5">
        <div className="flex items-center justify-between gap-2 border-t border-border px-2.5 pt-3.5">
          <NavLink
            to="/help"
            className={cn(
              'inline-flex items-center gap-2 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground',
              pathname === '/help' && 'font-semibold text-foreground',
            )}
          >
            <CircleQuestionMark className="size-[17px]" />
            {t('Help', { ns: 'navigation' })}
          </NavLink>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <LanguageSegmentedControl />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
