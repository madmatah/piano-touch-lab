import './index.css';

import { Provider } from 'inversify-react';
import { useState } from 'react';

import { BrowserRouter } from 'react-router-dom';

import { container } from './app-container';
import { KeyboardProvider } from './contexts/keyboard-context';
import { NewProfileDialogProvider } from './contexts/new-profile-dialog-context';
import { NewProfileDialog } from './components/new-profile/NewProfileDialog';
import { AppRouter } from './components/AppRouter';
import { useCreateNewProfileUseCase } from './hooks/profile/use-create-new-profile-use-case';
import { Toaster } from './components/ui/sonner';

const AppContent = ({
  isNewProfileDialogOpen,
  setIsNewProfileDialogOpen,
}: {
  isNewProfileDialogOpen: boolean;
  setIsNewProfileDialogOpen: (open: boolean) => void;
}) => {
  const { handleCreateNewProfile } = useCreateNewProfileUseCase();

  return (
    <>
      <AppRouter />
      <Toaster position="top-center" richColors />
      <NewProfileDialog
        isOpen={isNewProfileDialogOpen}
        onOpenChange={setIsNewProfileDialogOpen}
        onConfirm={handleCreateNewProfile}
      />
    </>
  );
};

export const App = () => {
  const [isNewProfileDialogOpen, setIsNewProfileDialogOpen] = useState(false);

  return (
    <Provider container={container}>
      <KeyboardProvider>
        <NewProfileDialogProvider onOpenChange={setIsNewProfileDialogOpen}>
          <BrowserRouter>
            <AppContent
              isNewProfileDialogOpen={isNewProfileDialogOpen}
              setIsNewProfileDialogOpen={setIsNewProfileDialogOpen}
            />
          </BrowserRouter>
        </NewProfileDialogProvider>
      </KeyboardProvider>
    </Provider>
  );
};
