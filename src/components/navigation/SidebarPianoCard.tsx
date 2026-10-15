import { NavLink, useLocation } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { usePianoProfileState } from '@/hooks/store/use-piano-profile-store';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

export interface SidebarPianoCardProps {
  label: string;
}

/**
 * The instrument being worked on, at the top of the sidebar: its name in
 * serif, the demo badge, and the serial number in mono.
 */
export const SidebarPianoCard = ({ label }: SidebarPianoCardProps) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { brand, isDemoProfile, model, serialNumber } = usePianoProfileState();

  const isActive = pathname === '/piano';
  // The key count and the range are on the Piano page, where they can be
  // changed; repeating them under every screen told the reader nothing.
  const specification = serialNumber
    ? t('S/N {{serialNumber}}', { ns: 'navigation', serialNumber })
    : null;

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
        <span className="ptl-label">{label}</span>
        {isDemoProfile ? (
          <Badge variant="mono">{t('Demo', { ns: 'navigation' })}</Badge>
        ) : null}
      </span>
      {/*
       * Two lines at most: a long make and model ran to six, and pushed the
       * file actions out of the sidebar. The full name is in the title, and
       * on the Piano page the card leads to.
       */}
      <span
        title={[brand, model].filter(Boolean).join(' ') || undefined}
        className="line-clamp-2 font-serif text-[22px] leading-[1.15] font-medium break-words short:text-[19px]"
      >
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
      {specification ? (
        <span className="font-mono text-[11px] text-muted-foreground">
          {specification}
        </span>
      ) : null}
    </NavLink>
  );
};
