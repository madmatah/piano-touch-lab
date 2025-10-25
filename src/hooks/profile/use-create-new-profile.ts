import { useCallback } from 'react';
import { usePianoProfileActions } from '@/hooks/store/use-piano-profile-store';
import { useMeasureActions } from '@/hooks/store/use-measure-store';
import { useDesignActions } from '@/hooks/store/use-design-store';
import { useMeasureOptionsActions } from '@/hooks/store/use-measure-options-store';

export const useCreateNewProfile = () => {
  const { reset: resetPianoProfile, updateSingleState } =
    usePianoProfileActions();
  const { reset: resetMeasures } = useMeasureActions();
  const { reset: resetDesign } = useDesignActions();
  const { reset: resetMeasureOptions } = useMeasureOptionsActions();

  const createNewProfile = useCallback(
    (pianoBrand: string, pianoModel: string, onSuccess?: () => void) => {
      resetPianoProfile();
      resetMeasures();
      resetDesign();
      resetMeasureOptions();

      if (pianoBrand.trim()) {
        updateSingleState('brand', pianoBrand.trim());
      }
      if (pianoModel.trim()) {
        updateSingleState('model', pianoModel.trim());
      }

      onSuccess?.();
    },
    [
      resetPianoProfile,
      resetMeasures,
      resetDesign,
      resetMeasureOptions,
      updateSingleState,
    ],
  );

  return { createNewProfile };
};
