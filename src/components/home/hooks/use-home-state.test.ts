import { beforeEach, describe, expect, it } from 'bun:test';

import {
  homeStageOf,
  RESUME_TO,
  type HomeProgress,
  type HomeStage,
} from './use-home-state';

const FRESH: HomeProgress = {
  hasDesign: false,
  isDemoProfile: false,
  isDesignCompleted: false,
  measured: 0,
  total: 88,
};

describe('The homeStageOf() function', () => {
  let result: HomeStage;

  describe('When the demonstration piano is loaded', () => {
    beforeEach(() => {
      result = homeStageOf({ ...FRESH, isDemoProfile: true, measured: 88 });
    });

    it('should be the demo, however far it has got', () => {
      expect(result).toBe('demo');
    });
  });

  describe('When keys are still to be measured', () => {
    beforeEach(() => {
      result = homeStageOf({
        ...FRESH,
        hasDesign: true,
        isDesignCompleted: true,
        measured: 87,
      });
    });

    it('should be measuring, even with a design under way', () => {
      expect(result).toBe('measuring');
    });
  });

  describe('When every key is measured and nothing is designed yet', () => {
    beforeEach(() => {
      result = homeStageOf({ ...FRESH, isDesignCompleted: true, measured: 88 });
    });

    it('should be measured', () => {
      expect(result).toBe('measured');
    });
  });

  describe('When a design has been started but does not yet resolve', () => {
    beforeEach(() => {
      result = homeStageOf({ ...FRESH, hasDesign: true, measured: 88 });
    });

    it('should still be measured', () => {
      expect(result).toBe('measured');
    });
  });

  describe('When the design resolves', () => {
    beforeEach(() => {
      result = homeStageOf({
        ...FRESH,
        hasDesign: true,
        isDesignCompleted: true,
        measured: 88,
      });
    });

    it('should be designed', () => {
      expect(result).toBe('designed');
    });
  });
});

describe('The RESUME_TO constant', () => {
  let result: string;

  describe('When the piano is measured', () => {
    beforeEach(() => {
      result = RESUME_TO.measured;
    });

    it('should lead to the first step of the design, the springs', () => {
      expect(result).toBe('/design/wippen-support-springs');
    });
  });

  describe('When the piano is designed', () => {
    beforeEach(() => {
      result = RESUME_TO.designed;
    });

    it('should lead to the adjustment sheet', () => {
      expect(result).toBe('/design/adjustment-sheet');
    });
  });
});
