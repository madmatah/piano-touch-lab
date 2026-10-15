import { useEffect, useRef } from 'react';
import { useLoadDemoData } from './use-load-demo-data';
import { useAppState, useAppStateActions } from '../store/use-app-state-store';
import { useMeasuredKeyCount } from '../keyboard/use-measured-key-count';
import { usePianoProfileState } from '../store/use-piano-profile-store';
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
  const { brand, isDemoProfile, model } = usePianoProfileState();
  const { measured } = useMeasuredKeyCount();
  const logger = useLogger();
  const hasExecuted = useRef<boolean>(false);
  const hasOwnProfile =
    !isDemoProfile && (brand !== null || model !== null || measured > 0);

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
