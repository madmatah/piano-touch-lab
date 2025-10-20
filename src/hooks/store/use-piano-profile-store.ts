import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useShallow } from 'zustand/shallow';

export interface PianoProfileStoreState {
  brand: string | null;
  isDemoProfile: boolean;
  keyCount: number;
  model: string | null;
  serialNumber: string | null;
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
        brand: null,
        isDemoProfile: false,
        keyCount: 88,
        model: null,
        serialNumber: null,
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
          brand: state.brand,
          isDemoProfile: state.isDemoProfile,
          keyCount: state.keyCount,
          model: state.model,
          serialNumber: state.serialNumber,
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
      brand: state.brand,
      displayName: `${state.brand ?? ''} ${state.model ?? ''}`.trim(),
      isDemoProfile: state.isDemoProfile,
      keyCount: state.keyCount,
      model: state.model,
      serialNumber: state.serialNumber,
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
