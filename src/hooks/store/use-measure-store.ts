import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useShallow } from 'zustand/shallow';
import type {
  MeasuredKeyRequirements,
  OptionalNumber,
} from '@/lib/piano/touch-design/measured-key.requirements';
import { useKeyboard } from '../keyboard/use-keyboard';
import type { KeyboardRequirements } from '@/lib/piano/keyboard';

export interface MeasuresStoreState {
  keys: MeasuredKeyRequirements[];
  keyWeightRatio: OptionalNumber;
  wippenRadiusWeight: OptionalNumber;
}

interface VersionedMeasuresStoreState extends MeasuresStoreState {
  version: number;
}

type GlobalMeasures = Pick<
  MeasuresStoreState,
  'keyWeightRatio' | 'wippenRadiusWeight'
>;

interface MeasuresStoreActions {
  updateKeyMeasure: (
    keyIndex: number,
    property: keyof MeasuredKeyRequirements,
    value: OptionalNumber,
  ) => void;
  updateKeyMeasures: (
    keyIndex: number,
    keySpec: MeasuredKeyRequirements,
  ) => void;
  updateGlobalMeasure: (
    property: keyof GlobalMeasures,
    value: OptionalNumber,
  ) => void;
  updateState: (newState: MeasuresStoreState) => void;
}

export type MeasuresStore = VersionedMeasuresStoreState & MeasuresStoreActions;

const createMeasuresStore = (keyboard: KeyboardRequirements) =>
  create<MeasuresStore>()(
    persist(
      (set) => ({
        keyWeightRatio: null,
        keys: Array.from({ length: keyboard.size }, () => ({
          downWeightWithSpringSupport: null,
          downWeightWithoutSpringSupport: null,
          frontWeight: null,
          keyWeightRatio: null,
          measuredStrikeWeightRatio: null,
          strikeWeight: null,
          upWeight: null,
          wippenRadiusWeight: null,
        })),
        updateGlobalMeasure: (property, value) =>
          set(() => ({
            [property]: value,
          })),
        updateKeyMeasure: (keyIndex, property, value) =>
          set((state) => ({
            keys: state.keys.map((spec, index) =>
              index === keyIndex ? { ...spec, [property]: value } : spec,
            ),
          })),
        updateKeyMeasures: (keyIndex, keySpec) =>
          set((state) => ({
            keys: state.keys.map((spec, index) =>
              index === keyIndex ? keySpec : spec,
            ),
          })),
        updateState: (newState: MeasuresStoreState) => set(newState),
        version: 1,
        wippenRadiusWeight: null,
      }),
      {
        name: `ptl.measures`,
        partialize: (state: MeasuresStore): VersionedMeasuresStoreState => ({
          keyWeightRatio: state.keyWeightRatio,
          keys: state.keys,
          version: state.version,
          wippenRadiusWeight: state.wippenRadiusWeight,
        }),
      },
    ),
  );

type MeasuresBoundStore = ReturnType<typeof createMeasuresStore>;

let measuresStore: MeasuresBoundStore | undefined = undefined;

export const useMeasuresStore = (): MeasuresBoundStore => {
  const { keyboard } = useKeyboard();
  measuresStore ??= createMeasuresStore(keyboard);
  return measuresStore;
};

export const useMeasuredKeyFromStore = (keyIndex: number) => {
  return useMeasuresStore()(
    useShallow((state: MeasuresStore) => state.keys?.[keyIndex]),
  );
};

export const useGlobalMeasures = (): GlobalMeasures => {
  return useMeasuresStore()(
    useShallow((state: MeasuresStore) => ({
      keyWeightRatio: state.keyWeightRatio,
      wippenRadiusWeight: state.wippenRadiusWeight,
    })),
  );
};

export const useMeasureActions = () => {
  return useMeasuresStore()(
    useShallow((state: MeasuresStore) => ({
      updateGlobalMeasure: state.updateGlobalMeasure,
      updateKeyMeasure: state.updateKeyMeasure,
      updateKeyMeasures: state.updateKeyMeasures,
      updateState: state.updateState,
    })),
  );
};
