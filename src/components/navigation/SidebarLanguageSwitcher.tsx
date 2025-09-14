import { useTranslation } from '@/hooks/use-translation';
import { ChevronRight, Globe } from 'lucide-react';
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from '../ui/sidebar';
import { useCallback, useMemo } from 'react';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '../ui/collapsible';

export const SidebarLanguageSwitcher = () => {
  const { changeLanguage, currentLanguage, t } = useTranslation();

  const changeLanguageFr = useCallback(
    () => changeLanguage('fr'),
    [changeLanguage],
  );
  const changeLanguageEn = useCallback(
    () => changeLanguage('en'),
    [changeLanguage],
  );
  const languages = useMemo(
    () => [
      {
        code: 'en',
        name: 'English',
        onClick: changeLanguageEn,
      },
      {
        code: 'fr',
        name: 'Français',
        onClick: changeLanguageFr,
      },
    ],
    [changeLanguageFr, changeLanguageEn],
  );

  return (
    <Collapsible>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton asChild tooltip="Language">
            <a className="cursor-pointer">
              <Globe />
              <span>{t('Language', { ns: 'navigation' })}</span>
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
              {languages.map((language, index) => (
                <SidebarMenuSubButton
                  key={`lang-${language.code}-${index}`}
                  asChild
                >
                  <div>
                    <a
                      onClick={language.onClick}
                      className={`cursor-pointer ${
                        language.code === currentLanguage ? 'font-bold' : ''
                      }`}
                    >
                      <span>{language.name} </span>
                    </a>
                  </div>
                </SidebarMenuSubButton>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </>
      </SidebarMenuItem>
    </Collapsible>
  );
};
