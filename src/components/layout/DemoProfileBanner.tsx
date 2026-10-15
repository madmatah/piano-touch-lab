import { useCallback } from 'react';

import { useNewProfileDialog } from '@/contexts/new-profile-dialog-context';
import { usePianoProfileState } from '@/hooks/store/use-piano-profile-store';
import { useTranslation } from '@/hooks/use-translation';

/**
 * The hatched strip that says the instrument on screen is not the reader's.
 *
 * Full width under the header rather than a card inside the page: it is a
 * property of the whole session, not of the page being read.
 */
export const DemoProfileBanner = () => {
  const { t } = useTranslation();
  const { isDemoProfile } = usePianoProfileState();
  const { openNewProfileDialog } = useNewProfileDialog();

  const onCreateNewProfile = useCallback(() => {
    openNewProfileDialog();
  }, [openNewProfileDialog]);

  if (!isDemoProfile) {
    return null;
  }

  return (
    <div
      data-slot="demo-banner"
      className="ptl-demo-banner flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border px-10 py-2.5 text-[13.5px] max-md:px-4 print:hidden"
    >
      <span className="font-serif text-[17px] italic text-ptl-brass">
        {t('Demo piano')}
      </span>
      <span className="flex-[1_1_320px] text-muted-foreground">
        {t(
          'You are currently viewing an example piano, so you can explore every feature freely.',
        )}
      </span>
      <button
        type="button"
        onClick={onCreateNewProfile}
        className="cursor-pointer font-semibold text-ptl-brass transition-colors hover:text-foreground"
      >
        {t('Create a new piano profile')} <span aria-hidden="true">→</span>
      </button>
    </div>
  );
};
