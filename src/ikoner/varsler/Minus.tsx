import React, { SVGProps } from 'react';

const Minus = (props: SVGProps<SVGSVGElement>) => (
    <svg
        {...props}
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M14 8v1H3V8h11z" />
    </svg>
);

export default Minus;
