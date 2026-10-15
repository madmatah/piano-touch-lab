import { useInjection } from 'inversify-react';
import { createContext, useMemo, type ReactNode } from 'react';

import {
  useGenerateTargetSeries,
  type TargetSeries,
} from '@/components/design/hooks/use-target-series-generators';
import { useGenerateDesignedKeyboardFromSeries } from '@/hooks/keyboard/use-generate-designed-keyboard-from-series';
import { useMeasuredKeyboard } from '@/hooks/keyboard/use-measured-keyboard';
import {
  touchWeightAnalyzerRequirementsSymbol,
  type TouchWeightAnalyzerRequirements,
} from '@/lib/piano/touch-design/touch-weight-analyzer/touch-weight-analyzer-requirements';
import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';
import {
  touchWeightPreviewerRequirementsSymbol,
  type TouchWeightPreviewerRequirements,
} from '@/lib/piano/touch-design/touch-weight-previewer/touch-weight-previewer.requirements';

export interface KeyboardAnalysisContextValue {
  /** The measured keyboard, analyzed key by key. */
  analyzedKeyboard: TouchWeightAnalyzedKeyboard;
  /** The same keyboard once the four targets of the design are applied. */
  designedKeyboard: TouchWeightAnalyzedKeyboard;
  targetSeries: TargetSeries;
}

export const KeyboardAnalysisContext = createContext<
  KeyboardAnalysisContextValue | undefined
>(undefined);

/**
 * Analyzes the measured keyboard and designs it, once for the whole page.
 *
 * The layout, the design banner, its printed recap, the page and its design
 * panel all read these keyboards. Built by each of them, a click on a Design
 * page would run the analysis of every key and the design pipeline four
 * times over.
 */
export const KeyboardAnalysisProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const touchWeightAnalyzer = useInjection<TouchWeightAnalyzerRequirements>(
    touchWeightAnalyzerRequirementsSymbol,
  );
  const touchWeightPreviewer = useInjection<TouchWeightPreviewerRequirements>(
    touchWeightPreviewerRequirementsSymbol,
  );
  const measuredKeyboard = useMeasuredKeyboard();

  const analyzedKeyboard: TouchWeightAnalyzedKeyboard = useMemo(
    () => measuredKeyboard.map((key) => touchWeightAnalyzer.analyzeKey(key)),
    [measuredKeyboard, touchWeightAnalyzer],
  );

  const targetSeries = useGenerateTargetSeries(analyzedKeyboard);
  const { generateDesignedKeyboardFromSeries } =
    useGenerateDesignedKeyboardFromSeries(analyzedKeyboard);

  const designedKeyboard = useMemo(
    () =>
      generateDesignedKeyboardFromSeries(targetSeries).map((key) =>
        touchWeightPreviewer.computeTouchWeight(key),
      ),
    [generateDesignedKeyboardFromSeries, targetSeries, touchWeightPreviewer],
  );

  const value = useMemo(
    () => ({ analyzedKeyboard, designedKeyboard, targetSeries }),
    [analyzedKeyboard, designedKeyboard, targetSeries],
  );

  return (
    <KeyboardAnalysisContext.Provider value={value}>
      {children}
    </KeyboardAnalysisContext.Provider>
  );
};
