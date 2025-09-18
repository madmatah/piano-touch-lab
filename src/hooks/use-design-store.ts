import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useShallow } from 'zustand/shallow';
import {
  StrikeWeightDesignMode,
  type StrikeWeightDesignTarget,
} from '@/components/design/strike-weight/StrikeWeightDesign.types';
import { type FrontWeightDesignTarget } from '@/components/design/front-weight/FrontWeightDesign.types';
import {
  StrikeWeightRatioDesignMode,
  type StrikeWeightRatioDesignTarget,
} from '@/components/design/strike-weight-ratio/StrikeWeightRatioDesign.types';

export interface DesignStoreState {
  frontWeightDesignTarget: FrontWeightDesignTarget | null;
  strikeWeightDesignMode: StrikeWeightDesignMode | null;
  strikeWeightDesignTarget: StrikeWeightDesignTarget | null;
  strikeWeightDesignLatestSmoothTarget: StrikeWeightDesignTarget | null;
  strikeWeightDesignLatestStandarTarget: StrikeWeightDesignTarget | null;
  strikeWeightRatioDesignMode: StrikeWeightRatioDesignMode | null;
  strikeWeightRatioDesignLatestFixedTarget: StrikeWeightRatioDesignTarget | null;
  strikeWeightRatioDesignTarget: StrikeWeightRatioDesignTarget | null;
}

interface VersionedDesignStoreState extends DesignStoreState {
  version: number;
}

interface DesignStoreActions {
  updateFrontWeightDesign: (target: FrontWeightDesignTarget | null) => void;
  updateStrikeWeightDesign: (
    mode: StrikeWeightDesignMode | null,
    target: StrikeWeightDesignTarget | null,
  ) => void;
  updateStrikeWeightRatioDesign: (
    mode: StrikeWeightRatioDesignMode | null,
    target: StrikeWeightRatioDesignTarget | null,
  ) => void;
}

export type DesignStore = VersionedDesignStoreState & DesignStoreActions;

const createDesignStore = (measureProfileName: string) =>
  create<DesignStore>()(
    persist(
      (set) => ({
        frontWeightDesignTarget: null,
        strikeWeightDesignLatestSmoothTarget: null,
        strikeWeightDesignLatestStandarTarget: null,
        strikeWeightDesignMode: null,
        strikeWeightDesignTarget: null,
        strikeWeightRatioDesignLatestFixedTarget: null,
        strikeWeightRatioDesignMode: null,
        strikeWeightRatioDesignTarget: null,
        updateFrontWeightDesign: (target: FrontWeightDesignTarget | null) =>
          set(() => ({
            frontWeightDesignTarget: target,
          })),
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
              mode === StrikeWeightDesignMode.StandardCurves &&
              target !== null
            ) {
              newState.strikeWeightDesignLatestStandarTarget = target;
            }
            if (mode === StrikeWeightDesignMode.Smoothed && target !== null) {
              newState.strikeWeightDesignLatestSmoothTarget = target;
            }
            return newState;
          }),
        updateStrikeWeightRatioDesign: (
          mode: StrikeWeightRatioDesignMode | null,
          target: StrikeWeightRatioDesignTarget | null,
        ) =>
          set(() => {
            const newState: Partial<DesignStore> = {
              strikeWeightRatioDesignMode: mode,
              strikeWeightRatioDesignTarget: target,
            };
            if (
              mode === StrikeWeightRatioDesignMode.FixedValue &&
              target !== null
            ) {
              newState.strikeWeightRatioDesignLatestFixedTarget = target;
            }
            return newState;
          }),
        version: 1,
      }),
      {
        name: `piano-touch.design.${measureProfileName}`,
        partialize: (state: DesignStore): VersionedDesignStoreState => ({
          frontWeightDesignTarget: state.frontWeightDesignTarget,
          strikeWeightDesignLatestSmoothTarget:
            state.strikeWeightDesignLatestSmoothTarget,
          strikeWeightDesignLatestStandarTarget:
            state.strikeWeightDesignLatestStandarTarget,
          strikeWeightDesignMode: state.strikeWeightDesignMode,
          strikeWeightDesignTarget: state.strikeWeightDesignTarget,
          strikeWeightRatioDesignLatestFixedTarget:
            state.strikeWeightRatioDesignLatestFixedTarget,
          strikeWeightRatioDesignMode: state.strikeWeightRatioDesignMode,
          strikeWeightRatioDesignTarget: state.strikeWeightRatioDesignTarget,
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

export const useFrontWeightDesign = (measureProfileName?: string) => {
  return useDesignStore(measureProfileName)(
    useShallow((state: DesignStore) => ({
      frontWeightDesignTarget: state.frontWeightDesignTarget,
    })),
  );
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

export const useStrikeWeightRatioDesign = (measureProfileName?: string) => {
  return useDesignStore(measureProfileName)(
    useShallow((state: DesignStore) => ({
      strikeWeightRatioDesignLatestFixedTarget:
        state.strikeWeightRatioDesignLatestFixedTarget,
      strikeWeightRatioDesignMode: state.strikeWeightRatioDesignMode,
      strikeWeightRatioDesignTarget: state.strikeWeightRatioDesignTarget,
    })),
  );
};

export const useDesignActions = (measureProfileName?: string) => {
  return useDesignStore(measureProfileName)(
    useShallow((state: DesignStore) => ({
      updateFrontWeightDesign: state.updateFrontWeightDesign,
      updateStrikeWeightDesign: state.updateStrikeWeightDesign,
      updateStrikeWeightRatioDesign: state.updateStrikeWeightRatioDesign,
    })),
  );
};
