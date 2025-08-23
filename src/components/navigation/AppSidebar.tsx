import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import { NavLink } from 'react-router-dom';
import {
  BadgeQuestionMark,
  ChartLine,
  FileDown,
  FlaskConical,
  Scale,
  Settings2,
} from 'lucide-react';
import { AppSidebarItem } from './AppSidebarItem';

export function AppSidebar() {
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
      icon: FileDown,
      name: 'Backup',
      url: '/backup',
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
