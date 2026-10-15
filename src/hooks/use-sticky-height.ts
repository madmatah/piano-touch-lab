import { useLayoutEffect, type RefObject } from 'react';

/**
 * Publishes the height of an element that sticks to the top of the page, as a
 * custom property on the root, and 0 whenever it does not stick.
 *
 * The page adds these up into its scroll padding, so that the browser scrolls
 * a field the focus moves to into view below what sticks, not behind it.
 */
export const useStickyHeight = (
  element: RefObject<HTMLElement | null>,
  property: `--${string}`,
) => {
  useLayoutEffect(() => {
    const sticky = element.current;
    if (!sticky) {
      return;
    }
    const root = document.documentElement;
    const publish = () => {
      const sticks = getComputedStyle(sticky).position === 'sticky';
      root.style.setProperty(
        property,
        sticks ? `${sticky.offsetHeight}px` : '0px',
      );
    };
    // Its height changes with the window, and so does whether it sticks.
    const observer = new ResizeObserver(publish);
    observer.observe(sticky);
    window.addEventListener('resize', publish);
    publish();
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', publish);
      root.style.removeProperty(property);
    };
  }, [element, property]);
};
