import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupContent,
  SidebarMenuAction,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { NavLink } from 'react-router-dom';
import {
  BadgeQuestionMark,
  ChartLine,
  ChevronRight,
  FileDown,
  FileText,
  FileUp,
  FlaskConical,
  Scale,
  Settings2,
} from 'lucide-react';
import { AppSidebarItem } from './AppSidebarItem';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import { useExportMeasures } from '@/hooks/backup/use-export-measures';
import { useImportMeasures } from '../../hooks/backup/use-import-measures';
import { useTranslation } from '@/hooks/use-translation';
import { SidebarLanguageSwitcher } from './SidebarLanguageSwitcher';

export const AppSidebar = () => {
  const { exportMeasures } = useExportMeasures();
  const { inputRef, onInputFileChange, triggerImport } = useImportMeasures();
  const { t } = useTranslation();

  const menuEntries = [
    {
      icon: Scale,
      name: t('Measure', { ns: 'navigation' }),
      url: '/measure',
    },
    {
      icon: ChartLine,
      name: t('Analyze', { ns: 'navigation' }),
      url: '/analyze',
    },

    {
      icon: Settings2,
      name: t('Design', { ns: 'navigation' }),
      url: '/design',
    },
    {
      icon: BadgeQuestionMark,
      name: t('Help', { ns: 'navigation' }),
      url: '/help',
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <NavLink
                className="flex items-center gap-1 group/sidebar-header"
                to="/"
              >
                <FlaskConical className="!size-5 group-hover/sidebar-header:text-primary group-hover/sidebar-header:animate-[spin_800ms_ease-in-out] transition duration-150" />
                <span className="text-base font-semibold">
                  {t('Piano Touch Lab')}
                </span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuEntries.map((menuEntry, index) => (
                <AppSidebarItem
                  key={`menu-item-${index}`}
                  destinationUrl={menuEntry.url}
                  label={menuEntry.name}
                  icon={<menuEntry.icon />}
                />
              ))}

              <Collapsible>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton asChild tooltip="Files">
                      <a className="cursor-pointer">
                        <FileText />
                        <span>{t('File', { ns: 'navigation' })}</span>
                      </a>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRight />
                        <span className="sr-only">
                          {t('Toggle', { ns: 'navigation' })}
                        </span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <div>
                              <FileDown />
                              <a
                                onClick={exportMeasures}
                                className="cursor-pointer"
                              >
                                <span>{t('Export', { ns: 'navigation' })}</span>
                              </a>
                            </div>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <div>
                              <input
                                ref={inputRef}
                                type="file"
                                accept="application/json"
                                className="hidden"
                                onChange={onInputFileChange}
                              />
                              <FileUp />
                              <a
                                onClick={triggerImport}
                                className="cursor-pointer"
                              >
                                <span>{t('Import', { ns: 'navigation' })}</span>
                              </a>
                            </div>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                </SidebarMenuItem>
              </Collapsible>
              <SidebarSeparator />
              <SidebarLanguageSwitcher />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
