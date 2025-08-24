import { describe, it, expect, beforeEach } from 'bun:test';
import { parseNote } from '@/lib/music/theory/spn';

describe('The parseNote() function', () => {
  let input: string;
  let act: () => ReturnType<typeof parseNote>;

  describe('When input is valid', () => {
    describe('and the note is uppercase and natural', () => {
      beforeEach(() => {
        input = 'A0';
        act = () => parseNote(input);
      });

      it('should parse the note', () => {
        const result = act();
        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.value.letter).toBe('A');
          expect(result.value.octave).toBe(0);
        }
      });
    });

    describe('and the note has spaces and lowercase sharp', () => {
      beforeEach(() => {
        input = '  c#8  ';
        act = () => parseNote(input);
      });

      it('should trim and be case-insensitive', () => {
        const result = act();
        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.value.letter).toBe('C#');
          expect(result.value.octave).toBe(8);
        }
      });
    });

    describe('and the note has a sharp with negative octave', () => {
      beforeEach(() => {
        input = 'a#-1';
        act = () => parseNote(input);
      });

      it('should parse the note', () => {
        const result = act();
        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.value.letter).toBe('A#');
          expect(result.value.octave).toBe(-1);
        }
      });
    });
  });

  describe('When input is invalid', () => {
    it.each([
      'H0',
      'Z1',
      'Bb0',
      'Cb4',
      'A10',
      'AA0',
      '',
      'A',
      '#1',
      'A-',
      '1A',
    ])('should return an error for "%s"', (value) => {
      input = value;
      act = () => parseNote(input);

      const result = act();
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.length).toBeGreaterThan(0);
      }
    });
  });
});
