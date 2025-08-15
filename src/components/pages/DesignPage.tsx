import { FrontWeightChart } from '../charts/FrontWeightChart';
import { MainLayout } from '../MainLayout';
import { Settings2 } from 'lucide-react';

export const DesignPage = () => {
  return (
    <MainLayout>
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance flex items-center justify-center gap-2 mb-5">
        Design <Settings2 className="w-8 h-8 stroke-primary" />
      </h1>

      <section>
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Front Weight
        </h2>
        <FrontWeightChart />
      </section>
    </MainLayout>
  );
};
