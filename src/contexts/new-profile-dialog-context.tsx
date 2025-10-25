import { createContext, useContext, type ReactNode } from 'react';

interface NewProfileDialogContextType {
  openNewProfileDialog: () => void;
}

const NewProfileDialogContext = createContext<
  NewProfileDialogContextType | undefined
>(undefined);

interface NewProfileDialogProviderProps {
  children: ReactNode;
  onOpenChange: (open: boolean) => void;
}

export const NewProfileDialogProvider = ({
  children,
  onOpenChange,
}: NewProfileDialogProviderProps) => {
  const openNewProfileDialog = () => {
    onOpenChange(true);
  };

  return (
    <NewProfileDialogContext.Provider value={{ openNewProfileDialog }}>
      {children}
    </NewProfileDialogContext.Provider>
  );
};

export const useNewProfileDialog = () => {
  const context = useContext(NewProfileDialogContext);
  if (context === undefined) {
    throw new Error(
      'useNewProfileDialog must be used within a NewProfileDialogProvider',
    );
  }
  return context;
};
