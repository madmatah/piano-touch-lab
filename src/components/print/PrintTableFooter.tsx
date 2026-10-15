import { usePianoProfileState } from '@/hooks/store/use-piano-profile-store';

/**
 * The footer repeated at the bottom of every printed page of a long table.
 *
 * A browser repeats a `<tfoot>` on each page the table spans, and unlike a
 * fixed box it stays in the flow, so it cannot land on the last rows. It
 * cannot know its own page number either, so the pagination is left to the
 * browser's own print headers.
 */
export const PrintTableFooter = ({ colSpan }: { colSpan: number }) => {
  const { displayName } = usePianoProfileState();

  return (
    <tfoot className="ptl-print-only">
      <tr>
        <td colSpan={colSpan} className="pt-3">
          <div className="flex items-center justify-between border-t border-ptl-rule-strong pt-2.5 font-mono text-xs">
            <span>
              Piano Touch Lab
              {displayName ? ` · ${displayName}` : null}
            </span>
            <span className="text-muted-foreground">piano-touch-lab.com</span>
          </div>
        </td>
      </tr>
    </tfoot>
  );
};
