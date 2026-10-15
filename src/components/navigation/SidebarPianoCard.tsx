import { NavLink, useLocation } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { useKeyboard } from '@/hooks/keyboard/use-keyboard';
import { usePianoProfileState } from '@/hooks/store/use-piano-profile-store';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

export interface SidebarPianoCardProps {
  number: string;
  label: string;
}

/**
 * The instrument being worked on, at the top of the sidebar: step number,
 * demo badge, name in serif, and the specification line in mono.
 */
export const SidebarPianoCard = ({ label, number }: SidebarPianoCardProps) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { brand, isDemoProfile, keyCount, model, serialNumber } =
    usePianoProfileState();
  const { keyboard } = useKeyboard();

  const isActive = pathname === '/piano';
  const keys = keyboard.getKeys();
  const range =
    keys.length > 0 ? `${keys[0]!.name}–${keys[keys.length - 1]!.name}` : null;

  const specification = [
    serialNumber
      ? t('S/N {{serialNumber}}', { ns: 'navigation', serialNumber })
      : null,
    t('{{count}} keys', { count: keyCount, ns: 'navigation' }),
    range,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <NavLink
      to="/piano"
      className={cn(
        'flex flex-col gap-1 rounded-md text-foreground',
        isActive
          ? 'border-2 border-ptl-brass bg-ptl-brass-soft p-[13px]'
          : 'border border-ptl-rule-strong bg-card p-3.5',
      )}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="ptl-label">
          {number} · {label}
        </span>
        {isDemoProfile ? (
          <Badge variant="mono">{t('Demo', { ns: 'navigation' })}</Badge>
        ) : null}
      </span>
      <span className="font-serif text-[22px] leading-[1.15] font-medium break-words">
        {brand || model ? (
          <>
            {brand}
            {brand && model ? ' ' : null}
            {model ? <em className="italic">{model}</em> : null}
          </>
        ) : (
          label
        )}
      </span>
      <span className="font-mono text-[11px] text-muted-foreground">
        {specification}
      </span>
    </NavLink>
  );
};
