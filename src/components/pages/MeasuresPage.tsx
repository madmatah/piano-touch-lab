import { MainLayout } from '../MainLayout';
import { Scale } from 'lucide-react';

export const MeasuresPage = () => {
  return (
    <MainLayout>
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance flex items-center justify-center gap-2 mb-5">
        Measures <Scale className="w-8 h-8 stroke-primary" />
      </h1>
    </MainLayout>
  );
};
