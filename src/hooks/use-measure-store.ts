import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useShallow } from 'zustand/shallow';
import type {
  KeyMeasureRequirements,
  OptionalNumber,
  MeasureRequirements,
} from '@/lib/piano/touch-design/measure-requirements';
import { useKeyboard } from './use-keyboard';
import type { KeyboardRequirements } from '@/lib/piano/keyboard';

interface MeasuresStoreState extends MeasureRequirements {
  version: number;
}

interface MeasuresStoreActions {
  updateKeyMeasure: (
    keyIndex: number,
    property: keyof KeyMeasureRequirements,
    value: OptionalNumber,
  ) => void;
  updateKeyMeasures: (
    keyIndex: number,
    keySpec: KeyMeasureRequirements,
  ) => void;
  updateGlobalMeasure: (
    property: keyof Pick<
      MeasureRequirements,
      'keyWeightRatio' | 'wippenRadiusWeight'
    >,
    value: OptionalNumber,
  ) => void;
}

type MeasuresStore = MeasuresStoreState & MeasuresStoreActions;

const createMeasuresStore = (
  measureProfileName: string,
  keyboard: KeyboardRequirements,
) =>
  create<MeasuresStore>()(
    persist(
      (set) => ({
        keyWeightRatio: null,
        keys: Array.from({ length: keyboard.size }, () => ({
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

        wippenRadiusWeight: null,
      }),
      {
        name: `piano-touch.measures.${measureProfileName}`,
        partialize: (state: MeasuresStore): MeasuresStoreState => ({
          keyWeightRatio: state.keyWeightRatio,
          keys: state.keys,
          version: state.version,
          wippenRadiusWeight: state.wippenRadiusWeight,
        }),
      },
    ),
  );

type MeasuresBoundStore = ReturnType<typeof createMeasuresStore>;

const measuresStoreRegistry: Record<string, MeasuresBoundStore> = {};

export const useMeasuresStore = (
  measureProfileName: string = 'default',
): MeasuresBoundStore => {
  const { keyboard } = useKeyboard();

  let store = measuresStoreRegistry[measureProfileName];
  if (!store) {
    store = createMeasuresStore(measureProfileName, keyboard);
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
    useShallow<MeasuresStore, MeasureRequirements>((state: MeasuresStore) => ({
      keyWeightRatio: state.keyWeightRatio,
      keys: state.keys,
      wippenRadiusWeight: state.wippenRadiusWeight,
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
