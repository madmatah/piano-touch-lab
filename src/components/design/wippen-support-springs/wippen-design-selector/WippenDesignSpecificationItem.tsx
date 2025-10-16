import {
  NumericSelector,
  type NumericSelectorProps,
} from '@/components/app-ui/numeric-selector/NumericSelector';

export interface WippenDesignSpecificationProps {
  name: string;
  selectorProps: NumericSelectorProps;
}

export const WipenDesignSpecificationItem: React.FC<
  WippenDesignSpecificationProps
> = ({ name, selectorProps }) => {
  return (
    <div className="flex flex-col gap-1 min-w-[220px]">
      <div className="text-center text-sm font-bold">{name}</div>
      <div>
        <NumericSelector {...selectorProps} />
      </div>
    </div>
  );
};
