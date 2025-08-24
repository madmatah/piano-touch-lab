import type { Note } from './note';
import { type NoteLetter } from './note-letter';
import { octaveNotes } from './octave-notes';

const NOTE_REGEX = /^([A-G]#?)(-?\d)$/i;

export type ParseNoteResult =
  | { ok: true; value: Note }
  | { ok: false; error: string };

export const parseNote = (raw: string): ParseNoteResult => {
  const matched = raw.toUpperCase().trim().match(NOTE_REGEX);
  if (!matched) {
    return { error: `Invalid note: ${raw}`, ok: false };
  }

  const letter = matched[1] as NoteLetter;
  const octave = parseInt(matched[2] as string, 10);

  if (!Number.isFinite(octave)) {
    return { error: `Invalid octave for note: ${raw}`, ok: false };
  }

  if (!octaveNotes.includes(letter)) {
    return { error: `Unsupported note letter: ${letter}`, ok: false };
  }

  return { ok: true, value: { letter: letter, octave } };
};
