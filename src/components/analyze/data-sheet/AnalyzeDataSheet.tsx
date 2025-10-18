import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTranslation } from '@/hooks/use-translation';
import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';
import { AnalyzeDataSheetTableRow } from './AnalyzeDataSheetTableRow';
import { useMeasureOptions } from '@/hooks/store/use-measure-options-store';

export const AnalyzeDataSheet: React.FC<{
  analyzedKeyboard: TouchWeightAnalyzedKeyboard;
}> = ({ analyzedKeyboard }) => {
  const { t } = useTranslation();
  const { useSupportSpringMeasurements } = useMeasureOptions();

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[5em]">Note</TableHead>
            <TableHead className="w-[10em]">{t('D')}</TableHead>
            <TableHead className="w-[10em]">{t('BW')}</TableHead>
            <TableHead className="w-[10em]">{t('U')}</TableHead>
            <TableHead className="w-[10em]">{t('F')}</TableHead>
            <TableHead className="w-[10em]">{t('FW')}</TableHead>
            <TableHead className="w-[10em]">{t('SW')}</TableHead>
            <TableHead className="w-[9em]">{t('R')}</TableHead>
            {useSupportSpringMeasurements && (
              <TableHead className="w-[10em]">{t('BWS')}</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {analyzedKeyboard.mapToArray((key) => (
            <AnalyzeDataSheetTableRow
              key={key.number}
              item={key}
              shouldUseSupportSpringMeasurements={useSupportSpringMeasurements}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
