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
import { useCallback, useEffect, useMemo } from 'react';
import { NumericSelector } from '../app-ui/numeric-selector/NumericSelector';

export enum TargetSelectorUi {
  ValueSelector = 'value-selector',
  HtmlSelect = 'html-select',
  NumericSelector = 'numeric-selector',
  UniqueTargetSelector = 'unique-target-selector',
  CustomComponentTargetSelector = 'custom-component-target-selector',
}

export interface TargetSelectorTarget<Target> {
  value: Target;
  label: string;
}

export interface TargetSelectorModeBaseOptions {
  placeholder?: string;
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
  maxCharacters?: number;
  step: number;
  labelFormatter?: (value: number) => string;
}

export interface UniqueTargetSelectorOptions<Target>
  extends TargetSelectorModeBaseOptions {
  selectorUi: TargetSelectorUi.UniqueTargetSelector;
  target: Target;
}

export interface CustomComponentTargetSelectorOptions<Target>
  extends TargetSelectorModeBaseOptions {
  selectorUi: TargetSelectorUi.CustomComponentTargetSelector;
  componentFactory: (
    currentTarget: Target | null,
    onTargetChange: (target: Target) => void,
  ) => React.ReactNode;
}

interface TargetSelectorModeBase<Mode extends string> {
  label: string;
  description?: string;
  isDisabled?: boolean;
  disabledReason?: string;
  /** The equation the mode solves, shown in mono under its control. */
  formula?: string;
  /** One line on what the mode depends on elsewhere in the design. */
  hint?: string;
  value: Mode;
}

export type TargetSelectorMode<Mode extends string, Target> =
  | (TargetSelectorModeBase<Mode> & {
      options: MultipleTargetSelectorOptions<Extract<Target, string>>;
    })
  | (TargetSelectorModeBase<Mode> & {
      options: NumericTargetSelectorOptions;
    })
  | (TargetSelectorModeBase<Mode> & {
      options: UniqueTargetSelectorOptions<Target>;
    })
  | (TargetSelectorModeBase<Mode> & {
      options: CustomComponentTargetSelectorOptions<Target>;
    });

export interface TargetSelectorProps<Mode extends string, Target> {
  title: string;
  modes: TargetSelectorMode<Mode, Target>[];
  selectedMode: Mode | null;
  selectedTarget: Target | null;
  shouldDisplayModeSelector?: boolean;
  onModeChange: (mode: Mode) => void;
  onTargetChange: (target: Target) => void;
}

export const TargetSelector = <Mode extends string, Target>(
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

  useEffect(() => {
    if (
      selectedMode &&
      selectedMode.options.selectorUi ===
        TargetSelectorUi.UniqueTargetSelector &&
      selectedTargetValue !== selectedMode.options.target
    ) {
      onTargetChange(selectedMode.options.target);
    }
  }, [onTargetChange, selectedMode, selectedTargetValue]);

  const onModeChangeHandler = useCallback(
    (mode: Mode) => {
      onModeChange(mode);
    },
    [onModeChange],
  );

  const control = selectedMode ? (
    <>
      {selectedMode.options.selectorUi === TargetSelectorUi.HtmlSelect && (
        <Select
          value={(selectedTarget?.value as unknown as string) || ''}
          onValueChange={onTargetChange as unknown as (value: string) => void}
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
      {selectedMode.options.selectorUi === TargetSelectorUi.ValueSelector && (
        <ValueSelector<string>
          currentValue={selectedTarget?.value as unknown as string}
          onChange={onTargetChange as unknown as (value: string) => void}
          values={selectedMode.options.targets.map((target) => ({
            label: target.label,
            value: target.value as unknown as string,
          }))}
        />
      )}
      {selectedMode.options.selectorUi === TargetSelectorUi.NumericSelector ? (
        <NumericSelector
          value={
            (selectedTargetValue as unknown as number) ??
            selectedMode.options.minValue
          }
          onChange={onTargetChange as unknown as (value: number) => void}
          maxCharacters={selectedMode.options.maxCharacters}
          minValue={selectedMode.options.minValue}
          maxValue={selectedMode.options.maxValue}
          step={selectedMode.options.step}
          labelFormatter={selectedMode.options.labelFormatter}
        />
      ) : null}
      {selectedMode.options.selectorUi ===
        TargetSelectorUi.CustomComponentTargetSelector &&
        selectedMode.options.componentFactory(
          selectedTargetValue,
          onTargetChange,
        )}
    </>
  ) : null;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="m-0 font-serif text-[30px] leading-none font-medium">
        {title}
      </h2>
      {shouldDisplayModeSelector ? (
        <RadioGroup
          onValueChange={onModeChangeHandler}
          value={selectedMode?.value}
          // As many cards to the row as fit, all of one height: they hold a
          // title each, and the controls of the one chosen sit under the row.
          className="grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-2.5"
        >
          {modes.map((mode) => (
            <RadioItem
              isDisabled={mode.isDisabled}
              disabledReason={mode.disabledReason}
              hasDescriptionOnDemand
              key={mode.value}
              label={mode.label}
              description={mode.description ?? ''}
              value={mode.value}
            />
          ))}
        </RadioGroup>
      ) : null}
      {/*
       * One strip for the controls of the choice in hand, laid out across:
       * inside its card they made that card three times as tall as its
       * neighbours, and pushed the curve they act on off the screen.
       */}
      {selectedMode &&
      selectedMode.options.selectorUi !==
        TargetSelectorUi.UniqueTargetSelector ? (
        <div
          role="group"
          aria-label={selectedMode.options.placeholder ?? selectedMode.label}
          data-slot="target-controls"
          className="flex flex-wrap items-end gap-x-8 gap-y-3 rounded-md border border-ptl-rule-strong bg-card px-4 py-3.5"
        >
          {/* `items-start`: the stepper keeps its own width. */}
          <div className="flex flex-col items-start gap-2">
            {selectedMode.options.placeholder ? (
              <span className="text-sm font-semibold">
                {selectedMode.options.placeholder}
              </span>
            ) : null}
            {control}
          </div>
          {selectedMode.formula || selectedMode.hint ? (
            <div className="flex max-w-[60ch] flex-col gap-1 pb-1">
              {selectedMode.formula ? (
                <span className="font-mono text-[13px] text-foreground">
                  {selectedMode.formula}
                </span>
              ) : null}
              {selectedMode.hint ? (
                <span className="text-[13px] leading-[1.5] text-muted-foreground">
                  {selectedMode.hint}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
};
