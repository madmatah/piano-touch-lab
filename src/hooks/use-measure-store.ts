import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useShallow } from 'zustand/shallow';
import type {
  KeyMeasureRequirements,
  NumericUserInput,
  MeasureRequirements,
} from '@/lib/touch-design/measure-requirements';
import { keyboardLength } from '@/lib/constants';

interface MeasuresStoreState {
  keys: KeyMeasureRequirements[];
  keyWeightRatio: NumericUserInput;
  version: number;
  wippenWeight: NumericUserInput;
}

interface MeasuresStoreActions {
  updateKeyMeasure: (
    keyIndex: number,
    property: keyof KeyMeasureRequirements,
    value: NumericUserInput,
  ) => void;
  updateKeyMeasures: (
    keyIndex: number,
    keySpec: KeyMeasureRequirements,
  ) => void;
  updateGlobalMeasure: (
    property: keyof Pick<
      MeasureRequirements,
      'keyWeightRatio' | 'wippenWeight'
    >,
    value: NumericUserInput,
  ) => void;
}

type MeasuresStore = MeasuresStoreState & MeasuresStoreActions;

const createMeasuresStore = (measureProfileName: string) =>
  create<MeasuresStore>()(
    persist(
      (set) => ({
        keyWeightRatio: null,
        keys: Array.from({ length: keyboardLength }, () => ({
          downWeight: null,
          frontWeight: null,
          strikeWeight: null,
          upWeight: null,
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

        version: 1,

        wippenWeight: null,
      }),
      {
        name: `piano-touch.measures.${measureProfileName}`,
        partialize: (state: MeasuresStore): MeasureRequirements => ({
          keyWeightRatio: state.keyWeightRatio,
          keys: state.keys,
          version: state.version,
          wippenWeight: state.wippenWeight,
        }),
      },
    ),
  );

type MeasuresBoundStore = ReturnType<typeof createMeasuresStore>;

const measuresStoreRegistry: Record<string, MeasuresBoundStore> = {};

export const useMeasuresStore = (
  measureProfileName: string = 'default',
): MeasuresBoundStore => {
  let store = measuresStoreRegistry[measureProfileName];
  if (!store) {
    store = createMeasuresStore(measureProfileName);
    measuresStoreRegistry[measureProfileName] = store;
  }
  return store;
};

export const useKeyMeasures = (
  keyIndex: number,
  measureProfileName?: string,
) => {
  return useMeasuresStore(measureProfileName)(
    useShallow((state: MeasuresStore) => state.keys?.[keyIndex]),
  );
};

export const usePianoMeasures = (measureProfileName?: string) => {
  return useMeasuresStore(measureProfileName)(
    useShallow((state: MeasuresStore) => ({
      keyWeightRatio: state.keyWeightRatio,
      keys: state.keys,
      wippenWeight: state.wippenWeight,
    })),
  );
};

export const useMeasureActions = (measureProfileName?: string) => {
  return useMeasuresStore(measureProfileName)(
    useShallow((state: MeasuresStore) => ({
      updateGlobalMeasure: state.updateGlobalMeasure,
      updateKeyMeasure: state.updateKeyMeasure,
      updateKeyMeasures: state.updateKeyMeasures,
    })),
  );
};
