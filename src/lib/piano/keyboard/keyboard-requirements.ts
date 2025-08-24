import type { Key } from './key';

export interface KeyboardRequirements {
  readonly size: number;
  getKeys: () => ReadonlyArray<Key>;
  getKeyNumbers: () => ReadonlyArray<number>;
  getKeyByNumber: (keyNumber: number) => Key | undefined;
  getKeyByName: (name: string) => Key | undefined;
}
