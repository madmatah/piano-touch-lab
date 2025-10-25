import { Info } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { usePianoProfileState } from '@/hooks/store/use-piano-profile-store';
import { useNewProfileDialog } from '@/contexts/new-profile-dialog-context';
import { Trans } from 'react-i18next';
import { useCallback } from 'react';

export const DemoProfileInformationCard = () => {
  const { isDemoProfile } = usePianoProfileState();
  const { openNewProfileDialog } = useNewProfileDialog();

  const onCreateNewProfile = useCallback(() => {
    openNewProfileDialog();
  }, [openNewProfileDialog]);

  return isDemoProfile ? (
    <div className="max-w-5xl p-5 print:hidden">
      <Alert variant="info">
        <Info />
        <AlertDescription>
          <p>
            <Trans i18nKey="You are currently viewing an example piano, allowing you to easily explore all the features. Explore the charts and calculations at your own pace. When you're ready, <2>create a new profile</2> to enter your own measurements.">
              You are currently viewing an example piano, allowing you to easily
              explore all the features. Explore the charts and calculations at
              your own pace. When you're ready,{' '}
              <a
                className="font-semibold cursor-pointer hover:opacity-80"
                onClick={onCreateNewProfile}
              >
                create a new profile
              </a>{' '}
              to enter your own measurements.
            </Trans>
          </p>
        </AlertDescription>
      </Alert>
    </div>
  ) : null;
};
