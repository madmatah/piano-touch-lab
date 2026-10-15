import { useCallback, useMemo, useState } from 'react';

import { MainLayout } from '../MainLayout';
import { PageHeading } from '../layout/PageHeading';
import { PageSection } from '../layout/PageSection';
import { SavedLocallyIndicator } from '../layout/SavedLocallyIndicator';
import { PianoKeyboard, type PianoKeyTone } from '../piano/PianoKeyboard';
import { useTranslation } from '@/hooks/use-translation';
import {
  usePianoProfileState,
  usePianoProfileActions,
} from '@/hooks/store/use-piano-profile-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radio-group';
import { RadioItem } from '@/components/app-ui/RadioGroupItem';
import { NumericSelector } from '@/components/app-ui/numeric-selector/NumericSelector';
import { ValueSelector } from '@/components/app-ui/value-selector/ValueSelector';
import { useKeyboard } from '@/hooks/keyboard/use-keyboard';
import { useValidStartNotes } from '@/hooks/keyboard/valid-start-notes';
import { getNoteName } from '@/lib/music/theory/spn';
import type { Note } from '@/lib/music/theory/spn';
import { Standard88Layout } from '@/lib/piano/keyboard';
import { KeyColor } from '@/lib/piano/keyboard/key-color.enum';
import { cn } from '@/lib/utils';

type LayoutMode = 'standard' | 'custom';

