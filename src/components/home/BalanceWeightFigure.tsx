import { useMemo } from 'react';

import {
  formatGrams,
  formatSignedWeightValue,
} from '@/lib/format/format-weight';
import { designedBalanceWeight } from '@/lib/piano/touch-design/designed-balance-weight';
import { computeKeyboardGeometry } from '@/lib/piano/keyboard/keyboard-geometry';
import { useTextScale } from '@/hooks/use-text-scale';
import { useTranslation } from '@/hooks/use-translation';

import type { HomeState } from './use-home-state';

/** The drawing is laid out in white-key widths of 20, as the charts are. */
const WHITE_KEY_WIDTH = 20;
/**
 * Deep keys, where a chart's keyboard is a thin axis strip: this is the one
 * place the instrument is shown for itself rather than to read a curve by.
 */
const KEY_HEIGHT = 130;
/** The keybed shows a sliver of itself below the front of the keys. */
const KEYBED_OVERHANG = 4;

const PLOT_TOP = 16;
const PLOT_BOTTOM = 141;
const KEYBOARD_TOP = 182;

/** The scale the figure opens on; a heavier piano widens it. */
const WEIGHT_FLOOR = 40;
const WEIGHT_CEILING = 80;
const WEIGHT_STEP = 10;

/** Below this spread the design lands on one weight, and can be named. */
const FLAT_TARGET_TOLERANCE = 0.5;

const diamond = (x: number, y: number, radius = 3.4) =>
  `M${x.toFixed(1)} ${(y - radius).toFixed(1)}` +
  `l${radius} ${radius}l${-radius} ${radius}l${-radius} ${-radius}z`;

interface Point {
  x: number;
  y: number;
}

const polyline = (points: Point[]) =>
  points
    .map(
      (point, index) =>
        `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)} ${point.y.toFixed(1)}`,
    )
    .join('');

/**
 * The balance weight of the piano on screen, key by key, over its own
 * keyboard.
 *
 * The home page is the one place that shows a whole instrument at a glance,
 * so the figure follows the reader: their measurements as they take them,
 * then the touch their design is heading for. It is ruled by the balance
 * rail like every other figure of the application.
 */
