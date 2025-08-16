import { MainLayout } from '../MainLayout';
import { Settings2 } from 'lucide-react';

export const DesignPage = () => {
  return (
    <MainLayout>
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance flex items-center justify-center gap-2 mb-5">
        <Settings2 className="w-11 h-11 stroke-primary pr-2" /> Design
      </h1>
    </MainLayout>
  );
};
