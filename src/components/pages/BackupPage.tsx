import { MainLayout } from '../MainLayout';
import { FileDown } from 'lucide-react';

export const BackupPage = () => {
  return (
    <MainLayout>
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance flex items-center justify-center gap-2 mb-5">
        <FileDown className="w-11 h-11 stroke-primary pr-2" /> Backup
      </h1>
    </MainLayout>
  );
};
