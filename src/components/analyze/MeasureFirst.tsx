import { ArrowRight, Ruler } from 'lucide-react';
import { Link } from 'react-router-dom';

import { EmptyState } from '@/components/app-ui/EmptyState';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';

/**
 * What an Analyze figure says before the first reading: that it fills in as
 * the keys are measured, and where they are.
 */
export const MeasureFirst = () => {
  const { t } = useTranslation();

  return (
    <EmptyState
      icon={<Ruler />}
      title={t('No measurement yet')}
      text={t(
        'Enter the weights of your keys in Measure: the figure fills in as you go.',
      )}
      actions={
        <Button asChild className="min-h-[46px]">
          <Link to="/measure">
            {t('Start measuring')}
            <ArrowRight />
          </Link>
        </Button>
      }
    />
  );
};
