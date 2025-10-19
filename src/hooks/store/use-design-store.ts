import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useShallow } from 'zustand/shallow';
import {
  StrikeWeightDesignMode,
  type StrikeWeightDesignTarget,
} from '@/components/design/strike-weight/StrikeWeightDesign.types';
import {
  FrontWeightDesignMode,
  type FrontWeightDesignTarget,
} from '@/components/design/front-weight/FrontWeightDesign.types';
import {
  StrikeWeightRatioDesignMode,
  type StrikeWeightRatioDesignTarget,
} from '@/components/design/strike-weight-ratio/StrikeWeightRatioDesign.types';
import {
  WippenSupportSpringsDesignMode,
  type WippenSupportSpringsDesignTarget,
  type WippenTensionDesign,
} from '@/components/design/wippen-support-springs/WippenSupportSpringsDesign.types';
import { SmoothStrategy } from '@/lib/geometry/curve-smoother/smooth-strategy.enum';
import { StrikeWeightLevel } from '@/lib/piano/touch-design/hammer-weight-level';

export interface DesignStoreState {
  frontWeightDesignMode: FrontWeightDesignMode | null;
  frontWeightDesignStandardTarget: FrontWeightDesignTarget | null;
  frontWeightDesignComputedBalanceWeightTarget: number | null;
  frontWeightDesignTarget: FrontWeightDesignTarget | null;
  strikeWeightDesignMode: StrikeWeightDesignMode | null;
  strikeWeightDesignTarget: StrikeWeightDesignTarget | null;
  strikeWeightDesignComputedBalanceWeightTarget: number | null;
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
  updateFrontWeightDesign: (
    mode: FrontWeightDesignMode | null,
    target: FrontWeightDesignTarget | null,
  ) => void;
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
        frontWeightDesignComputedBalanceWeightTarget: 38,
        frontWeightDesignMode: FrontWeightDesignMode.AsMeasured,
        frontWeightDesignStandardTarget: 7,
        frontWeightDesignTarget: null,
        strikeWeightDesignComputedBalanceWeightTarget: 38,
        strikeWeightDesignLatestSmoothTarget:
          SmoothStrategy.LeastSquaresRegression,
        strikeWeightDesignLatestStandarTarget: StrikeWeightLevel.Level7,
        strikeWeightDesignMode: StrikeWeightDesignMode.AsMeasured,
        strikeWeightDesignTarget: null,
        strikeWeightRatioDesignLatestFixedTarget: 5.5,
        strikeWeightRatioDesignLatestSmoothTarget: SmoothStrategy.Median,
        strikeWeightRatioDesignMode: StrikeWeightRatioDesignMode.AsMeasured,
        strikeWeightRatioDesignTarget: null,
        updateFrontWeightDesign: (
          mode: FrontWeightDesignMode | null,
          target: FrontWeightDesignTarget | null,
        ) =>
          set(() => {
            const newState: Partial<DesignStore> = {
              frontWeightDesignMode: mode,
              frontWeightDesignTarget: target,
            };

            if (
              mode === FrontWeightDesignMode.StandardCurves &&
              target !== null
            ) {
              newState.frontWeightDesignStandardTarget = target;
            }

            if (mode === FrontWeightDesignMode.Computed && target !== null) {
              newState.frontWeightDesignComputedBalanceWeightTarget = target;
            }

            return newState;
          }),
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
            if (
              mode === StrikeWeightDesignMode.Computed &&
              target !== null &&
              !isNaN(Number(target))
            ) {
              newState.strikeWeightDesignComputedBalanceWeightTarget =
                Number(target);
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
        wippenSupportSpringsDesignLatestNumberOfSprings: 60,
        wippenSupportSpringsDesignLatestSpringBalanceWeight: 9,
        wippenSupportSpringsDesignLatestTensionDropIndex: 20,
        wippenSupportSpringsDesignMode: WippenSupportSpringsDesignMode.None,
        wippenSupportSpringsDesignTarget: null,
      }),
      {
        name: `piano-touch.design.${measureProfileName}`,
        partialize: (state: DesignStore): VersionedDesignStoreState => ({
          frontWeightDesignComputedBalanceWeightTarget:
            state.frontWeightDesignComputedBalanceWeightTarget,
          frontWeightDesignMode: state.frontWeightDesignMode,
          frontWeightDesignStandardTarget:
            state.frontWeightDesignStandardTarget,
          frontWeightDesignTarget: state.frontWeightDesignTarget,
          strikeWeightDesignComputedBalanceWeightTarget:
            state.strikeWeightDesignComputedBalanceWeightTarget,
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
  measureProfileName = 'default',
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
      frontWeightDesignComputedBalanceWeightTarget:
        state.frontWeightDesignComputedBalanceWeightTarget,
      frontWeightDesignMode: state.frontWeightDesignMode,
      frontWeightDesignStandardTarget: state.frontWeightDesignStandardTarget,
      frontWeightDesignTarget: state.frontWeightDesignTarget,
    })),
  );
};

export const useStrikeWeightDesign = (measureProfileName?: string) => {
  return useDesignStore(measureProfileName)(
    useShallow((state: DesignStore) => ({
      strikeWeightDesignComputedBalanceWeightTarget:
        state.strikeWeightDesignComputedBalanceWeightTarget,
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
