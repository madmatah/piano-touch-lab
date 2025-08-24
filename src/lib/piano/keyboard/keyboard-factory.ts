import { KeyColor } from './key-color.enum';
import type { Key } from './key';
import { Keyboard } from './keyboard';
import type { KeyboardRequirements } from './keyboard-requirements';
import {
  parseNote,
  transpose,
  type Note,
  isAccidental,
  getNoteName,
} from '@/lib/music/theory/spn';
import { MIN_OCTAVE, MAX_OCTAVE } from './constants';
import type { KeyboardLayoutRequirements } from './layout/keyboard-layout-requirements';

const getKey = (keyNumber: number, firstNote: Note): Key => {
  const transposedNote = transpose(firstNote, keyNumber - 1);

  const noteColor = isAccidental(transposedNote)
    ? KeyColor.Black
    : KeyColor.White;

  return {
    color: noteColor,
    name: getNoteName(transposedNote),
    number: keyNumber,
    octave: transposedNote.octave,
  };
};

const fromStartNoteAndLength = (
  firstNoteName: string,
  keysNumber: number,
): KeyboardRequirements => {
  if (!Number.isInteger(keysNumber) || keysNumber <= 0) {
    throw new Error(
      `Invalid number of keys: ${keysNumber}. Must be a positive integer.`,
    );
  }

  const parsedNoteResult = parseNote(firstNoteName);
  if (!parsedNoteResult.ok) {
    throw new Error(
      `Invalid first note (${firstNoteName}): ${parsedNoteResult.error}`,
    );
  }

  return fromLayout({ length: keysNumber, startNote: parsedNoteResult.value });
};

const fromLayout = (
  layout: KeyboardLayoutRequirements,
): KeyboardRequirements => {
  const startOctave = layout.startNote.octave;
  if (startOctave < MIN_OCTAVE || startOctave > MAX_OCTAVE) {
    throw new Error(
      `Invalid start octave: ${startOctave}. Must be between ${MIN_OCTAVE} and ${MAX_OCTAVE}.`,
    );
  }

  const lastNote = transpose(layout.startNote, layout.length - 1);
  if (lastNote.octave < MIN_OCTAVE || lastNote.octave > MAX_OCTAVE) {
    throw new Error(
      `Invalid keyboard range: last note ${getNoteName(lastNote)} has octave ${lastNote.octave} (must be between ${MIN_OCTAVE} and ${MAX_OCTAVE})`,
    );
  }

  const keys: Key[] = Array.from({ length: layout.length }, (_, i) =>
    getKey(i + 1, layout.startNote),
  );
  return new Keyboard(keys);
};

export const KeyboardFactory = {
  fromLayout,
  fromStartNoteAndLength,
};
