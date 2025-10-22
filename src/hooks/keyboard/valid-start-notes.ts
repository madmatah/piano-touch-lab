import type { Note } from '@/lib/music/theory/spn';
import { transpose } from '@/lib/music/theory/spn';
import { useMemo } from 'react';

export const useValidStartNotes = (): { validStartNotes: Note[] } => {
  const validStartNotes = useMemo(() => {
    const notes: Note[] = [];
    const startNote: Note = { letter: 'A', octave: -1 };
    const endNote: Note = { letter: 'B', octave: 0 };

    let currentNote = startNote;
    while (true) {
      notes.push(currentNote);
      if (
        currentNote.letter === endNote.letter &&
        currentNote.octave === endNote.octave
      ) {
        break;
      }
      currentNote = transpose(currentNote, 1);
    }
    return notes;
  }, []);

  return { validStartNotes };
};
