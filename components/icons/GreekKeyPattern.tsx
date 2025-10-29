import React from 'react';

export const GreekKeyPattern: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    style={{ pointerEvents: 'none' }}
  >
    <defs>
      <pattern id="greek-key" patternUnits="userSpaceOnUse" width="40" height="40">
        <path d="M0 0 H40 M40 0 V40 M40 40 H0 M0 40 V10 H30 V30 H10 V10" fill="none" stroke="currentColor" strokeWidth="2" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#greek-key)" />
  </svg>
);
