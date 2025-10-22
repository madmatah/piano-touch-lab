import { MainLayout } from '../MainLayout';
import { Piano } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import {
  usePianoProfileState,
  usePianoProfileActions,
} from '@/hooks/store/use-piano-profile-store';
import { useCallback, useMemo, useState } from 'react';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { NumericSelector } from '@/components/app-ui/numeric-selector/NumericSelector';
import { ValueSelector } from '@/components/app-ui/value-selector/ValueSelector';
import { useValidStartNotes } from '@/hooks/keyboard/valid-start-notes';
import { getNoteName } from '@/lib/music/theory/spn';
import type { Note } from '@/lib/music/theory/spn';
import { Standard88Layout } from '@/lib/piano/keyboard';

export const PianoPage = () => {
  const { t } = useTranslation();
  const { brand, model, serialNumber, keyCount, startNote } =
    usePianoProfileState();
  const { updateSingleState } = usePianoProfileActions();

  const getInitialLayoutMode = (): 'standard' | 'custom' => {
    if (
      keyCount === Standard88Layout.length &&
      startNote?.letter === Standard88Layout.startNote.letter &&
      startNote?.octave === Standard88Layout.startNote.octave
    ) {
      return 'standard';
    }
    return 'custom';
  };

  const [layoutMode, setLayoutMode] = useState<'standard' | 'custom'>(() =>
    getInitialLayoutMode(),
  );

  const isCustomLayout = useMemo(() => {
    return layoutMode === 'custom';
  }, [layoutMode]);

  const { validStartNotes } = useValidStartNotes();

  const startNoteValues = useMemo(
    () =>
      validStartNotes.map((note) => ({
        label: getNoteName(note),
        value: getNoteName(note),
      })),
    [validStartNotes],
  );

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

  const handleLayoutChange = useCallback(
    (layoutType: string) => {
      setLayoutMode(layoutType as 'standard' | 'custom');
      if (layoutType === 'standard') {
        updateSingleState('keyCount', 88);
        updateSingleState('startNote', { letter: 'A', octave: 0 });
      } else if (layoutType === 'custom' && !startNote) {
        updateSingleState('startNote', { letter: 'A', octave: 0 });
      }
    },
    [updateSingleState, startNote],
  );

  const handleKeyCountChange = useCallback(
    (value: number) => {
      updateSingleState('keyCount', value);
    },
    [updateSingleState],
  );

  const handleStartNoteChange = useCallback(
    (note: Note) => {
      updateSingleState('startNote', note);
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

        <FieldSet className="mt-6">
          <FieldLegend>{t('Keyboard layout')}</FieldLegend>
          <FieldDescription>
            {t(
              'You can define your keyboard layout manually if it differs from the standard 88-key configuration.',
            )}
          </FieldDescription>
          <FieldGroup>
            <Field>
              <FieldLabel>{t('Layout')}</FieldLabel>
              <RadioGroup value={layoutMode} onValueChange={handleLayoutChange}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="layout-standard" />
                  <FieldLabel htmlFor="layout-standard">
                    {t('Standard 88 keys')}
                  </FieldLabel>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="layout-custom" />
                  <FieldLabel htmlFor="layout-custom">{t('Custom')}</FieldLabel>
                </div>
              </RadioGroup>
            </Field>

            {isCustomLayout && (
              <>
                <Field>
                  <FieldLabel>{t('Number of keys')}</FieldLabel>
                  <NumericSelector
                    value={keyCount}
                    onChange={handleKeyCountChange}
                    minValue={85}
                    maxValue={97}
                    step={1}
                  />
                </Field>
                <Field>
                  <FieldLabel>{t('First note')}</FieldLabel>
                  <ValueSelector
                    currentValue={startNote ? getNoteName(startNote) : 'A0'}
                    onChange={(noteName: string) => {
                      const note = validStartNotes.find(
                        (n) => getNoteName(n) === noteName,
                      );
                      if (note) {
                        handleStartNoteChange(note);
                      }
                    }}
                    values={startNoteValues}
                  />
                </Field>
              </>
            )}
          </FieldGroup>
        </FieldSet>
      </div>
    </MainLayout>
  );
};
