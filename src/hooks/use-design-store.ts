import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useShallow } from 'zustand/shallow';
import {
  StrikeWeightDesignMode,
  type StrikeWeightDesignTarget,
} from '@/components/design/strike-weight/StrikeWeightDesign.types';

export interface DesignStoreState {
  strikeWeightDesignMode: StrikeWeightDesignMode | null;
  strikeWeightDesignTarget: StrikeWeightDesignTarget | null;
  strikeWeightDesignLatestSmoothTarget: StrikeWeightDesignTarget | null;
  strikeWeightDesignLatestStandarTarget: StrikeWeightDesignTarget | null;
}

interface VersionedDesignStoreState extends DesignStoreState {
  version: number;
}

interface DesignStoreActions {
  updateStrikeWeightDesign: (
    mode: StrikeWeightDesignMode | null,
    target: StrikeWeightDesignTarget | null,
  ) => void;
}

export type DesignStore = VersionedDesignStoreState & DesignStoreActions;

const createDesignStore = (measureProfileName: string) =>
  create<DesignStore>()(
    persist(
      (set) => ({
        strikeWeightDesignLatestSmoothTarget: null,
        strikeWeightDesignLatestStandarTarget: null,
        strikeWeightDesignMode: null,
        strikeWeightDesignTarget: null,
        updateStrikeWeightDesign: (
          mode: StrikeWeightDesignMode | null,
          target: StrikeWeightDesignTarget | null,
        ) =>
          set(() => {
            const newState: Partial<DesignStore> = {
              strikeWeightDesignMode: mode,
              strikeWeightDesignTarget: target,
            };
            if (
              mode === StrikeWeightDesignMode.STANDARD_CURVES &&
              target !== null
            ) {
              newState.strikeWeightDesignLatestStandarTarget = target;
            }
            if (mode === StrikeWeightDesignMode.SMOOTHED && target !== null) {
              newState.strikeWeightDesignLatestSmoothTarget = target;
            }
            return newState;
          }),
        version: 1,
      }),
      {
        name: `piano-touch.design.${measureProfileName}`,
        partialize: (state: DesignStore): VersionedDesignStoreState => ({
          strikeWeightDesignLatestSmoothTarget:
            state.strikeWeightDesignLatestSmoothTarget,
          strikeWeightDesignLatestStandarTarget:
            state.strikeWeightDesignLatestStandarTarget,
          strikeWeightDesignMode: state.strikeWeightDesignMode,
          strikeWeightDesignTarget: state.strikeWeightDesignTarget,
          version: state.version,
        }),
      },
    ),
  );

type DesignBoundStore = ReturnType<typeof createDesignStore>;

const designStoreRegistry: Record<string, DesignBoundStore> = {};

export const useDesignStore = (
  measureProfileName: string = 'default',
): DesignBoundStore => {
  let store = designStoreRegistry[measureProfileName];
  if (!store) {
    store = createDesignStore(measureProfileName);
    designStoreRegistry[measureProfileName] = store;
  }
  return store;
};

export const useStrikeWeightDesign = (measureProfileName?: string) => {
  return useDesignStore(measureProfileName)(
    useShallow((state: DesignStore) => ({
      strikeWeightDesignMode: state.strikeWeightDesignMode,
      strikeWeightDesignSmoothTarget:
        state.strikeWeightDesignLatestSmoothTarget,
      strikeWeightDesignStandarTarget:
        state.strikeWeightDesignLatestStandarTarget,
      strikeWeightDesignTarget: state.strikeWeightDesignTarget,
    })),
  );
};

export const useDesignActions = (measureProfileName?: string) => {
  return useDesignStore(measureProfileName)(
    useShallow((state: DesignStore) => ({
      updateStrikeWeightDesign: state.updateStrikeWeightDesign,
    })),
  );
};
