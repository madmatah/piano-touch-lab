import { ArrowRight, Ruler } from 'lucide-react';
import { Link } from 'react-router-dom';

import { EmptyState } from '@/components/app-ui/EmptyState';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';

/**
 * A design page before the piano has been measured far enough to design it:
 * what is missing, and the way to it, where a grey alert gave neither.
 */
export const NotEnoughData = ({
  description,
  title,
}: {
  description: string;
  title: string;
}) => {
  const { t } = useTranslation();

  return (
    <section className="flex justify-center rounded-md border border-ptl-rule-strong bg-card px-6 py-14">
      <EmptyState
        icon={<Ruler />}
        title={title}
        text={description}
        actions={
          <Button asChild variant="outlineStrong" className="min-h-[46px]">
            <Link to="/measure">
              {t('Complete the measurements')}
              <ArrowRight />
            </Link>
          </Button>
        }
      />
    </section>
  );
};
