import Joi from 'joi';
import { useCallback } from 'react';

import {
  useGlobalMeasures,
  useMeasureActions,
} from '@/hooks/store/use-measure-store';
import { useTranslation } from '@/hooks/use-translation';
import {
  DEFAULT_KEY_WEIGHT_RATIO,
  DEFAULT_WIPPEN_RADIUS_WEIGHT,
} from '@/lib/piano/touch-design/constants';
import type { OptionalNumber } from '@/lib/piano/touch-design/measured-key.requirements';

import { MeasureInputField } from './MeasureInputField';

/**
 * The two values that hold for the whole instrument.
 *
 * They sit on one line above the table rather than in a section of their own:
 * they are measured once, and the rest of the page is the real work.
 */
export const PianoMeasureList = () => {
  const pianoGlobalMeasures = useGlobalMeasures();
  const { updateGlobalMeasure } = useMeasureActions();
  const { t } = useTranslation();

  const onUpdateKeyRatio = useCallback(
    (value: OptionalNumber) => {
      updateGlobalMeasure('keyWeightRatio', value);
    },
    [updateGlobalMeasure],
  );

  const onUpdateWippenRadiusWeight = useCallback(
    (value: OptionalNumber) => {
      updateGlobalMeasure('wippenRadiusWeight', value);
    },
    [updateGlobalMeasure],
  );

  return (
    <section
      aria-label={t('For the whole piano')}
      className="flex flex-wrap items-center gap-x-7 gap-y-3 rounded-md border border-border bg-card px-4 py-3"
    >
      <h2 className="m-0 font-sans text-sm font-semibold">
        {t('For the whole piano')}
      </h2>
      <label className="inline-flex items-center gap-2.5 text-[13.5px] text-muted-foreground">
        {t('Key weight ratio')}
        <MeasureInputField
          className="w-[72px]"
          defaultValue={pianoGlobalMeasures.keyWeightRatio}
          onUpdate={onUpdateKeyRatio}
          placeholder={DEFAULT_KEY_WEIGHT_RATIO.toString()}
          validator={Joi.number().min(0.1).max(1).optional()}
        />
      </label>
      <label className="inline-flex items-center gap-2.5 text-[13.5px] text-muted-foreground">
        {t('Wippen radius weight')}
        <MeasureInputField
          className="w-[72px]"
          defaultValue={pianoGlobalMeasures.wippenRadiusWeight}
          onUpdate={onUpdateWippenRadiusWeight}
          placeholder={DEFAULT_WIPPEN_RADIUS_WEIGHT.toString()}
        />
        <span className="font-mono text-xs text-ptl-ink-3">g</span>
      </label>
    </section>
  );
};
