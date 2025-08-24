import type { KeyColor } from './key-color.enum';

export interface Key {
  number: number;
  color: KeyColor;
  name: string;
  octave: number;
}
