import { ArrowRight, Github, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Trans } from 'react-i18next';

import { BalanceWeightFigure } from '../home/BalanceWeightFigure';
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
  useAutoloadDemoData();

  const steps = [
    {
      description: t(
        'Down weight, up weight, front weight and strike weight, key by key. Support springs and non-standard keyboards are handled.',
      ),
      number: '01',
      title: t('Measure', { ns: 'navigation' }),
    },
    {
      description: t(
        'Enter your measurements and explore the charts to spot irregularities in your action.',
      ),
      number: '02',
      title: t('Analyze', { ns: 'navigation' }),
    },
    {
      description: t(
        'Adjust the parameters in interactive charts, see their effect on the touch at once, and build your ideal keyboard step by step.',
      ),
      number: '03',
      title: t('Design', { ns: 'navigation' }),
    },
    {
      description: t(
        'Print a worksheet from your design, so every adjustment figure is at hand in your workshop.',
      ),
      number: '04',
      title: t('Regulate'),
    },
  ];

  const extras = [
    {
      description: t(
        'Compute the ideal weight of your keys or your hammers from the balance weight you are aiming for.',
      ),
      number: 'A.1',
      title: t('Balance weight targeting'),
    },
    {
      description: t(
        'If your wippens carry support springs, work them into your design to reduce the lead needed in the keys.',
      ),
      number: 'A.2',
      title: t('Wippen Support Springs', { ns: 'navigation' }),
    },
    {
      description: t(
        'No account is required, all your data is stored locally in your browser and never leaves your computer.',
      ),
      number: 'A.3',
      title: t('Free and respectful of your privacy'),
    },
  ];

  return (
    <MainLayout variant="bare" shouldDisplayDemoBanner={false}>
      <section className="flex flex-col items-center gap-6 border-b border-border bg-[radial-gradient(70%_80%_at_50%_0%,var(--card)_0%,transparent_70%)] px-12 pt-[84px] text-center max-md:px-4 max-md:pt-12">
        <span className="ptl-label text-ptl-brass">
          {t('Open source toolkit · after David C. Stanwood')}
        </span>
        <h1 className="m-0 font-serif text-[clamp(58px,8.6vw,128px)] leading-[0.95] font-medium tracking-[-0.01em]">
          Piano Touch <span className="ptl-accent">Lab</span>
        </h1>
        <p className="m-0 max-w-[28ch] text-[clamp(20px,2.2vw,27px)] leading-[1.35] font-serif italic text-muted-foreground text-balance">
          {t('A toolkit for grand piano action balancing')}
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-1">
          <Button asChild size="lg">
            <Link to="/piano">
              {t('Explore the demonstration piano')}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            variant="outlineStrong"
            size="lg"
            onClick={openNewProfileDialog}
          >
            <Plus className="size-4" />
            {t('Create a piano profile')}
          </Button>
        </div>
        <span className="font-mono text-xs text-ptl-ink-3">
          {t('Free · no account · your data stays in your browser')}
        </span>

        <BalanceWeightFigure
          caption={
            displayName
              ? t('The balance weight of the {{piano}}, taken key by key.', {
                  piano: displayName,
                })
              : t(
                  'The balance weight of the demonstration piano, taken key by key.',
                )
          }
          description={t(
            'The balance weight of the demonstration piano, key by key, above an 88-key keyboard',
          )}
        />
      </section>

      <section className="border-b border-border px-12 py-20 max-md:px-4 max-md:py-12">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-8">
          <div className="flex flex-col gap-2.5">
            <span className="ptl-label">{t('From measurement to bench')}</span>
            <h2 className="m-0 font-serif text-[clamp(34px,4vw,50px)] leading-[1.05] font-medium">
              <Trans i18nKey="Four <1>steps</1>">
                Four <em className="ptl-accent">steps</em>
              </Trans>
            </h2>
          </div>
          <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(230px,100%),1fr))] overflow-hidden rounded-md border border-ptl-rule-strong border-r-0 p-0">
            {steps.map((step) => (
              <li
                key={step.number}
                className="flex flex-col gap-3 border-r border-border bg-card px-[22px] pt-6 pb-7"
              >
                <span className="font-mono text-[13px] font-semibold text-ptl-brass">
                  {step.number}
                </span>
                <h3 className="m-0 font-serif text-[28px] leading-[1.1] font-medium">
                  {step.title}
                </h3>
                <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-border px-12 py-[72px] max-md:px-4 max-md:py-12">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-4">
          <span className="ptl-label">{t('Also in the toolkit')}</span>
          <div>
            {extras.map((extra, index) => (
              <div
                key={extra.number}
                className={`grid grid-cols-[52px_minmax(180px,300px)_minmax(0,1fr)] items-baseline gap-x-6 gap-y-2 border-t border-border py-[22px] max-[760px]:grid-cols-[40px_minmax(0,1fr)] ${
                  index === extras.length - 1 ? 'border-b' : ''
                }`}
              >
                <span className="font-mono text-[13px] text-ptl-brass">
                  {extra.number}
                </span>
                <h3 className="m-0 font-serif text-[23px] leading-[1.15] font-medium">
                  {extra.title}
                </h3>
                <p className="m-0 max-w-[60ch] text-[15px] leading-[1.6] text-muted-foreground max-[760px]:col-start-2">
                  {extra.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
