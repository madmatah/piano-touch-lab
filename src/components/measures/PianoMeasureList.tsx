import { useMeasureActions, usePianoMeasures } from '@/hooks/use-measure-store';
import { MeasureInputField } from './MeasureInputField';
import type { OptionalNumber } from '@/lib/piano/touch-design/measure-requirements';
import { useCallback } from 'react';
import {
  DEFAULT_KEY_RATIO,
  DEFAULT_WIPPEN_WEIGHT,
} from '@/lib/piano/touch-design/constants';
import Joi from 'joi';

export const PianoMeasureList = () => {
  const pianoMeasures = usePianoMeasures();
  const { updateGlobalMeasure } = useMeasureActions();

  const onUpdateKeyRatio = useCallback(
    (value: OptionalNumber) => {
      updateGlobalMeasure('keyWeightRatio', value);
    },
    [updateGlobalMeasure],
  );

  const onUpdateWippenWeight = useCallback(
    (value: OptionalNumber) => {
      updateGlobalMeasure('wippenWeight', value);
    },
    [updateGlobalMeasure],
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-10 flex-wrap items-center hover:bg-purple-50 p-2 px-3 max-w-fit">
        <h3 className="text-sm font-bold w-40">Key weight ratio</h3>
        <div>
          <MeasureInputField
            className="w-15"
            defaultValue={pianoMeasures.keyWeightRatio}
            onUpdate={onUpdateKeyRatio}
            placeholder={DEFAULT_KEY_RATIO.toString()}
            validator={Joi.number().min(0.1).max(1).optional()}
          />
        </div>
      </div>

      <div className="flex flex-row gap-10 flex-wrap items-center hover:bg-purple-50 p-2 px-3 max-w-fit">
        <h3 className="text-sm font-bold w-40">Wippen radius weight</h3>
        <div>
          <MeasureInputField
            className="w-15"
            defaultValue={pianoMeasures.wippenWeight}
            onUpdate={onUpdateWippenWeight}
            placeholder={DEFAULT_WIPPEN_WEIGHT.toString()}
          />
        </div>
      </div>
    </div>
  );
};
