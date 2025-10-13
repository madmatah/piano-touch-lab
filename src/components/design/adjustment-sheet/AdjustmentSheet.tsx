import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTranslation } from '@/hooks/use-translation';
import { useMemo } from 'react';
import {
  type AdjustmentSheetProps,
  type KeyAdjustmentPayload,
} from './AdjustmentSheet.types';
import { AdjustmentSheetTableRow } from './AdjustmentSheetTableRow';

export const AdjustmentSheet: React.FC<AdjustmentSheetProps> = ({
  analyzedKeyboard,
  designedKeyboard,
}) => {
  const { t } = useTranslation();

  const adjustedKeyboard = useMemo(() => {
    return analyzedKeyboard.map((analyzedKey): KeyAdjustmentPayload | null => {
      const designedKey = designedKeyboard.getKeyByNumber(analyzedKey.number);
      const actualFrontWeight = analyzedKey.payload.frontWeight ?? null;
      const actualStrikeWeight = analyzedKey.payload.strikeWeight ?? null;
      const targetFrontWeight = designedKey?.payload.frontWeight ?? null;
      const targetStrikeWeight = designedKey?.payload.strikeWeight ?? null;

      if (
        actualFrontWeight === null ||
        actualStrikeWeight === null ||
        targetFrontWeight === null ||
        targetStrikeWeight === null
      ) {
        return null;
      }

      return {
        actualFrontWeight,
        actualStrikeWeight,
        targetFrontWeight,
        targetStrikeWeight,
      };
    });
  }, [analyzedKeyboard, designedKeyboard]);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[5em]">Note</TableHead>
            <TableHead className="w-[13em]">{t('Front Weight')}</TableHead>
            <TableHead>{t('Strike Weight')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {adjustedKeyboard.mapToArray((key) => (
            <AdjustmentSheetTableRow key={key.number} item={key} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
