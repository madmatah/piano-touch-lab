import { useEffect, useRef } from 'react';
import { useLoadDemoData } from './use-load-demo-data';
import { useAppState, useAppStateActions } from '../store/use-app-state-store';
import { usePianoProfileState } from '../store/use-piano-profile-store';
import {
  useMeasuresStore,
  type MeasuresStore,
} from '../store/use-measure-store';
import { useShallow } from 'zustand/shallow';
import { useLogger } from '../use-logger';

/**
 * Loads the demonstration piano on a first visit, and only then.
 *
 * The application keeps one profile at a time, so this must never run over
 * someone's own instrument: a profile that has been named or measured is
 * theirs, whatever the flag says, and the demo is theirs to load from the
 * home page if they want it.
 */
export const useAutoloadDemoData = () => {
  const { hasLoadedDemoData } = useAppState();
  const { updateSingleState } = useAppStateActions();
  const { loadDemoData } = useLoadDemoData();
  const { brand, isDemoProfile, model, serialNumber } = usePianoProfileState();
  const measures = useMeasuresStore()(
    useShallow((state: MeasuresStore) => state.keys),
  );
  const logger = useLogger();
  const hasExecuted = useRef<boolean>(false);
  // Any reading at all, on any quantity: the measuring passes are filled
  // independently, so counting only the keys that carry a down and an up
  // weight would miss someone who weighed eighty-eight hammers first.
  const hasOwnProfile =
    !isDemoProfile &&
    (brand !== null ||
      model !== null ||
      serialNumber !== null ||
      measures.some((key) =>
        Object.values(key).some((value) => value !== null),
      ));

  useEffect(() => {
    if (!hasLoadedDemoData && !hasOwnProfile && !hasExecuted.current) {
      hasExecuted.current = true;
      try {
        loadDemoData();
        updateSingleState('hasLoadedDemoData', true);
      } catch (error) {
        logger.warn('Failed to load demo data', error);
      }
    }
  }, [
    hasLoadedDemoData,
    hasOwnProfile,
    loadDemoData,
    logger,
    updateSingleState,
  ]);

  return { hasLoadedDemoData };
};
