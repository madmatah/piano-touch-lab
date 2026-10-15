import { cn } from '@/lib/utils';

export interface PianoKeyboardLabel {
  /** The key the label sits under, or an edge of the keyboard. */
  at: number | 'start' | 'end';
  isMuted?: boolean;
  isStrong?: boolean;
  text: string;
}

export interface KeyboardLabelRowProps {
  labels: readonly PianoKeyboardLabel[];
  /** Where the label of a key sits, as a share of the width of the row. */
  placeOf: (keyNumber: number) => number;
}

const positionOf = (
  at: PianoKeyboardLabel['at'],
  placeOf: KeyboardLabelRowProps['placeOf'],
) => {
  if (at === 'start') {
    return { left: 0 };
  }
  if (at === 'end') {
    return { right: 0 };
  }
  return {
    left: `${placeOf(at) * 100}%`,
    transform: 'translateX(-50%)',
  };
};

/**
 * The names written under a keyboard — or, on paper, under the ticks that
 * stand in for it.
 *
 * Text of the page rather than of the drawing, so that it keeps the size and
 * the face of the page whatever the width of the drawing above it.
 */
export const KeyboardLabelRow = ({
  labels,
  placeOf,
}: KeyboardLabelRowProps) => (
  <div
    aria-hidden="true"
    className="relative h-[18px] font-mono text-[11px] text-muted-foreground"
  >
    {labels.map((label) => (
      <span
        key={`${String(label.at)}-${label.text}`}
        className={cn(
          'absolute top-1 whitespace-nowrap',
          label.isMuted && 'text-ptl-ink-3',
          label.isStrong && 'font-bold text-ptl-brass',
        )}
        style={positionOf(label.at, placeOf)}
      >
        {label.text}
      </span>
    ))}
  </div>
);
