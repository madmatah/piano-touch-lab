import {
  type WippenSupportSpringsDesignTarget,
  type WippenTensionDesign,
} from '@/lib/piano/touch-design/design/wippen-support-springs-design';
import { useTranslation } from '@/hooks/use-translation';
import { useKeyboard } from '@/hooks/keyboard/use-keyboard';
import { formatWeightValue } from '@/lib/format/format-weight';
import { useCallback, useEffect, useMemo } from 'react';
import { WipenDesignSpecificationItem } from './WippenDesignSpecificationItem';

/**
 * `20,0 g`: the widest label the spring weight stepper can show. The value box
 * is sized from it so that stepping does not make the control jump.
 */
const SPRING_WEIGHT_CHARACTERS = 6;

/** `#88 · G#4`: likewise, the widest label of the tension drop stepper. */
const TENSION_DROP_INDEX_CHARACTERS = 9;

export interface WippenDesignSelectorProps {
  currentTarget: WippenSupportSpringsDesignTarget;
  onTargetChange: (target: WippenSupportSpringsDesignTarget) => void;
  shouldEnableTensionDropIndexSelector: boolean;
}

export const WippenDesignSelector: React.FC<WippenDesignSelectorProps> = ({
  currentTarget,
  onTargetChange,
  shouldEnableTensionDropIndexSelector,
}) => {
  const { currentLanguage, t } = useTranslation();
  const { keyboard } = useKeyboard();

  const currentTensionDesign: WippenTensionDesign = useMemo(() => {
    const tensionDesign = currentTarget as WippenTensionDesign;
    return shouldEnableTensionDropIndexSelector
      ? {
          numberOfSprings: tensionDesign?.numberOfSprings,
          springBalanceWeight: tensionDesign?.springBalanceWeight,
          tensionDropIndex: tensionDesign?.tensionDropIndex,
        }
      : {
          numberOfSprings: tensionDesign?.numberOfSprings,
          springBalanceWeight: tensionDesign?.springBalanceWeight,
        };
  }, [currentTarget, shouldEnableTensionDropIndexSelector]);

  const onSpringsCountChange = useCallback(
    (numberOfSprings: number) => {
      onTargetChange({
        ...currentTensionDesign,
        numberOfSprings: numberOfSprings,
      });
    },
    [onTargetChange, currentTensionDesign],
  );

  const onSpringBalanceWeightChange = useCallback(
    (springBalanceWeight: number) => {
      onTargetChange({
        ...currentTensionDesign,
        springBalanceWeight: springBalanceWeight,
      });
    },
    [onTargetChange, currentTensionDesign],
  );

  const onTensionDropIndexChange = useCallback(
    (tensionDropIndex: number) => {
      onTargetChange({
        ...currentTensionDesign,
        tensionDropIndex: tensionDropIndex,
      });
    },
    [onTargetChange, currentTensionDesign],
  );

  useEffect(() => {
    if (
      currentTensionDesign.tensionDropIndex !== undefined &&
      currentTensionDesign.tensionDropIndex >
        currentTensionDesign.numberOfSprings
    ) {
      onTensionDropIndexChange(currentTensionDesign.numberOfSprings);
    }
  }, [currentTensionDesign, onTensionDropIndexChange]);

  // The unit belongs on the value now that the label no longer carries it.
  const springBalanceWeightLabelFormatter = useCallback(
    (value: number) =>
      t('{{value}} g', { value: formatWeightValue(value, currentLanguage) }),
    [currentLanguage, t],
  );

  // A bare key number asks the user to count keys; the note name answers the
  // question they actually have — where on the keyboard the tension drops.
  const tensionDropIndexLabelFormatter = useCallback(
    (value: number) =>
      t('#{{number}} · {{note}}', {
        note: keyboard.getKeyByNumber(value)?.name ?? '',
        number: value,
      }),
    [keyboard, t],
  );

  return (
    <div className="flex flex-wrap gap-x-8 gap-y-3.5">
      <WipenDesignSpecificationItem
        name={t('Number of springs')}
        selectorProps={{
          maxCharacters: keyboard.size.toString().length,
          maxValue: keyboard.size,
          minValue: 0,
          onChange: onSpringsCountChange,
          value: currentTensionDesign.numberOfSprings,
        }}
      />

      <WipenDesignSpecificationItem
        name={t('Weight supported by the springs')}
        selectorProps={{
          labelFormatter: springBalanceWeightLabelFormatter,
          maxCharacters: SPRING_WEIGHT_CHARACTERS,
          maxValue: 20,
          minValue: 0,
          onChange: onSpringBalanceWeightChange,
          step: 0.5,
          value: currentTensionDesign.springBalanceWeight,
        }}
      />

      {shouldEnableTensionDropIndexSelector ? (
        <WipenDesignSpecificationItem
          name={t('Tension drop index')}
          selectorProps={{
            labelFormatter: tensionDropIndexLabelFormatter,
            maxCharacters: TENSION_DROP_INDEX_CHARACTERS,
            maxValue: currentTensionDesign.numberOfSprings,
            minValue: 1,
            onChange: onTensionDropIndexChange,
            value: currentTensionDesign.tensionDropIndex!,
          }}
        />
      ) : null}
    </div>
  );
};
