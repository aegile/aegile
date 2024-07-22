import type { SVGProps } from "react";

import type { SVGRProps } from "./types";

export const DoneIcon = ({
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
    aria-label="Done Status"
    aria-labelledby={titleId}
    aria-describedby={descId}
    {...props}
  >
    <mask
      id="done-path-mask"
      x="0"
      y="0"
      width="14"
      height="14"
      maskUnits="userSpaceOnUse"
    >
      <rect width="14" height="14" fill="white" />
      <path
        d="M10.951 4.24896C11.283 4.58091 11.283 5.11909 10.951 5.45104L5.95104 10.451C5.61909 10.783 5.0809 10.783 4.74896 10.451L2.74896 8.45104C2.41701 8.11909 2.41701 7.5809 2.74896 7.24896C3.0809 6.91701 3.61909 6.91701 3.95104 7.24896L5.35 8.64792L9.74896 4.24896C10.0809 3.91701 10.6191 3.91701 10.951 4.24896Z"
        fill="black"
      />
    </mask>

    <circle
      cx="7"
      cy="7"
      r="6"
      fill="none"
      stroke="#5e6ad2"
      strokeWidth="2"
      strokeDasharray="3.14 0"
      strokeDashoffset="-0.7"
      mask="url(#done-path-mask)"
    ></circle>
    <circle
      cx="7"
      cy="7"
      r="3"
      fill="none"
      stroke="#5e6ad2"
      strokeWidth="6"
      strokeDasharray="18.84955592153876 100"
      strokeDashoffset="0"
      mask="url(#done-path-mask)"
    ></circle>
  </svg>
);
