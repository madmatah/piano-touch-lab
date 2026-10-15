import { useContext } from 'react';

import {
  KeyboardAnalysisContext,
  type KeyboardAnalysisContextValue,
} from '@/contexts/keyboard-analysis-context';

export const useKeyboardAnalysis = (): KeyboardAnalysisContextValue => {
  const context = useContext(KeyboardAnalysisContext);
  if (context === undefined) {
    throw new Error(
      'useKeyboardAnalysis must be used within a KeyboardAnalysisProvider',
    );
  }

  return context;
};
