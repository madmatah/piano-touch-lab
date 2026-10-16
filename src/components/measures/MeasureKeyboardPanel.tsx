import { useStore } from 'zustand';
import { useMemo, useRef } from 'react';
import { useShallow } from 'zustand/shallow';

import { type PianoKeyTone } from '@/components/piano/KeyboardPlate';
import { PianoKeyboard } from '@/components/piano/PianoKeyboard';
import { useKeyboard } from '@/hooks/keyboard/use-keyboard';
import { useStickyHeight } from '@/hooks/use-sticky-height';
import {
  useMeasuresStore,
  type MeasuresStore,
} from '@/hooks/store/use-measure-store';
import { useTranslation } from '@/hooks/use-translation';
import { octaveMarks } from '@/lib/piano/keyboard/keyboard-geometry';
import { cn } from '@/lib/utils';

import {
  isPassDone,
  passProgress,
  useMeasurePasses,
  type MeasurePassId,
} from './hooks/use-measure-passes';

export interface MeasureKeyboardPanelProps {
  currentKeyNumber: number | null;
  currentPassId: MeasurePassId;
  onKeySelect: (keyNumber: number) => void;
  onPassChange: (passId: MeasurePassId) => void;
}

/** Hoisted: a fresh object here would recompute the whole keyboard. */
const KEYBOARD_GEOMETRY = { keyHeight: 72 };

/**
 * Where the session stands: which pass is in hand, how far down the keyboard
 * it has got, and which key is being filled.
 *
 * It sticks to the top of the page, because the answer to "where am I?" is
 * needed exactly when the table has scrolled it out of sight — and it says
 * how tall it is, so that a field the focus moves to is scrolled into view
 * below it rather than behind it. On a phone, or any window under 600 px
 * tall, it would take a third to a half of the screen, before the on-screen
 * keyboard takes its share: there it scrolls away with the page instead.
 */
export const MeasureKeyboardPanel = ({
  currentKeyNumber,
  currentPassId,
  onKeySelect,
  onPassChange,
}: MeasureKeyboardPanelProps) => {
  const { t } = useTranslation();
  const { keyboard } = useKeyboard();
  const panel = useRef<HTMLElement>(null);

  useStickyHeight(panel, '--ptl-sticky-top');

  const measuredKeys = useStore(
    useMeasuresStore(),
    useShallow((state: MeasuresStore) => state.keys),
  );

  const keys = useMemo(() => keyboard.getKeys(), [keyboard]);
  const passes = useMeasurePasses();

  const passLabels: Record<MeasurePassId, string> = {
    'down-up': t('Down & up weight'),
    'front-weight': t('Front Weight', { ns: 'navigation' }),
    'strike-weight': t('Strike Weight', { ns: 'navigation' }),
  };

  const progress = useMemo(
    () => passProgress(passes, measuredKeys, keyboard.size),
    [keyboard.size, measuredKeys, passes],
  );

  const tones = useMemo(() => {
    const pass = passes.find((item) => item.id === currentPassId);
    const map = new Map<number, PianoKeyTone>();
    if (!pass) {
      return map;
    }
    keys.forEach((key) => {
      const measured = measuredKeys[key.number - 1];
      if (!measured || !isPassDone(pass, measured)) {
        map.set(key.number, 'pending');
      }
    });
    if (currentKeyNumber !== null) {
      map.set(currentKeyNumber, 'current');
    }
    return map;
  }, [currentKeyNumber, currentPassId, keys, measuredKeys, passes]);

  const currentKey =
    currentKeyNumber === null
      ? null
      : keyboard.getKeyByNumber(currentKeyNumber);

  const labels = useMemo(
    () =>
      octaveMarks(keys).map((mark) => ({
        at: mark.number,
        isMuted: true,
        text: mark.label,
      })),
    [keys],
  );

  return (
    <section
      ref={panel}
      aria-label={t('Keyboard and measuring pass')}
      className="sticky top-0 z-10 flex flex-col gap-3 rounded-md border border-ptl-rule-strong bg-card px-4 pt-3.5 pb-3 shadow-[0_14px_28px_-18px_rgb(0_0_0/0.45)] max-md:static [@media(max-height:600px)]:static"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/*
         * A group of toggles, not tabs: these buttons open no panel, they
         * change which columns of the table below are in hand.
         */}
        <div
          role="group"
          aria-label={t('Measuring pass')}
          className="inline-flex flex-wrap overflow-hidden rounded-md border border-ptl-rule-strong"
        >
          {passes.map((pass, index) => {
            const isSelected = pass.id === currentPassId;
            return (
              <button
                key={pass.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onPassChange(pass.id)}
                className={cn(
                  'inline-flex h-9 cursor-pointer items-center gap-2 px-3 text-[13px] font-medium transition-colors',
                  index > 0 && 'border-l border-input',
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-transparent text-muted-foreground hover:bg-accent',
                )}
              >
                <span className="font-mono font-semibold">{pass.number}</span>
                {passLabels[pass.id]}
                <span className="font-mono text-[11px] opacity-80">
                  {progress.get(pass.id) ?? 0}/{keyboard.size}
                </span>
              </button>
            );
          })}
        </div>
        {currentKey ? (
          <div className="flex items-baseline gap-2.5">
            <span className="ptl-label">{t('Current key')}</span>
            <span className="font-serif text-[28px] leading-none">
              {currentKey.name}
            </span>
            <span className="font-mono text-[13px] font-semibold text-ptl-current">
              #{currentKey.number}
            </span>
          </div>
        ) : null}
      </div>

      <PianoKeyboard
        keys={keys}
        description={t('Keyboard: click a key to jump to it')}
        geometry={KEYBOARD_GEOMETRY}
        labels={labels}
        onKeySelect={onKeySelect}
        toneByKeyNumber={tones}
      />

      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 text-[12.5px] text-muted-foreground">
        <div className="flex flex-wrap gap-4">
          <span className="inline-flex items-center gap-[7px]">
            <span className="size-3 rounded-sm bg-ptl-key-white shadow-[inset_0_0_0_1px_var(--input)]" />
            {t('Measured in this pass')}
          </span>
          <span className="inline-flex items-center gap-[7px]">
            <span className="size-3 rounded-sm bg-ptl-current" />
            {t('Current')}
          </span>
          <span className="inline-flex items-center gap-[7px]">
            <span className="size-3 rounded-sm bg-ptl-key-white-pending shadow-[inset_0_0_0_1px_var(--input)]" />
            {t('Still to measure')}
          </span>
        </div>
        <span className="text-ptl-ink-3">{t('Click a key to jump to it')}</span>
      </div>
    </section>
  );
};
