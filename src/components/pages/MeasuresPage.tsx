import { MainLayout } from '../MainLayout';
import { Scale } from 'lucide-react';
import { KeyMeasureList } from '../measures/KeyMeasureList';
import { PianoMeasureList } from '../measures/PianoMeasureList';
import { useTranslation } from '@/hooks/use-translation';

export const MeasurePage = () => {
  const { t } = useTranslation();

  return (
    <MainLayout pageTitle={t('Measure')} pageIcon={<Scale />}>
      <section className="container p-6">
        <div className="flex flex-col gap-5">
          <div className="relative flex flex-col gap-5">
            <h2 className="text-xl font-bold">{t('For each note')}</h2>
            <KeyMeasureList />
          </div>

          <div className="flex flex-col gap-5">
            <h2 className="text-xl font-bold">{t('For the whole piano')}</h2>
            <PianoMeasureList />
          </div>
        </div>
      </section>
    </MainLayout>
  );
};
