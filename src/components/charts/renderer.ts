/**
 * ECharts draws into SVG here, not a canvas.
 *
 * A canvas is a bitmap: it keeps the colours and the width it was drawn with,
 * so a figure printed from a dark screen lands dark on the sheet, and a figure
 * laid out for a narrow column is cropped by a wide one. SVG is in the
 * document, so the print stylesheet repaints it like everything else and the
 * sheet gets vector marks rather than screen pixels.
 *
 * These figures are small — eighty-eight keys over a handful of series — so
 * the nodes cost nothing next to what they buy.
 */
export const SVG_RENDERER = { renderer: 'svg' } as const;
