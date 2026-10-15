import { useMemo } from 'react';

import { useAnalyzedKeyboard } from '@/hooks/keyboard/use-analyzed-keyboard';
import { useDesignedKeyboard } from '@/hooks/keyboard/use-designed-keyboard';
import { useMeasureOptions } from '@/hooks/store/use-measure-options-store';
import { useTranslation } from '@/hooks/use-translation';

export interface NavigationLink {
  isDisabled?: boolean;
  isHidden?: boolean;
  label: string;
  /** Short mono tag shown after the label, e.g. OPTION. */
  tag?: string;
  to: string;
}

export interface NavigationStep {
  label: string;
  links: NavigationLink[];
  /** Two-digit step number, shown in brass in the sidebar and breadcrumb. */
  number: string;
  /** URL prefix owning every page of the step. */
  section: string;
  /** Where the step itself leads: its own page, or its first open link. */
  to: string;
}

/** A design is considered complete once most keys carry a down weight. */
const DESIGN_COMPLETION_RATIO = 0.8;

const firstOpenLink = (links: NavigationLink[]): string | undefined =>
  links.find((link) => !link.isHidden && !link.isDisabled)?.to;

/**
 * The four steps of the workflow, in order.
 *
 * One model, two readers: the sidebar renders it, and the breadcrumb of the
 * page header looks the current route up in it. Adding a page means adding it
 * here only.
 */
export const useAppNavigation = (): NavigationStep[] => {
  const { t } = useTranslation();
  const { useSupportSpringMeasurements } = useMeasureOptions();
  const analyzedKeyboard = useAnalyzedKeyboard();
  const designedKeyboard = useDesignedKeyboard(analyzedKeyboard);

  const isDesignCompleted = useMemo(() => {
    return (
      designedKeyboard
        .mapToArray((key) => key.payload.downWeightWithoutSpringSupport)
        .filter((weight) => weight !== undefined && weight !== null).length >=
      Math.round(designedKeyboard.size * DESIGN_COMPLETION_RATIO)
    );
  }, [designedKeyboard]);

  return useMemo(() => {
    const analyzeLinks: NavigationLink[] = [
      {
        label: t('Touch Weight', { ns: 'navigation' }),
        to: '/analyze/touch-weight',
      },
      {
        label: t('Front Weight', { ns: 'navigation' }),
        to: '/analyze/front-weight',
      },
      {
        label: t('Strike Weight', { ns: 'navigation' }),
        to: '/analyze/strike-weight',
      },
      {
        label: t('Strike Weight Ratio', { ns: 'navigation' }),
        to: '/analyze/strike-weight-ratio',
      },
      {
        // Listed even when the measurement option is off: the page is where
        // the option is explained, and hiding it would leave its own
        // "turn the option on" prompt unreachable.
        label: t('Wippen Support Springs', { ns: 'navigation' }),
        tag: useSupportSpringMeasurements
          ? undefined
          : t('Option', { ns: 'navigation' }),
        to: '/analyze/wippen-support-springs',
      },
      {
        label: t('Data Sheet', { ns: 'navigation' }),
        to: '/analyze/data-sheet',
      },
    ];

    const designLinks: NavigationLink[] = [
      {
        label: t('Wippen Support Springs', { ns: 'navigation' }),
        to: '/design/wippen-support-springs',
      },
      {
        label: t('Front Weight', { ns: 'navigation' }),
        to: '/design/front-weight',
      },
      {
        label: t('Strike Weight', { ns: 'navigation' }),
        to: '/design/strike-weight',
      },
      {
        label: t('Strike Weight Ratio', { ns: 'navigation' }),
        to: '/design/strike-weight-ratio',
      },
      {
        isDisabled: !isDesignCompleted,
        label: t('Touch Weight Preview', { ns: 'navigation' }),
        to: '/design/touch-weight-preview',
      },
      {
        isDisabled: !isDesignCompleted,
        label: t('Adjustment Sheet', { ns: 'navigation' }),
        to: '/design/adjustment-sheet',
      },
    ];

    return [
      {
        label: t('Piano', { ns: 'navigation' }),
        links: [],
        number: '00',
        section: '/piano',
        to: '/piano',
      },
      {
        label: t('Measure', { ns: 'navigation' }),
        links: [],
        number: '01',
        section: '/measure',
        to: '/measure',
      },
      {
        label: t('Analyze', { ns: 'navigation' }),
        links: analyzeLinks,
        number: '02',
        section: '/analyze',
        to: firstOpenLink(analyzeLinks) ?? '/analyze/touch-weight',
      },
      {
        label: t('Design', { ns: 'navigation' }),
        links: designLinks,
        number: '03',
        section: '/design',
        to: firstOpenLink(designLinks) ?? '/design/wippen-support-springs',
      },
    ];
  }, [isDesignCompleted, t, useSupportSpringMeasurements]);
};

export interface NavigationLocation {
  link?: NavigationLink;
  step?: NavigationStep;
}

/** Finds the step, and where possible the page, a pathname belongs to. */
export const locateInNavigation = (
  steps: NavigationStep[],
  pathname: string,
): NavigationLocation => {
  const step = steps.find(
    (candidate) =>
      pathname === candidate.section ||
      pathname.startsWith(`${candidate.section}/`),
  );

  if (!step) {
    return {};
  }

  return { link: step.links.find((link) => link.to === pathname), step };
};
