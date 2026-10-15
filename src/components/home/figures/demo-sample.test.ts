import { beforeEach, describe, expect, it } from 'bun:test';

import { gaveauModele1 } from '@/demo-data/gaveau-m1';

import { DEMO_DESIGN, DEMO_KEY_COUNT, demoDesigned } from './demo-sample';

describe('The DEMO_DESIGN constant', () => {
  const { design } = gaveauModele1;

  describe('When compared with the design the demonstration piano ships with', () => {
    it('should aim at the same balance weight', () => {
      expect(design.frontWeightDesignComputedBalanceWeightTarget).toBe(
        DEMO_DESIGN.balanceWeightTarget,
      );
    });

    it('should follow the same strike weight curve', () => {
      expect(design.strikeWeightDesignTarget).toBe(
        DEMO_DESIGN.strikeWeightLevel,
      );
    });

    it('should keep the same ratio', () => {
      expect(design.strikeWeightRatioDesignTarget).toBe(
        DEMO_DESIGN.strikeWeightRatio,
      );
    });

    it('should fit the same springs', () => {
      expect(design.wippenSupportSpringsDesignTarget).toEqual({
        numberOfSprings: DEMO_DESIGN.springCount,
        springBalanceWeight: DEMO_DESIGN.springBaseTension,
        tensionDropIndex: DEMO_DESIGN.springTensionDropIndex,
      });
    });
  });
});

describe('The demoDesigned constant', () => {
  let result: typeof demoDesigned;

  describe('When the home page draws its illustrations from it', () => {
    beforeEach(() => {
      result = demoDesigned;
    });

    it('should cover the whole keyboard', () => {
      expect(result.frontWeight).toHaveLength(DEMO_KEY_COUNT);
      expect(result.springBalance).toHaveLength(DEMO_KEY_COUNT);
      expect(result.strikeWeight).toHaveLength(DEMO_KEY_COUNT);
    });

    it('should leave the keys beyond the last spring unsprung', () => {
      expect(result.springBalance[DEMO_DESIGN.springCount - 1]).not.toBe(null);
      expect(result.springBalance[DEMO_DESIGN.springCount]).toBe(null);
    });
  });
});
