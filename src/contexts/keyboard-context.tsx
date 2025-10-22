import { createContext, useMemo, type ReactNode } from 'react';
import {
  Standard88Layout,
  type KeyboardLayoutRequirements,
  type KeyboardRequirements,
} from '@/lib/piano/keyboard';
import { KeyboardFactory } from '@/lib/piano/keyboard/keyboard-factory';
import { usePianoProfileState } from '@/hooks/store/use-piano-profile-store';

export interface KeyboardContextValue {
  keyboard: KeyboardRequirements;
  layout: KeyboardLayoutRequirements;
}

export const KeyboardContext = createContext<KeyboardContextValue | undefined>(
  undefined,
);

interface KeyboardProviderProps {
  children: ReactNode;
}

export const KeyboardProvider = ({ children }: KeyboardProviderProps) => {
  const pianoProfile = usePianoProfileState();

  const layout = useMemo(() => {
    if (pianoProfile.startNote) {
      return {
        length: pianoProfile.keyCount,
        startNote: pianoProfile.startNote,
      };
    }

    return Standard88Layout;
  }, [pianoProfile.startNote, pianoProfile.keyCount]);

  const keyboard = useMemo(() => KeyboardFactory.fromLayout(layout), [layout]);

  const value: KeyboardContextValue = {
    keyboard,
    layout,
  };

  return (
    <KeyboardContext.Provider value={value}>
      {children}
    </KeyboardContext.Provider>
  );
};
