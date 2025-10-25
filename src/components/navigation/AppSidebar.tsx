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
import { NavLink, useLocation } from 'react-router-dom';
import {
  BadgeQuestionMark,
  ChartLine,
  ChevronRight,
  FileDown,
  FilePlus,
  FileText,
  FileUp,
  FlaskConical,
  Piano,
  Scale,
  Settings2,
} from 'lucide-react';
import { AppSidebarItem } from './AppSidebarItem';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import { useExportBackupFile } from '@/hooks/backup/use-export-backup-file';
import { useImportBackupFile } from '../../hooks/backup/use-import-backup-file';
import { useTranslation } from '@/hooks/use-translation';
import { SidebarLanguageSwitcher } from './SidebarLanguageSwitcher';
import { useMeasureOptions } from '@/hooks/store/use-measure-options-store';
import { useAnalyzedKeyboard } from '@/hooks/keyboard/use-analyzed-keyboard';
import { useDesignedKeyboard } from '@/hooks/keyboard/use-designed-keyboard';
import { useMemo } from 'react';
import { usePianoProfileState } from '@/hooks/store/use-piano-profile-store';
import { useNewProfileDialog } from '@/contexts/new-profile-dialog-context';
import type { MenuEntry, SubmenuItem } from './AppSidebar.types';
import { AppSidebarMenuButton } from './AppSidebarMenuButton';

