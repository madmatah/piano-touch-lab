import { useDesignedKeyboard } from '@/hooks/keyboard/use-designed-keyboard';
import { TouchWeightChart } from '../charts/touch-weight-chart/TouchWeightChart';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircleIcon } from 'lucide-react';

export interface TouchWeightPreviewProps {
  requiredDataPercentage: number;
  notEnoughDataErrorTitle: string;
  notEnoughDataErrorDescription: string;
}

export const TouchWeightPreview: React.FC<TouchWeightPreviewProps> = ({
  requiredDataPercentage,
  notEnoughDataErrorTitle,
  notEnoughDataErrorDescription,
}) => {
  const designedKeyboard = useDesignedKeyboard();
  const hasEnoughData =
    designedKeyboard
      .mapToArray((key) => key.payload.downWeight)
      .filter((v) => v !== undefined && v !== null).length >=
    Math.round(designedKeyboard.size * requiredDataPercentage);

  if (!hasEnoughData) {
    return (
      <Alert variant="default" className="w-full mx-auto my-10">
        <AlertCircleIcon />
        <AlertTitle>{notEnoughDataErrorTitle}</AlertTitle>
        <AlertDescription>{notEnoughDataErrorDescription}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <TouchWeightChart analyzedKeyboard={designedKeyboard} />
    </div>
  );
};
