import { useCallback } from 'react';
import { RadioGroupItem } from '../ui/radio-group';

export interface RadioGroupItemProps<T extends string> {
  label: string;
  value: T;
  description?: string;
  onClick: (value: T) => void;
}

export const RadioItem = <T extends string>({
  label,
  value,
  description,
  onClick,
}: RadioGroupItemProps<T>) => {
  const onClickHandler = useCallback(() => {
    onClick(value);
  }, [onClick, value]);

  return (
    <label className="text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-input/20 flex items-start gap-3 rounded-lg border p-3 cursor-pointer hover:bg-input/10 transition-colors">
      <RadioGroupItem value={value} className="mt-1" onClick={onClickHandler} />
      <div className="grid gap-1 font-normal">
        <div className="font-medium">{label}</div>
        {description ? (
          <div className="text-muted-foreground text-xs leading-snug text-balance">
            {description}
          </div>
        ) : null}
      </div>
    </label>
  );
};
