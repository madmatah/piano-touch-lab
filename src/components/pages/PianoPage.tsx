import { MainLayout } from '../MainLayout';
import { Piano } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import {
  usePianoProfileState,
  usePianoProfileActions,
} from '@/hooks/store/use-piano-profile-store';
import { useState, useCallback } from 'react';
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
  const { pianoName } = usePianoProfileState();
  const { updateSingleState } = usePianoProfileActions();
  const [localPianoName, setLocalPianoName] = useState(pianoName ?? '');

  const handlePianoNameChange = useCallback(
    (value: string) => {
      setLocalPianoName(value);
      updateSingleState('pianoName', value ?? null);
    },
    [updateSingleState],
  );

  const handleBlur = useCallback(() => {
    updateSingleState('pianoName', localPianoName ?? null);
  }, [updateSingleState, localPianoName]);

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
              <FieldLabel htmlFor="piano-name">{t('Piano Name')}</FieldLabel>
              <Input
                id="piano-name"
                placeholder={t('Enter your piano name')}
                value={localPianoName}
                onChange={(e) => handlePianoNameChange(e.target.value)}
                onBlur={handleBlur}
              />
            </Field>
          </FieldGroup>
        </FieldSet>
      </div>
    </MainLayout>
  );
};
