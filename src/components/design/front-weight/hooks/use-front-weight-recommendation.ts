import { useEffect, useRef } from 'react';

import {
  FrontWeightDesignMode,
  type FrontWeightDesignTarget,
} from '../FrontWeightDesign.types';

export const useFrontWeightRecommendation = (
  frontWeightDesignMode: FrontWeightDesignMode | null,
  frontWeightDesignTarget: FrontWeightDesignTarget | null,
  setFrontWeightDesign: (
    mode: FrontWeightDesignMode,
    target: FrontWeightDesignTarget,
  ) => void,
) => {
  const isFirstRender = useRef<boolean>(true);

  useEffect(() => {
    if (isFirstRender.current) {
      if (frontWeightDesignTarget === null && frontWeightDesignMode === null) {
        setFrontWeightDesign(FrontWeightDesignMode.AsMeasured, null);
      }
      isFirstRender.current = false;
    }
  }, [
    frontWeightDesignMode,
    frontWeightDesignTarget,
    isFirstRender,
    setFrontWeightDesign,
  ]);
};
