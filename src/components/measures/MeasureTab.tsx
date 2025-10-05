import { KeyMeasureList } from './KeyMeasureList';
import { PianoMeasureList } from './PianoMeasureList';
import { useTranslation } from '@/hooks/use-translation';

export const MeasureTab = () => {
  const { t } = useTranslation();

  return (
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
  );
};
