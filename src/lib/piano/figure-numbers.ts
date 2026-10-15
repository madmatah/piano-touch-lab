/**
 * The figure number of each Analyze page.
 *
 * It appears twice — above the page title and in the caption of the figure —
 * so it is written once here. The table is fixed rather than derived from the
 * menu: "Wippen support springs" is hidden when its measurement option is off,
 * and a derived numbering would then slide the data sheet from 02.6 to 02.5.
 */
export const ANALYZE_FIGURE_NUMBERS: Readonly<Record<string, string>> = {
  '/analyze/data-sheet': '02.6',
  '/analyze/front-weight': '02.2',
  '/analyze/strike-weight': '02.3',
  '/analyze/strike-weight-ratio': '02.4',
  '/analyze/touch-weight': '02.1',
  '/analyze/wippen-support-springs': '02.5',
};
