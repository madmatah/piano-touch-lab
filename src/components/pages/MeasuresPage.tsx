import { MainLayout } from '../MainLayout';
import { Scale } from 'lucide-react';
import { KeyMeasureList } from '../measures/KeyMeasureList';
import { PianoMeasureList } from '../measures/PianoMeasureList';

export const MeasurePage = () => {
  return (
    <MainLayout pageTitle="Measure" pageIcon={<Scale />}>
      <section className="container p-6">
        <div className="flex flex-col gap-5">
          <div className="relative flex flex-col gap-5">
            <h2 className="text-xl font-bold">For each note</h2>
            <KeyMeasureList />
          </div>

          <div className="flex flex-col gap-5">
            <h2 className="text-xl font-bold">For the whole piano</h2>
            <PianoMeasureList />
          </div>
        </div>
      </section>
    </MainLayout>
  );
};
