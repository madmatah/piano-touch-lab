import { useMemo } from 'react';

import { useAnalyzedKeyboard } from '@/hooks/keyboard/use-analyzed-keyboard';
import { useDesignedKeyboard } from '@/hooks/keyboard/use-designed-keyboard';
import { useIsDesignCompleted } from '@/hooks/keyboard/use-design-completion';
import {
  useFrontWeightDesign,
  useStrikeWeightDesign,
  useStrikeWeightRatioDesign,
  useWippenSupportSpringsDesign,
} from '@/hooks/store/use-design-store';
import { useTranslation } from '@/hooks/use-translation';
import { SmoothStrategy } from '@/lib/geometry/curve-smoother/smooth-strategy.enum';
import { formatGrams, formatRatio } from '@/lib/format/format-weight';
import { feltBalanceWeight } from '@/lib/piano/touch-design/felt-balance-weight';

import { FrontWeightDesignMode } from '../../front-weight/FrontWeightDesign.types';
import { StrikeWeightDesignMode } from '../../strike-weight/StrikeWeightDesign.types';
import { StrikeWeightRatioDesignMode } from '../../strike-weight-ratio/StrikeWeightRatioDesign.types';
import { WippenSupportSpringsDesignMode } from '../../wippen-support-springs/WippenSupportSpringsDesign.types';

/**
 * Between two parts of a step's summary. The space before the dot is one a
 * line never breaks at: a narrow tile wraps after the dot, never before it,
 * so no line starts with one.
 */
const SEPARATOR = '\u00a0· ';

export type DesignStepId =
  | 'springs'
  | 'front-weight'
  | 'strike-weight'
  | 'ratio'
  | 'preview'
  | 'sheet';

export interface DesignStep {
  id: DesignStepId;
  /** Result tiles stay closed until the design resolves. */
  isAvailable: boolean;
  kind: 'parameter' | 'result';
  /** The tile's caption, numbered: "1 · Front Weight". */
  label: string;
  /** The same step without its number, for a printed recap. */
  name: string;
  to: string;
  /** Where the parameter stands right now: "Computed · BW 39 g". */
  value: string;
}

const average = (values: (number | null)[]): number | null => {
  const measured = values.filter((value): value is number => value !== null);
  return measured.length === 0
    ? null
    : measured.reduce((total, value) => total + value, 0) / measured.length;
};

/**
 * The six tiles of the design banner.
 *
 * They turn four separate pages into one form: each tile states where its
 * parameter stands, so the reader can see the whole design from any of them.
 */
