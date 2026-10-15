import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import {
  locateInNavigation,
  type NavigationStep,
} from '@/components/navigation/app-navigation';
import { usePianoProfileState } from '@/hooks/store/use-piano-profile-store';
import { useTranslation } from '@/hooks/use-translation';

const APPLICATION = 'Piano Touch Lab';

/**
 * The title of a page: which page, of which piano, in which application.
 *
 * Browsers name a page saved as PDF after it, and print it in the header of
 * a sheet when asked to; the history and the tabs list it too. "Piano Touch
 * Lab" on every page told none of them apart.
 */
export const documentTitle = (
  page: string | null,
  piano: string | null,
): string =>
  [page, piano, APPLICATION]
    .filter((part) => part !== null && part !== '')
    .join(' — ');

export const useDocumentTitle = (steps: NavigationStep[]) => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { displayName } = usePianoProfileState();

  useEffect(() => {
    const { link, step } = locateInNavigation(steps, pathname);
    const page =
      pathname === '/help'
        ? t('Help', { ns: 'navigation' })
        : (link?.label ?? step?.label ?? null);
    document.title = documentTitle(page, page === null ? null : displayName);
  }, [displayName, pathname, steps, t]);
};
