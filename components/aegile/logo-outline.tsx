import * as React from 'react';

type SvgProps = React.SVGProps<SVGSVGElement>;

const LogoOutline = (props: SvgProps & React.PropsWithChildren<{}>) => (
  <svg
    width={90}
    height={90}
    viewBox="0 0 90 90"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-white dark:text-black"
    {...props}
  >
    <path
      d="M24.9375 26.5L20.625 19V19C16.7917 12.3333 21.5951 4 29.2853 4L63.7147 3.99999C71.4049 3.99999 76.2171 12.3181 72.3838 18.9847L50.8125 56.5C48.8997 59.8265 44.1003 59.8265 42.1875 56.5V56.5L40.0313 52.75"
      stroke="currentColor"
      strokeWidth={8}
    />
    <path
      d="M46.875 42L38.25 57L29.6162 72.0153C25.7829 78.6819 30.5951 87 38.2853 87H72.7147C80.4049 87 85.2171 78.6819 81.3838 72.0153L72.75 57L64.125 42L61.9688 38.25"
      stroke="currentColor"
      strokeWidth={8}
    />
    <path
      d="M52.4407 53L44.9492 40L38.6304 29.0351C34.7832 22.3591 25.149 22.3591 21.3018 29.0351L8.64003 51.007C4.79822 57.6737 9.60991 66 17.3043 66H29.9661H33.7119"
      stroke="currentColor"
      strokeWidth={8}
    />
  </svg>
);
export default LogoOutline;
