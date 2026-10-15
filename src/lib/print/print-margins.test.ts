import { beforeEach, describe, expect, it } from 'bun:test';

import { printMarginsRule } from '@/lib/print/print-margins';

describe('The printMarginsRule() function', () => {
  let result: string;

  describe('When the piano has an ordinary name', () => {
    beforeEach(() => {
      result = printMarginsRule({
        identity: 'Piano Touch Lab · Gaveau Modèle 1',
        pageLabel: 'page',
      });
    });

    it('should write the identity in the bottom left margin', () => {
      expect(result).toContain(
        '@bottom-left { content: "Piano Touch Lab · Gaveau Modèle 1" }',
      );
    });

    it('should number the sheets in the bottom right margin', () => {
      expect(result).toContain(
        '@bottom-right { content: "page " counter(page) " / " counter(pages) }',
      );
    });
  });

  describe('When the name carries quotes and a backslash', () => {
    beforeEach(() => {
      result = printMarginsRule({
        identity: 'Steinway "D" \\ 1902',
        pageLabel: 'page',
      });
    });

    it('should escape them so the rule stays whole', () => {
      expect(result).toContain('content: "Steinway \\"D\\" \\\\ 1902"');
    });
  });
});
