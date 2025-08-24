import { describe, it, expect, beforeEach } from 'bun:test';
import type { Note } from '@/lib/music/theory/spn';
import { transpose, transposeByName } from '@/lib/music/theory/spn';

describe('The transpose() function', () => {
  let input: Note;
  let semitones: number;
  let act: () => Note;

  describe('When the input note letter is invalid', () => {
    beforeEach(() => {
      input = { letter: 'Z', octave: 1 } as unknown as Note;
      semitones = 2;
      act = () => transpose(input, semitones);
    });

    it('should throw an error', () => {
      expect(act).toThrowError();
    });
  });

  describe('When transposing up within the same octave', () => {
    beforeEach(() => {
      input = { letter: 'A', octave: 0 };
      semitones = 2;
      act = () => transpose(input, semitones);
    });

    it('should return the expected note', () => {
      expect(act()).toEqual({ letter: 'B', octave: 0 });
    });
  });

  describe('When transposing down across octave boundary', () => {
    beforeEach(() => {
      input = { letter: 'C', octave: 0 };
      semitones = -1;
      act = () => transpose(input, semitones);
    });

    it('should return the expected note', () => {
      expect(act()).toEqual({ letter: 'B', octave: -1 });
    });
  });

  describe('When semitones is zero', () => {
    beforeEach(() => {
      input = { letter: 'C#', octave: 8 };
      semitones = 0;
      act = () => transpose(input, semitones);
    });

    it('should return the same note', () => {
      expect(act()).toEqual({ letter: 'C#', octave: 8 });
    });
  });

  describe('When jumping upwards by one octave', () => {
    beforeEach(() => {
      input = { letter: 'G#', octave: 3 };
      semitones = 12;
      act = () => transpose(input, semitones);
    });

    it('should increase the octave', () => {
      expect(act()).toEqual({ letter: 'G#', octave: 4 });
    });
  });

  describe('When jumping downwards by one octave', () => {
    beforeEach(() => {
      input = { letter: 'C', octave: 0 };
      semitones = -12;
      act = () => transpose(input, semitones);
    });

    it('should decrease the octave', () => {
      expect(act()).toEqual({ letter: 'C', octave: -1 });
    });
  });

  describe('When wrapping from B to C with octave increase', () => {
    beforeEach(() => {
      input = { letter: 'B', octave: -1 };
      semitones = 1;
      act = () => transpose(input, semitones);
    });

    it('should change letter and increase octave', () => {
      expect(act()).toEqual({ letter: 'C', octave: 0 });
    });
  });

  describe('When transposing by a large positive interval', () => {
    beforeEach(() => {
      input = { letter: 'C', octave: 0 };
      semitones = 26;
      act = () => transpose(input, semitones);
    });

    it('should return the expected note', () => {
      expect(act()).toEqual({ letter: 'D', octave: 2 });
    });
  });

  describe('When transposing by a large negative interval', () => {
    beforeEach(() => {
      input = { letter: 'A#', octave: -1 };
      semitones = -26;
      act = () => transpose(input, semitones);
    });

    it('should return the expected note', () => {
      expect(act()).toEqual({ letter: 'G#', octave: -3 });
    });
  });
});

describe('The transposeByName() function', () => {
  let input: string;
  let semitones: number;
  let act: () => string;

  describe('When the input name is valid', () => {
    beforeEach(() => {
      input = 'A#-1';
      semitones = -26;
      act = () => transposeByName(input, semitones);
    });

    it('should transpose and return the expected name', () => {
      expect(act()).toBe('G#-3');
    });
  });

  describe('When the input name is invalid', () => {
    beforeEach(() => {
      input = 'H0';
      semitones = 3;
      act = () => transposeByName(input, semitones);
    });

    it('should throw an error', () => {
      expect(act).toThrowError();
    });
  });
});
