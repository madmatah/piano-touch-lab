import { beforeEach, describe, expect, it } from 'bun:test';

import {
  locateInNavigation,
  type NavigationLocation,
  type NavigationStep,
} from './app-navigation';

const STEPS: NavigationStep[] = [
  { label: 'Measure', links: [], section: '/measure', to: '/measure' },
  {
    label: 'Analyze',
    links: [
      { label: 'Touch Weight', to: '/analyze/touch-weight' },
      { label: 'Data Sheet', to: '/analyze/data-sheet' },
    ],
    section: '/analyze',
    to: '/analyze/touch-weight',
  },
];

describe('The locateInNavigation() function', () => {
  let result: NavigationLocation;

  describe('When the page is a step of its own', () => {
    beforeEach(() => {
      result = locateInNavigation(STEPS, '/measure');
    });

    it('should find the step, and no page within it', () => {
      expect(result.step?.label).toBe('Measure');
      expect(result.link).toBeUndefined();
    });
  });

  describe('When the page is one of a step', () => {
    beforeEach(() => {
      result = locateInNavigation(STEPS, '/analyze/data-sheet');
    });

    it('should find both the step and the page', () => {
      expect(result.step?.label).toBe('Analyze');
      expect(result.link?.label).toBe('Data Sheet');
    });
  });

  describe('When the page lies under a step but is not listed in it', () => {
    beforeEach(() => {
      result = locateInNavigation(STEPS, '/analyze/unknown');
    });

    it('should find the step alone', () => {
      expect(result.step?.label).toBe('Analyze');
      expect(result.link).toBeUndefined();
    });
  });

  describe('When the address only begins like a step', () => {
    beforeEach(() => {
      result = locateInNavigation(STEPS, '/measurements');
    });

    it('should not take it for that step', () => {
      expect(result).toEqual({});
    });
  });

  describe('When the page belongs to no step', () => {
    beforeEach(() => {
      result = locateInNavigation(STEPS, '/help');
    });

    it('should find nothing', () => {
      expect(result).toEqual({});
    });
  });
});
