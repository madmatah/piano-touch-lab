import { useEffect, useRef } from 'react';
import { useLoadDemoData } from './use-load-demo-data';
import { useAppState, useAppStateActions } from '../store/use-app-state-store';
import { useLogger } from '../use-logger';

export const useAutoloadDemoData = () => {
  const { hasLoadedDemoData } = useAppState();
  const { updateSingleState } = useAppStateActions();
  const { loadDemoData } = useLoadDemoData();
  const logger = useLogger();
  const hasExecuted = useRef<boolean>(false);

  useEffect(() => {
    if (!hasLoadedDemoData && !hasExecuted.current) {
      hasExecuted.current = true;
      try {
        loadDemoData();
        updateSingleState('hasLoadedDemoData', true);
      } catch (error) {
        logger.warn('Failed to load demo data', error);
      }
    }
  }, [hasLoadedDemoData, loadDemoData, logger, updateSingleState]);

  return { hasLoadedDemoData };
};
