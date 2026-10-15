/** The glyph standing for a series in a legend or a reading row. */
export type ChartLegendMarkKind =
  | 'dot'
  | 'line'
  | 'line-soft'
  | 'line-dashed'
  | 'line-thick'
  | 'triangle-down'
  | 'triangle-up'
  | 'diamond'
  | 'diamond-hollow';

/**
 * Drawn in `currentColor`, so a legend item carries its colour as a text
 * class and the mark follows — no colour literal anywhere in the legend.
 */
export const ChartLegendMark = ({ kind }: { kind: ChartLegendMarkKind }) => {
  switch (kind) {
    case 'dot':
      return (
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <circle cx="5" cy="5" r="4.5" fill="currentColor" />
        </svg>
      );
    case 'triangle-down':
      return (
        <svg width="10" height="9" viewBox="0 0 10 9" aria-hidden="true">
          <path d="M0 0h10L5 9z" fill="currentColor" />
        </svg>
      );
    case 'triangle-up':
      return (
        <svg width="10" height="9" viewBox="0 0 10 9" aria-hidden="true">
          <path d="M0 9h10L5 0z" fill="currentColor" />
        </svg>
      );
    case 'diamond':
      return (
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M5 0l5 5-5 5-5-5z" fill="currentColor" />
        </svg>
      );
    case 'diamond-hollow':
      return (
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path
            d="M5 1l4 4-4 4-4-4z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      );
    case 'line-thick':
      return (
        <svg width="24" height="10" viewBox="0 0 24 10" aria-hidden="true">
          <path
            d="M1 5h22"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'line-dashed':
      return (
        <svg width="22" height="10" viewBox="0 0 22 10" aria-hidden="true">
          <path
            d="M0 5h22"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
        </svg>
      );
    case 'line-soft':
      return (
        <svg width="22" height="10" viewBox="0 0 22 10" aria-hidden="true">
          <path d="M0 5h22" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    case 'line':
    default:
      return (
        <svg width="22" height="10" viewBox="0 0 22 10" aria-hidden="true">
          <path d="M0 5h22" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
  }
};
