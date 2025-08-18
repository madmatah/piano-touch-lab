import type { Container, ServiceIdentifier } from 'inversify';
import { useContainer } from 'inversify-react';

export function useNamedInjection<T>(
  serviceId: ServiceIdentifier<T>,
  named: string | number | symbol,
): T {
  return useContainer((container: Container) =>
    container.get<T>(serviceId, { name: named }),
  );
}
