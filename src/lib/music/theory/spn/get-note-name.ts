import type { Note } from './note';

export const getNoteName = (note: Note): string => {
  return `${note.letter}${note.octave}`;
};
