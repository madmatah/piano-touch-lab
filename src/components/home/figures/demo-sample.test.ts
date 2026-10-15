import { describe, expect, it } from 'bun:test';

import { gaveauModele1 } from '@/demo-data/gaveau-m1';

import { DEMO_DESIGN, DEMO_KEY_COUNT, demoDesigned } from './demo-sample';

describe('The home page illustrations', () => {
  describe('The design they are drawn with', () => {
    const { design } = gaveauModele1;

    it('should be the one the demonstration piano ships with', () => {
      expect(design.frontWeightDesignComputedBalanceWeightTarget).toBe(
        DEMO_DESIGN.balanceWeightTarget,
      );
      expect(design.strikeWeightDesignTarget).toBe(
        DEMO_DESIGN.strikeWeightLevel,
      );
      expect(design.strikeWeightRatioDesignTarget).toBe(
        DEMO_DESIGN.strikeWeightRatio,
      );
      expect(design.wippenSupportSpringsDesignTarget).toEqual({
        numberOfSprings: DEMO_DESIGN.springCount,
        springBalanceWeight: DEMO_DESIGN.springBaseTension,
        tensionDropIndex: DEMO_DESIGN.springTensionDropIndex,
      });
    });
  });

  describe('The designed series', () => {
    it('should cover the whole keyboard', () => {
      expect(demoDesigned.frontWeight).toHaveLength(DEMO_KEY_COUNT);
      expect(demoDesigned.springBalance).toHaveLength(DEMO_KEY_COUNT);
      expect(demoDesigned.strikeWeight).toHaveLength(DEMO_KEY_COUNT);
    });

    it('should leave the keys beyond the last spring unsprung', () => {
      expect(demoDesigned.springBalance[DEMO_DESIGN.springCount - 1]).not.toBe(
        null,
      );
      expect(demoDesigned.springBalance[DEMO_DESIGN.springCount]).toBe(null);
    });
  });
});
