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
import {
  WippenSupportSpringsDesignMode,
  type WippenSupportSpringsDesignTarget,
  type WippenTensionDesign,
} from '@/components/design/wippen-support-springs/WippenSupportSpringsDesign.types';

export interface DesignStoreState {
  frontWeightDesignTarget: FrontWeightDesignTarget | null;
  strikeWeightDesignMode: StrikeWeightDesignMode | null;
  strikeWeightDesignTarget: StrikeWeightDesignTarget | null;
  strikeWeightDesignLatestSmoothTarget: StrikeWeightDesignTarget | null;
  strikeWeightDesignLatestStandarTarget: StrikeWeightDesignTarget | null;
  strikeWeightRatioDesignMode: StrikeWeightRatioDesignMode | null;
  strikeWeightRatioDesignLatestFixedTarget: StrikeWeightRatioDesignTarget | null;
  strikeWeightRatioDesignLatestSmoothTarget: StrikeWeightRatioDesignTarget | null;
  strikeWeightRatioDesignTarget: StrikeWeightRatioDesignTarget | null;
  wippenSupportSpringsDesignLatestSpringBalanceWeight: number | null;
  wippenSupportSpringsDesignLatestNumberOfSprings: number | null;
  wippenSupportSpringsDesignLatestTensionDropIndex: number | null;
  wippenSupportSpringsDesignMode: WippenSupportSpringsDesignMode | null;
  wippenSupportSpringsDesignTarget: WippenSupportSpringsDesignTarget;
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
  updateWippenSupportSpringsDesign: (
    mode: WippenSupportSpringsDesignMode | null,
    target: WippenSupportSpringsDesignTarget,
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
        strikeWeightRatioDesignLatestSmoothTarget: null,
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
              mode === StrikeWeightRatioDesignMode.Smoothed &&
              target !== null
            ) {
              newState.strikeWeightRatioDesignLatestSmoothTarget = target;
            }
            if (
              mode === StrikeWeightRatioDesignMode.FixedValue &&
              target !== null
            ) {
              newState.strikeWeightRatioDesignLatestFixedTarget = target;
            }
            return newState;
          }),
        updateWippenSupportSpringsDesign: (
          mode: WippenSupportSpringsDesignMode | null,
          target: WippenSupportSpringsDesignTarget,
        ) =>
          set(() => {
            const newState: Partial<DesignStore> = {
              wippenSupportSpringsDesignMode: mode,
              wippenSupportSpringsDesignTarget: target,
            };
            const isConstantOrSmoothTransitionMode = [
              WippenSupportSpringsDesignMode.Constant,
              WippenSupportSpringsDesignMode.SmoothTransition,
            ].includes(mode!);
            const tensionDesign = target as WippenTensionDesign;

            if (
              isConstantOrSmoothTransitionMode &&
              tensionDesign?.numberOfSprings
            ) {
              newState.wippenSupportSpringsDesignLatestNumberOfSprings =
                tensionDesign.numberOfSprings;
            }

            if (
              isConstantOrSmoothTransitionMode &&
              tensionDesign?.springBalanceWeight
            ) {
              newState.wippenSupportSpringsDesignLatestSpringBalanceWeight =
                tensionDesign.springBalanceWeight;
            }

            if (
              mode === WippenSupportSpringsDesignMode.SmoothTransition &&
              tensionDesign?.tensionDropIndex
            ) {
              newState.wippenSupportSpringsDesignLatestTensionDropIndex =
                tensionDesign.tensionDropIndex;
            }

            return newState;
          }),
        version: 1,
        wippenSupportSpringsDesignLatestNumberOfSprings: null,
        wippenSupportSpringsDesignLatestSpringBalanceWeight: null,
        wippenSupportSpringsDesignLatestTensionDropIndex: null,
        wippenSupportSpringsDesignMode: WippenSupportSpringsDesignMode.None,
        wippenSupportSpringsDesignTarget: null,
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
          strikeWeightRatioDesignLatestSmoothTarget:
            state.strikeWeightRatioDesignLatestSmoothTarget,
          strikeWeightRatioDesignMode: state.strikeWeightRatioDesignMode,
          strikeWeightRatioDesignTarget: state.strikeWeightRatioDesignTarget,
          version: state.version,
          wippenSupportSpringsDesignLatestNumberOfSprings:
            state.wippenSupportSpringsDesignLatestNumberOfSprings,
          wippenSupportSpringsDesignLatestSpringBalanceWeight:
            state.wippenSupportSpringsDesignLatestSpringBalanceWeight,
          wippenSupportSpringsDesignLatestTensionDropIndex:
            state.wippenSupportSpringsDesignLatestTensionDropIndex,
          wippenSupportSpringsDesignMode: state.wippenSupportSpringsDesignMode,
          wippenSupportSpringsDesignTarget:
            state.wippenSupportSpringsDesignTarget,
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
      strikeWeightRatioDesignLatestSmoothTarget:
        state.strikeWeightRatioDesignLatestSmoothTarget,
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
      updateWippenSupportSpringsDesign: state.updateWippenSupportSpringsDesign,
    })),
  );
};

export const useWippenSupportSpringsDesign = (measureProfileName?: string) => {
  return useDesignStore(measureProfileName)(
    useShallow((state: DesignStore) => ({
      wippenSupportSpringsDesignLatestNumberOfSprings:
        state.wippenSupportSpringsDesignLatestNumberOfSprings,
      wippenSupportSpringsDesignLatestSpringBalanceWeight:
        state.wippenSupportSpringsDesignLatestSpringBalanceWeight,
      wippenSupportSpringsDesignLatestTensionDropIndex:
        state.wippenSupportSpringsDesignLatestTensionDropIndex,
      wippenSupportSpringsDesignMode: state.wippenSupportSpringsDesignMode,
      wippenSupportSpringsDesignTarget: state.wippenSupportSpringsDesignTarget,
    })),
  );
};