export const AppSidebar = () => {
  const { exportBackupFile } = useExportBackupFile();
  const { inputRef, onInputFileChange, triggerImport } = useImportBackupFile();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { useSupportSpringMeasurements } = useMeasureOptions();
  const { displayName, isDemoProfile } = usePianoProfileState();
  const analyzedKeyboard = useAnalyzedKeyboard();
  const designedKeyboard = useDesignedKeyboard(analyzedKeyboard);
  const { openNewProfileDialog } = useNewProfileDialog();

  const isDesignCompleted = useMemo(() => {
    const requiredDataPercentage = 0.8;
    return (
      designedKeyboard
        .mapToArray((key) => key.payload.downWeightWithoutSpringSupport)
        .filter((v) => v !== undefined && v !== null).length >=
      Math.round(designedKeyboard.size * requiredDataPercentage)
    );
  }, [designedKeyboard]);

  const menuEntries: MenuEntry[] = [
    {
      badge: isDemoProfile
        ? {
            label: 'Demo',
            tooltipContent: t(
              'This is a sample piano profile to help you discover the application.',
              { ns: 'navigation' },
            ),
            variant: 'outline',
          }
        : undefined,
      icon: Piano,
      name: displayName || t('Piano', { ns: 'navigation' }),
      url: '/piano',
    },
    {
      icon: Scale,
      name: t('Measure', { ns: 'navigation' }),
      url: '/measure',
    },
    {
      icon: ChartLine,
      name: t('Analyze', { ns: 'navigation' }),
      shouldOpenFirstEntry: true,
      submenu: [
        {
          name: t('Touch Weight', { ns: 'navigation' }),
          url: '/analyze/touch-weight',
        },
        {
          name: t('Front Weight', { ns: 'navigation' }),
          url: '/analyze/front-weight',
        },
        {
          name: t('Strike Weight', { ns: 'navigation' }),
          url: '/analyze/strike-weight',
        },
        {
          name: t('Strike Weight Ratio', { ns: 'navigation' }),
          url: '/analyze/strike-weight-ratio',
        },
        {
          isHidden: !useSupportSpringMeasurements,
          name: t('Wippen Support Springs', { ns: 'navigation' }),
          url: '/analyze/wippen-support-springs',
        },
        {
          name: t('Data Sheet', { ns: 'navigation' }),
          url: '/analyze/data-sheet',
        },
      ],
    },
    {
      icon: Settings2,
      name: t('Design', { ns: 'navigation' }),
      shouldOpenFirstEntry: true,
      submenu: [
        {
          name: t('Wippen Support Springs', { ns: 'navigation' }),
          url: '/design/wippen-support-springs',
        },
        {
          name: t('Front Weight', { ns: 'navigation' }),
          url: '/design/front-weight',
        },
        {
          name: t('Strike Weight', { ns: 'navigation' }),
          url: '/design/strike-weight',
        },
        {
          name: t('Strike Weight Ratio', { ns: 'navigation' }),
          url: '/design/strike-weight-ratio',
        },
        {
          isDisabled: !isDesignCompleted,
          name: t('Touch Weight Preview', { ns: 'navigation' }),
          url: '/design/touch-weight-preview',
        },
        {
          isDisabled: !isDesignCompleted,
          name: t('Adjustment Sheet', { ns: 'navigation' }),
          url: '/design/adjustment-sheet',
        },
      ],
    },
    {
      icon: FileText,
      name: t('File', { ns: 'navigation' }),
      submenu: [
        {
          icon: FilePlus,
          name: t('New Profile', { ns: 'navigation' }),
          onClick: openNewProfileDialog,
        },
        {
          icon: FileDown,
          name: t('Export', { ns: 'navigation' }),
          onClick: exportBackupFile,
        },
        {
          icon: FileUp,
          name: t('Import', { ns: 'navigation' }),
          onClick: triggerImport,
        },
      ],
    },
    {
      icon: BadgeQuestionMark,
      name: t('Help', { ns: 'navigation' }),
      url: '/help',
    },
  ];

  const isParentActive = (submenu: SubmenuItem[]) => {
    return submenu.some(
      (item) => 'url' in item && item.url && pathname.startsWith(item.url),
    );
  };

  const getFirstValidSubmenuUrl = (submenu: SubmenuItem[]) => {
    const validItem = submenu.find(
      (item) =>
        'url' in item &&
        item.url &&
        item.isHidden !== true &&
        item.isDisabled !== true,
    );
    return validItem && 'url' in validItem ? validItem.url : null;
  };

  const renderSubmenuItem = (item: SubmenuItem, index: number) => {
    if (item.isHidden) {
      return null;
    }
    if ('url' in item && item.url) {
      const isActive = pathname === item.url;
      const isDisabled = item.isDisabled;
      return (
        <SidebarMenuSubItem key={`submenu-item-${index}`}>
          <SidebarMenuSubButton asChild isActive={isActive}>
            <NavLink
              to={item.url}
              className={`group/submenu-item ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={(e) => isDisabled && e.preventDefault()}
            >
              {item.icon && (
                <item.icon
                  className={`transition transition-duration-200 ${
                    isDisabled
                      ? 'opacity-50'
                      : 'group-hover/submenu-item:stroke-primary group-hover/submenu-item:scale-120'
                  }`}
                />
              )}
              <span
                className={`${isActive ? 'font-semibold' : ''} ${isDisabled ? 'opacity-50' : ''}`}
              >
                {item.name}{' '}
              </span>
            </NavLink>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      );
    } else if ('onClick' in item && item.onClick) {
      const isDisabled = item.isDisabled;
      return (
        <SidebarMenuSubItem key={`submenu-item-${index}`}>
          <SidebarMenuSubButton asChild>
            <div
              className={`group/submenu-item ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={isDisabled ? undefined : item.onClick}
            >
              {item.icon && (
                <item.icon
                  className={`transition transition-duration-200 ${
                    isDisabled
                      ? 'opacity-50'
                      : 'group-hover/submenu-item:stroke-primary group-hover/submenu-item:scale-120'
                  }`}
                />
              )}
              <span className={isDisabled ? 'opacity-50' : ''}>
                {item.name}
              </span>
            </div>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      );
    }
    return null;
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 h-8 [&>svg]:size-4 xl:h-12 xl:[&>svg]:size-10"
            >
              <NavLink
                className="flex items-center gap-1 group/sidebar-header"
                to="/"
              >
                <FlaskConical className="!size-5 xl:!size-6 group-hover/sidebar-header:text-primary group-hover/sidebar-header:animate-[spin_800ms_ease-in-out] transition duration-150" />
                <span className="text-base font-semibold xl:text-2xl">
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
              {menuEntries.map((menuEntry, index) => {
                if ('url' in menuEntry && menuEntry.url) {
                  return (
                    <AppSidebarItem
                      badge={menuEntry.badge}
                      destinationUrl={menuEntry.url}
                      icon={<menuEntry.icon />}
                      key={`menu-item-${index}`}
                      label={menuEntry.name}
                    />
                  );
                } else if ('submenu' in menuEntry && menuEntry.submenu) {
                  const isActive = isParentActive(menuEntry.submenu);
                  const firstValidUrl = menuEntry.shouldOpenFirstEntry
                    ? getFirstValidSubmenuUrl(menuEntry.submenu)
                    : null;

                  return (
                    <Collapsible
                      key={`menu-item-${index}`}
                      defaultOpen={isActive}
                    >
                      <SidebarMenuItem>
                        {firstValidUrl ? (
                          <AppSidebarMenuButton isActive={isActive}>
                            <NavLink
                              to={firstValidUrl}
                              className="cursor-pointer group/item"
                            >
                              <menuEntry.icon
                                className={
                                  isActive
                                    ? 'scale-120 transition transition-duration-200'
                                    : 'group-hover/item:stroke-primary group-hover/item:scale-120 transition transition-duration-200'
                                }
                              />
                              <span>{menuEntry.name}</span>
                            </NavLink>
                          </AppSidebarMenuButton>
                        ) : (
                          <CollapsibleTrigger asChild>
                            <AppSidebarMenuButton isActive={isActive}>
                              <a className="cursor-pointer group/item">
                                <menuEntry.icon
                                  className={
                                    isActive
                                      ? 'scale-120 transition transition-duration-200'
                                      : 'group-hover/item:stroke-primary group-hover/item:scale-120 transition transition-duration-200'
                                  }
                                />
                                <span>{menuEntry.name}</span>
                              </a>
                            </AppSidebarMenuButton>
                          </CollapsibleTrigger>
                        )}
                        <CollapsibleTrigger asChild>
                          <SidebarMenuAction className="data-[state=open]:rotate-90 peer-data-[size=default]/menu-button:top-1.5 xl:peer-data-[size=default]/menu-button:top-2.5">
                            <ChevronRight />
                            <span className="sr-only">
                              {t('Toggle', { ns: 'navigation' })}
                            </span>
                          </SidebarMenuAction>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {menuEntry.submenu.map((item, subIndex) =>
                              renderSubmenuItem(item, subIndex),
                            )}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }
                return null;
              })}

              <input
                ref={inputRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={onInputFileChange}
              />
              <SidebarSeparator />
              <SidebarLanguageSwitcher />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
