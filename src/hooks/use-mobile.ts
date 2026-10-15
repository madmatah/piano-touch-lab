import * as React from 'react';

/**
 * Under this, the navigation is a drawer rather than a column of the page.
 *
 * Measured rather than chosen: the sidebar is 250px, the page keeps 40px of
 * margin on each side, and a figure will not draw its keyboard under 666px —
 * it scrolls sideways in its own frame instead. Anything under a thousand
 * leaves the figure less than it needs, so the drawer holds until `lg`.
 */
const MOBILE_BREAKPOINT = '64rem';

/**
 * Asked of the very media query the stylesheet's `lg` asks, rather than of
 * `innerWidth`: that is rounded to a whole pixel, the query is not. A window
 * of 1126 px zoomed to 110 % is 1023.6 px wide: rounded, it was a desktop,
 * which hid the drawer's handle, while the stylesheet hid the sidebar — and
 * the page was left with no navigation at all.
 *
 * `screen`: while a page prints, the same query is asked of the sheet, and an
 * upright sheet is narrower than 64rem — the page would turn into its phone
 * layout for the print, and was not always back from it when the print ended.
 */
const MOBILE_QUERY = `screen and (width < ${MOBILE_BREAKPOINT})`;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const onChange = () => {
      setIsMobile(mql.matches);
    };
    mql.addEventListener('change', onChange);
    setIsMobile(mql.matches);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return !!isMobile;
}
