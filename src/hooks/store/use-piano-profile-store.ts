import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useShallow } from 'zustand/shallow';

export interface PianoProfileStoreState {
  keyCount: number;
  pianoName: string | null;
}

interface VersionedPianoProfileStoreState extends PianoProfileStoreState {
  version: number;
}

interface PianoStoreActions {
  updateSingleState: (
    property: keyof PianoProfileStoreState,
    value: string | null | number,
  ) => void;
  updateState: (newState: PianoProfileStoreState) => void;
}

export type PianoProfileStore = VersionedPianoProfileStoreState &
  PianoStoreActions;

const createPianoProfileStore = () =>
  create<PianoProfileStore>()(
    persist(
      (set) => ({
        keyCount: 88,
        pianoName: null,
        updateSingleState: (property, value) =>
          set(() => ({
            [property]: value,
          })),
        updateState: (newState: PianoProfileStoreState) => set(() => newState),
        version: 1,
      }),
      {
        name: `ptl.piano`,
        partialize: (
          state: PianoProfileStore,
        ): VersionedPianoProfileStoreState => ({
          keyCount: state.keyCount,
          pianoName: state.pianoName,
          version: state.version,
        }),
      },
    ),
  );

type PianoProfileBoundStore = ReturnType<typeof createPianoProfileStore>;

let pianoProfileStore: PianoProfileBoundStore | undefined = undefined;

export const usePianoProfileStore = (): PianoProfileBoundStore => {
  pianoProfileStore ??= createPianoProfileStore();
  return pianoProfileStore;
};

export const usePianoProfileState = () => {
  return usePianoProfileStore()(
    useShallow((state: PianoProfileStore) => ({
      keyCount: state.keyCount,
      pianoName: state.pianoName,
    })),
  );
};

export const usePianoProfileActions = () => {
  return usePianoProfileStore()(
    useShallow((state: PianoProfileStore) => ({
      updateSingleState: state.updateSingleState,
      updateState: state.updateState,
    })),
  );
};
