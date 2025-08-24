import { describe, it, expect, beforeEach } from 'bun:test';
import type { Note } from '@/lib/music/theory/spn';
import { getNoteName } from '@/lib/music/theory/spn/get-note-name';

describe('The getNoteName() function', () => {
  let input: Note;
  let act: () => string;

  describe('When passing a natural note', () => {
    beforeEach(() => {
      input = { letter: 'A', octave: 0 };
      act = () => getNoteName(input);
    });

    it('should return the expected name', () => {
      expect(act()).toBe('A0');
    });
  });

  describe('When passing a sharp note', () => {
    beforeEach(() => {
      input = { letter: 'C#', octave: 8 };
      act = () => getNoteName(input);
    });

    it('should return the expected name', () => {
      expect(act()).toBe('C#8');
    });
  });

  describe('When passing a note with negative octave', () => {
    beforeEach(() => {
      input = { letter: 'A#', octave: -1 };
      act = () => getNoteName(input);
    });

    it('should return the expected name', () => {
      expect(act()).toBe('A#-1');
    });
  });
});
