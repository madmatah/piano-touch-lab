import { describe, it, expect, beforeEach } from 'bun:test';
import { Keyboard } from './keyboard';
import type { Key } from './key';
import { KeyColor } from './key-color.enum';

describe('The Keyboard class', () => {
  let model: Keyboard;
  let keys: Key[];

  const fakeKeys: Key[] = [
    { color: KeyColor.White, name: 'A0', number: 1, octave: 0 },
    { color: KeyColor.White, name: 'B0', number: 2, octave: 0 },
  ];

  beforeEach(() => {
    keys = fakeKeys;
    model = new Keyboard(keys);
  });

  describe('The [Symbol.iterator]() method', () => {
    let result: Key[];

    beforeEach(() => {
      result = Array.from(model);
    });

    it('should yield keys in order', () => {
      expect(result).toEqual(fakeKeys);
    });
  });

  describe('The toJSON() method', () => {
    let result: unknown;

    beforeEach(() => {
      result = JSON.parse(JSON.stringify(model));
    });

    it('should include a keys array with key data', () => {
      expect(result).toEqual({ keys: fakeKeys });
    });
  });

  describe('The getKeyByName() method', () => {
    let result: Key | undefined;

    describe('When the name exists', () => {
      beforeEach(() => {
        result = model.getKeyByName('B0');
      });

      it('should return the expected key information', () => {
        expect(result).toEqual({
          color: KeyColor.White,
          name: 'B0',
          number: 2,
          octave: 0,
        });
      });
    });

    describe('When the name does not exist', () => {
      beforeEach(() => {
        result = model.getKeyByName('Z9');
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('The getKeys() method', () => {
    describe('When pushing into the keys array', () => {
      let act: () => unknown;

      beforeEach(() => {
        const snapshot = model.getKeys();
        const first = model.getKeyByName('A0') as Key;
        act = () => (snapshot as Key[]).push(first);
      });

      it('should throw an error', () => {
        expect(act).toThrowError();
      });
    });

    describe('When mutating an element', () => {
      let act: () => unknown;

      beforeEach(() => {
        const snapshot = model.getKeys();
        act = () => {
          (snapshot[0] as Key).name = 'Z9';
        };
      });

      it('should throw an error', () => {
        expect(act).toThrowError();
      });
    });
  });
});
