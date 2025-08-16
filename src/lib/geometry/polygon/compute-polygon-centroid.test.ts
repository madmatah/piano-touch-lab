import { describe, it, expect } from 'bun:test';
import { computePolygonCentroid } from './compute-polygon-centroid';
import type { XYCoordinates } from '../coordinates';

describe('computePolygonCentroid', () => {
  describe('basic polygon shapes', () => {
    it('should compute centroid of a triangle', () => {
      const triangle: XYCoordinates[] = [
        [0, 0],
        [4, 0],
        [2, 3],
      ];
      const centroid = computePolygonCentroid(triangle);
      expect(centroid[0]).toBeCloseTo(2, 10);
      expect(centroid[1]).toBeCloseTo(1, 10);
    });

    it('should compute centroid of a square', () => {
      const square: XYCoordinates[] = [
        [0, 0],
        [2, 0],
        [2, 2],
        [0, 2],
      ];
      const centroid = computePolygonCentroid(square);
      expect(centroid[0]).toBeCloseTo(1, 10);
      expect(centroid[1]).toBeCloseTo(1, 10);
    });

    it('should compute centroid of a rectangle', () => {
      const rectangle: XYCoordinates[] = [
        [0, 0],
        [6, 0],
        [6, 2],
        [0, 2],
      ];
      const centroid = computePolygonCentroid(rectangle);
      expect(centroid[0]).toBeCloseTo(3, 10);
      expect(centroid[1]).toBeCloseTo(1, 10);
    });

    it('should compute centroid of a pentagon', () => {
      const pentagon: XYCoordinates[] = [
        [0, 0],
        [2, 0],
        [3, 1],
        [2, 2],
        [0, 2],
      ];
      const centroid = computePolygonCentroid(pentagon);
      expect(centroid[0]).toBeCloseTo(1.2666666666666666, 10);
      expect(centroid[1]).toBeCloseTo(1, 10);
    });
  });

  describe('polygons with negative coordinates', () => {
    it('should compute centroid of a triangle with negative coordinates', () => {
      const triangle: XYCoordinates[] = [
        [-2, -1],
        [2, -1],
        [0, 2],
      ];
      const centroid = computePolygonCentroid(triangle);
      expect(centroid[0]).toBeCloseTo(0, 10);
      expect(centroid[1]).toBeCloseTo(0, 10);
    });

    it('should compute centroid of a square centered at origin', () => {
      const square: XYCoordinates[] = [
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1],
      ];
      const centroid = computePolygonCentroid(square);
      expect(centroid[0]).toBeCloseTo(0, 10);
      expect(centroid[1]).toBeCloseTo(0, 10);
    });
  });

  describe('polygons with decimal coordinates', () => {
    it('should compute centroid with high precision', () => {
      const triangle: XYCoordinates[] = [
        [0.1, 0.2],
        [3.7, 0.3],
        [1.9, 2.8],
      ];
      const centroid = computePolygonCentroid(triangle);
      expect(centroid[0]).toBeCloseTo(1.9, 10);
      expect(centroid[1]).toBeCloseTo(1.1, 10);
    });
  });

  describe('edge cases', () => {
    it('should handle single point polygon', () => {
      const singlePoint: XYCoordinates[] = [[5, 3]];
      const centroid = computePolygonCentroid(singlePoint);
      expect(centroid[0]).toBe(5);
      expect(centroid[1]).toBe(3);
    });

    it('should handle two-point polygon', () => {
      const twoPoints: XYCoordinates[] = [
        [0, 0],
        [4, 0],
      ];
      const centroid = computePolygonCentroid(twoPoints);
      expect(centroid[0]).toBe(0);
      expect(centroid[1]).toBe(0);
    });

    it('should handle polygon with zero area (collinear points)', () => {
      const collinearPoints: XYCoordinates[] = [
        [0, 0],
        [2, 0],
        [4, 0],
      ];
      const centroid = computePolygonCentroid(collinearPoints);
      expect(centroid[0]).toBe(0);
      expect(centroid[1]).toBe(0);
    });

    it('should handle empty polygon array', () => {
      const emptyPolygon: XYCoordinates[] = [];
      const centroid = computePolygonCentroid(emptyPolygon);
      expect(centroid[0]).toBe(0);
      expect(centroid[1]).toBe(0);
    });
  });

  describe('mathematical properties', () => {
    it('should preserve centroid under translation', () => {
      const originalTriangle: XYCoordinates[] = [
        [0, 0],
        [2, 0],
        [1, 2],
      ];
      const translatedTriangle: XYCoordinates[] = [
        [5, 3],
        [7, 3],
        [6, 5],
      ];

      const originalCentroid = computePolygonCentroid(originalTriangle);
      const translatedCentroid = computePolygonCentroid(translatedTriangle);

      expect(translatedCentroid[0]).toBeCloseTo(originalCentroid[0] + 5, 10);
      expect(translatedCentroid[1]).toBeCloseTo(originalCentroid[1] + 3, 10);
    });

    it('should preserve centroid under scaling', () => {
      const originalTriangle: XYCoordinates[] = [
        [0, 0],
        [2, 0],
        [1, 2],
      ];
      const scaledTriangle: XYCoordinates[] = [
        [0, 0],
        [4, 0],
        [2, 4],
      ];

      const originalCentroid = computePolygonCentroid(originalTriangle);
      const scaledCentroid = computePolygonCentroid(scaledTriangle);

      expect(scaledCentroid[0]).toBeCloseTo(originalCentroid[0] * 2, 10);
      expect(scaledCentroid[1]).toBeCloseTo(originalCentroid[1] * 2, 10);
    });
  });

  describe('complex polygons', () => {
    it('should compute centroid of a concave polygon', () => {
      const concavePolygon: XYCoordinates[] = [
        [0, 0],
        [4, 0],
        [4, 4],
        [2, 2],
        [0, 4],
      ];
      const centroid = computePolygonCentroid(concavePolygon);
      expect(centroid[0]).toBeCloseTo(2, 10);
      expect(centroid[1]).toBeCloseTo(1.5555555555555556, 10);
    });

    it('should compute centroid of a star-shaped polygon', () => {
      const starPolygon: XYCoordinates[] = [
        [0, -2],
        [0.5, -0.5],
        [2, 0],
        [0.5, 0.5],
        [0, 2],
        [-0.5, 0.5],
        [-2, 0],
        [-0.5, -0.5],
      ];
      const centroid = computePolygonCentroid(starPolygon);
      expect(centroid[0]).toBeCloseTo(0, 10);
      expect(centroid[1]).toBeCloseTo(0, 10);
    });
  });
});
