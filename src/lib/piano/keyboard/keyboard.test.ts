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

  describe('The getKeyByNumber() method', () => {
    let result: Key | undefined;

    describe('When the number exists', () => {
      beforeEach(() => {
        result = model.getKeyByNumber(1);
      });

      it('should return the expected key information', () => {
        expect(result).toEqual({
          color: KeyColor.White,
          name: 'A0',
          number: 1,
          octave: 0,
        });
      });
    });

    describe('When the number does not exist', () => {
      beforeEach(() => {
        result = model.getKeyByNumber(999);
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('The getKeyNumbers() method', () => {
    let result: readonly number[];

    beforeEach(() => {
      result = model.getKeyNumbers();
    });

    it('should return an array of key numbers in order', () => {
      expect(result).toEqual([1, 2]);
    });
  });

  describe('The size property', () => {
    it('should return the number of keys', () => {
      expect(model.size).toBe(2);
    });
  });

  describe('The map() method', () => {
    let result: Keyboard<Key & { payload: string }>;

    beforeEach(() => {
      result = model.map((key) => `Key ${key.name}`);
    });

    it('should return a new Keyboard instance', () => {
      expect(result).toBeInstanceOf(Keyboard);
      expect(result).not.toBe(model);
    });

    it('should transform each key with the payload', () => {
      const mappedKeys = result.getKeys();
      expect(mappedKeys).toHaveLength(2);
      expect(mappedKeys[0]?.payload).toBe('Key A0');
      expect(mappedKeys[1]?.payload).toBe('Key B0');
    });

    it('should preserve original key properties', () => {
      const mappedKeys = result.getKeys();
      expect(mappedKeys[0]).toMatchObject({
        color: KeyColor.White,
        name: 'A0',
        number: 1,
        octave: 0,
        payload: 'Key A0',
      });
    });
  });

  describe('The mapToArray() method', () => {
    let result: string[];

    beforeEach(() => {
      result = model.mapToArray((key) => `${key.color} ${key.name}`);
    });

    it('should return an array of transformed values', () => {
      expect(result).toEqual(['white A0', 'white B0']);
    });

    it('should have the same length as the original keys', () => {
      expect(result).toHaveLength(model.size);
    });
  });

  describe('The getKeys() method', () => {
    describe('When pushing into the keys array', () => {
      let act: () => unknown;

      beforeEach(() => {
        const snapshot = model.getKeys();
        const first = model.getKeyByName('A0')!;
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
          snapshot[0]!.name = 'Z9';
        };
      });

      it('should throw an error', () => {
        expect(act).toThrowError();
      });
    });
  });
});
