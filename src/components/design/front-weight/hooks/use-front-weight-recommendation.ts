import { useEffect, useRef } from 'react';

import type { FrontWeightDesignTarget } from '../FrontWeightDesign.types';

export const useFrontWeightRecommendation = (
  frontWeightDesignTarget: FrontWeightDesignTarget | null,
  setFrontWeightDesign: (target: FrontWeightDesignTarget) => void,
) => {
  const isFirstRender = useRef<boolean>(true);

  useEffect(() => {
    if (isFirstRender.current) {
      if (frontWeightDesignTarget === null) {
        setFrontWeightDesign(7);
      }
      isFirstRender.current = false;
    }
  }, [frontWeightDesignTarget, isFirstRender, setFrontWeightDesign]);
};
