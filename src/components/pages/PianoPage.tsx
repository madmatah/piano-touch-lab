import { MainLayout } from '../MainLayout';
import { Piano } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import {
  usePianoProfileState,
  usePianoProfileActions,
} from '@/hooks/store/use-piano-profile-store';
import { useCallback } from 'react';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export const PianoPage = () => {
  const { t } = useTranslation();
  const { brand, model, serialNumber } = usePianoProfileState();
  const { updateSingleState } = usePianoProfileActions();

  const handleBrandChange = useCallback(
    (value: string) => {
      updateSingleState('brand', value || null);
    },
    [updateSingleState],
  );

  const handleModelChange = useCallback(
    (value: string) => {
      updateSingleState('model', value || null);
    },
    [updateSingleState],
  );

  const handleSerialNumberChange = useCallback(
    (value: string) => {
      updateSingleState('serialNumber', value || null);
    },
    [updateSingleState],
  );

  return (
    <MainLayout pageTitle={t('Piano')} pageIcon={<Piano />}>
      <div className="w-full max-w-md">
        <FieldSet>
          <FieldLegend>{t('Identify your piano')}</FieldLegend>
          <FieldDescription>
            {t(
              'This info will appear in the app and on your printed reports, helping you stay organized if you manage multiple instruments.',
            )}
          </FieldDescription>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="piano-brand">{t('Brand')}</FieldLabel>
              <Input
                id="piano-brand"
                placeholder={t('Enter your piano brand')}
                value={brand ?? ''}
                onChange={(e) => handleBrandChange(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="piano-model">{t('Model')}</FieldLabel>
              <Input
                id="piano-model"
                placeholder={t('Enter your piano model')}
                value={model ?? ''}
                onChange={(e) => handleModelChange(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="piano-serial">
                {t('Serial Number')}
              </FieldLabel>
              <Input
                id="piano-serial"
                placeholder={t('Enter your piano serial number')}
                value={serialNumber ?? ''}
                onChange={(e) => handleSerialNumberChange(e.target.value)}
              />
            </Field>
          </FieldGroup>
        </FieldSet>
      </div>
    </MainLayout>
  );
};
