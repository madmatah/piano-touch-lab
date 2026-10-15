import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Trans } from 'react-i18next';

import { formatWholeGrams } from '@/lib/format/format-weight';
import { useTranslation } from '@/hooks/use-translation';

import { AdjustmentSheetPreview } from './figures/AdjustmentSheetPreview';
import { DEMO_DESIGN, DEMO_PIANO_NAME } from './figures/demo-sample';
import { FrontWeightPreview } from './figures/FrontWeightPreview';
import { SpringsPreview } from './figures/SpringsPreview';
import { StaticBalancePreview } from './figures/StaticBalancePreview';
import { StrikeWeightPreview } from './figures/StrikeWeightPreview';

/**
 * The panel every card opens with: a fixed band of the page colour, so the six
 * figures line up whatever they are made of.
 */
const FigurePanel = ({
  children,
  header,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
}) => (
  <figure className="m-0 flex h-[200px] flex-col gap-1.5 border-b border-border bg-background px-4 pt-3.5 pb-3">
    <figcaption className="flex min-h-4 items-center justify-between gap-2">
      {header}
    </figcaption>
    {children}
  </figure>
);

const FigureCard = ({
  description,
  figure,
  header,
  linkLabel,
  section,
  title,
  to,
}: {
  description: string;
  figure: React.ReactNode;
  header: React.ReactNode;
  /** The page the card opens, named as the sidebar names it. */
  linkLabel: string;
  section: string;
  title: React.ReactNode;
  to: string;
}) => {
  return (
    <article className="flex flex-col overflow-hidden rounded border border-border bg-card">
      <FigurePanel header={header}>{figure}</FigurePanel>
      <div className="flex flex-1 flex-col gap-2.5 px-6 pt-[22px] pb-6">
        <h3 className="m-0 font-serif text-[26px] leading-[1.1] font-medium">
          {title}
        </h3>
        <p className="m-0 flex-1 text-[15px] leading-[1.6] text-muted-foreground">
          {description}
        </p>
        <Link
          to={to}
          className="ptl-link inline-flex items-center gap-1.5 pt-2 text-[14px] font-semibold"
        >
          <span className="ptl-label text-ptl-ink-3">{section} ›</span>
          {linkLabel}
          <ArrowRight className="size-[15px]" />
        </Link>
      </div>
    </article>
  );
};

const FigureLabel = ({ number }: { number: string }) => (
  <span className="ptl-label">{`Fig. ${number}`}</span>
);

/** The small monospaced caption a figure carries at its top right. */
const FigureNote = ({ children }: { children: React.ReactNode }) => (
  <span className="truncate font-mono text-[10px] text-ptl-ink-3">
    {children}
  </span>
);

/** A series name beside the swatch that stands for it in the figure. */
const FigureKey = ({
  children,
  swatch,
}: {
  children: React.ReactNode;
  swatch: React.ReactNode;
}) => (
  <span className="inline-flex items-center gap-[5px] font-mono text-[10px] text-ptl-ink-3">
    {swatch}
    {children}
  </span>
);

/** Chevrons to walk a list of curves, signs to raise or lower a weight. */
const STEPPER_ARROWS = {
  browse: ['‹', '›'],
  count: ['−', '+'],
};

/**
 * The control the figure stands for, drawn as the page draws it but inert: the
 * card is a picture of the screen it opens, not a second way to drive it.
 */
const FigureStepper = ({
  arrows,
  children,
}: {
  arrows: keyof typeof STEPPER_ARROWS;
  children: React.ReactNode;
}) => (
  <span
    aria-hidden="true"
    className="inline-flex h-[26px] items-center overflow-hidden rounded border border-input bg-card font-mono"
  >
    <span className="flex h-full w-6 items-center justify-center text-[14px] text-muted-foreground">
      {STEPPER_ARROWS[arrows][0]}
    </span>
    <span className="flex h-full items-center border-x border-border px-2 text-[12px] font-semibold">
      {children}
    </span>
    <span className="flex h-full w-6 items-center justify-center text-[14px] text-muted-foreground">
      {STEPPER_ARROWS[arrows][1]}
    </span>
  </span>
);

/**
 * What the application does, in six panels.
 *
 * Each one is a real extract of the demonstration piano rather than a
 * drawing of one: the page claims to turn measurements into readable
 * figures, so the figures had better be the real thing.
 */
