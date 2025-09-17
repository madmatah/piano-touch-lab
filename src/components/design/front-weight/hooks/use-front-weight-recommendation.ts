import { useEffect, useState } from 'react';

import type { FrontWeightDesignTarget } from '../FrontWeightDesign.types';

export const useFrontWeightRecommendation = (
  frontWeightDesignTarget: FrontWeightDesignTarget | null,
  setFrontWeightDesign: (target: FrontWeightDesignTarget) => void,
) => {
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if (isFirstRender) {
      if (frontWeightDesignTarget === null) {
        setFrontWeightDesign(7);
      }
      setIsFirstRender(false);
    }
  }, [frontWeightDesignTarget, isFirstRender, setFrontWeightDesign]);
};
