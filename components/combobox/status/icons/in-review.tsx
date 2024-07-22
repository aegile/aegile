import type { SVGProps } from "react";

import type { SVGRProps } from "./types";

export const InReviewIcon = ({
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
    aria-label="In Review Status"
    aria-labelledby={titleId}
    aria-describedby={descId}
    {...props}
  >
    {desc ? <desc id={descId}>{desc}</desc> : null}
    <title id={titleId}>{title}</title>
    <circle
      cx="7"
      cy="7"
      r="6"
      fill="none"
      stroke="#26a544"
      stroke-width="2"
      stroke-dasharray="3.14 0"
      stroke-dashoffset="-0.7"
    ></circle>
    <circle
      cx="7"
      cy="7"
      r="2"
      fill="none"
      stroke="#26a544"
      stroke-width="4"
      stroke-dasharray="9.377654070965532 100"
      stroke-dashoffset="0"
      transform="rotate(-90 7 7)"
    ></circle>
  </svg>
);
