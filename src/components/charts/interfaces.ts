import type { KeyWith } from '@/lib/piano/keyboard';
import type { TouchDesignSerieVariant } from './TouchDesignChart';

export interface EchartsDataItemStyle {
  color?: string;
}

export type TouchDesignDataPointOld = number | undefined | [number, undefined];

export type TouchDesignDataPoint = KeyWith<number | undefined>;

export interface TouchDesignSerie {
  name: string;
  data: readonly TouchDesignDataPoint[];
  variant?: TouchDesignSerieVariant;
  color?: string;
  sharpItemStyle?: EchartsDataItemStyle;
  flatItemStyle?: EchartsDataItemStyle;
}
