import { MainLayout } from '../MainLayout';
import { Scale } from 'lucide-react';
import { KeyMeasureList } from '../measures/KeyMeasureList';

export const MeasurePage = () => {
  return (
    <MainLayout>
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance flex items-center justify-center gap-2 mb-5">
        <Scale className="w-11 h-11 stroke-primary pr-2" /> Measure
      </h1>

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
