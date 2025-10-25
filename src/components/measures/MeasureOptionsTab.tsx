import { useTranslation } from '@/hooks/use-translation';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '../ui/field';
import { Switch } from '@/components/ui/switch';
import {
  useMeasureOptions,
  useMeasureOptionsActions,
} from '@/hooks/store/use-measure-options-store';
import { useCallback } from 'react';

export const MeasureOptionsTab = () => {
  const { t } = useTranslation();
  const { useManualSWRMeasurements, useSupportSpringMeasurements } =
    useMeasureOptions();
  const { updateOption } = useMeasureOptionsActions();

  const onUpdateUseManualSWRMeasurements = useCallback(
    (value: boolean) => {
      updateOption('useManualSWRMeasurements', value);
    },
    [updateOption],
  );

  const onUpdateUseSpringSupportMeasurements = useCallback(
    (value: boolean) => {
      updateOption('useSupportSpringMeasurements', value);
    },
    [updateOption],
  );

  return (
    <section className="container">
      <div className="flex flex-col gap-5">
        <h2 className="text-xl font-bold">{t('Options')}</h2>

        <FieldGroup className="gap-4 border rounded-xl p-8 max-w-2xl">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="useManualSWRMeasurements">
                {t('Measure Strike Weight Ratio manually')}
              </FieldLabel>
              <FieldDescription className="whitespace-pre-line">
                {t(
                  'By enabling this option, you will be able to manually measure the SWR for each key rather than using an automatically calculated value.\nIf the measured value is too far from the calculated value, a warning will be displayed to indicate that some measurements are incorrect or not accurate enough.',
                )}
              </FieldDescription>
            </FieldContent>
            <Switch
              className="hover:cursor-pointer"
              id="useManualSWRMeasurements"
              checked={useManualSWRMeasurements}
              onCheckedChange={onUpdateUseManualSWRMeasurements}
            />
          </Field>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="useSpringSupportMeasurements">
                {t('Measure Wippen Support Spring tension')}
              </FieldLabel>
              <FieldDescription className="whitespace-pre-line">
                {t(
                  'By enabling this option, a new field will be added to measure Down Weight with wippen support spring attached. It will be used to calculate the Wippen Support spring (WSS) tension and display a dedicated chart in Analyze page.\nThis is optional, even if you want to enable WSS tension in your design.',
                )}
              </FieldDescription>
            </FieldContent>
            <Switch
              className="hover:cursor-pointer"
              id="useSupportSpringMeasurements"
              checked={useSupportSpringMeasurements}
              onCheckedChange={onUpdateUseSpringSupportMeasurements}
            />
          </Field>
        </FieldGroup>
      </div>
    </section>
  );
};
