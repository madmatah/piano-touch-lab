import { Github } from 'lucide-react';
import { useState } from 'react';
import { Trans } from 'react-i18next';

import { BalanceWeightFigure } from '../home/BalanceWeightFigure';
import { HomeFeatures } from '../home/HomeFeatures';
import { HomeHero } from '../home/HomeHero';
import { LoadDemoDialog } from '../home/LoadDemoDialog';
import { useHomeState } from '../home/use-home-state';
import { MainLayout } from '../MainLayout';
import { Button } from '@/components/ui/button';
import { useNewProfileDialog } from '@/contexts/new-profile-dialog-context';
import { useAutoloadDemoData } from '@/hooks/demo/use-autoload-demo-data';
import { usePianoProfileState } from '@/hooks/store/use-piano-profile-store';
import { useTranslation } from '@/hooks/use-translation';

export const Homepage = () => {
  const { t } = useTranslation();
  const { displayName } = usePianoProfileState();
  const { openNewProfileDialog } = useNewProfileDialog();
  const [isDemoDialogOpen, setIsDemoDialogOpen] = useState(false);
  const home = useHomeState();
  useAutoloadDemoData();

  return (
    <MainLayout variant="bare" shouldDisplayDemoBanner={false}>
      <section className="flex flex-col items-center gap-6 border-b border-border bg-[radial-gradient(70%_80%_at_50%_0%,var(--card)_0%,transparent_70%)] px-12 pt-[104px] max-md:px-4 max-md:pt-12">
        <HomeHero
          home={home}
          onCreateProfile={openNewProfileDialog}
          onLoadDemo={() => setIsDemoDialogOpen(true)}
        />
        <BalanceWeightFigure
          home={home}
          description={
            home.stage === 'demo'
              ? t('Balance weight · demonstration piano')
              : t('Balance weight · your {{piano}}', { piano: displayName })
          }
        />
      </section>

      <LoadDemoDialog
        isOpen={isDemoDialogOpen}
        measured={home.measured}
        onOpenChange={setIsDemoDialogOpen}
        total={home.total}
      />

      <HomeFeatures />

      <section className="px-12 pt-20 pb-16 max-md:px-4 max-md:py-12">
        <aside className="mx-auto flex max-w-[760px] flex-col items-center gap-4 text-center">
          <span className="flex w-full items-center gap-3.5">
            <span className="h-px flex-1 bg-input" />
            <span className="ptl-label text-ptl-brass">{t('Warning')}</span>
            <span className="h-px flex-1 bg-input" />
          </span>
          <p className="m-0 font-serif text-[clamp(20px,2vw,26px)] leading-[1.45] italic">
            {t(
              'Piano Touch Lab is a toolbox, not a magic wand. It provides the tools for measurement, analysis and calculation, but it is no substitute for the judgement of a trained technician.',
            )}
          </p>
          <p className="m-0 text-[15px] text-muted-foreground">
            {t(
              'It assists technicians in their design decisions; it does not make them for them.',
            )}
          </p>
        </aside>
      </section>

      <section className="px-12 pb-24 max-md:px-4 max-md:pb-16">
        <div className="mx-auto flex max-w-[1120px] flex-wrap gap-10 border-t border-border pt-14">
          <h2 className="m-0 flex-[1_1_260px] font-serif text-[42px] leading-[1.05] font-medium">
            <Trans i18nKey="About <1>this project</1>">
              About <em className="ptl-accent">this project</em>
            </Trans>
          </h2>
          <div className="flex flex-[2_1_420px] flex-col gap-4">
            <p className="m-0 text-[16.5px] leading-[1.75] text-muted-foreground">
              {t(
                'Piano Touch Lab was born where two enthusiasms meet: the piano and software. Curious to understand the mechanics of the instrument, I set out to explore the principles behind its geometry and its touch. That search led me to the work of David C. Stanwood, whose “Equation of Balance” and “New Touch Weight Metrology” shaped much of my thinking.',
              )}
            </p>
            <p className="m-0 text-[16.5px] leading-[1.75] text-muted-foreground">
              {t(
                'What began as a personal learning tool gradually became an application in its own right, shared as open source.',
              )}
            </p>
            <Button asChild variant="outlineStrong" className="self-start">
              <a
                href="https://github.com/madmatah/piano-touch-lab"
                target="_blank"
                rel="noreferrer"
              >
                <Github className="size-4" />
                {t('View on GitHub')}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};
