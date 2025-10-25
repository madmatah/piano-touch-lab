import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/use-translation';
import { usePianoProfileState } from '@/hooks/store/use-piano-profile-store';

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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('Create a new piano profile')}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 pt-4 pb-2">
          <div className="grid gap-2">
            <Label htmlFor="brand">{t('Piano brand')}</Label>
            <Input
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder={t('Brand')}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="model">{t('Piano model')}</Label>
            <Input
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder={t('Model')}
            />
          </div>
        </div>
        {!isDemoProfile ? (
          <p className="text-xs text-muted-foreground pb-2">
            {t(
              'Note : All data from the current profile will be deleted. Please save your work before!',
            )}
          </p>
        ) : null}

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {t('Cancel')}
          </Button>
          <Button onClick={handleConfirm}>{t('Create New Profile')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
