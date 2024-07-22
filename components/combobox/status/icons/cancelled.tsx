import type { SVGProps } from "react";

import type { SVGRProps } from "./types";

export const CancelledIcon = ({
  title,
  titleId,
  desc,
  descId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-label="Cancelled Status"
    aria-labelledby={titleId}
    aria-describedby={descId}
    {...props}
  >
    <mask
      id="cancelled-path-mask"
      x="0"
      y="0"
      width="14"
      height="14"
      maskUnits="userSpaceOnUse"
    >
      <rect width="14" height="14" fill="white" />
      <path
        fill="black"
        d="M3.73657 3.73657C4.05199 3.42114 4.56339 3.42114 4.87881 3.73657L5.93941 4.79716L7 5.85775L9.12117 3.73657C9.4366 3.42114 9.94801 3.42114 10.2634 3.73657C10.5789 4.05199 10.5789 4.56339 10.2634 4.87881L8.14225 7L10.2634 9.12118C10.5789 9.4366 10.5789 9.94801 10.2634 10.2634C9.94801 10.5789 9.4366 10.5789 9.12117 10.2634L7 8.14225L4.87881 10.2634C4.56339 10.5789 4.05199 10.5789 3.73657 10.2634C3.42114 9.94801 3.42114 9.4366 3.73657 9.12118L4.79716 8.06059L5.85775 7L3.73657 4.87881C3.42114 4.56339 3.42114 4.05199 3.73657 3.73657Z"
      />
    </mask>
    <circle
      cx="7"
      cy="7"
      r="6"
      fill="none"
      stroke="#95a2b3"
      stroke-width="2"
      stroke-dasharray="3.14 0"
      stroke-dashoffset="-0.7"
      mask="url(#cancelled-path-mask)"
    ></circle>
    <circle
      cx="7"
      cy="7"
      r="3"
      fill="none"
      stroke="#95a2b3"
      stroke-width="6"
      stroke-dasharray="18.84955592153876 100"
      stroke-dashoffset="0"
      mask="url(#cancelled-path-mask)"
    ></circle>
  </svg>
);
