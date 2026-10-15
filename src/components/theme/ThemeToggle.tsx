import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

/**
 * Picks the light workshop, the dark one, or whichever the system asks for.
 *
 * Three choices rather than a straight flip: "system" is the default, and a
 * binary toggle would quietly take it away the first time someone pressed it.
 */
export const ThemeToggle = ({ className }: { className?: string }) => {
  const { t } = useTranslation();
  const { setTheme, theme } = useTheme();

  const options = useMemo(
    () => [
      { icon: Sun, label: t('Light', { ns: 'navigation' }), value: 'light' },
      { icon: Moon, label: t('Dark', { ns: 'navigation' }), value: 'dark' },
      {
        icon: Monitor,
        label: t('System', { ns: 'navigation' }),
        value: 'system',
      },
    ],
    [t],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className={cn('size-9 text-muted-foreground', className)}
          aria-label={t('Theme', { ns: 'navigation' })}
        >
          <Sun className="size-[17px] dark:hidden" />
          <Moon className="hidden size-[17px] dark:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/*
         * Radio items: the chosen theme is marked, and announced as checked,
         * where bold type alone said it to no screen reader.
         */}
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              <option.icon className="size-4" />
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
