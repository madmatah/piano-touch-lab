import { usePianoProfileState } from '@/hooks/store/use-piano-profile-store';
import { cn } from '@/lib/utils';

/** The instrument in one line: `Gaveau Model 1 — 89XXX`. */
export const PianoIdentity = ({ className }: { className?: string }) => {
  const { displayName, serialNumber } = usePianoProfileState();

  if (!displayName && !serialNumber) {
    return null;
  }

  return (
    <span
      className={cn(
        'max-w-[32ch] truncate font-mono text-xs text-muted-foreground max-md:hidden',
        className,
      )}
    >
      {displayName}
      {displayName && serialNumber ? ' — ' : null}
      {serialNumber}
    </span>
  );
};
