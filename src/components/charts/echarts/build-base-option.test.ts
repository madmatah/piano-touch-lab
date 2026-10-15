import { describe, expect, it } from 'bun:test';

import {
  scaleFromReadings,
  scaleOver,
  type AxisScale,
} from './build-base-option';

/** The static balance panel of the design: ruled every 20g, from zero. */
const WEIGHT: AxisScale = { interval: 20, max: 100, min: 0 };

describe('A scale widened to what the instrument reads', () => {
  it('should keep the design scale where the readings fit in it', () => {
    expect(scaleOver(WEIGHT, [40, 88])).toEqual(WEIGHT);
  });

  it('should take in a reading the design did not expect', () => {
    expect(scaleOver(WEIGHT, [40, 104]).max).toBe(120);
  });
});

describe('A scale lifted to where the readings start', () => {
  it('should rule the panel from under the lowest reading', () => {
    // An ordinary piano: nothing under 37g, so two fifths of a panel ruled
    // from zero would be drawn for nothing.
    expect(scaleFromReadings(WEIGHT, [37.4, 88])).toEqual({
      interval: 10,
      max: 100,
      min: 30,
    });
  });

  it('should leave the rules on round values', () => {
    // 35 is the first step of 5 under 37.4, and a panel ruled every 5 from
    // 35 to 100 would carry fourteen rules: the step that fits is 10.
    expect(scaleFromReadings(WEIGHT, [37.4, 88]).min % 10).toBe(0);
  });

  it('should keep a reading off the foot of its panel', () => {
    // A reading sitting on the foot reads as one that ran off it.
    expect(scaleFromReadings(WEIGHT, [40, 88]).min).toBe(30);
  });

  it('should leave the design scale alone on a piano that reads low', () => {
    expect(scaleFromReadings(WEIGHT, [4, 88])).toEqual(WEIGHT);
    expect(scaleFromReadings(WEIGHT, [0, 88])).toEqual(WEIGHT);
  });

  it('should still take in a reading the design did not expect', () => {
    expect(scaleFromReadings(WEIGHT, [37, 104])).toEqual({
      interval: 20,
      max: 120,
      min: 20,
    });
  });

  it('should have nothing to go on without readings', () => {
    expect(scaleFromReadings(WEIGHT, [])).toEqual(WEIGHT);
  });
});