export const HomeFeatures = () => {
  const { currentLanguage, t } = useTranslation();

  return (
    <section className="border-b border-border px-12 pt-[104px] pb-28 max-md:px-4 max-md:py-14">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-12">
        <header className="flex flex-col items-center gap-4 text-center">
          <span className="ptl-label">{t('Main features')}</span>
          <h2 className="m-0 font-serif text-[clamp(34px,3.6vw,48px)] leading-[1.1] font-medium text-balance">
            <Trans
              t={t}
              i18nKey="Understand your action, <1>then improve it</1>"
            >
              Understand your action,
              <em className="ptl-accent"> then improve it</em>
            </Trans>
          </h2>
          <p className="m-0 max-w-[60ch] text-[16.5px] leading-[1.65] text-muted-foreground">
            {t(
              'You take a few weights on every key. Piano Touch Lab turns them into readable figures, then works out the adjustments that will even the touch out from one end of the keyboard to the other.',
            )}
          </p>
        </header>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] gap-5">
          <FigureCard
            header={
              <>
                <FigureLabel number="1" />
                <span className="flex items-center gap-[9px]">
                  <FigureKey
                    swatch={
                      <svg
                        aria-hidden="true"
                        width="9"
                        height="8"
                        viewBox="0 0 10 9"
                      >
                        <path
                          d="M0 0h10L5 9z"
                          className="fill-ptl-series-down"
                        />
                      </svg>
                    }
                  >
                    D
                  </FigureKey>
                  <FigureKey
                    swatch={
                      <svg
                        aria-hidden="true"
                        width="9"
                        height="9"
                        viewBox="0 0 10 10"
                      >
                        <path
                          d="M5 0l5 5-5 5-5-5z"
                          className="fill-ptl-series-balance"
                        />
                      </svg>
                    }
                  >
                    BW
                  </FigureKey>
                  <FigureKey
                    swatch={
                      <svg
                        aria-hidden="true"
                        width="9"
                        height="8"
                        viewBox="0 0 10 9"
                      >
                        <path d="M0 9h10L5 0z" className="fill-ptl-series-up" />
                      </svg>
                    }
                  >
                    U
                  </FigureKey>
                  <FigureKey
                    swatch={
                      <svg
                        aria-hidden="true"
                        width="8"
                        height="8"
                        viewBox="0 0 10 10"
                      >
                        <circle
                          cx="5"
                          cy="5"
                          r="4.5"
                          className="fill-ptl-series-friction"
                        />
                      </svg>
                    }
                  >
                    F
                  </FigureKey>
                </span>
              </>
            }
            figure={<StaticBalancePreview />}
            title={t('Visual analysis')}
            description={t(
              'Enter your measurements and explore the charts to spot irregularities in your action.',
            )}
            linkLabel={t('Touch Weight', { ns: 'navigation' })}
            section={t('Analyze', { ns: 'navigation' })}
            to="/analyze/touch-weight"
          />

          <FigureCard
            header={
              <>
                <FigureLabel number="2" />
                <FigureStepper arrows="browse">
                  {DEMO_DESIGN.strikeWeightLevel}
                </FigureStepper>
              </>
            }
            figure={<StrikeWeightPreview />}
            title={t('Interactive modeling')}
            description={t(
              'Adjust the parameters in interactive charts, see their effect on the touch at once, and build your ideal keyboard step by step.',
            )}
            linkLabel={t('Strike Weight', { ns: 'navigation' })}
            section={t('Design', { ns: 'navigation' })}
            to="/design/strike-weight"
          />

          <FigureCard
            header={
              <>
                <FigureLabel number="3" />
                <span className="flex min-w-0 items-center gap-2">
                  <FigureNote>{t('Target balance')}</FigureNote>
                  <FigureStepper arrows="count">
                    {formatWholeGrams(
                      DEMO_DESIGN.balanceWeightTarget,
                      currentLanguage,
                    )}
                  </FigureStepper>
                </span>
              </>
            }
            figure={<FrontWeightPreview />}
            title={t('Balance weight targeting')}
            description={t(
              'Compute the ideal weight of your keys or your hammers from the balance weight you are aiming for.',
            )}
            linkLabel={t('Front Weight', { ns: 'navigation' })}
            section={t('Design', { ns: 'navigation' })}
            to="/design/front-weight"
          />

          <FigureCard
            header={
              <>
                <FigureLabel number="4" />
                <span className="flex items-center gap-2.5">
                  <FigureKey
                    swatch={
                      <span className="inline-block h-2 w-1.5 bg-ptl-brass opacity-60" />
                    }
                  >
                    {t('designed')}
                  </FigureKey>
                  <FigureKey
                    swatch={
                      <span className="inline-block size-[5px] rounded-full bg-ptl-series-balance" />
                    }
                  >
                    {t('measured')}
                  </FigureKey>
                </span>
              </>
            }
            figure={<SpringsPreview />}
            title={t('Wippen Support Springs', { ns: 'navigation' })}
            description={t(
              'If your wippens carry support springs, work them into your design to reduce the lead needed in the keys.',
            )}
            linkLabel={t('Wippen Support Springs', { ns: 'navigation' })}
            section={t('Design', { ns: 'navigation' })}
            to="/design/wippen-support-springs"
          />

          <FigureCard
            header={
              <>
                <FigureLabel number="5" />
                <FigureNote>
                  {DEMO_PIANO_NAME} ·{' '}
                  {t('p. {{page}}/{{pages}}', { page: 1, pages: 4 })}
                </FigureNote>
              </>
            }
            figure={<AdjustmentSheetPreview />}
            title={t('Adjustment sheets')}
            description={t(
              'Print a worksheet from your design, so every adjustment figure is at hand in your workshop.',
            )}
            linkLabel={t('Adjustment Sheet', { ns: 'navigation' })}
            section={t('Design', { ns: 'navigation' })}
            to="/design/adjustment-sheet"
          />

          <article className="flex flex-col overflow-hidden rounded border border-border bg-card">
            <FigurePanel header={<FigureLabel number="6" />}>
              <div className="grid flex-1 grid-cols-3 items-center text-center">
                {[
                  { figure: <>0&nbsp;&euro;</>, label: t('Free') },
                  { figure: <>0</>, label: t('account to create') },
                  { figure: <>100&nbsp;%</>, label: t('in your browser') },
                ].map((stat, index) => (
                  <div
                    key={stat.label}
                    className={`flex flex-col items-center gap-2 px-1.5 ${
                      index === 0 ? '' : 'border-l border-border'
                    }`}
                  >
                    <span className="font-serif text-[36px] leading-none font-medium whitespace-nowrap text-ptl-brass">
                      {stat.figure}
                    </span>
                    <span className="ptl-label text-[10px] leading-[1.4] tracking-[0.06em]">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </FigurePanel>
            <div className="flex flex-1 flex-col gap-2.5 px-6 pt-[22px] pb-6">
              <h3 className="m-0 font-serif text-[26px] leading-[1.1] font-medium">
                {t('Free and respectful of your privacy')}
              </h3>
              <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
                {t(
                  'No account is required, all your data is stored locally in your browser and never leaves your computer.',
                )}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};
