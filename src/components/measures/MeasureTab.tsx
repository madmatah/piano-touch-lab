import { useCallback, useState } from 'react';

import { KeyMeasureList } from './KeyMeasureList';
import { MeasureKeyboardPanel } from './MeasureKeyboardPanel';
import { PianoMeasureList } from './PianoMeasureList';
import type { MeasurePassId } from './measure-passes';

export const MeasureTab = () => {
  const [currentPassId, setCurrentPassId] = useState<MeasurePassId>('down-up');
  const [currentKeyNumber, setCurrentKeyNumber] = useState<number | null>(null);

  /** Clicking a key on the keyboard scrolls the table to its row. */
  const onKeySelect = useCallback((keyNumber: number) => {
    setCurrentKeyNumber(keyNumber);
    document
      .getElementById(`measure-key-${keyNumber}`)
      ?.scrollIntoView({ block: 'center' });
  }, []);

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
        currentPassId={currentPassId}
        onFocusKey={setCurrentKeyNumber}
      />
    </div>
  );
};
