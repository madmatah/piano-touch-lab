import { Download, TriangleAlert } from 'lucide-react';
import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useExportBackupFile } from '@/hooks/backup/use-export-backup-file';
import { usePianoProfileState } from '@/hooks/store/use-piano-profile-store';
import { useTranslation } from '@/hooks/use-translation';

export interface NewProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (brand: string, model: string) => void;
}

export const NewProfileDialog = ({
  isOpen: open,
  onOpenChange,
  onConfirm,
}: NewProfileDialogProps) => {
  const { t } = useTranslation();
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const { isDemoProfile } = usePianoProfileState();
  const { exportBackupFile } = useExportBackupFile();

  const handleConfirm = () => {
    onConfirm(brand, model);
    setBrand('');
    setModel('');
    onOpenChange(false);
  };

  const handleCancel = () => {
    setBrand('');
    setModel('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* No description: the two fields and the warning say it all. */}
      <DialogContent aria-describedby={undefined}>
        <DialogHeader className="gap-2 pr-9">
          <span className="ptl-label">
            {t('File', { ns: 'navigation' })} ·{' '}
            {t('New Profile', { ns: 'navigation' })}
          </span>
          <DialogTitle>{t('Create a new piano profile')}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-[7px]">
          <Label htmlFor="brand">{t('Piano brand')}</Label>
          <Input
            id="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder={t('Brand')}
          />
        </div>
        <div className="flex flex-col gap-[7px]">
          <Label htmlFor="model">{t('Piano model')}</Label>
          <Input
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder={t('Model')}
          />
        </div>
        {isDemoProfile ? null : (
          <Alert variant="warn">
            <TriangleAlert />
            <AlertDescription>
              {t(
                'All data from the current profile will be deleted. Please save your work first!',
              )}
            </AlertDescription>
          </Alert>
        )}

        {/*
         * The way out stands outside the warning: the profile on screen is
         * not always the one the flag says it is — a measures-only import
         * leaves the demonstration flag up — and an export costs nothing
         * when there is nothing to lose.
         */}
        <button
          type="button"
          onClick={exportBackupFile}
          className="inline-flex cursor-pointer items-center gap-1.5 self-start text-[14px] font-semibold text-ptl-brass transition-colors hover:text-foreground"
        >
          <Download className="size-[15px]" />
          {t('Export the current profile')}
        </button>

        <DialogFooter>
          <Button variant="outlineStrong" onClick={handleCancel}>
            {t('Cancel')}
          </Button>
          <Button onClick={handleConfirm}>{t('Create New Profile')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
