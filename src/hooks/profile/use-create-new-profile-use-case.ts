import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateNewProfile } from './use-create-new-profile';

export const useCreateNewProfileUseCase = () => {
  const navigate = useNavigate();
  const { createNewProfile } = useCreateNewProfile();

  const handleCreateNewProfile = useCallback(
    (brand: string, model: string) => {
      createNewProfile(brand, model, () => {
        void navigate('/piano');
      });
    },
    [createNewProfile, navigate],
  );

  return { handleCreateNewProfile };
};
