import { usePianoProfileState } from '@/hooks/store/use-piano-profile-store';

/**
 * The footer repeated at the bottom of every printed page.
 *
 * `position: fixed` is what makes a browser repeat it; it cannot know its own
 * page number, so the page count is left to the browser's own print headers.
 */
export const PrintFooter = () => {
  const { displayName } = usePianoProfileState();

  return (
    <footer className="ptl-print-only fixed inset-x-0 bottom-0 flex items-center justify-between border-t border-ptl-rule-strong pt-2.5 font-mono text-xs">
      <span>
        Piano Touch Lab
        {displayName ? ` · ${displayName}` : null}
      </span>
      <span className="text-muted-foreground">piano-touch-lab.com</span>
    </footer>
  );
};
