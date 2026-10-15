import { Printer } from 'lucide-react';
import { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';

export interface PrintButtonProps {
  label?: string;
  size?: React.ComponentProps<typeof Button>['size'];
  variant?: React.ComponentProps<typeof Button>['variant'];
}

export const PrintButton = ({
  label,
  size = 'xs',
  variant = 'outlineStrong',
}: PrintButtonProps) => {
  const { t } = useTranslation();
  const print = useCallback(() => window.print(), []);

  return (
    <Button variant={variant} size={size} onClick={print}>
      <Printer className="size-4" />
      {label ?? t('Print')}
    </Button>
  );
};
