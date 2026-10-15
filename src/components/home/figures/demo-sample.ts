import { gaveauModele1 } from '@/demo-data/gaveau-m1';
import { CurveSmootherCubicSpline } from '@/lib/geometry/curve-smoother/curve-smoother-cubic-spline';
import { DataPointsExtractor } from '@/lib/geometry/curve-smoother/data-points-extractor/data-points-extractor';
import { KeyboardFactory, type KeyWith } from '@/lib/piano/keyboard';
import { strikeWeightKeyPointsByLevel } from '@/lib/piano/touch-design/data/strike-weight';
import { FrontWeightCalculator } from '@/lib/piano/touch-design/front-weight-calculator/front-weight-calculator';
import { generateSupportSpringBalanceWeightCurve } from '@/lib/piano/touch-design/generate-support-spring-balance-weight-curve';
import { StrikeWeightLevel } from '@/lib/piano/touch-design/hammer-weight-level';
import type { MeasuredKeyRequirements } from '@/lib/piano/touch-design/measured-key.requirements';
import { TouchWeightAnalyzer } from '@/lib/piano/touch-design/touch-weight-analyzer/touch-weight-analyzer';
import type { TouchWeightKeyAnalysis } from '@/lib/piano/touch-design/touch-weight-key-analysis';

/**
 * The design the demonstration piano ships with.
 *
 * `gaveauModele1.design` stores exactly these, but each of its fields is a
 * union of everything the matching design mode could hold; narrowing six of
 * them would bury the figures in type guards. `demo-sample.test.ts` pins the
 * two copies together instead.
 */
export const DEMO_DESIGN = {
  balanceWeightTarget: 39,
  springBaseTension: 9.5,
  springCount: 48,
  springTensionDropIndex: 1,
  strikeWeightLevel: StrikeWeightLevel.Level5,
  strikeWeightRatio: 6,
};

/** The first note of a piano, when a profile does not say. */
const DEFAULT_FIRST_NOTE = 'A0';

const { keys, keyWeightRatio, wippenRadiusWeight } = gaveauModele1.measures;
const startNote = gaveauModele1.piano?.startNote;

const keyboard = KeyboardFactory.fromStartNoteAndLength(
  startNote ? `${startNote.letter}${startNote.octave}` : DEFAULT_FIRST_NOTE,
  keys.length,
);

const analyzer = new TouchWeightAnalyzer();
const frontWeightCalculator = new FrontWeightCalculator();

/**
 * A key's measurements, read from the backup as `useImportBackupData` reads
 * them and falling back to the instrument-wide ones as
 * `useKeyMeasurementsHelpers` does.
 */
const measurementsOf = (index: number): MeasuredKeyRequirements => {
  const key = keys[index]!;
  return {
    downWeightWithSpringSupport: key.downWeightWithSpringSupport ?? null,
    downWeightWithoutSpringSupport:
      key.downWeightWithoutSpringSupport ?? key.downWeight ?? null,
    frontWeight: key.frontWeight ?? null,
    keyWeightRatio: key.keyWeightRatio ?? keyWeightRatio ?? null,
    measuredStrikeWeightRatio: key.measuredStrikeWeightRatio ?? null,
    strikeWeight: key.strikeWeight ?? null,
    upWeight: key.upWeight ?? null,
    wippenRadiusWeight: key.wippenRadiusWeight ?? wippenRadiusWeight ?? null,
  };
};

const measured: KeyWith<TouchWeightKeyAnalysis>[] = keyboard.mapToArray(
  (key) => ({
    ...key,
    payload: analyzer.analyzeKey({
      ...key,
      payload: measurementsOf(key.number - 1),
    }),
  }),
);

/**
 * A standard curve as the application plots it: the five key points run
 * through the cubic spline, which is what `useStrikeWeightCurve` builds for
 * every chart and for the design pipeline behind them.
 *
 * The 88-value table that sits beside the key points is rounded to a tenth
 * of a gram; drawn at this size, and multiplied by the strike weight ratio
 * on its way to a front weight, that rounding reads as a staircase.
 *
 * The key points are written for 88 keys, which is what the demonstration
 * piano has, so they need no rescaling here.
 */
const cubicSpline = new CurveSmootherCubicSpline(new DataPointsExtractor());

const standardCurve = (keypoints: Map<number, number>): number[] =>
  cubicSpline.smoothCurve(
    keyboard.mapToArray((key) => keypoints.get(key.number)),
  );

export const demoStandardStrikeWeight = Object.fromEntries(
  Object.values(StrikeWeightLevel).map((level) => [
    level,
    standardCurve(strikeWeightKeyPointsByLevel[level]),
  ]),
) as Record<StrikeWeightLevel, number[]>;

const designedStrikeWeight =
  demoStandardStrikeWeight[DEMO_DESIGN.strikeWeightLevel];

const springCurve = generateSupportSpringBalanceWeightCurve({
  baseTension: DEMO_DESIGN.springBaseTension,
  numberOfSprings: DEMO_DESIGN.springCount,
  tensionDropIndex: DEMO_DESIGN.springTensionDropIndex,
});

/** The sprung keys carry the taper; the rest of the keyboard carries nothing. */
const designedSpringBalance: (number | null)[] = keyboard.mapToArray(
  (key) => springCurve[key.number - 1] ?? null,
);

/** What the keys would have to weigh to land on the design's balance weight. */
const designedFrontWeight = measured.map(
  (key, index) =>
    frontWeightCalculator.calculateFrontWeight(
      {
        ...key,
        payload: {
          ...key.payload,
          strikeWeight: designedStrikeWeight[index] ?? null,
          strikeWeightRatio: DEMO_DESIGN.strikeWeightRatio,
          supportSpringBalanceWeight: designedSpringBalance[index] ?? 0,
        },
      },
      DEMO_DESIGN.balanceWeightTarget,
    ).frontWeight,
);

const series = (
  pick: (key: TouchWeightKeyAnalysis) => number | null | undefined,
): (number | null)[] => measured.map((key) => pick(key.payload) ?? null);

export const DEMO_KEY_COUNT = keyboard.size;
export const DEMO_PIANO_NAME = [
  gaveauModele1.piano?.brand,
  gaveauModele1.piano?.model,
]
  .filter(Boolean)
  .join(' ');

export const demoKeyNames = keyboard.mapToArray((key) => key.name);

/**
 * The demonstration piano as the application reads it, reduced to the series
 * the home page illustrations are drawn from.
 *
 * Those illustrations show what the application does, not what the reader's
 * own instrument reads, so they are taken from the piano that ships with it
 * and stay the same whoever is looking. Real measurements run through the
 * real analyser rather than a decorative squiggle: the figures are the
 * argument.
 */
export const demoMeasured = {
  balanceWeight: series((key) => key.balanceWeight),
  downWeight: series((key) => key.downWeightWithoutSpringSupport),
  friction: series((key) => key.frictionWeight),
  frontWeight: series((key) => key.frontWeight),
  /** What the springs take off the measuring point, where they are fitted. */
  springBalance: series((key) => key.supportSpringBalanceWeight),
  strikeWeight: series((key) => key.strikeWeight),
  upWeight: series((key) => key.upWeight),
};

/** The same piano once the design of {@link DEMO_DESIGN} is applied to it. */
export const demoDesigned = {
  frontWeight: designedFrontWeight,
  springBalance: designedSpringBalance,
  strikeWeight: designedStrikeWeight,
};