export const PianoPage = () => {
  const { t } = useTranslation();
  const { brand, model, serialNumber, keyCount, startNote } =
    usePianoProfileState();
  const { updateSingleState } = usePianoProfileActions();
  const { keyboard } = useKeyboard();

  const getInitialLayoutMode = (): LayoutMode => {
    if (
      keyCount === Standard88Layout.length &&
      startNote?.letter === Standard88Layout.startNote.letter &&
      startNote?.octave === Standard88Layout.startNote.octave
    ) {
      return 'standard';
    }
    return 'custom';
  };

  const [layoutMode, setLayoutMode] = useState<LayoutMode>(() =>
    getInitialLayoutMode(),
  );

  const isCustomLayout = layoutMode === 'custom';

  const { validStartNotes } = useValidStartNotes();

  const startNoteValues = useMemo(
    () =>
      validStartNotes.map((note) => ({
        label: getNoteName(note),
        value: getNoteName(note),
      })),
    [validStartNotes],
  );

  const keys = keyboard.getKeys();
  const whiteKeyCount = keys.filter(
    (key) => key.color === KeyColor.White,
  ).length;
  const firstKeyName = keys[0]?.name ?? '';
  const lastKeyName = keys[keys.length - 1]?.name ?? '';
  const middleCKeyNumber = keyboard.getKeyByName('C4')?.number;

  /** The two ends of the range are tinted, so the span reads at a glance. */
  const rangeEndTones = useMemo(() => {
    const allKeys = keyboard.getKeys();
    return new Map<number, PianoKeyTone>(
      [allKeys[0], allKeys[allKeys.length - 1]]
        .filter((key) => key !== undefined)
        .map((key) => [key.number, 'marked' as const]),
    );
  }, [keyboard]);

  const handleBrandChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      updateSingleState('brand', event.target.value || null);
    },
    [updateSingleState],
  );

  const handleModelChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      updateSingleState('model', event.target.value || null);
    },
    [updateSingleState],
  );

  const handleSerialNumberChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      updateSingleState('serialNumber', event.target.value || null);
    },
    [updateSingleState],
  );

  const handleLayoutChange = useCallback(
    (layoutType: string) => {
      setLayoutMode(layoutType as LayoutMode);
      if (layoutType === 'standard') {
        updateSingleState('keyCount', Standard88Layout.length);
        updateSingleState('startNote', Standard88Layout.startNote);
      } else if (layoutType === 'custom' && !startNote) {
        updateSingleState('startNote', Standard88Layout.startNote);
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
    (noteName: string) => {
      const note: Note | undefined = validStartNotes.find(
        (candidate) => getNoteName(candidate) === noteName,
      );
      if (note) {
        updateSingleState('startNote', note);
      }
    },
    [updateSingleState, validStartNotes],
  );

  return (
    <MainLayout headerRight={<SavedLocallyIndicator />}>
      <PageHeading
        title={t('Piano')}
        lede={t(
          'This info will appear in the app and on your printed reports, helping you stay organized if you manage multiple instruments.',
        )}
        ledeWidth="64ch"
      />

      <div className="flex flex-wrap items-stretch gap-6">
        <PageSection
          className="flex-[1_1_340px]"
          contentClassName="gap-[18px]"
          title={t('Identify your piano')}
        >
          <div className="flex flex-col gap-[7px]">
            <Label htmlFor="piano-brand">{t('Brand')}</Label>
            <Input
              id="piano-brand"
              placeholder={t('Enter your piano brand')}
              value={brand ?? ''}
              onChange={handleBrandChange}
            />
          </div>
          <div className="flex flex-col gap-[7px]">
            <Label htmlFor="piano-model">{t('Model')}</Label>
            <Input
              id="piano-model"
              placeholder={t('Enter your piano model')}
              value={model ?? ''}
              onChange={handleModelChange}
            />
          </div>
          <div className="flex flex-col gap-[7px]">
            <Label htmlFor="piano-serial">{t('Serial Number')}</Label>
            <Input
              id="piano-serial"
              className="font-mono"
              placeholder={t('Enter your piano serial number')}
              value={serialNumber ?? ''}
              onChange={handleSerialNumberChange}
            />
          </div>
        </PageSection>

        <PageSection className="flex-[1_1_420px]" title={t('Keyboard layout')}>
          <p className="m-0 text-[13px] leading-[1.5] text-muted-foreground">
            {t(
              'You can define your keyboard layout manually if it differs from the standard 88-key configuration.',
            )}
          </p>
          <RadioGroup
            value={layoutMode}
            onValueChange={handleLayoutChange}
            aria-label={t('Keyboard layout')}
          >
            <RadioItem
              value="standard"
              label={t('Standard 88 keys')}
              description={t('From A0 to C8.')}
            />
            <RadioItem value="custom" label={t('Custom')}>
              {/*
               * Dimmed and inert while the layout is standard: the mockup
               * shows the fields, but a stepper clicked here would raise the
               * key count of a keyboard still labelled "Standard 88 keys".
               */}
              <div
                inert={!isCustomLayout}
                className={cn(
                  'flex flex-wrap gap-[18px]',
                  !isCustomLayout && 'opacity-50',
                )}
              >
                <div className="flex flex-col gap-1.5">
                  <span className="ptl-label">{t('Number of keys')}</span>
                  <NumericSelector
                    value={keyCount}
                    onChange={handleKeyCountChange}
                    minValue={85}
                    maxValue={97}
                    step={1}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="ptl-label">{t('First note')}</span>
                  <ValueSelector
                    currentValue={startNote ? getNoteName(startNote) : 'A0'}
                    onChange={handleStartNoteChange}
                    values={startNoteValues}
                  />
                </div>
              </div>
            </RadioItem>
          </RadioGroup>
        </PageSection>
      </div>

      <PageSection
        title={t('Keyboard preview')}
        meta={t(
          '{{total}} keys · {{white}} white · {{black}} black · {{first}} → {{last}}',
          {
            black: keys.length - whiteKeyCount,
            first: firstKeyName,
            last: lastKeyName,
            total: keys.length,
            white: whiteKeyCount,
          },
        )}
      >
        <PianoKeyboard
          keys={keys}
          toneByKeyNumber={rangeEndTones}
          description={t(
            'Keyboard of {{count}} keys, from {{first}} to {{last}}',
            { count: keys.length, first: firstKeyName, last: lastKeyName },
          )}
          labels={[
            {
              at: 'start',
              text: `${firstKeyName} · ${t('key {{number}}', { number: 1 })}`,
            },
            ...(middleCKeyNumber !== undefined
              ? [{ at: middleCKeyNumber, isMuted: true, text: 'C4' } as const]
              : []),
            {
              at: 'end',
              text: `${t('key {{number}}', { number: keys.length })} · ${lastKeyName}`,
            },
          ]}
        />
      </PageSection>
    </MainLayout>
  );
};
