import { useEffect, useState } from 'react';

import type { FrontWeightDesignTarget } from '../FrontWeightDesign.types';
import { FrontWeightLevel } from '@/lib/piano/touch-design/front-weight-level';

export const useFrontWeightRecommendation = (
  frontWeightDesignTarget: FrontWeightDesignTarget | null,
  setFrontWeightDesign: (target: FrontWeightDesignTarget) => void,
) => {
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if (isFirstRender) {
      if (frontWeightDesignTarget === null) {
        setFrontWeightDesign(FrontWeightLevel.Level5);
      }
      setIsFirstRender(false);
    }
  }, [frontWeightDesignTarget, isFirstRender, setFrontWeightDesign]);
};
