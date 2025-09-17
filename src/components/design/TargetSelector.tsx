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
import { ValueSelector } from '../app-ui/value-selector/ValueSelector';
import { useMemo } from 'react';
import { NumericSelector } from '../app-ui/numeric-selector/NumericSelector';

export enum TargetSelectorUi {
  ValueSelector = 'value-selector',
  HtmlSelect = 'html-select',
  NumericSelector = 'numeric-selector',
}

export interface TargetSelectorTarget<Target> {
  value: Target;
  label: string;
}

export interface TargetSelectorModeBaseOptions {
  placeholder: string;
  selectorUi: TargetSelectorUi;
}

export interface MultipleTargetSelectorOptions<Target extends string>
  extends TargetSelectorModeBaseOptions {
  selectorUi: TargetSelectorUi.ValueSelector | TargetSelectorUi.HtmlSelect;
  targets: TargetSelectorTarget<Target>[];
}

export interface NumericTargetSelectorOptions
  extends TargetSelectorModeBaseOptions {
  selectorUi: TargetSelectorUi.NumericSelector;
  minValue: number;
  maxValue: number;
  step: number;
  labelFormatter?: (value: number) => string;
}

export type TargetSelectorMode<
  Mode extends string,
  Target extends string | number,
> =
  | {
      label: string;
      description?: string;
      value: Mode;
      options: MultipleTargetSelectorOptions<Extract<Target, string>>;
    }
  | {
      label: string;
      description?: string;
      value: Mode;
      options: NumericTargetSelectorOptions;
    };

export interface TargetSelectorProps<
  Mode extends string,
  Target extends string | number,
> {
  title: string;
  modes: TargetSelectorMode<Mode, Target>[];
  selectedMode: Mode | null;
  selectedTarget: Target | null;
  shouldDisplayModeSelector?: boolean;
  onModeChange: (mode: Mode) => void;
  onTargetChange: (target: Target) => void;
}

export const TargetSelector = <
  Mode extends string,
  Target extends string | number,
>(
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

  const selectedMode = useMemo(
    () =>
      selectedModeValue
        ? modes.find((mode) => mode.value === selectedModeValue)
        : undefined,
    [selectedModeValue, modes],
  );

  const selectedTarget = useMemo(() => {
    if (
      selectedTargetValue &&
      selectedMode &&
      (selectedMode.options.selectorUi === TargetSelectorUi.ValueSelector ||
        selectedMode.options.selectorUi === TargetSelectorUi.HtmlSelect)
    ) {
      return selectedMode.options.targets.find(
        (choice) => choice.value === selectedTargetValue,
      );
    }
    return undefined;
  }, [selectedTargetValue, selectedMode]);

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
          <div className="mt-4 flex justify-center">
            {selectedMode.options.selectorUi ===
              TargetSelectorUi.HtmlSelect && (
              <Select
                value={(selectedTarget?.value as unknown as string) || ''}
                onValueChange={
                  onTargetChange as unknown as (value: string) => void
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={selectedMode.options.placeholder}>
                    {selectedTarget?.label}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {selectedMode.options.targets.map((target) => (
                    <SelectItem
                      key={target.value as unknown as string}
                      value={target.value as unknown as string}
                    >
                      {target.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {selectedMode.options.selectorUi ===
              TargetSelectorUi.ValueSelector && (
              <ValueSelector<string>
                currentValue={selectedTarget?.value as unknown as string}
                onChange={onTargetChange as unknown as (value: string) => void}
                values={selectedMode.options.targets.map((target) => ({
                  label: target.label,
                  value: target.value as unknown as string,
                }))}
              />
            )}
            {selectedMode.options.selectorUi ===
              TargetSelectorUi.NumericSelector && (
              <NumericSelector
                value={
                  (selectedTargetValue as unknown as number) ??
                  selectedMode.options.minValue
                }
                onChange={onTargetChange as unknown as (value: number) => void}
                minValue={selectedMode.options.minValue}
                maxValue={selectedMode.options.maxValue}
                step={selectedMode.options.step}
                labelFormatter={selectedMode.options.labelFormatter}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
