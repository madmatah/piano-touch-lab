import type { Key, KeyWith } from './key';
import type { KeyboardLike } from './keyboard-requirements';

export class Keyboard<K extends Key = Key> implements KeyboardLike<K> {
  public readonly keys: ReadonlyArray<K>;
  private readonly keyByNumber: Map<number, K>;
  private readonly keyByName: Map<string, K>;

  public constructor(keys: Array<K>) {
    const cloned = keys.map((k) => ({ ...(k as Key) })) as Array<K>;
    for (const k of cloned) Object.freeze(k as object);
    this.keys = Object.freeze(cloned);

    this.keyByNumber = new Map<number, K>();
    this.keyByName = new Map<string, K>();
    for (const key of this.keys) {
      this.keyByNumber.set(key.number, key);
      this.keyByName.set(key.name, key);
    }
  }

  public getKeys(): ReadonlyArray<K> {
    return this.keys;
  }

  public getKeyNumbers(): ReadonlyArray<number> {
    return this.keys.map((key) => key.number);
  }

  public getKeyByNumber(keyNumber: number): K | undefined {
    return this.keyByNumber.get(keyNumber);
  }

  public getKeyByName(name: string): K | undefined {
    return this.keyByName.get(name);
  }

  public get size(): number {
    return this.keys.length;
  }

  public [Symbol.iterator](): Iterator<K> {
    return this.keys[Symbol.iterator]();
  }

  public toJSON(): { keys: Array<K> } {
    return { keys: this.keys.slice() };
  }

  public map<TNext>(mapper: (key: K) => TNext): Keyboard<KeyWith<TNext>> {
    const next: Array<KeyWith<TNext>> = this.keys.map((k) => ({
      ...(k as Key),
      payload: mapper(k),
    }));
    return new Keyboard<KeyWith<TNext>>(next);
  }

  public mapToArray<TNext>(mapper: (key: K) => TNext): Array<TNext> {
    return this.keys.map((k) => mapper(k));
  }
}
