import { MainLayout } from '../MainLayout';
import { Scale } from 'lucide-react';
import { KeyMeasureList } from '../measures/KeyMeasureList';

export const MeasurePage = () => {
  return (
    <MainLayout pageTitle="Measure" pageIcon={<Scale />}>
      <section className="container p-6">
        <div className="flex flex-col gap-5">
          <div className="relative flex flex-col gap-5">
            <KeyMeasureList />
          </div>
        </div>
      </section>
    </MainLayout>
  );
};
