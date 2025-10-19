export const loggerSymbol = Symbol('logger');

export interface LoggerRequirements {
  debug(message: string, ...positionals: unknown[]): void;
  info(message: string, ...positionals: unknown[]): void;
  warn(message: string, ...positionals: unknown[]): void;
  error(message: string, ...positionals: unknown[]): void;
}
