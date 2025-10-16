import {
  type WippenSupportSpringsDesignTarget,
  type WippenTensionDesign,
} from '../WippenSupportSpringsDesign.types';
import { useTranslation } from '@/hooks/use-translation';
import { useKeyboard } from '@/hooks/keyboard/use-keyboard';
import { useCallback, useEffect, useMemo } from 'react';
import { WipenDesignSpecificationItem } from './WippenDesignSpecificationItem';

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
  const { t } = useTranslation();
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

  return (
    <div className="flex flex-row gap-10">
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
        name={t('Spring balance weight (g)')}
        selectorProps={{
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
            maxCharacters: keyboard.size.toString().length,
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
