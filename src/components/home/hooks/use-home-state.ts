import { useMemo } from 'react';

import { useKeyboard } from '@/hooks/keyboard/use-keyboard';
import { useAnalyzedKeyboard } from '@/hooks/keyboard/use-analyzed-keyboard';
import { useDesignedKeyboard } from '@/hooks/keyboard/use-designed-keyboard';
import { useIsDesignCompleted } from '@/hooks/keyboard/use-design-completion';
import { useMeasuredKeyCount } from '@/hooks/keyboard/use-measured-key-count';
import {
  useFrontWeightDesign,
  useStrikeWeightDesign,
  useStrikeWeightRatioDesign,
  useWippenSupportSpringsDesign,
} from '@/hooks/store/use-design-store';
import { FrontWeightDesignMode } from '@/components/design/front-weight/FrontWeightDesign.types';
import { StrikeWeightDesignMode } from '@/components/design/strike-weight/StrikeWeightDesign.types';
import { StrikeWeightRatioDesignMode } from '@/components/design/strike-weight-ratio/StrikeWeightRatioDesign.types';
import { WippenSupportSpringsDesignMode } from '@/components/design/wippen-support-springs/WippenSupportSpringsDesign.types';
import { usePianoProfileState } from '@/hooks/store/use-piano-profile-store';
import {
  useMeasuresStore,
  type MeasuresStore,
} from '@/hooks/store/use-measure-store';
import { useShallow } from 'zustand/shallow';
import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';

/**
 * How far the reader has got, which is what the home page opens on.
 *
 * `demo` is the instrument the application loads on a first visit; the three
 * others are the stages of someone's own piano. Nothing of this is stored:
 * the stage follows from the measurements and the design, so it can never
 * fall out of step with them.
 */
export type HomeStage = 'demo' | 'measuring' | 'measured' | 'designed';

export interface HomeProgress {
  /** One of the four design parameters asks for something other than "as is". */
  hasDesign: boolean;
  isDemoProfile: boolean;
  isDesignCompleted: boolean;
  measured: number;
  total: number;
}

/** The stage a reader is at, from how far their piano has got. */
export const homeStageOf = ({
  hasDesign,
  isDemoProfile,
  isDesignCompleted,
  measured,
  total,
}: HomeProgress): HomeStage =>
  isDemoProfile
    ? 'demo'
    : measured < total
      ? 'measuring'
      : hasDesign && isDesignCompleted
        ? 'designed'
        : 'measured';

/** Where the main call to action leads from each stage: what is left to do. */
export const RESUME_TO: Record<HomeStage, string> = {
  // The demo is already loaded: the button opens it rather than reloading.
  demo: '/analyze/touch-weight',
  designed: '/design/adjustment-sheet',
  // The first step of the design. Springs are designed whether or not they
  // were measured: skipping the step with the option off hid it from whoever
  // has springs and never measured them.
  measured: '/design/wippen-support-springs',
  measuring: '/measure',
};

export interface HomeState {
  analyzedKeyboard: TouchWeightAnalyzedKeyboard;
  designedKeyboard: TouchWeightAnalyzedKeyboard;
  /** Keys carrying both a down and an up weight. */
  measured: number;
  /** The first key still missing one of the two, for "next up". */
  nextKeyToMeasure: { name: string; number: number } | null;
  /** Where the main call to action leads: the next thing left to do. */
  resumeTo: string;
  stage: HomeStage;
  total: number;
}

export const useHomeState = (): HomeState => {
  const { isDemoProfile } = usePianoProfileState();
  const { keyboard } = useKeyboard();
  const { measured, total } = useMeasuredKeyCount();
  const analyzedKeyboard = useAnalyzedKeyboard();
  const designedKeyboard = useDesignedKeyboard(analyzedKeyboard);
  const isDesignCompleted = useIsDesignCompleted(designedKeyboard);
  const { frontWeightDesignMode } = useFrontWeightDesign();
  const { strikeWeightDesignMode } = useStrikeWeightDesign();
  const { strikeWeightRatioDesignMode } = useStrikeWeightRatioDesign();
  const { wippenSupportSpringsDesignMode } = useWippenSupportSpringsDesign();

  // Every design starts out saying "leave it as it is", and the preview
  // then hands back the measurements themselves. A design exists once one of
  // the four asks for something else.
  const hasDesign =
    frontWeightDesignMode !== FrontWeightDesignMode.AsMeasured ||
    strikeWeightDesignMode !== StrikeWeightDesignMode.AsMeasured ||
    strikeWeightRatioDesignMode !== StrikeWeightRatioDesignMode.AsMeasured ||
    wippenSupportSpringsDesignMode !== WippenSupportSpringsDesignMode.None;
  const measures = useMeasuresStore()(
    useShallow((state: MeasuresStore) => state.keys),
  );

  const nextKeyToMeasure = useMemo(() => {
    const index = measures
      .slice(0, keyboard.size)
      .findIndex(
        (key) =>
          key.downWeightWithoutSpringSupport === null || key.upWeight === null,
      );
    if (index === -1) {
      return null;
    }
    const key = keyboard.getKeyByNumber(index + 1);
    return key ? { name: key.name, number: key.number } : null;
  }, [keyboard, measures]);

  return useMemo(() => {
    const stage = homeStageOf({
      hasDesign,
      isDemoProfile,
      isDesignCompleted,
      measured,
      total,
    });

    return {
      analyzedKeyboard,
      designedKeyboard,
      measured,
      nextKeyToMeasure,
      resumeTo: RESUME_TO[stage],
      stage,
      total,
    };
  }, [
    analyzedKeyboard,
    designedKeyboard,
    hasDesign,
    isDemoProfile,
    isDesignCompleted,
    measured,
    nextKeyToMeasure,
    total,
  ]);
};
