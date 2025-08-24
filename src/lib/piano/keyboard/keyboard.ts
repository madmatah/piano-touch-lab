import type { Key } from './key';
import type { KeyboardRequirements } from './keyboard-requirements';

export class Keyboard implements KeyboardRequirements {
  public readonly keys: ReadonlyArray<Key>;
  private readonly keyByNumber: Map<number, Key>;
  private readonly keyByName: Map<string, Key>;

  public constructor(keys: Key[]) {
    const cloned: Key[] = keys.map((k) => ({ ...k }));
    for (const k of cloned) Object.freeze(k);
    this.keys = Object.freeze(cloned);

    this.keyByNumber = new Map<number, Key>();
    this.keyByName = new Map<string, Key>();
    for (const key of this.keys) {
      this.keyByNumber.set(key.number, key);
      this.keyByName.set(key.name, key);
    }
  }

  public getKeys(): ReadonlyArray<Key> {
    return this.keys;
  }

  public getKeyNumbers(): ReadonlyArray<number> {
    return this.keys.map((key) => key.number);
  }

  public getKeyByNumber(keyNumber: number): Key | undefined {
    return this.keyByNumber.get(keyNumber);
  }

  public getKeyByName(name: string): Key | undefined {
    return this.keyByName.get(name);
  }

  public get size(): number {
    return this.keys.length;
  }

  public [Symbol.iterator](): Iterator<Key> {
    return this.keys[Symbol.iterator]();
  }

  public toJSON(): { keys: Key[] } {
    return { keys: this.keys.slice() };
  }
}
