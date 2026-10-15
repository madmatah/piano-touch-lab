import * as React from 'react';

/**
 * A coil spring, as drawn in the mockups.
 *
 * Lucide has no spring, and the existing `SupportSpring` drawing is a part
 * seen from the side, too detailed to read at 34 px. Colour and stroke are
 * left to the caller so the glyph follows the text it sits above.
 */
export const CoilSpring = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.3}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2v3l-5 2 10 3-10 3 10 3-5 2v4" />
  </svg>
);
