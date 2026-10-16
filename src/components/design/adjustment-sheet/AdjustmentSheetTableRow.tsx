import type { KeyWith } from '@/lib/piano/keyboard';
import { isOctaveStart } from '@/lib/piano/keyboard/keyboard-geometry';
import { cn } from '@/lib/utils';

import type { KeyAdjustmentPayload } from './AdjustmentSheet.types';
import { AdjustmentValue } from './AdjustmentValue';

export interface AdjustmentSheetTableRowProps {
  hasWippenAssistSpringDesign: boolean;
  isBlackKey: boolean;
  item: KeyWith<KeyAdjustmentPayload | null>;
}

/*
 * On paper the rows close up to the 28 px of the print mockup: at their screen
 * height of 42 px the sheet ran to five pages where the mockup takes four.
 */
const cellClassName =
  'h-[42px] px-3 align-middle font-mono text-sm print:h-7 print:px-1.5 print:text-[13px]';

/*
 * On paper the pills flatten to plain text, and the change to one weight ran
 * into the reading of the next: each column after the note is ruled off from
 * the one before it. On screen the pills keep them apart.
 */
const ruledCellClassName = `${cellClassName} print:border-l`;

const Adjustment = ({
  actualValue,
  targetValue,
}: {
  actualValue: number | null;
  targetValue: number | null;
}) => (
  <td className={ruledCellClassName}>
    {/* On their baseline: the change is set smaller than the weights. */}
    <div className="flex items-baseline gap-2">
      <AdjustmentValue actualValue={actualValue} targetValue={targetValue} />
    </div>
  </td>
);

/*
 * Each C opens an octave, which the printed sheet rules off, as a score does.
 * The rules between keys are drawn by the rows and this one by the cells: in a
 * collapsed table, at equal width, a cell's border wins over a row's, where
 * between two cells the one above wins. A rule half a pixel wider would not
 * do, for Chrome rounds it down to a whole pixel on paper.
 */
export const AdjustmentSheetTableRow: React.FC<
  AdjustmentSheetTableRowProps
> = ({ hasWippenAssistSpringDesign, isBlackKey, item }) => (
  <tr
    className={cn(
      'border-b border-border even:bg-secondary',
      isOctaveStart(item) &&
        'print:[&>td]:border-t print:[&>td]:border-t-foreground',
    )}
  >
    <td className={`${cellClassName} text-xs text-ptl-ink-3`}>{item.number}</td>
    <td
      className={cn(
        cellClassName,
        isOctaveStart(item) && 'print:font-semibold',
      )}
    >
      {isBlackKey ? (
        <span className="inline-flex rounded-[3px] bg-ptl-key-black px-1.5 py-px text-[12.5px] text-ptl-key-white">
          {item.name}
        </span>
      ) : (
        item.name
      )}
    </td>
    <Adjustment
      actualValue={item.payload?.actualFrontWeight ?? null}
      targetValue={item.payload?.targetFrontWeight ?? null}
    />
    <Adjustment
      actualValue={item.payload?.actualStrikeWeight ?? null}
      targetValue={item.payload?.targetStrikeWeight ?? null}
    />
    {hasWippenAssistSpringDesign && (
      <Adjustment
        actualValue={item.payload?.actualSupportSpringBalanceWeight ?? null}
        targetValue={item.payload?.targetSupportSpringBalanceWeight ?? null}
      />
    )}
    {/*
     * A box to tick in pencil at the bench, so on paper only: on screen it
     * looked like a checkbox, and a click on it did nothing. In ink, for a
     * pale box vanishes from a black and white laser.
     */}
    <td className={`${ruledCellClassName} ptl-print-only text-center`}>
      <span className="inline-block size-[15px] rounded-[2px] border-[1.5px] border-foreground align-middle" />
    </td>
    {/* Room to write on the printed sheet; nothing to show on screen. */}
    <td className={`${ruledCellClassName} ptl-print-only`} />
  </tr>
);
