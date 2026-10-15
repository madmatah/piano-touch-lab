import { useMemo } from 'react';
import { Trans } from 'react-i18next';

import { Glossary, type GlossaryTerm } from '../glossary/Glossary';
import { MainLayout } from '../MainLayout';
import { PageHeading } from '../layout/PageHeading';
import { useTranslation } from '@/hooks/use-translation';

/**
 * The order the abbreviations appear in the index at the top of the page:
 * alphabetical, which is how a reader looks one up.
 */
const INDEX_ORDER = [
  'BW',
  'BWS',
  'D',
  'F',
  'FW',
  'HW',
  'KF',
  'KR',
  'R',
  'SBW',
  'SS',
  'SW',
  'TBW',
  'U',
  'WBW',
  'WW',
];

export const HelpPage = () => {
  const { t } = useTranslation();

  const measuredTerms = useMemo<GlossaryTerm[]>(
    () => [
      {
        abbreviation: 'D',
        description: t(
          'The minimum weight, to the nearest gram, placed on the measuring point that makes the key go down while keeping a slow, controlled hammer motion.',
        ),
        name: t('Down Weight'),
      },
      {
        abbreviation: 'U',
        description: t(
          'The maximum weight, to the nearest gram, placed on the measuring point that the key can still lift while keeping a slow, controlled hammer motion.',
        ),
        name: t('Up Weight'),
      },
      {
        abbreviation: 'FW',
        description: t(
          'The static weight, to the nearest tenth of a gram, that the level key exerts at the measuring point, tipped on its balance pin.',
        ),
        name: t('Front Weight'),
      },
      {
        abbreviation: 'SW',
        description: t(
          'The weight, to the nearest tenth of a gram, of the shank and hammer, pivoting without friction at the hammer centre, shank horizontal, measured at the strike line radius.',
        ),
        name: t('Strike Weight'),
      },
    ],
    [t],
  );

  const computedTerms = useMemo<GlossaryTerm[]>(
    () => [
      {
        abbreviation: 'BW',
        description: t(
          'The weight placed at the measuring point that brings the key into balance.',
        ),
        formula: 'BW = (D + U) / 2',
        name: t('Balance Weight'),
      },
      {
        abbreviation: 'F',
        description: t(
          'The minimum weight added to the balance weight that makes the key go down, or taken away to make it rise, while keeping a slow, controlled hammer motion.',
        ),
        formula: 'F = (D − U) / 2',
        name: t('Friction Weight'),
      },
      {
        abbreviation: 'R',
        description: t(
          'The weight to place at the measuring point to balance 1 g of strike weight, through the shank, the wippen and the key.',
        ),
        formula: 'R = (FW + BW − WBW) / SW',
        name: t('Strike Weight Ratio'),
      },
      {
        abbreviation: 'WBW',
        description: t(
          'The upward static force at the measuring point coming from the weight of the wippen, carried through the key.',
        ),
        formula: t('WBW = KR × wippen radial weight'),
        name: t('Wippen Balance Weight'),
      },
      {
        abbreviation: 'BWS',
        description: t(
          'The difference between the balance weight with the support spring disengaged and with it engaged.',
        ),
        formula: t('BWS = D without spring − D with spring'),
        name: t('Support Spring Balance Weight'),
      },
    ],
    [t],
  );

  const otherTerms = useMemo<GlossaryTerm[]>(
    () => [
      {
        abbreviation: 'KR',
        description: t(
          'The weight at the measuring point that balances 1 g placed at the capstan contact point: the leverage of the key alone.',
        ),
        name: t('Key Weight Ratio'),
      },
      {
        abbreviation: 'WW',
        description: t(
          'The weight, to the nearest tenth of a gram, of the level wippen, pivoting without friction at its centre, measured at the capstan contact point.',
        ),
        name: t('Wippen Weight'),
      },
      {
        abbreviation: 'HW',
        description: t('The weight of the hammer with the shank removed.'),
        name: t('Hammer Weight'),
      },
      {
        abbreviation: 'SS',
        description: t(
          'The weight, to the nearest tenth of a gram, of the shank alone, pivoting without friction at the hammer centre, measured at the strike line radius.',
        ),
        name: t('Shank Strike Weight'),
      },
      {
        abbreviation: 'SBW',
        description: t(
          'The upward static force at the measuring point coming from the hammer and its shank, carried through the shank, the wippen and the key.',
        ),
        name: t('Strike Balance Weight'),
      },
      {
        abbreviation: 'TBW',
        description: t(
          'The combined force of the wippen and the hammer at the measuring point: WBW and SBW together.',
        ),
        name: t('Top Action Balance Weight'),
      },
      {
        abbreviation: 'KF',
        description: t(
          'The share of the friction belonging to the key itself, measured on its frame with the action removed and the front weight cancelled by a temporary weight.',
        ),
        name: t('Key Friction Weight'),
      },
    ],
    [t],
  );

  const designFormulas = useMemo(
    () => [
      {
        formula: 'FW = WBW + R × SW − BW − BWS',
        label: t('Front weight for a target balance weight'),
      },
      {
        formula: 'SW = (BW + FW + BWS − WBW) / R',
        label: t('Strike weight for a target balance weight'),
      },
      {
        formula: 'BW = SW × R + WBW − FW',
        label: t('Resulting balance weight'),
      },
    ],
    [t],
  );

  return (
    <MainLayout shouldDisplayDemoBanner={false} contentClassName="gap-10">
      <PageHeading
        title={
          <Trans i18nKey="Touch weight <1>metrology</1> cheat sheet">
            Touch weight <em className="ptl-accent">metrology</em> cheat sheet
          </Trans>
        }
        lede={t(
          'The quantities Piano Touch Lab uses, after David C. Stanwood’s “New Touch Weight Metrology”.',
        )}
      />

      <nav
        aria-label={t('Index of abbreviations')}
        className="-mt-6 flex flex-wrap gap-1.5"
      >
        {INDEX_ORDER.map((abbreviation) => (
          <a
            key={abbreviation}
            href={`#term-${abbreviation}`}
            className="inline-flex h-9 min-w-11 items-center justify-center rounded-md border border-input px-2 font-mono text-[13px] text-foreground transition-colors hover:bg-accent"
          >
            {abbreviation}
          </a>
        ))}
      </nav>

      <section className="flex flex-col gap-3.5">
        <h2 className="m-0 font-serif text-[28px] font-medium">
          {t('What you measure')}
        </h2>
        <Glossary terms={measuredTerms} />
      </section>

      <section className="flex flex-col gap-3.5">
        <h2 className="m-0 font-serif text-[28px] font-medium">
          {t('What the tool computes')}
        </h2>
        <Glossary terms={computedTerms} />
      </section>

      <section className="flex flex-col gap-3.5">
        <h2 className="m-0 font-serif text-[28px] font-medium">
          {t('Other terms')}
        </h2>
        <Glossary terms={otherTerms} />
      </section>

      <div className="flex flex-wrap items-start gap-6">
        <section className="flex-[3_1_420px] rounded-md border border-ptl-rule-strong bg-card px-6 pt-[22px] pb-3">
          <h2 className="m-0 mb-3 font-serif text-[26px] font-medium">
            {t('Design formulas')}
          </h2>
          {designFormulas.map((entry) => (
            <div
              key={entry.formula}
              className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-baseline gap-x-5 gap-y-1.5 border-t border-border py-3"
            >
              <span className="text-sm text-muted-foreground">
                {entry.label}
              </span>
              <span className="font-mono text-sm">{entry.formula}</span>
            </div>
          ))}
        </section>

        <section className="flex flex-[2_1_320px] flex-col gap-3">
          <h2 className="m-0 font-serif text-[26px] font-medium">
            {t('Going further')}
          </h2>
          <a
            href="https://www.stanwoodpiano.com/touchweight.htm"
            target="_blank"
            rel="noreferrer"
            className="flex flex-col gap-1 rounded-md border border-border bg-card px-4 py-3.5 text-foreground transition-colors hover:bg-accent"
          >
            <span className="font-semibold">
              David C. Stanwood — Piano Technicians Resource Page
            </span>
            <span className="text-[13.5px] text-muted-foreground">
              {t(
                'Technical documents on analysing and improving touch weight.',
              )}
            </span>
          </a>
          <div className="flex flex-col gap-1 rounded-md border border-border bg-card px-4 py-3.5">
            <span className="font-serif text-lg italic">Pianos Inside Out</span>
            <span className="text-[13.5px] text-muted-foreground">
              {t(
                'Mario Igrec — a reference guide to piano tuning, repair and rebuilding.',
              )}
            </span>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};
