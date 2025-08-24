import { createContext, useMemo, useState, type ReactNode } from 'react';
import {
  Standard88Layout,
  type KeyboardLayoutRequirements,
  type KeyboardRequirements,
} from '@/lib/piano/keyboard';
import { KeyboardFactory } from '@/lib/piano/keyboard/keyboard-factory';

export interface KeyboardContextValue {
  keyboard: KeyboardRequirements;
  layout: KeyboardLayoutRequirements;
  setLayout: (layout: KeyboardLayoutRequirements) => void;
}

export const KeyboardContext = createContext<KeyboardContextValue | undefined>(
  undefined,
);

interface KeyboardProviderProps {
  children: ReactNode;
}

export const KeyboardProvider = ({ children }: KeyboardProviderProps) => {
  const [layout, setLayout] =
    useState<KeyboardLayoutRequirements>(Standard88Layout);

  const keyboard = useMemo(() => KeyboardFactory.fromLayout(layout), [layout]);

  const value: KeyboardContextValue = {
    keyboard,
    layout,
    setLayout,
  };

  return (
    <KeyboardContext.Provider value={value}>
      {children}
    </KeyboardContext.Provider>
  );
};
