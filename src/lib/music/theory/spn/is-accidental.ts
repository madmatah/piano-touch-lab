import type { Note } from './note';

export const isAccidental = (note: Note): boolean => note.letter.includes('#');
