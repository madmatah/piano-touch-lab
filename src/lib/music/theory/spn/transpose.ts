import type { Note } from './note';
import { octaveNotes } from './octave-notes';
import { getNoteName } from './get-note-name';
import { parseNote } from './note-parser';

export const transpose = (note: Note, semitones: number): Note => {
  const noteIndex = octaveNotes.indexOf(note.letter);
  if (noteIndex === -1) {
    throw new Error(`Invalid note letter: ${note.letter}`);
  }
  const notesInOctave = octaveNotes.length;

  const totalSemitones =
    note.octave * notesInOctave + noteIndex + Math.trunc(semitones);
  const wrappedIndex =
    ((totalSemitones % notesInOctave) + notesInOctave) % notesInOctave;
  const newOctave = Math.floor(totalSemitones / notesInOctave);

  const newLetter = octaveNotes[wrappedIndex]!;
  return { letter: newLetter, octave: newOctave };
};

export const transposeByName = (
  noteName: string,
  semitones: number,
): string => {
  const parsed = parseNote(noteName);
  if (!parsed.ok) {
    throw new Error(`Invalid note: ${noteName}`);
  }
  const transposed = transpose(parsed.value, semitones);
  return getNoteName(transposed);
};
