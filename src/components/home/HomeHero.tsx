import { ArrowRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';

import type { HomeState } from './use-home-state';

/**
 * The top of the home page: who the instrument on screen belongs to, and the
 * one thing left to do with it.
 *
 * On a first visit the demonstration piano is already loaded, so its button
 * opens it rather than loading it again. Once someone has their own profile,
 * the main button carries them on from wherever they stopped, and the demo
 * steps back to a link — loading it would overwrite their piano.
 */
export const HomeHero = ({
  home,
  onCreateProfile,
  onLoadDemo,
}: {
  home: HomeState;
  onCreateProfile: () => void;
  onLoadDemo: () => void;
}) => {
  const { t } = useTranslation();

  const resumeLabel = {
    demo: t('Explore the demonstration piano'),
    designed: t('View the adjustment sheet'),
    measured: t('Set my target'),
    measuring: t('Resume the measurements'),
  }[home.stage];

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h1 className="m-0 font-serif text-[clamp(58px,8.6vw,128px)] leading-[0.95] font-medium tracking-[-0.01em]">
        Piano Touch <span className="ptl-accent">Lab</span>
      </h1>
      <p className="m-0 max-w-[30ch] text-[clamp(20px,2.2vw,27px)] leading-[1.35] font-serif italic text-muted-foreground text-balance">
        {t('A toolkit for grand piano action balancing')}
      </p>

      <div className="flex flex-col items-center gap-4 pt-2.5">
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link to={home.resumeTo}>
              {resumeLabel}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button variant="outlineStrong" size="lg" onClick={onCreateProfile}>
            <Plus className="size-4" />
            {home.stage === 'demo'
              ? t('Create a piano profile')
              : t('New Profile', { ns: 'navigation' })}
          </Button>
        </div>
        {home.stage === 'demo' ? (
          <span className="font-mono text-xs text-ptl-ink-3">
            {t('Free · no account · your data stays in your browser')}
          </span>
        ) : (
          <span className="text-sm text-ptl-ink-3">
            {t('Want to see the example again?')}{' '}
            <button
              type="button"
              onClick={onLoadDemo}
              className="ptl-link font-semibold"
            >
              {t('Load the demonstration piano…')}
            </button>
          </span>
        )}
      </div>
    </div>
  );
};
