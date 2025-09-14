import {
  useGlobalMeasures,
  useMeasureActions,
} from '@/hooks/use-measure-store';
import { MeasureInputField } from './MeasureInputField';
import type { OptionalNumber } from '@/lib/piano/touch-design/measured-key.requirements';
import { useCallback } from 'react';
import {
  DEFAULT_KEY_WEIGHT_RATIO,
  DEFAULT_WIPPEN_RADIUS_WEIGHT,
} from '@/lib/piano/touch-design/constants';
import Joi from 'joi';
import { useTranslation } from '@/hooks/use-translation';

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
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-10 flex-wrap items-center hover:bg-purple-50 p-2 px-3 max-w-fit">
        <h3 className="text-sm font-bold w-40">{t('Key weight ratio')}</h3>
        <div>
          <MeasureInputField
            className="w-15"
            defaultValue={pianoGlobalMeasures.keyWeightRatio}
            onUpdate={onUpdateKeyRatio}
            placeholder={DEFAULT_KEY_WEIGHT_RATIO.toString()}
            validator={Joi.number().min(0.1).max(1).optional()}
          />
        </div>
      </div>

      <div className="flex flex-row gap-10 flex-wrap items-center hover:bg-purple-50 p-2 px-3 max-w-fit">
        <h3 className="text-sm font-bold w-40">{t('Wippen radius weight')}</h3>
        <div>
          <MeasureInputField
            className="w-15"
            defaultValue={pianoGlobalMeasures.wippenRadiusWeight}
            onUpdate={onUpdateWippenRadiusWeight}
            placeholder={DEFAULT_WIPPEN_RADIUS_WEIGHT.toString()}
          />
        </div>
      </div>
    </div>
  );
};
