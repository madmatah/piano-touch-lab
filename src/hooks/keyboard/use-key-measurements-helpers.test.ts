import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { renderHook } from '@testing-library/react';
import { useKeyMeasurementsHelpers } from './use-key-measurements-helpers';
import type { MeasuredKeyRequirements } from '@/lib/piano/touch-design/measured-key.requirements';

const mockUseGlobalMeasures = mock(() => ({
  keyWeightRatio: 0.5 as number | null,
  wippenRadiusWeight: 10 as number | null,
}));

const mockUseMeasureOptions = mock(() => ({
  useManualSWRMeasurements: false,
}));

void mock.module('../store/use-measure-store', () => ({
  useGlobalMeasures: mockUseGlobalMeasures,
}));

void mock.module('../store/use-measure-options-store', () => ({
  useMeasureOptions: mockUseMeasureOptions,
}));

describe('The useKeyMeasurementsHelpers() hook', () => {
  let measureProfileName: string | undefined;
  let globalMeasure: {
    keyWeightRatio: number | null;
    wippenRadiusWeight: number | null;
  };
  let measureOptions: { useManualSWRMeasurements: boolean };
  let keyMeasure: MeasuredKeyRequirements;

  beforeEach(() => {
    measureProfileName = 'test-profile';
    globalMeasure = {
      keyWeightRatio: 0.5,
      wippenRadiusWeight: 10,
    };
    measureOptions = {
      useManualSWRMeasurements: false,
    };
    keyMeasure = {
      downWeightWithSpringSupport: 43,
      downWeightWithoutSpringSupport: 50,
      frontWeight: 30,
      keyWeightRatio: null,
      measuredStrikeWeightRatio: 0.8,
      strikeWeight: 20,
      upWeight: 40,
      wippenRadiusWeight: null,
    };

    mockUseGlobalMeasures.mockReturnValue(globalMeasure);
    mockUseMeasureOptions.mockReturnValue(measureOptions);
  });

  describe('The computeKeyMeasurements() function', () => {
    let result: MeasuredKeyRequirements;

    beforeEach(() => {
      const { result: hookResult } = renderHook(() =>
        useKeyMeasurementsHelpers(),
      );
      result = hookResult.current.computeKeyMeasurements(keyMeasure);
    });

    it('should return the key measure with global values when key measure values are null', () => {
      expect(result.keyWeightRatio).toBe(globalMeasure.keyWeightRatio);
      expect(result.wippenRadiusWeight).toBe(globalMeasure.wippenRadiusWeight);
    });

    it('should preserve non-null key measure values', () => {
      expect(result.downWeightWithoutSpringSupport).toBe(
        keyMeasure.downWeightWithoutSpringSupport,
      );
      expect(result.downWeightWithSpringSupport).toBe(
        keyMeasure.downWeightWithSpringSupport,
      );
      expect(result.frontWeight).toBe(keyMeasure.frontWeight);
      expect(result.strikeWeight).toBe(keyMeasure.strikeWeight);
      expect(result.upWeight).toBe(keyMeasure.upWeight);
    });

    describe('When useManualSWRMeasurements is false', () => {
      beforeEach(() => {
        measureOptions.useManualSWRMeasurements = false;
        mockUseMeasureOptions.mockReturnValue(measureOptions);
      });

      it('should set measuredStrikeWeightRatio to null', () => {
        const { result: hookResult } = renderHook(() =>
          useKeyMeasurementsHelpers(),
        );
        result = hookResult.current.computeKeyMeasurements(keyMeasure);

        expect(result.measuredStrikeWeightRatio).toBeNull();
      });
    });

    describe('When useManualSWRMeasurements is true', () => {
      beforeEach(() => {
        measureOptions.useManualSWRMeasurements = true;
        mockUseMeasureOptions.mockReturnValue(measureOptions);
      });

      it('should preserve the original measuredStrikeWeightRatio value', () => {
        const { result: hookResult } = renderHook(() =>
          useKeyMeasurementsHelpers(),
        );
        result = hookResult.current.computeKeyMeasurements(keyMeasure);

        expect(result.measuredStrikeWeightRatio).toBe(
          keyMeasure.measuredStrikeWeightRatio,
        );
      });
    });

    describe('When keyMeasure has non-null keyWeightRatio', () => {
      beforeEach(() => {
        keyMeasure.keyWeightRatio = 0.7;
      });

      it('should use the local keyWeightRatio value', () => {
        const { result: hookResult } = renderHook(() =>
          useKeyMeasurementsHelpers(),
        );
        result = hookResult.current.computeKeyMeasurements(keyMeasure);

        expect(result.keyWeightRatio).toBe(0.7);
      });
    });

    describe('When keyMeasure has non-null wippenRadiusWeight', () => {
      beforeEach(() => {
        keyMeasure.wippenRadiusWeight = 15;
      });

      it('should use the local wippenRadiusWeight value', () => {
        const { result: hookResult } = renderHook(() =>
          useKeyMeasurementsHelpers(),
        );
        result = hookResult.current.computeKeyMeasurements(keyMeasure);

        expect(result.wippenRadiusWeight).toBe(15);
      });
    });
  });
});
