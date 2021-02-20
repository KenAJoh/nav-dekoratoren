import React, { SVGProps } from 'react';

const Timeglass = (props: SVGProps<SVGSVGElement>) => (
    <svg width={props.width} height={props.height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17 2H7v4h10V2zM7.416 8a5.001 5.001 0 009.168 0H7.416zM19 6a6.996 6.996 0 01-3.392 6A6.996 6.996 0 0119 18v6H5v-6a6.996 6.996 0 013.392-6A6.996 6.996 0 015 6V0h14v6zm-2 12v1.857L12 17l-5 2.857V18a5 5 0 0110 0zm-5 1.303L16.719 22H7.28L12 19.303zM11 14v2h2v-2h-2z"
            fill={props.fill ?? '#000000'}
        />
    </svg>
);

export default Timeglass;