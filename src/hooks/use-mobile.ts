import * as React from 'react';

/**
 * Under this, the navigation is a drawer rather than a column of the page.
 *
 * Measured rather than chosen: the sidebar is 250px, the page keeps 40px of
 * margin on each side, and a figure will not draw its keyboard under 666px —
 * it scrolls sideways in its own frame instead. Anything under a thousand
 * leaves the figure less than it needs, so the drawer holds until `lg`.
 */
const MOBILE_BREAKPOINT = 1024;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return !!isMobile;
}
