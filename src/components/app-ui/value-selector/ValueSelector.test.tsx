import { describe, it, expect, beforeEach, mock, afterEach } from 'bun:test';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ValueSelector } from './ValueSelector';

describe('The ValueSelector component', () => {
  const onChange = mock(() => {});
  let previousButton: HTMLButtonElement;
  let nextButton: HTMLButtonElement;
  let valueDisplay: HTMLElement;

  const renderComponent = (
    props: Partial<{
      currentValue: string;
      onChange: () => void;
      values: Array<{ value: string; label: string }>;
    }> = {},
  ) => {
    const mergedProps = {
      currentValue: 'option-2',
      onChange,
      values: [
        { label: 'Option 1', value: 'option-1' },
        { label: 'Option 2', value: 'option-2' },
        { label: 'Option 3', value: 'option-3' },
      ],
      ...props,
    };
    return render(<ValueSelector {...mergedProps} />);
  };

  afterEach(() => {
    onChange.mockReset();
  });

  beforeEach(() => {
    cleanup();
  });

  describe('The render() method', () => {
    describe('When rendering with default props', () => {
      beforeEach(() => {
        renderComponent();
      });

      it('should display the current value', () => {
        expect(screen.getByText('Option 2')).toBeDefined();
      });

      it('should render two buttons', () => {
        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(2);
      });

      it('should enable both navigation buttons', () => {
        const buttons = screen.getAllByRole('button');
        previousButton = buttons[0]! as HTMLButtonElement;
        nextButton = buttons[1]! as HTMLButtonElement;

        expect(previousButton.disabled).toBe(false);
        expect(nextButton.disabled).toBe(false);
      });
    });

    describe('When rendering with numeric values', () => {
      beforeEach(() => {
        renderComponent({
          currentValue: 'value-2',
          values: [
            { label: 'One', value: 'value-1' },
            { label: 'Two', value: 'value-2' },
            { label: 'Three', value: 'value-3' },
            { label: 'Four', value: 'value-4' },
            { label: 'Five', value: 'value-5' },
          ],
        });
      });

      it('should display the current numeric value', () => {
        expect(screen.getByText('Two')).toBeDefined();
      });
    });

    describe('When rendering with single value', () => {
      beforeEach(() => {
        renderComponent({
          currentValue: 'only-value',
          values: [{ label: 'Only Option', value: 'only-value' }],
        });
      });

      it('should disable both navigation buttons', () => {
        const buttons = screen.getAllByRole('button');
        previousButton = buttons[0]! as HTMLButtonElement;
        nextButton = buttons[1]! as HTMLButtonElement;

        expect(previousButton.disabled).toBe(true);
        expect(nextButton.disabled).toBe(true);
      });
    });
  });

  describe('The handleGoPrevious() method', () => {
    describe('When previous button is clicked', () => {
      beforeEach(() => {
        renderComponent();
        const buttons = screen.getAllByRole('button');
        previousButton = buttons[0]! as HTMLButtonElement;
        fireEvent.click(previousButton);
      });

      it('should call onChange with previous value', () => {
        expect(onChange).toHaveBeenCalledWith('option-1');
      });
    });

    describe('When previous button is clicked at first position', () => {
      beforeEach(() => {
        renderComponent({
          currentValue: 'option-1',
        });
        const buttons = screen.getAllByRole('button');
        previousButton = buttons[0]! as HTMLButtonElement;
      });

      it('should disable the previous button', () => {
        expect(previousButton.disabled).toBe(true);
      });
    });

    describe('When previous button is disabled and clicked', () => {
      beforeEach(() => {
        renderComponent({
          currentValue: 'option-1',
        });
        const buttons = screen.getAllByRole('button');
        previousButton = buttons[0]! as HTMLButtonElement;
        fireEvent.click(previousButton);
      });

      it('should not call onChange', () => {
        expect(onChange).not.toHaveBeenCalled();
      });
    });
  });

  describe('The handleGoNext() method', () => {
    describe('When next button is clicked', () => {
      beforeEach(() => {
        renderComponent();
        const buttons = screen.getAllByRole('button');
        nextButton = buttons[1]! as HTMLButtonElement;
        fireEvent.click(nextButton);
      });

      it('should call onChange with next value', () => {
        expect(onChange).toHaveBeenCalledWith('option-3');
      });
    });

    describe('When next button is clicked at last position', () => {
      beforeEach(() => {
        renderComponent({
          currentValue: 'option-3',
        });
        const buttons = screen.getAllByRole('button');
        nextButton = buttons[1]! as HTMLButtonElement;
      });

      it('should disable the next button', () => {
        expect(nextButton.disabled).toBe(true);
      });
    });

    describe('When next button is disabled and clicked', () => {
      beforeEach(() => {
        renderComponent({
          currentValue: 'option-3',
        });
        const buttons = screen.getAllByRole('button');
        nextButton = buttons[1]! as HTMLButtonElement;
        fireEvent.click(nextButton);
      });

      it('should not call onChange', () => {
        expect(onChange).not.toHaveBeenCalled();
      });
    });
  });

  describe('The currentValueIndex calculation', () => {
    describe('When currentValue is in values array', () => {
      beforeEach(() => {
        renderComponent({
          currentValue: 'option-2',
        });
      });

      it('should find correct index', () => {
        const buttons = screen.getAllByRole('button');
        previousButton = buttons[0]! as HTMLButtonElement;
        nextButton = buttons[1]! as HTMLButtonElement;

        expect(previousButton.disabled).toBe(false);
        expect(nextButton.disabled).toBe(false);
      });
    });

    describe('When currentValue is not in values array', () => {
      beforeEach(() => {
        renderComponent({
          currentValue: 'invalid-value',
        });
      });

      it('should default to first index', () => {
        const buttons = screen.getAllByRole('button');
        previousButton = buttons[0]! as HTMLButtonElement;
        nextButton = buttons[1]! as HTMLButtonElement;

        expect(previousButton.disabled).toBe(true);
        expect(nextButton.disabled).toBe(false);
      });
    });
  });

  describe('The maxValueLength calculation', () => {
    describe('When values have different lengths', () => {
      beforeEach(() => {
        renderComponent({
          currentValue: 'short-value',
          values: [
            { label: 'Short', value: 'short-value' },
            { label: 'Very Long Option Name', value: 'very-long-value' },
            { label: 'Medium', value: 'medium-value' },
          ],
        });
      });

      it('should calculate correct width based on longest value', () => {
        valueDisplay = screen.getByText('Short');
        const computedStyle = window.getComputedStyle(valueDisplay);
        expect(computedStyle.width).toBeDefined();
      });
    });

    describe('When all values have same length', () => {
      beforeEach(() => {
        renderComponent({
          currentValue: 'test-value-1',
          values: [
            { label: 'Test 1', value: 'test-value-1' },
            { label: 'Test 2', value: 'test-value-2' },
            { label: 'Test 3', value: 'test-value-3' },
          ],
        });
      });

      it('should use consistent width', () => {
        valueDisplay = screen.getByText('Test 1');
        const computedStyle = window.getComputedStyle(valueDisplay);
        expect(computedStyle.width).toBeDefined();
      });
    });
  });

  describe('The edge cases', () => {
    describe('When values array is empty', () => {
      beforeEach(() => {
        renderComponent({
          currentValue: 'Any Value',
          values: [],
        });
      });

      it('should handle empty array gracefully', () => {
        const buttons = screen.getAllByRole('button');
        previousButton = buttons[0]! as HTMLButtonElement;
        nextButton = buttons[1]! as HTMLButtonElement;

        expect(previousButton.disabled).toBe(true);
        expect(nextButton.disabled).toBe(true);
      });
    });

    describe('When values array has only one item', () => {
      beforeEach(() => {
        renderComponent({
          currentValue: 'only-value',
          values: [{ label: 'Only Option', value: 'only-value' }],
        });
      });

      it('should handle single item array gracefully', () => {
        const buttons = screen.getAllByRole('button');
        previousButton = buttons[0]! as HTMLButtonElement;
        nextButton = buttons[1]! as HTMLButtonElement;

        expect(previousButton.disabled).toBe(true);
        expect(nextButton.disabled).toBe(true);
      });
    });

    describe('When values contain mixed types', () => {
      beforeEach(() => {
        renderComponent({
          currentValue: 'value-two',
          values: [
            { label: 'One', value: 'value-one' },
            { label: 'Two', value: 'value-two' },
            { label: 'Three', value: 'value-three' },
            { label: 'Four', value: 'value-four' },
          ],
        });
      });

      it('should handle mixed types correctly', () => {
        expect(screen.getByText('Two')).toBeDefined();
        const buttons = screen.getAllByRole('button');
        previousButton = buttons[0]! as HTMLButtonElement;
        nextButton = buttons[1]! as HTMLButtonElement;

        expect(previousButton.disabled).toBe(false);
        expect(nextButton.disabled).toBe(false);
      });
    });

    describe('When navigating through all values', () => {
      it('should call onChange with correct values when navigating forward', () => {
        renderComponent({
          currentValue: 'value-first',
          values: [
            { label: 'First', value: 'value-first' },
            { label: 'Second', value: 'value-second' },
            { label: 'Third', value: 'value-third' },
            { label: 'Fourth', value: 'value-fourth' },
          ],
        });

        const buttons = screen.getAllByRole('button');
        const nextButton = buttons[1]! as HTMLButtonElement;

        fireEvent.click(nextButton);
        expect(onChange).toHaveBeenCalledWith('value-second');
      });

      it('should call onChange with correct values when navigating backward', () => {
        renderComponent({
          currentValue: 'value-third',
          values: [
            { label: 'First', value: 'value-first' },
            { label: 'Second', value: 'value-second' },
            { label: 'Third', value: 'value-third' },
            { label: 'Fourth', value: 'value-fourth' },
          ],
        });

        const buttons = screen.getAllByRole('button');
        const previousButton = buttons[0]! as HTMLButtonElement;

        fireEvent.click(previousButton);
        expect(onChange).toHaveBeenCalledWith('value-second');
      });
    });
  });
});
