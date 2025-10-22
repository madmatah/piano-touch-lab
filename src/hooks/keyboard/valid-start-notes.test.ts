import { describe, it, expect, beforeEach } from 'bun:test';
import { useValidStartNotes } from '@/hooks/keyboard/valid-start-notes';
import { transpose, type Note } from '@/lib/music/theory/spn';
import { renderHook } from '@testing-library/react';

describe('The useValidStartNotes() hook', () => {
  describe('The validStartNotes state', () => {
    let validStartNotes: Note[];

    beforeEach(() => {
      const { result } = renderHook(() => useValidStartNotes());
      validStartNotes = result.current.validStartNotes;
    });

    it('should contain the expected number of notes', () => {
      expect(validStartNotes).toHaveLength(15);
    });

    it('should start with A-1', () => {
      expect(validStartNotes[0]).toEqual({ letter: 'A', octave: -1 });
    });

    it('should end with B0', () => {
      expect(validStartNotes[validStartNotes.length - 1]).toEqual({
        letter: 'B',
        octave: 0,
      });
    });

    it('should be in correct chromatic order', () => {
      for (let i = 0; i < validStartNotes.length - 1; i++) {
        const currentNote = validStartNotes[i]!;
        const nextNote = validStartNotes[i + 1]!;
        const transposed = transpose(currentNote, 1);

        expect(nextNote).toEqual(transposed);
      }
    });

    it('should contain all expected notes from A-1 to F0', () => {
      const expectedNotes: Note[] = [
        { letter: 'A', octave: -1 },
        { letter: 'A#', octave: -1 },
        { letter: 'B', octave: -1 },
        { letter: 'C', octave: 0 },
        { letter: 'C#', octave: 0 },
        { letter: 'D', octave: 0 },
        { letter: 'D#', octave: 0 },
        { letter: 'E', octave: 0 },
        { letter: 'F', octave: 0 },
        { letter: 'F#', octave: 0 },
        { letter: 'G', octave: 0 },
        { letter: 'G#', octave: 0 },
        { letter: 'A', octave: 0 },
        { letter: 'A#', octave: 0 },
        { letter: 'B', octave: 0 },
      ];

      expect(validStartNotes).toEqual(expectedNotes);
    });

    it('should not contain duplicate notes', () => {
      const uniqueNotes = new Set(
        validStartNotes.map((note) => `${note.letter}${note.octave}`),
      );

      expect(uniqueNotes.size).toBe(validStartNotes.length);
    });

    it('should be consistent across multiple calls', () => {
      const { result: result1 } = renderHook(() => useValidStartNotes());
      const { result: result2 } = renderHook(() => useValidStartNotes());

      expect(result1.current.validStartNotes).toEqual(
        result2.current.validStartNotes,
      );
    });
  });
});
