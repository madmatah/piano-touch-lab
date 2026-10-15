import { useTouchWeightSeries } from '@/components/charts/touch-weight-chart/hooks/use-touch-weight-series';
import type { TouchWeightSeries } from '@/components/charts/touch-weight-chart/hooks/use-touch-weight-series';
import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';

/**
 * A design always states what the support springs will do, even when the
 * answer is none at all, so the touch it gives is always read with them
 * engaged.
 *
 * Reading a designed keyboard through the measuring option instead leaves the
 * spring on the balance weight — `FrontWeightCalculator` sized the front
 * weight to land on the weight the springs leave behind — and the preview then
 * reports a target the design never aimed at.
 */
export const DESIGN_INCLUDES_SPRING_SUPPORT = true;

/**
 * The two readings the preview sets against each other: the touch the design
 * gives, and the touch the piano has today.
 *
 * Only the second answers to the measuring option, which says whether the
 * technician weighed their keys with the springs hooked up.
 */
export const useTouchWeightPreviewSeries = (
  designedKeyboard: TouchWeightAnalyzedKeyboard,
  analyzedKeyboard: TouchWeightAnalyzedKeyboard,
  useSupportSpringMeasurements: boolean,
): { current: TouchWeightSeries; designed: TouchWeightSeries } => ({
  current: useTouchWeightSeries(analyzedKeyboard, useSupportSpringMeasurements),
  designed: useTouchWeightSeries(
    designedKeyboard,
    DESIGN_INCLUDES_SPRING_SUPPORT,
  ),
});
