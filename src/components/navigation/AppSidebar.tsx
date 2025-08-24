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

export const AppSidebar = () => {
  const { exportMeasures } = useExportMeasures();
  const { inputRef, onInputFileChange, triggerImport } = useImportMeasures();

  const menuEntries = [
    {
      icon: Scale,
      name: 'Measure',
      url: '/measure',
    },
    {
      icon: ChartLine,
      name: 'Analyze',
      url: '/analyze',
    },

    {
      icon: Settings2,
      name: 'Design',
      url: '/design',
    },
    {
      icon: BadgeQuestionMark,
      name: 'Help',
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
                <span className="text-base font-semibold">Piano Touch Lab</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuEntries.map((project) => (
                <AppSidebarItem
                  key={project.name}
                  destinationUrl={project.url}
                  label={project.name}
                  icon={<project.icon />}
                />
              ))}

              <Collapsible>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton asChild tooltip="Files">
                      <a className="cursor-pointer">
                        <FileText />
                        <span>Data</span>
                      </a>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
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
                                <span>Save to file</span>
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
                                <span>Load from file</span>
                              </a>
                            </div>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
