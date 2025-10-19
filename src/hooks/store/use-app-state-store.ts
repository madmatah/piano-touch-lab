import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useShallow } from 'zustand/shallow';

export interface AppStateStoreState {
  hasLoadedDemoData: boolean;
}

interface AppStateStoreActions {
  updateSingleState: (
    property: keyof AppStateStoreState,
    value: boolean,
  ) => void;
  updateState: (newState: AppStateStoreState) => void;
}

export type MeasureOptionsStore = AppStateStoreState & AppStateStoreActions;

const createAppStateStore = () =>
  create<MeasureOptionsStore>()(
    persist(
      (set) => ({
        hasLoadedDemoData: false,
        updateSingleState: (property, value) =>
          set(() => ({
            [property]: value,
          })),
        updateState: (newState: AppStateStoreState) => set(() => newState),
      }),
      {
        name: `ptl.app-state`,
        partialize: (state: MeasureOptionsStore): AppStateStoreState => ({
          hasLoadedDemoData: state.hasLoadedDemoData,
        }),
      },
    ),
  );

type AppStateBoundStore = ReturnType<typeof createAppStateStore>;

let appStateStore: AppStateBoundStore | undefined = undefined;

export const useAppStateStore = (): AppStateBoundStore => {
  appStateStore ??= createAppStateStore();
  return appStateStore;
};

export const useAppState = () => {
  return useAppStateStore()(
    useShallow((state: MeasureOptionsStore) => ({
      hasLoadedDemoData: state.hasLoadedDemoData,
    })),
  );
};

export const useAppStateActions = () => {
  return useAppStateStore()(
    useShallow((state: MeasureOptionsStore) => ({
      updateSingleState: state.updateSingleState,
      updateState: state.updateState,
    })),
  );
};
