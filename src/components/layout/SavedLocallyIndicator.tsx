import { useTranslation } from '@/hooks/use-translation';

/** Reassurance that the work is kept, and kept here. */
export const SavedLocallyIndicator = () => {
  const { t } = useTranslation();

  return (
    <span className="inline-flex items-center gap-[7px] text-[12.5px] text-muted-foreground">
      <span className="size-[7px] rounded-full bg-ptl-ok" />
      {t('Saved in this browser')}
    </span>
  );
};
