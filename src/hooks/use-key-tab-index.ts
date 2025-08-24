import type { KeyMeasureRequirements } from '@/lib/piano/touch-design/measure-requirements';
import { keyboardLength } from '@/lib/constants';

type KeyProperty = keyof KeyMeasureRequirements;

export const useKeyTabIndex = (
  keyIndex: number,
  tabGroups: Array<Array<KeyProperty>>,
) => {
  const orderedProperties: Array<KeyProperty> = tabGroups.flat();

  const getTabIndexFor = (property: KeyProperty) => {
    for (let groupIndex = 0; groupIndex < tabGroups.length; groupIndex++) {
      const group = tabGroups[groupIndex]!;
      const propertyIndexInGroup = group.indexOf(property);
      if (propertyIndexInGroup >= 0) {
        const baseIndex = groupIndex * keyboardLength + keyIndex;
        const additionalOffset = groupIndex > 0 ? 1 : 0;
        return 1 + baseIndex + propertyIndexInGroup + additionalOffset;
      }
    }
    return undefined;
  };

  return { getTabIndexFor, orderedProperties };
};
