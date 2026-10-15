import { Download, TriangleAlert } from 'lucide-react';
import { useRef } from 'react';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useExportBackupFile } from '@/hooks/backup/use-export-backup-file';
import { useLoadDemoData } from '@/hooks/demo/use-load-demo-data';
import { usePianoProfileState } from '@/hooks/store/use-piano-profile-store';
import { useTranslation } from '@/hooks/use-translation';

export interface LoadDemoDialogProps {
  isOpen: boolean;
  /** Keys carrying both a down and an up weight, for the warning. */
  measured: number;
  onOpenChange: (open: boolean) => void;
  total: number;
}

/**
 * What stands between someone's piano and the demonstration one.
 *
 * The application keeps a single profile, so loading the demo overwrites it.
 * The way out is offered before the door rather than after: export, then
 * load — and the export is the button that carries the weight.
 */
export const LoadDemoDialog = ({
  isOpen,
  measured,
  onOpenChange,
  total,
}: LoadDemoDialogProps) => {
  const { t } = useTranslation();
  const { brand, model } = usePianoProfileState();
  const { exportBackupFile } = useExportBackupFile();
  const { loadDemoData } = useLoadDemoData();
  const exportButton = useRef<HTMLButtonElement>(null);

  const load = () => {
    loadDemoData();
    onOpenChange(false);
  };

  const exportThenLoad = () => {
    exportBackupFile();
    load();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        // Opening on "replace without exporting" would put the one
        // irreversible action under the first keystroke.
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          exportButton.current?.focus();
        }}
      >
        <DialogHeader className="gap-2 pr-9">
          <span className="ptl-label">{t('Demonstration piano')}</span>
          <DialogTitle>{t('Replace your profile with the demo?')}</DialogTitle>
        </DialogHeader>
        <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
          {t(
            'Piano Touch Lab keeps one profile at a time. The demonstration piano will replace yours: export it first and you will be able to import it again from File › Import.',
          )}
        </p>
        <Alert variant="default">
          <TriangleAlert />
          <AlertDescription className="gap-1">
            <span className="font-serif text-[17px] text-foreground">
              {brand}
              {brand && model ? ' ' : null}
              {model ? <em className="italic">{model}</em> : null}
            </span>
            <span className="font-mono text-[12.5px]">
              {t('{{measured}}/{{total}} keys measured · design and options', {
                measured,
                total,
              })}
            </span>
          </AlertDescription>
        </Alert>
        <DialogFooter className="items-center sm:justify-between">
          <Button variant="link" className="text-destructive" onClick={load}>
            {t('Replace without exporting')}
          </Button>
          <div className="flex flex-wrap gap-2.5">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t('Cancel')}
            </Button>
            <Button ref={exportButton} onClick={exportThenLoad}>
              <Download className="size-4" />
              {t('Export, then load')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
