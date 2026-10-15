import { beforeEach, describe, expect, it } from 'bun:test';

import { getKeyFrictionThresholds } from '@/lib/piano/touch-design/data/friction';

import {
  frictionZoneAt,
  type FrictionZoneKind,
} from './use-friction-zones-series';

describe('The frictionZoneAt() function', () => {
  const { mediumZone } = getKeyFrictionThresholds(1, 88);
  let result: FrictionZoneKind | null;

  describe('When the friction is above the medium band', () => {
    beforeEach(() => {
      result = frictionZoneAt(mediumZone.higher + 0.1, 1, 88);
    });

    it('should be high', () => {
      expect(result).toBe('high');
    });
  });

  describe('When the friction is far past the drawn high band', () => {
    beforeEach(() => {
      result = frictionZoneAt(mediumZone.higher + 50, 1, 88);
    });

    it('should still be high', () => {
      expect(result).toBe('high');
    });
  });

  describe('When the friction is on an edge of the medium band', () => {
    let edges: (FrictionZoneKind | null)[];

    beforeEach(() => {
      edges = [
        frictionZoneAt(mediumZone.lower, 1, 88),
        frictionZoneAt(mediumZone.higher, 1, 88),
      ];
    });

    it('should be medium', () => {
      expect(edges).toEqual(['medium', 'medium']);
    });
  });

  describe('When the friction is below the medium band', () => {
    beforeEach(() => {
      result = frictionZoneAt(mediumZone.lower - 0.1, 1, 88);
    });

    it('should be low', () => {
      expect(result).toBe('low');
    });
  });

  describe('When the friction has not been measured', () => {
    let missing: (FrictionZoneKind | null)[];

    beforeEach(() => {
      missing = [
        frictionZoneAt(null, 1, 88),
        frictionZoneAt(undefined, 1, 88),
        frictionZoneAt(Number.NaN, 1, 88),
      ];
    });

    it('should be in no zone', () => {
      expect(missing).toEqual([null, null, null]);
    });
  });

  describe('When a friction just above the medium band of the treble is read in the bass', () => {
    let zones: (FrictionZoneKind | null)[];

    beforeEach(() => {
      const friction = getKeyFrictionThresholds(88, 88).mediumZone.higher + 1;
      zones = [
        frictionZoneAt(friction, 1, 88),
        frictionZoneAt(friction, 88, 88),
      ];
    });

    it('should be medium in the bass and high in the treble, the ideal drifting along the keyboard', () => {
      expect(zones).toEqual(['medium', 'high']);
    });
  });
});
