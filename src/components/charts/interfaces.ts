import type { TouchDesignSerieVariant } from './TouchDesignChart';

export interface EchartsDataItemStyle {
  color?: string;
}

export interface TouchDesignSerie {
  name: string;
  data: Array<number | undefined>;
  variant?: TouchDesignSerieVariant;
  color?: string;
  sharpItemStyle?: EchartsDataItemStyle;
  flatItemStyle?: EchartsDataItemStyle;
}
