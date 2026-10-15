import { useTranslation } from '@/hooks/use-translation';
import type { Key } from '@/lib/piano/keyboard/key';
import type { KeyboardPlacement } from '@/lib/piano/keyboard/keyboard-geometry';

import type { AxisScale } from '../echarts/build-base-option';
import { KeyboardChart } from '../KeyboardChart';
import { ChartKeyboardAxis } from './ChartKeyboardAxis';

export interface ChartEmptyFrameProps {
  /** What to say, laid over the figure: an `EmptyState`. */
  children: React.ReactNode;
  geometry: KeyboardPlacement;
  height: number;
  keys: readonly Key[];
  scale: AxisScale;
  variant: 'analyze' | 'design';
}

/**
 * A figure with nothing to draw yet: its empty axes and keyboard, faded,
 * under a veil that says what is missing.
 *
 * The figure keeps its place and its size, so the page does not jump the
 * moment the first value comes in.
 */
export const ChartEmptyFrame = ({
  children,
  geometry,
  height,
  keys,
  scale,
  variant,
}: ChartEmptyFrameProps) => {
  const { t } = useTranslation();

  return (
    <section
      aria-label={t('Chart unavailable')}
      className="relative overflow-hidden rounded-md border border-ptl-rule-strong bg-card"
    >
      <div aria-hidden="true" className="px-3 pt-[18px] pb-1.5 opacity-55">
        <KeyboardChart
          variant={variant}
          geometry={geometry}
          height={height}
          scale={scale}
          series={[]}
        />
        <ChartKeyboardAxis
          keys={keys}
          marks="none"
          description={t('Keyboard')}
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-ptl-veil p-6">
        {children}
      </div>
    </section>
  );
};