export const useDesignSteps = (): DesignStep[] => {
  const { currentLanguage, t } = useTranslation();
  const analyzedKeyboard = useAnalyzedKeyboard();
  const designedKeyboard = useDesignedKeyboard(analyzedKeyboard);
  const isDesignCompleted = useIsDesignCompleted(designedKeyboard);

  const springs = useWippenSupportSpringsDesign();
  const frontWeight = useFrontWeightDesign();
  const strikeWeight = useStrikeWeightDesign();
  const ratio = useStrikeWeightRatioDesign();

  return useMemo(() => {
    const springsValue = () => {
      const target = springs.wippenSupportSpringsDesignTarget;
      const tension =
        target !== null && typeof target === 'object'
          ? `${target.numberOfSprings}${SEPARATOR}${formatGrams(target.springBalanceWeight, currentLanguage)}`
          : null;

      switch (springs.wippenSupportSpringsDesignMode) {
        case WippenSupportSpringsDesignMode.AsMeasured:
          return t('As measured');
        case WippenSupportSpringsDesignMode.Constant:
          return [t('Constant'), tension].filter(Boolean).join(SEPARATOR);
        case WippenSupportSpringsDesignMode.SmoothTransition:
          return [t('Tapered'), tension].filter(Boolean).join(SEPARATOR);
        default:
          return t('None');
      }
    };

    const frontWeightValue = () => {
      switch (frontWeight.frontWeightDesignMode) {
        case FrontWeightDesignMode.Computed:
          return `${t('Computed')}${SEPARATOR}${t('BW {{weight}}', {
            weight: formatGrams(
              frontWeight.frontWeightDesignComputedBalanceWeightTarget,
              currentLanguage,
            ),
          })}`;
        case FrontWeightDesignMode.StandardCurves:
          return t('Curve FW#{{level}}', {
            level: frontWeight.frontWeightDesignStandardTarget ?? '',
          });
        default:
          return t('As measured');
      }
    };

    const strikeWeightValue = () => {
      switch (strikeWeight.strikeWeightDesignMode) {
        case StrikeWeightDesignMode.Computed:
          return `${t('Computed')}${SEPARATOR}${t('BW {{weight}}', {
            weight: formatGrams(
              strikeWeight.strikeWeightDesignComputedBalanceWeightTarget,
              currentLanguage,
            ),
          })}`;
        case StrikeWeightDesignMode.StandardCurves:
          return t('Curve {{level}}', {
            level: String(strikeWeight.strikeWeightDesignStandarTarget ?? ''),
          });
        case StrikeWeightDesignMode.Smoothed:
          return t('Smoothed curve');
        default:
          return t('As measured');
      }
    };

    const ratioValue = () => {
      switch (ratio.strikeWeightRatioDesignMode) {
        case StrikeWeightRatioDesignMode.FixedValue:
          return `${t('Constant')}${SEPARATOR}${formatRatio(
            typeof ratio.strikeWeightRatioDesignLatestFixedTarget === 'number'
              ? ratio.strikeWeightRatioDesignLatestFixedTarget
              : null,
            currentLanguage,
          )}`;
        case StrikeWeightRatioDesignMode.Smoothed:
          return ratio.strikeWeightRatioDesignLatestSmoothTarget ===
            SmoothStrategy.Mean
            ? t('Mean')
            : t('Median');
        default:
          return t('As measured');
      }
    };

    // Only the keys the previewer actually resolved: a balance weight on
    // its own proves nothing, it survives from the measurements. The sidebar
    // opens the same two pages on the same predicate — they have to agree,
    // they are on screen together.
    const designedKeys = designedKeyboard
      .getKeys()
      .filter((key) => key.payload.downWeightWithoutSpringSupport !== null);
    const designedCount = designedKeys.length;
    const designedBalanceWeights = designedKeys.map((key) =>
      feltBalanceWeight(key.payload),
    );

    return [
      {
        id: 'springs' as const,
        isAvailable: true,
        kind: 'parameter' as const,
        label: `1 · ${t('Wippen Support Springs', { ns: 'navigation' })}`,
        name: t('Wippen Support Springs', { ns: 'navigation' }),
        to: '/design/wippen-support-springs',
        value: springsValue(),
      },
      {
        id: 'front-weight' as const,
        isAvailable: true,
        kind: 'parameter' as const,
        label: `2 · ${t('Front Weight', { ns: 'navigation' })}`,
        name: t('Front Weight', { ns: 'navigation' }),
        to: '/design/front-weight',
        value: frontWeightValue(),
      },
      {
        id: 'strike-weight' as const,
        isAvailable: true,
        kind: 'parameter' as const,
        label: `3 · ${t('Strike Weight', { ns: 'navigation' })}`,
        name: t('Strike Weight', { ns: 'navigation' }),
        to: '/design/strike-weight',
        value: strikeWeightValue(),
      },
      {
        id: 'ratio' as const,
        isAvailable: true,
        kind: 'parameter' as const,
        label: `4 · ${t('Strike Weight Ratio', { ns: 'navigation' })}`,
        name: t('Strike Weight Ratio', { ns: 'navigation' }),
        to: '/design/strike-weight-ratio',
        value: ratioValue(),
      },
      {
        id: 'preview' as const,
        isAvailable: isDesignCompleted,
        kind: 'result' as const,
        label: `→ ${t('Touch Weight Preview', { ns: 'navigation' })}`,
        name: t('Touch Weight Preview', { ns: 'navigation' }),
        to: '/design/touch-weight-preview',
        value: t('BW {{weight}}', {
          weight: formatGrams(average(designedBalanceWeights), currentLanguage),
        }),
      },
      {
        id: 'sheet' as const,
        isAvailable: isDesignCompleted,
        kind: 'result' as const,
        label: `→ ${t('Adjustment Sheet', { ns: 'navigation' })}`,
        name: t('Adjustment Sheet', { ns: 'navigation' }),
        to: '/design/adjustment-sheet',
        value: t('{{count}} keys', {
          count: designedCount,
          ns: 'navigation',
        }),
      },
    ];
  }, [
    currentLanguage,
    designedKeyboard,
    isDesignCompleted,
    frontWeight,
    ratio,
    springs,
    strikeWeight,
    t,
  ]);
};