export const BalanceWeightFigure = ({
  description,
  home,
}: {
  description: string;
  home: HomeState;
}) => {
  const { currentLanguage, t } = useTranslation();

  const figure = useMemo(() => {
    const keys = home.analyzedKeyboard.getKeys();
    const geometry = computeKeyboardGeometry(keys, {
      keyHeight: KEY_HEIGHT,
      whiteKeyWidth: WHITE_KEY_WIDTH,
    });

    const measuredWeights = keys
      .map((key) => key.payload.balanceWeight)
      .filter((weight): weight is number => weight !== null);

    const targetByNumber = new Map<number, number>();
    if (home.stage === 'demo' || home.stage === 'designed') {
      for (const key of home.designedKeyboard.getKeys()) {
        const aim = designedBalanceWeight(key.payload);
        if (aim !== null) {
          targetByNumber.set(key.number, aim);
        }
      }
    }
    const targetWeights = [...targetByNumber.values()];

    if (measuredWeights.length < 2) {
      return null;
    }

    // The scale of the mockups is a floor: an instrument outside it widens
    // the figure rather than having its ends quietly clipped.
    const min =
      Math.floor(
        Math.min(WEIGHT_FLOOR, ...measuredWeights, ...targetWeights) /
          WEIGHT_STEP,
      ) * WEIGHT_STEP;
    const max =
      Math.ceil(
        Math.max(WEIGHT_CEILING, ...measuredWeights, ...targetWeights) /
          WEIGHT_STEP,
      ) * WEIGHT_STEP;
    const y = (weight: number) =>
      PLOT_TOP + ((max - weight) / (max - min)) * (PLOT_BOTTOM - PLOT_TOP);

    const placeOf = (keyNumber: number) =>
      geometry.keysByNumber.get(keyNumber)?.backCenter;

    const measured: Point[] = [];
    const target: Point[] = [];
    const gapColumns: string[] = [];
    for (const key of keys) {
      const place = placeOf(key.number);
      if (place === undefined) {
        continue;
      }
      const weight = key.payload.balanceWeight;
      if (weight !== null) {
        measured.push({ x: place, y: y(weight) });
      }
      const aim = targetByNumber.get(key.number);
      if (aim !== undefined) {
        target.push({ x: place, y: y(aim) });
      }
      if (weight !== null && aim !== undefined) {
        gapColumns.push(
          `M${place - geometry.slotWidth / 2} ${y(weight)}` +
            `h${geometry.slotWidth}V${y(aim)}h${-geometry.slotWidth}z`,
        );
      }
    }

    const differences = keys
      .map((key) => {
        const weight = key.payload.balanceWeight;
        const aim = targetByNumber.get(key.number);
        return weight === null || aim === undefined ? null : aim - weight;
      })
      .filter((value): value is number => value !== null);

    const targetSpread =
      targetWeights.length === 0
        ? 0
        : Math.max(...targetWeights) - Math.min(...targetWeights);

    return {
      gap: gapColumns.join(''),
      // An arrow a quarter of the way along, where the two lines are far
      // enough apart to read, carrying the mean of the whole keyboard.
      gapArrow: (() => {
        const anchor = measured[Math.floor(measured.length / 4)];
        const aim = target[Math.floor(target.length / 4)];
        if (!anchor || !aim || Math.abs(aim.y - anchor.y) < 18) {
          return null;
        }
        const head = aim.y > anchor.y ? -5 : 5;
        const tip = aim.y - Math.sign(aim.y - anchor.y) * 4;
        return {
          path:
            `M${anchor.x} ${anchor.y + Math.sign(aim.y - anchor.y) * 6}V${tip}` +
            `m${-4} ${head}l4 ${-head}l4 ${head}`,
          x: anchor.x + 8,
          y: (anchor.y + aim.y) / 2,
        };
      })(),

      geometry,

      gridLines: Array.from(
        { length: (max - min) / WEIGHT_STEP + 1 },
        (_, index) => min + index * WEIGHT_STEP,
      ),

      height: KEYBOARD_TOP + geometry.height + KEYBED_OVERHANG,

      isTargetFlat: targetSpread <= FLAT_TARGET_TOLERANCE,

      meanDifference:
        differences.length === 0
          ? null
          : differences.reduce((total, value) => total + value, 0) /
            differences.length,

      measuredDots: measured.map((point) => diamond(point.x, point.y)).join(''),

      measuredLine: polyline(measured),

      measuredMax: Math.max(...measuredWeights),

      measuredMin: Math.min(...measuredWeights),

      nextKey:
        home.nextKeyToMeasure === null
          ? null
          : (() => {
              const placed = geometry.keysByNumber.get(
                home.nextKeyToMeasure.number,
              );
              return placed?.path ?? null;
            })(),

      stems: measured
        .map((point) => `M${point.x} ${point.y + 4}V${KEYBOARD_TOP - 2}`)
        .join(''),
      targetLine: polyline(target),
      targetWeight: targetWeights.length === 0 ? null : targetWeights[0]!,
      // Hung from the target rather than from a fixed rule: the comb then
      // follows the line it belongs to, as it does in the artboard where that
      // line happens to be flat.
      ties: target
        .map((point) => `M${point.x} ${point.y + 2}V${KEYBOARD_TOP - 2}`)
        .join(''),
      width: geometry.width,
    };
  }, [home]);

  // Its text keeps its size however narrow the column: see useTextScale.
  const textScale = useTextScale(figure?.width ?? 0);

  if (!figure) {
    return null;
  }

  const hasTarget = figure.targetLine !== '';
  const remaining = home.total - home.measured;

  return (
    <figure className="m-0 mt-[72px] w-full max-w-[1080px]">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1.5 pb-1.5 text-left">
        <span className="ptl-label">{description}</span>
        {hasTarget ? (
          <span className="flex flex-wrap items-center gap-x-5 gap-y-1.5 font-mono text-[11.5px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true">
                <path d="M5 0l5 5-5 5-5-5z" className="fill-ptl-ink-3" />
              </svg>
              {t('measured · from {{min}} to {{max}}', {
                max: formatGrams(figure.measuredMax, currentLanguage),
                min: formatGrams(figure.measuredMin, currentLanguage),
              })}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-[2.4px] w-[18px] bg-ptl-brass" />
              {figure.isTargetFlat && figure.targetWeight !== null
                ? t('after adjustment · {{weight}}', {
                    weight: formatGrams(figure.targetWeight, currentLanguage),
                  })
                : t('after adjustment (expected)')}
            </span>
          </span>
        ) : (
          <span className="font-mono text-[11.5px] text-muted-foreground">
            {t('{{measured}} keys measured out of {{total}}', {
              measured: home.measured,
              total: home.total,
            })}
          </span>
        )}
      </figcaption>

      <svg
        ref={textScale}
        viewBox={`0 0 ${figure.width} ${figure.height}`}
        className="block h-auto w-full"
        role="img"
        aria-label={description}
      >
        <defs>
          <linearGradient id="ptl-home-stem" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--ptl-ink-3)" stopOpacity="0.3" />
            <stop offset="1" stopColor="var(--ptl-ink-3)" stopOpacity="0.03" />
          </linearGradient>
          <linearGradient id="ptl-home-tie" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--ptl-brass)" stopOpacity="0.4" />
            <stop offset="1" stopColor="var(--ptl-brass)" stopOpacity="0.04" />
          </linearGradient>
          <pattern
            id="ptl-home-hatch"
            patternUnits="userSpaceOnUse"
            width="7"
            height="7"
            patternTransform="rotate(45)"
          >
            <path
              d="M0 0V7"
              strokeWidth="1.3"
              className="stroke-ptl-brass"
              strokeOpacity="0.4"
            />
          </pattern>
        </defs>

        {figure.gridLines.map((weight, index) => {
          const row =
            PLOT_BOTTOM -
            (index * (PLOT_BOTTOM - PLOT_TOP)) / (figure.gridLines.length - 1);
          // Every other line is named: a rule every 10 g, a figure every 20.
          const isNamed = (figure.gridLines.length - 1 - index) % 2 === 0;
          return (
            <g key={weight}>
              <path
                d={`M34 ${row}H${figure.width}`}
                strokeWidth="1"
                strokeDasharray="2 4"
                fill="none"
                className="stroke-border"
              />
              {isNamed ? (
                // Under 768 px the axis would run into the first keys at its
                // true size: the caption above gives the range instead.
                <text
                  x="0"
                  y={row + 3.5}
                  style={{ fontSize: 'calc(10px * var(--ptl-text-scale, 1))' }}
                  className="fill-ptl-ink-3 font-mono max-md:hidden"
                >
                  {t('{{weight}} g', { weight })}
                </text>
              ) : null}
            </g>
          );
        })}

        {hasTarget ? (
          <>
            <path d={figure.gap} fill="url(#ptl-home-hatch)" />
            <path d={figure.gap} className="fill-ptl-brass" opacity="0.06" />
          </>
        ) : null}

        <path
          d={hasTarget ? figure.ties : figure.stems}
          strokeWidth="1"
          fill="none"
          stroke={`url(#${hasTarget ? 'ptl-home-tie' : 'ptl-home-stem'})`}
        />
        <path
          d={figure.measuredLine}
          strokeWidth="1.2"
          fill="none"
          opacity="0.6"
          className="stroke-ptl-ink-3"
        />
        <path d={figure.measuredDots} className="fill-muted-foreground" />

        {hasTarget ? (
          <path
            d={figure.targetLine}
            strokeWidth="2.6"
            fill="none"
            className="stroke-ptl-brass"
          />
        ) : null}

        {hasTarget && figure.gapArrow && figure.meanDifference !== null ? (
          <g>
            <path
              d={figure.gapArrow.path}
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              className="stroke-ptl-brass"
            />
            <text
              x={figure.gapArrow.x}
              y={figure.gapArrow.y}
              // Haloed: it sits in the middle of the hatching it measures.
              style={{
                fontSize: 'calc(11.5px * var(--ptl-text-scale, 1))',
                paintOrder: 'stroke',
                stroke: 'var(--background)',
                strokeWidth: 'calc(3.5px * var(--ptl-text-scale, 1))',
              }}
              className="fill-ptl-brass font-mono font-semibold"
            >
              {t('{{weight}} g on average', {
                weight: formatSignedWeightValue(
                  figure.meanDifference,
                  currentLanguage,
                ),
              })}
            </text>
          </g>
        ) : null}

        <g transform={`translate(0, ${KEYBOARD_TOP})`}>
          <rect
            x="0"
            y="0"
            width={figure.width}
            height={figure.geometry.height + KEYBED_OVERHANG}
            rx="3"
            className="fill-ptl-keybed"
          />
          <rect
            x="0"
            y="0"
            width={figure.width}
            height={figure.geometry.feltHeight}
            className="fill-ptl-felt"
          />
          <path
            d={figure.geometry.whiteKeys.map((key) => key.path).join('')}
            strokeWidth="0.8"
            className="fill-ptl-key-white stroke-ptl-key-white-edge"
          />
          <path
            d={figure.geometry.blackKeys.map((key) => key.path).join('')}
            className="fill-ptl-key-black"
          />
          {home.stage === 'measuring' && figure.nextKey ? (
            <path d={figure.nextKey} className="fill-ptl-brass" />
          ) : null}
        </g>

        {home.stage === 'measuring' ? (
          <g>
            {/*
             * Always in the same place, and translucent: the keys left to
             * measure are not necessarily the ones on the right, so a frame
             * drawn around them would lie as soon as someone measures out
             * of order. The points stay readable underneath.
             */}
            <rect
              x={figure.width / 2 - 170}
              y={PLOT_BOTTOM - 74}
              width="340"
              height="58"
              rx="4"
              strokeWidth="1"
              strokeDasharray="4 4"
              className="fill-card stroke-input"
              fillOpacity="0.86"
            />
            <text
              x={figure.width / 2}
              y={PLOT_BOTTOM - 48}
              textAnchor="middle"
              className="fill-muted-foreground font-serif text-[19px] italic"
            >
              {t('{{count}} keys left to measure', { count: remaining })}
            </text>
            <text
              x={figure.width / 2}
              y={PLOT_BOTTOM - 28}
              textAnchor="middle"
              className="fill-ptl-ink-3 font-mono text-[10.5px]"
            >
              {home.nextKeyToMeasure
                ? t('next: {{note}} · key {{number}}', {
                    note: home.nextKeyToMeasure.name,
                    number: home.nextKeyToMeasure.number,
                  })
                : null}
            </text>
          </g>
        ) : null}

        {home.stage === 'measured' ? (
          <g>
            <rect
              x={figure.width / 2 - 125}
              y={PLOT_BOTTOM - 38}
              width="250"
              height="25"
              rx="12.5"
              strokeWidth="1.3"
              strokeDasharray="4 3"
              className="fill-card stroke-ptl-ink-3"
            />
            <text
              x={figure.width / 2}
              y={PLOT_BOTTOM - 21}
              textAnchor="middle"
              className="fill-muted-foreground font-mono text-[11.5px]"
            >
              {t('Target: to be set in Design')}
            </text>
          </g>
        ) : null}
      </svg>
    </figure>
  );
};
