import {
  KeyboardContext,
  type KeyboardContextValue,
} from '@/contexts/keyboard-context';
import { useContext } from 'react';

export const useKeyboard = (): KeyboardContextValue => {
  const context = useContext(KeyboardContext);
  if (context === undefined) {
    throw new Error('useKeyboard must be used within a KeyboardProvider');
  }

  return context;
};
