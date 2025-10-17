import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { NumericSelector } from './NumericSelector';

describe('The NumericSelector component', () => {
  let onChange: () => void;
  let defaultProps: {
    onChange: () => void;
    value: number;
    minValue?: number;
    maxValue?: number;
    step?: number;
    labelFormatter?: (value: number) => string;
    maxCharacters?: number;
  };
  let plusButton: HTMLButtonElement;
  let minusButton: HTMLButtonElement;
  let valueDisplay: HTMLElement;
  let input: HTMLElement;

  const renderComponent = (props: Partial<typeof defaultProps> = {}) => {
    return render(<NumericSelector {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    cleanup();
    onChange = mock(() => {
      // do nothing
    });
    defaultProps = {
      onChange,
      value: 10,
    };
  });

  describe('The render() method', () => {
    describe('When rendering with default props', () => {
      beforeEach(() => {
        renderComponent();
      });

      it('should display the value', () => {
        expect(screen.getByText('10')).toBeDefined();
      });

      it('should render two buttons', () => {
        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(2);
      });
    });

    describe('When rendering with custom properties', () => {
      beforeEach(() => {
        renderComponent({
          maxValue: 15,
          minValue: 5,
          step: 0.5,
        });
      });

      it('should display the value', () => {
        expect(screen.getByText('10')).toBeDefined();
      });
    });

    describe('When rendering with labelFormatter', () => {
      beforeEach(() => {
        renderComponent({
          labelFormatter: (value) => `Value: ${value}`,
        });
      });

      it('should display the formatted value', () => {
        expect(screen.getByText('Value: 10')).toBeDefined();
      });
    });

    describe('When rendering without labelFormatter', () => {
      beforeEach(() => {
        renderComponent();
      });

      it('should display the raw value', () => {
        expect(screen.getByText('10')).toBeDefined();
      });
    });
  });

  describe('The increment() method', () => {
    describe('When plus button is clicked', () => {
      beforeEach(() => {
        renderComponent();
        const buttons = screen.getAllByRole('button');
        plusButton = buttons[1]! as HTMLButtonElement;
        fireEvent.click(plusButton);
      });

      it('should call onChange with incremented value', () => {
        expect(onChange).toHaveBeenCalledWith(11);
      });
    });

    describe('When plus button is clicked with labelFormatter', () => {
      beforeEach(() => {
        renderComponent({
          labelFormatter: (value) => `$${value}`,
        });
        const buttons = screen.getAllByRole('button');
        plusButton = buttons[1]! as HTMLButtonElement;
        fireEvent.click(plusButton);
      });

      it('should call onChange with incremented value', () => {
        expect(onChange).toHaveBeenCalledWith(11);
      });
    });

    describe('When plus button is clicked with custom step', () => {
      beforeEach(() => {
        renderComponent({ step: 0.5 });
        const buttons = screen.getAllByRole('button');
        plusButton = buttons[1]! as HTMLButtonElement;
        fireEvent.click(plusButton);
      });

      it('should call onChange with step-incremented value', () => {
        expect(onChange).toHaveBeenCalledWith(10.5);
      });
    });

    describe('When value is at maxValue', () => {
      beforeEach(() => {
        renderComponent({ maxValue: 15, value: 15 });
        const buttons = screen.getAllByRole('button');
        plusButton = buttons[1]! as HTMLButtonElement;
      });

      it('should disable the plus button', () => {
        expect(plusButton.disabled).toBe(true);
      });
    });

    describe('When plus button is disabled and clicked', () => {
      beforeEach(() => {
        renderComponent({ maxValue: 15, value: 15 });
        const buttons = screen.getAllByRole('button');
        plusButton = buttons[1]! as HTMLButtonElement;
        fireEvent.click(plusButton);
      });

      it('should not call onChange', () => {
        expect(onChange).not.toHaveBeenCalled();
      });
    });
  });

  describe('The decrement() method', () => {
    describe('When minus button is clicked', () => {
      beforeEach(() => {
        renderComponent();
        const buttons = screen.getAllByRole('button');
        minusButton = buttons[0]! as HTMLButtonElement;
        fireEvent.click(minusButton);
      });

      it('should call onChange with decremented value', () => {
        expect(onChange).toHaveBeenCalledWith(9);
      });
    });

    describe('When minus button is clicked with labelFormatter', () => {
      beforeEach(() => {
        renderComponent({
          labelFormatter: (value) => `${value}%`,
        });
        const buttons = screen.getAllByRole('button');
        minusButton = buttons[0]! as HTMLButtonElement;
        fireEvent.click(minusButton);
      });

      it('should call onChange with decremented value', () => {
        expect(onChange).toHaveBeenCalledWith(9);
      });
    });

    describe('When minus button is clicked with custom step', () => {
      beforeEach(() => {
        renderComponent({ step: 0.5 });
        const buttons = screen.getAllByRole('button');
        minusButton = buttons[0]! as HTMLButtonElement;
        fireEvent.click(minusButton);
      });

      it('should call onChange with step-decremented value', () => {
        expect(onChange).toHaveBeenCalledWith(9.5);
      });
    });

    describe('When value is at minValue', () => {
      beforeEach(() => {
        renderComponent({ minValue: 5, value: 5 });
        const buttons = screen.getAllByRole('button');
        minusButton = buttons[0]! as HTMLButtonElement;
      });

      it('should disable the minus button', () => {
        expect(minusButton.disabled).toBe(true);
      });
    });

    describe('When minus button is disabled and clicked', () => {
      beforeEach(() => {
        renderComponent({ minValue: 5, value: 5 });
        const buttons = screen.getAllByRole('button');
        minusButton = buttons[0]! as HTMLButtonElement;
        fireEvent.click(minusButton);
      });

      it('should not call onChange', () => {
        expect(onChange).not.toHaveBeenCalled();
      });
    });
  });

  describe('The enterEditMode() method', () => {
    describe('When value display is clicked', () => {
      beforeEach(() => {
        renderComponent();
        valueDisplay = screen.getByText('10');
        fireEvent.click(valueDisplay);
        input = screen.getByDisplayValue('10');
      });

      it('should show input field', () => {
        expect(input).toBeDefined();
      });
    });

    describe('When value display is clicked with labelFormatter', () => {
      beforeEach(() => {
        renderComponent({
          labelFormatter: (value) => `Value: ${value}`,
        });
        valueDisplay = screen.getByText('Value: 10');
        fireEvent.click(valueDisplay);
        input = screen.getByDisplayValue('10');
      });

      it('should show input field with raw value', () => {
        expect(input).toBeDefined();
        expect((input as HTMLInputElement).value).toBe('10');
      });
    });
  });

  describe('The handleInputChange() method', () => {
    describe('When Enter key is pressed with valid value', () => {
      beforeEach(() => {
        renderComponent();
        valueDisplay = screen.getByText('10');
        fireEvent.click(valueDisplay);
        input = screen.getByDisplayValue('10');
        fireEvent.change(input, { target: { value: '12' } });
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      it('should call onChange with new value', () => {
        expect(onChange).toHaveBeenCalledWith(12);
      });
    });

    describe('When Escape key is pressed', () => {
      beforeEach(() => {
        renderComponent();
        valueDisplay = screen.getByText('10');
        fireEvent.click(valueDisplay);
        input = screen.getByDisplayValue('10');
        fireEvent.change(input, { target: { value: '12' } });
        fireEvent.keyDown(input, { key: 'Escape' });
      });

      it('should not call onChange', () => {
        expect(onChange).not.toHaveBeenCalled();
      });
    });

    describe('When input loses focus with valid value', () => {
      beforeEach(() => {
        renderComponent();
        valueDisplay = screen.getByText('10');
        fireEvent.click(valueDisplay);
        input = screen.getByDisplayValue('10');
        fireEvent.change(input, { target: { value: '12' } });
        fireEvent.blur(input);
      });

      it('should call onChange with new value', () => {
        expect(onChange).toHaveBeenCalledWith(12);
      });
    });

    describe('When input loses focus with valid value and labelFormatter', () => {
      beforeEach(() => {
        renderComponent({
          labelFormatter: (value) => `$${value}`,
        });
        valueDisplay = screen.getByText('$10');
        fireEvent.click(valueDisplay);
        input = screen.getByDisplayValue('10');
        fireEvent.change(input, { target: { value: '12' } });
        fireEvent.blur(input);
      });

      it('should call onChange with new value', () => {
        expect(onChange).toHaveBeenCalledWith(12);
      });
    });
  });

  describe('The validateValue() method', () => {
    describe('When value is below minValue', () => {
      beforeEach(() => {
        renderComponent({
          maxValue: 13,
          minValue: 8,
          value: 12,
        });
        valueDisplay = screen.getByText('12');
        fireEvent.click(valueDisplay);
        input = screen.getByDisplayValue('12');
        fireEvent.change(input, { target: { value: '-2' } });
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      it('should not call onChange', () => {
        expect(onChange).not.toHaveBeenCalled();
      });
    });

    describe('When value is above maxValue', () => {
      beforeEach(() => {
        renderComponent({
          maxValue: 13,
          minValue: 8,
          value: 12,
        });
        valueDisplay = screen.getByText('12');
        fireEvent.click(valueDisplay);
        input = screen.getByDisplayValue('12');
        fireEvent.change(input, { target: { value: '15' } });
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      it('should not call onChange', () => {
        expect(onChange).not.toHaveBeenCalled();
      });
    });

    describe('When value is within bounds', () => {
      beforeEach(() => {
        renderComponent({
          maxValue: 13,
          minValue: 8,
          step: 0.02,
          value: 12,
        });
        valueDisplay = screen.getByText('12');
        fireEvent.click(valueDisplay);
        input = screen.getByDisplayValue('12');
        fireEvent.change(input, { target: { value: '10.5' } });
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      it('should call onChange with valid value', () => {
        expect(onChange).toHaveBeenCalledWith(10.5);
      });
    });

    describe('When input is non-numeric', () => {
      beforeEach(() => {
        renderComponent();
        valueDisplay = screen.getByText('10');
        fireEvent.click(valueDisplay);
        input = screen.getByDisplayValue('10');
        fireEvent.change(input, { target: { value: 'abc' } });
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      it('should not call onChange', () => {
        expect(onChange).not.toHaveBeenCalled();
      });
    });
  });

  describe('The roundToStep() method', () => {
    describe('When step has decimal precision', () => {
      beforeEach(() => {
        renderComponent({ step: 0.02 });
        valueDisplay = screen.getByText('10');
        fireEvent.click(valueDisplay);
        input = screen.getByDisplayValue('10');
        fireEvent.change(input, { target: { value: '10.123' } });
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      it('should round to step precision', () => {
        expect(onChange).toHaveBeenCalledWith(10.12);
      });
    });

    describe('When step is integer', () => {
      beforeEach(() => {
        renderComponent({ step: 1 });
        valueDisplay = screen.getByText('10');
        fireEvent.click(valueDisplay);
        input = screen.getByDisplayValue('10');
        fireEvent.change(input, { target: { value: '10.7' } });
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      it('should round to integer', () => {
        expect(onChange).toHaveBeenCalledWith(11);
      });
    });
  });

  describe('The edge cases', () => {
    describe('When minValue and maxValue are undefined', () => {
      beforeEach(() => {
        renderComponent({ value: 10 });
        valueDisplay = screen.getByText('10');
        fireEvent.click(valueDisplay);
        input = screen.getByDisplayValue('10');
        fireEvent.change(input, { target: { value: '1000' } });
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      it('should accept any value', () => {
        expect(onChange).toHaveBeenCalledWith(1000);
      });
    });

    describe('When step is very small', () => {
      beforeEach(() => {
        renderComponent({ step: 0.001 });
        valueDisplay = screen.getByText('10');
        fireEvent.click(valueDisplay);
        input = screen.getByDisplayValue('10');
        fireEvent.change(input, { target: { value: '10.1234' } });
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      it('should round to step precision', () => {
        expect(onChange).toHaveBeenCalledWith(10.123);
      });
    });
  });

  describe('The maxCharacters prop', () => {
    describe('When maxCharacters is explicitly provided', () => {
      beforeEach(() => {
        renderComponent({ maxCharacters: 5 });
        valueDisplay = screen.getByText('10');
      });

      it('should apply width style to display div', () => {
        const displayDiv = valueDisplay.parentElement;
        expect(displayDiv?.getAttribute('style')).toContain(
          'width: calc(5ch + 2.5rem)',
        );
      });

      it('should apply width style to input when editing', () => {
        fireEvent.click(valueDisplay);
        input = screen.getByDisplayValue('10');
        expect(input.getAttribute('style')).toContain(
          'width: calc(5ch + 2.5rem)',
        );
      });
    });

    describe('When maxValue is provided without maxCharacters', () => {
      beforeEach(() => {
        renderComponent({ maxValue: 100, step: 0.5 });
        valueDisplay = screen.getByText('10');
      });

      it('should calculate and apply width from maxValue', () => {
        const displayDiv = valueDisplay.parentElement;
        expect(displayDiv?.getAttribute('style')).toContain(
          'width: calc(5ch + 2.5rem)',
        );
      });

      it('should apply calculated width to input when editing', () => {
        fireEvent.click(valueDisplay);
        input = screen.getByDisplayValue('10');
        expect(input.getAttribute('style')).toContain(
          'width: calc(5ch + 2.5rem)',
        );
      });
    });

    describe('When neither maxCharacters nor maxValue is provided', () => {
      beforeEach(() => {
        renderComponent();
        valueDisplay = screen.getByText('10');
      });

      it('should not apply width style to display div', () => {
        const displayDiv = valueDisplay.parentElement;
        const style = displayDiv?.getAttribute('style');
        expect(style === null || !style?.includes('width')).toBe(true);
      });

      it('should not apply width style to input when editing', () => {
        fireEvent.click(valueDisplay);
        input = screen.getByDisplayValue('10');
        const style = input.getAttribute('style');
        expect(!style?.includes('width')).toBe(true);
      });
    });

    describe('When both maxCharacters and maxValue are provided', () => {
      beforeEach(() => {
        renderComponent({ maxCharacters: 6, maxValue: 100, step: 0.5 });
        valueDisplay = screen.getByText('10');
      });

      it('should use maxCharacters over calculated value', () => {
        const displayDiv = valueDisplay.parentElement;
        expect(displayDiv?.getAttribute('style')).toContain(
          'width: calc(6ch + 2.5rem)',
        );
      });
    });
  });
});
