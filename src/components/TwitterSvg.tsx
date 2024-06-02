import React from "react";

interface Props {
  className?: string;
  onClick?: () => void;
}

export const TwitterSvg = ({ className, onClick }: Props) => {
  return (
    <div className={className} onClick={onClick}>
      <svg
        className={className}
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M27.4894 2.85587H32.5496L21.4946 15.4911L34.5 32.6848H24.3169L16.3411 22.2569L7.21492 32.6848H2.15165L13.9762 19.17L1.5 2.85587H11.9417L19.1511 12.3874L27.4894 2.85587ZM25.7135 29.656H28.5174L10.4181 5.72556H7.40919L25.7135 29.656Z"
          fill="white"
        />
      </svg>
    </div>
  );
};
