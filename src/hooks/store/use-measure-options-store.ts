import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useShallow } from 'zustand/shallow';

export interface MeasureOptionsStoreState {
  useManualSWRMeasurements: boolean;
  useSupportSpringMeasurements: boolean;
}

interface MeasureOptionsStoreActions {
  updateOption: (
    property: keyof MeasureOptionsStoreState,
    value: boolean,
  ) => void;
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
        useSupportSpringMeasurements: false,
      }),
      {
        name: `piano-touch.measure-options`,
        partialize: (state: MeasureOptionsStore): MeasureOptionsStoreState => ({
          useManualSWRMeasurements: state.useManualSWRMeasurements,
          useSupportSpringMeasurements: state.useSupportSpringMeasurements,
        }),
      },
    ),
  );

type MeasureOptionsBoundStore = ReturnType<typeof createMeasureOptionsStore>;

let measureOptionsStore: MeasureOptionsBoundStore | undefined = undefined;

export const useMeasureOptionsStore = (): MeasureOptionsBoundStore => {
  measureOptionsStore ??= createMeasureOptionsStore();
  return measureOptionsStore;
};

export const useMeasureOptions = () => {
  return useMeasureOptionsStore()(
    useShallow((state: MeasureOptionsStore) => ({
      useManualSWRMeasurements: state.useManualSWRMeasurements,
      useSupportSpringMeasurements: state.useSupportSpringMeasurements,
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
