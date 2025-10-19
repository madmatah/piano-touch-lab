import { useInjection } from 'inversify-react';
import {
  loggerSymbol,
  type LoggerRequirements,
} from '@/lib/logger/logger.requirements';

export const useLogger = () => {
  const logger = useInjection<LoggerRequirements>(loggerSymbol);
  return logger;
};
