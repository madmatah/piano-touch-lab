import { describe, expect, it } from 'bun:test';
import { container } from './app-container';
import { curveSmootherRequirementsSymbol } from '@/lib/geometry/curve-smoother/curve-smoother.requirements';
import { SmoothStrategy } from '@/lib/geometry/curve-smoother/smooth-strategy.enum';
import { loggerSymbol } from '@/lib/logger/logger.requirements';

const portFiles = [
  ...new Bun.Glob('**/*requirements.ts').scanSync({
    absolute: true,
    cwd: import.meta.dir,
  }),
];

const portModules = await Promise.all(
  portFiles.map(
    (portFile) => import(portFile) as Promise<Record<string, unknown>>,
  ),
);

const portSymbols = portModules
  .flatMap((portModule) => Object.values(portModule))
  .filter((exported): exported is symbol => typeof exported === 'symbol');

const portsBoundOnce = portSymbols
  .filter((portSymbol) => portSymbol !== curveSmootherRequirementsSymbol)
  .map((portSymbol) => [portSymbol.description ?? '', portSymbol] as const);

describe('The container constant', () => {
  describe('When the ports are listed from the requirements files', () => {
    it('should find the logger among them', () => {
      expect(portSymbols).toContain(loggerSymbol);
    });
  });

  describe('When each port bound once is resolved', () => {
    it.each(portsBoundOnce)('should build %s', (_portName, portSymbol) => {
      expect(() => container.get(portSymbol)).not.toThrow();
    });
  });

  describe('When a curve smoother is resolved by its strategy', () => {
    it.each(Object.entries(SmoothStrategy))(
      'should build the %s smoother',
      (_strategyName, strategy) => {
        expect(() =>
          container.get(curveSmootherRequirementsSymbol, { name: strategy }),
        ).not.toThrow();
      },
    );
  });
});
