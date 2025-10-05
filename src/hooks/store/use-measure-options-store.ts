import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useShallow } from 'zustand/shallow';

export interface MeasureOptionsStoreState {
  useManualSWRMeasurements: boolean;
}

type MeasureOptions = Pick<
  MeasureOptionsStoreState,
  'useManualSWRMeasurements'
>;

interface MeasureOptionsStoreActions {
  updateOption: (property: keyof MeasureOptions, value: boolean) => void;
  updateState: (newState: MeasureOptionsStoreState) => void;
}

export type MeasureOptionsStore = MeasureOptionsStoreState &
  MeasureOptionsStoreActions;

const createMeasureOptionsStore = () =>
  create<MeasureOptionsStore>()(
    persist(
      (set) => ({
        updateOption: (property, value) =>
          set(() => ({
            [property]: value,
          })),
        updateState: (newState: MeasureOptionsStoreState) =>
          set(() => newState),
        useManualSWRMeasurements: false,
      }),
      {
        name: `piano-touch.measure-options`,
        partialize: (state: MeasureOptionsStore): MeasureOptionsStoreState => ({
          useManualSWRMeasurements: state.useManualSWRMeasurements,
        }),
      },
    ),
  );

type MeasureOptionsBoundStore = ReturnType<typeof createMeasureOptionsStore>;

let measureOptionsStore: MeasureOptionsBoundStore | undefined = undefined;

export const useMeasureOptionsStore = (): MeasureOptionsBoundStore => {
  if (!measureOptionsStore) {
    measureOptionsStore = createMeasureOptionsStore();
  }
  return measureOptionsStore;
};

export const useMeasureOptions = () => {
  return useMeasureOptionsStore()(
    useShallow((state: MeasureOptionsStore) => ({
      useManualSWRMeasurements: state.useManualSWRMeasurements,
    })),
  );
};

export const useMeasureOptionsActions = () => {
  return useMeasureOptionsStore()(
    useShallow((state: MeasureOptionsStore) => ({
      updateOption: state.updateOption,
      updateState: state.updateState,
    })),
  );
};
