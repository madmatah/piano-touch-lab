import { useCallback, useState } from 'react';

import { KeyMeasureList } from './KeyMeasureList';
import { MeasureKeyboardPanel } from './MeasureKeyboardPanel';
import { PianoMeasureList } from './PianoMeasureList';
import { useMeasurePasses, type MeasurePassId } from './measure-passes';

export const MeasureTab = () => {
  const [currentPassId, setCurrentPassId] = useState<MeasurePassId>('down-up');
  const [currentKeyNumber, setCurrentKeyNumber] = useState<number | null>(null);
  const passes = useMeasurePasses();

  /**
   * Clicking a key on the keyboard brings its row to the middle of the page
   * and puts the cursor in the first field of the pass in hand: the click
   * means "measure this key now".
   */
  const onKeySelect = useCallback(
    (keyNumber: number) => {
      setCurrentKeyNumber(keyNumber);
      const row = document.querySelector<HTMLElement>(
        `[data-key-number="${keyNumber}"]`,
      );
      row?.scrollIntoView({ block: 'center' });
      const field = passes.find((pass) => pass.id === currentPassId)?.fields[0];
      row
        ?.querySelector<HTMLInputElement>(`input[name="${field}"]`)
        ?.focus({ preventScroll: true });
    },
    [currentPassId, passes],
  );

  return (
    <div className="flex flex-col gap-5">
      <PianoMeasureList />
      <MeasureKeyboardPanel
        currentKeyNumber={currentKeyNumber}
        currentPassId={currentPassId}
        onKeySelect={onKeySelect}
        onPassChange={setCurrentPassId}
      />
      <KeyMeasureList
        currentKeyNumber={currentKeyNumber}
        currentPassId={currentPassId}
        onFocusKey={setCurrentKeyNumber}
      />
    </div>
  );
};
