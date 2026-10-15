import { beforeEach, describe, expect, it } from 'bun:test';

import { documentTitle } from '@/components/layout/hooks/use-document-title';

describe('The documentTitle() function', () => {
  let result: string;

  describe('When a page of a piano is open', () => {
    beforeEach(() => {
      result = documentTitle('Adjustment Sheet', 'Gaveau Modèle 1');
    });

    it('should name the page, the piano and the application', () => {
      expect(result).toBe(
        'Adjustment Sheet — Gaveau Modèle 1 — Piano Touch Lab',
      );
    });
  });

  describe('When the piano has no name yet', () => {
    beforeEach(() => {
      result = documentTitle('Measure', '');
    });

    it('should leave the piano out', () => {
      expect(result).toBe('Measure — Piano Touch Lab');
    });
  });

  describe('When the page belongs to no step', () => {
    beforeEach(() => {
      result = documentTitle(null, null);
    });

    it('should name the application alone', () => {
      expect(result).toBe('Piano Touch Lab');
    });
  });
});
