import React, { CSSProperties } from "react";

interface Props {
  className: string;
  onClick: () => void;
  style: CSSProperties;
}

export const BlastSVG = ({ className, onClick, style }: Props) => {
  return (
    <div style={style} className={className} onClick={onClick}>
      <svg
        width="250"
        height="74"
        viewBox="0 0 250 74"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <rect width="250" height="74" fill="url(#pattern0_19_5)" />
        <defs>
          <pattern
            id="pattern0_19_5"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <use
              xlinkHref="#image0_19_5"
              transform="scale(0.00333333 0.0135135)"
            />
          </pattern>
          <image
            id="image0_19_5"
            width="250"
            height="74"
            xlinkHref="data:image/png;base64,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"
          />
        </defs>
      </svg>
    </div>
  );
};
