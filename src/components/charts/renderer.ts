/**
 * ECharts draws into SVG here, not a canvas.
 *
 * A canvas is a bitmap: it keeps the width it was drawn at, so a figure laid
 * out for a narrow column is cropped or blurred by a wide sheet, and the
 * printer gets screen pixels. SVG is in the document: the print stylesheet
 * can stretch it to the box the sheet gives it (see `fit-drawing.ts`), and
 * the sheet gets vector marks. Its colours are values written as it draws,
 * so a figure is drawn again with the paper's when the page prints (see
 * `use-printable-chart.ts`).
 *
 * These figures are small — eighty-eight keys over a handful of series — so
 * the nodes cost nothing next to what they buy.
 */
export const SVG_RENDERER = { renderer: 'svg' } as const;
