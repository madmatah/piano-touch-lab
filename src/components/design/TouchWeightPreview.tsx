import { TouchWeightChart } from '../charts/touch-weight-chart/TouchWeightChart';
import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';

export interface TouchWeightPreviewProps {
  designedKeyboard: TouchWeightAnalyzedKeyboard;
}

export const TouchWeightPreview: React.FC<TouchWeightPreviewProps> = ({
  designedKeyboard,
}) => {
  return (
    <div>
      <TouchWeightChart analyzedKeyboard={designedKeyboard} />
    </div>
  );
};
