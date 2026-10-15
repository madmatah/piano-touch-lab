import {
  NumericSelector,
  type NumericSelectorProps,
} from '@/components/app-ui/numeric-selector/NumericSelector';

export interface WippenDesignSpecificationProps {
  name: string;
  selectorProps: NumericSelectorProps;
}

/**
 * One setting of the spring design: what is being set on the left, its stepper
 * on the right.
 *
 * The row now lives inside the objective card, in a column barely wider than
 * the stepper itself, so it wraps instead of squeezing the stepper: a label
 * above its control still reads as one setting, a clipped stepper does not.
 */
export const WipenDesignSpecificationItem: React.FC<
  WippenDesignSpecificationProps
> = ({ name, selectorProps }) => {
  return (
    <div className="flex flex-col items-start gap-2">
      <span className="text-sm font-semibold">{name}</span>
      <NumericSelector {...selectorProps} />
    </div>
  );
};
