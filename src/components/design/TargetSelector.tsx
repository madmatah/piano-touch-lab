import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { RadioGroup } from '../ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { RadioItem } from '../app-ui/RadioGroupItem';

export interface TargetSelectorTarget<Target> {
  value: Target;
  label: string;
}

export interface TargetSelectorMode<Mode, Target> {
  label: string;
  description?: string;
  value: Mode;
  options: {
    placeholder: string;
    targets: TargetSelectorTarget<Target>[];
  };
}

export interface TargetSelectorProps<
  Mode extends string,
  Target extends string,
> {
  title: string;
  modes: TargetSelectorMode<Mode, Target>[];
  selectedMode: Mode | null;
  selectedTarget: Target | null;
  shouldDisplayModeSelector?: boolean;
  onModeChange: (mode: Mode) => void;
  onTargetChange: (target: Target) => void;
}

export const TargetSelector = <Mode extends string, Target extends string>(
  props: TargetSelectorProps<Mode, Target>,
) => {
  const {
    title,
    modes,
    onModeChange,
    onTargetChange,
    selectedMode: selectedModeValue,
    selectedTarget: selectedTargetValue,
    shouldDisplayModeSelector = true,
  } = props;

  const selectedMode = selectedModeValue
    ? modes.find((mode) => mode.value === selectedModeValue)
    : undefined;

  const selectedTarget =
    selectedTargetValue && selectedMode
      ? selectedMode.options.targets.find(
          (choice) => choice.value === selectedTargetValue,
        )
      : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {shouldDisplayModeSelector && (
          <div>
            <RadioGroup
              value={selectedMode?.value}
              className="grid gap-3 md:grid-cols-2"
            >
              {modes.map((mode, index) => (
                <RadioItem
                  key={index}
                  label={mode.label}
                  description={mode.description || ''}
                  value={mode.value}
                  onClick={onModeChange}
                />
              ))}
            </RadioGroup>
          </div>
        )}
        {selectedMode && (
          <div className="mt-4">
            <Select
              value={selectedTarget?.value || ''}
              onValueChange={onTargetChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={selectedMode.options.placeholder}>
                  {selectedTarget?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {selectedMode.options.targets.map((target) => (
                  <SelectItem key={target.value} value={target.value}>
                    {target.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
