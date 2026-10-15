import type { KeyWith } from '@/lib/piano/keyboard';

import type { KeyAdjustmentPayload } from './AdjustmentSheet.types';
import { AdjustmentValue } from './AdjustmentValue';

export interface AdjustmentSheetTableRowProps {
  hasWippenAssistSpringDesign: boolean;
  isBlackKey: boolean;
  item: KeyWith<KeyAdjustmentPayload | null>;
}

const cellClassName =
  'h-[42px] border-b border-border px-3 align-middle font-mono text-sm';

const Adjustment = ({
  actualValue,
  targetValue,
}: {
  actualValue: number | null;
  targetValue: number | null;
}) => (
  <td className={cellClassName}>
    <div className="flex items-center gap-2">
      <AdjustmentValue actualValue={actualValue} targetValue={targetValue} />
    </div>
  </td>
);

export const AdjustmentSheetTableRow: React.FC<
  AdjustmentSheetTableRowProps
> = ({ hasWippenAssistSpringDesign, isBlackKey, item }) => (
  <tr className="even:bg-secondary">
    <td className={`${cellClassName} text-xs text-ptl-ink-3`}>{item.number}</td>
    <td className={cellClassName}>
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
    <td className={`${cellClassName} text-center`}>
      <span className="inline-block size-[18px] rounded-[3px] border-[1.5px] border-input align-middle" />
    </td>
  </tr>
);
