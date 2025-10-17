import type { Key, KeyWith } from './key';

export interface KeyboardLike<K> {
  readonly size: number;
  getKeys: () => readonly K[];
  getKeyNumbers: () => readonly number[];
  getKeyByNumber: (keyNumber: number) => K | undefined;
  getKeyByName: (name: string) => K | undefined;
  [Symbol.iterator](): Iterator<K>;
  toJSON(): { keys: K[] };
  map<TNext>(mapper: (key: K) => TNext): KeyboardLike<KeyWith<TNext>>;
  mapToArray<TNext>(mapper: (key: K) => TNext): TNext[];
}

export type KeyboardRequirements = KeyboardLike<Key>;
