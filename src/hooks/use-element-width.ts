import { useLayoutEffect, useRef, useState } from 'react';

/**
 * The width an element is laid out at, followed as it changes.
 *
 * Measured before the first paint, so what is drawn from it never shows at a
 * wrong size. A width of nothing — the element hidden, as for print — keeps
 * the last one, so that the drawing comes back as it was.
 */
export const useElementWidth = <T extends HTMLElement>() => {
  const element = useRef<T>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const measured = element.current;
    if (!measured) {
      return;
    }
    const measure = () => {
      const next = measured.getBoundingClientRect().width;
      if (next > 0) {
        setWidth(next);
      }
    };
    const observer = new ResizeObserver(measure);
    observer.observe(measured);
    measure();
    return () => {
      observer.disconnect();
    };
  }, []);

  return [element, width] as const;
};
