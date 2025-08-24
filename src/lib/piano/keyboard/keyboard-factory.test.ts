import { KeyboardFactory } from './keyboard-factory';
import { describe, it, expect, beforeEach } from 'bun:test';
import { MIN_OCTAVE, MAX_OCTAVE } from './constants';
import type { KeyboardRequirements } from './keyboard-requirements';
import { KeyColor } from './key-color.enum';

describe('The KeyboardModelFactory', () => {
  describe('The fromStartNoteAndLength() function', () => {
    describe('When the number of keys is not a positive integer', () => {
      it.each([0, -1, 3.14] as number[])(
        'should throw an error for %s',
        (n) => {
          expect(() =>
            KeyboardFactory.fromStartNoteAndLength('A0', n),
          ).toThrowError();
        },
      );
    });

    describe('When the first note is invalid', () => {
      it.each(['Z', 'A#-2', 'B9'])('should throw an error', (note) => {
        expect(() =>
          KeyboardFactory.fromStartNoteAndLength(note, 88),
        ).toThrowError();
      });
    });

    describe('When parameters are valid', () => {
      let keyboardModel: KeyboardRequirements;

      describe('On standard keyboard', () => {
        beforeEach(() => {
          keyboardModel = KeyboardFactory.fromStartNoteAndLength('a0', 88);
        });

        it('should generate the expected keys', () => {
          expect(keyboardModel.getKeys().length).toBe(88);
          expect(keyboardModel.getKeyByNumber(1)).toEqual({
            color: KeyColor.White,
            name: 'A0',
            number: 1,
            octave: 0,
          });

          expect(keyboardModel.getKeyByNumber(9)).toEqual({
            color: KeyColor.White,
            name: 'F1',
            number: 9,
            octave: 1,
          });

          expect(keyboardModel.getKeyByNumber(41)).toEqual({
            color: KeyColor.Black,
            name: 'C#4',
            number: 41,
            octave: 4,
          });

          expect(keyboardModel.getKeyByNumber(88)).toEqual({
            color: KeyColor.White,
            name: 'C8',
            number: 88,
            octave: 8,
          });
        });
      });

      describe('On a custom keyboard', () => {
        beforeEach(() => {
          keyboardModel = KeyboardFactory.fromStartNoteAndLength('a#-1', 5);
        });

        it('should generate the expected keys', () => {
          expect(keyboardModel.getKeyNumbers()).toEqual([1, 2, 3, 4, 5]);
          expect(keyboardModel.getKeys().length).toBe(5);
          expect(keyboardModel.getKeys()).toEqual([
            {
              color: KeyColor.Black,
              name: 'A#-1',
              number: 1,
              octave: -1,
            },
            {
              color: KeyColor.White,
              name: 'B-1',
              number: 2,
              octave: -1,
            },
            {
              color: KeyColor.White,
              name: 'C0',
              number: 3,
              octave: 0,
            },
            {
              color: KeyColor.Black,
              name: 'C#0',
              number: 4,
              octave: 0,
            },
            {
              color: KeyColor.White,
              name: 'D0',
              number: 5,
              octave: 0,
            },
          ]);
        });
      });

      describe('On a non-standard size keyboard', () => {
        beforeEach(() => {
          keyboardModel = KeyboardFactory.fromStartNoteAndLength('c4', 7);
        });

        it('should generate the requested number of keys', () => {
          expect(keyboardModel.getKeys().length).toBe(7);
        });
      });
    });

    describe('When the computed last note exceeds allowed octave range', () => {
      it('should throw for exceeding MAX_OCTAVE', () => {
        const start = `A${MAX_OCTAVE - 1}`;
        expect(() =>
          KeyboardFactory.fromStartNoteAndLength(start, 24),
        ).toThrowError();
      });

      it('should not throw when starting at lower bound and staying in range', () => {
        expect(() =>
          KeyboardFactory.fromStartNoteAndLength(`B${MIN_OCTAVE}`, 2),
        ).not.toThrowError();
      });
    });
  });

  describe('The fromLayout() function', () => {
    let keyboardModel: KeyboardRequirements;

    describe('When using the standard 88-key layout', () => {
      beforeEach(() => {
        keyboardModel = KeyboardFactory.fromLayout({
          length: 88,
          startNote: { letter: 'A', octave: 0 },
        });
      });

      it('should generate the expected keys', () => {
        expect(keyboardModel.getKeys().length).toBe(88);
        expect(keyboardModel.getKeyByNumber(1)).toEqual({
          color: KeyColor.White,
          name: 'A0',
          number: 1,
          octave: 0,
        });

        expect(keyboardModel.getKeyByNumber(9)).toEqual({
          color: KeyColor.White,
          name: 'F1',
          number: 9,
          octave: 1,
        });

        expect(keyboardModel.getKeyByNumber(41)).toEqual({
          color: KeyColor.Black,
          name: 'C#4',
          number: 41,
          octave: 4,
        });

        expect(keyboardModel.getKeyByNumber(88)).toEqual({
          color: KeyColor.White,
          name: 'C8',
          number: 88,
          octave: 8,
        });
      });
    });

    describe('When the start octave is invalid', () => {
      it('should throw an error', () => {
        expect(() =>
          KeyboardFactory.fromLayout({
            length: 10,
            startNote: { letter: 'A', octave: MIN_OCTAVE - 1 },
          }),
        ).toThrowError();
      });
    });

    describe('When the computed last note exceeds allowed octave range', () => {
      it('should throw for exceeding MAX_OCTAVE', () => {
        expect(() =>
          KeyboardFactory.fromLayout({
            length: 24,
            startNote: { letter: 'A', octave: MAX_OCTAVE - 1 },
          }),
        ).toThrowError();
      });

      it('should not throw when starting at lower bound and staying in range', () => {
        expect(() =>
          KeyboardFactory.fromLayout({
            length: 2,
            startNote: { letter: 'B', octave: MIN_OCTAVE },
          }),
        ).not.toThrowError();
      });
    });
  });
});
