import { useCallback, useMemo } from 'react';
import { RadioGroupItem } from '../ui/radio-group';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Info } from 'lucide-react';

export interface RadioGroupItemProps<T extends string> {
  description?: string;
  disabledReason?: string;
  isDisabled?: boolean;
  label: string;
  onClick: (value: T) => void;
  value: T;
}

export const RadioItem = <T extends string>({
  description,
  disabledReason,
  isDisabled,
  label,
  value,
  onClick,
}: RadioGroupItemProps<T>) => {
  const onClickHandler = useCallback(() => {
    onClick(value);
  }, [onClick, value]);

  const shouldDisplayTooltip = useMemo(() => {
    return !!isDisabled && disabledReason;
  }, [disabledReason, isDisabled]);

  const labelClassName = useMemo(() => {
    return cn(
      'text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-input/20 flex items-start gap-3 rounded-lg border p-3 cursor-pointer hover:bg-input/10 transition-colors',
      isDisabled
        ? 'cursor-not-allowed opacity-70 bg-input/20 hover:bg-input/20'
        : '',
    );
  }, [isDisabled]);

  const itemContent = useMemo(
    () => (
      <>
        <RadioGroupItem
          value={value}
          className="mt-1"
          onClick={onClickHandler}
          disabled={!!isDisabled}
        />
        <div className="grid gap-1 font-normal">
          <div className="font-medium">{label}</div>
          {description ? (
            <div className="text-muted-foreground text-xs leading-snug text-balance">
              {description}
            </div>
          ) : null}
        </div>
      </>
    ),
    [value, onClickHandler, isDisabled, label, description],
  );

  return shouldDisplayTooltip ? (
    <div>
      <Tooltip>
        <TooltipTrigger asChild>
          <label className={labelClassName}>{itemContent}</label>
        </TooltipTrigger>
        <TooltipContent
          backgroundColor="bg-blue-100"
          textColor="text-blue-900"
          arrowClassName="bg-blue-100 fill-blue-100"
          className="font-semibold"
        >
          <div className="inline-flex items-center gap-2">
            <span>
              <Info className="w-4 h-4" />
            </span>
            <span>{disabledReason}</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  ) : (
    <label className={labelClassName}>{itemContent}</label>
  );
};
