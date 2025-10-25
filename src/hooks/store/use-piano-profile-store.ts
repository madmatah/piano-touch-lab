import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useShallow } from 'zustand/shallow';
import type { Note } from '@/lib/music/theory/spn';

export interface PianoProfileStoreState {
  brand: string | null;
  isDemoProfile: boolean;
  keyCount: number;
  model: string | null;
  serialNumber: string | null;
  startNote: Note | null;
}

interface VersionedPianoProfileStoreState extends PianoProfileStoreState {
  version: number;
}

interface PianoStoreActions {
  reset: () => void;
  updateSingleState: (
    property: keyof PianoProfileStoreState,
    value: string | null | number | Note,
  ) => void;
  updateState: (newState: PianoProfileStoreState) => void;
}

export type PianoProfileStore = VersionedPianoProfileStoreState &
  PianoStoreActions;

const defaultPianoProfileStoreValues: PianoProfileStoreState = {
  brand: null,
  isDemoProfile: false,
  keyCount: 88,
  model: null,
  serialNumber: null,
  startNote: { letter: 'A', octave: 0 },
};

const createPianoProfileStore = () =>
  create<PianoProfileStore>()(
    persist(
      (set) => ({
        ...defaultPianoProfileStoreValues,
        reset: () => set(() => defaultPianoProfileStoreValues),
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
          startNote: state.startNote,
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
      startNote: state.startNote,
    })),
  );
};

export const usePianoProfileActions = () => {
  return usePianoProfileStore()(
    useShallow((state: PianoProfileStore) => ({
      reset: state.reset,
      updateSingleState: state.updateSingleState,
      updateState: state.updateState,
    })),
  );
};
