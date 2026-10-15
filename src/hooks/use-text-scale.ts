import { useLayoutEffect, useRef } from 'react';

/** Past this, a figure is so small that keeping its text full size would cover it. */
const MOST_SCALE = 2.8;

/**
 * Keeps the text of a stretched SVG at the size it was set at.
 *
 * A figure drawn in a fixed viewBox and stretched to its column scales its
 * text along with it: labels set at 10 px came out at 3 px on a phone. This
 * publishes, as `--ptl-text-scale` on the SVG, how much the drawing has been
 * shrunk, for its text to be set that much larger.
 */
export const useTextScale = (viewBoxWidth: number) => {
  const svg = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const element = svg.current;
    if (!element) {
      return;
    }
    const publish = () => {
      const width = element.getBoundingClientRect().width;
      const scale = width > 0 ? Math.min(viewBoxWidth / width, MOST_SCALE) : 1;
      element.style.setProperty('--ptl-text-scale', String(Math.max(scale, 1)));
    };
    const observer = new ResizeObserver(publish);
    observer.observe(element);
    publish();
    return () => {
      observer.disconnect();
    };
  }, [viewBoxWidth]);

  return svg;
};
