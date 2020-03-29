import * as React from "react";
import { Layer } from "../model/Layer";

interface RectProps {
  src: Layer;
}

export const Rect: React.FC<RectProps> = ({ src }) => {
  return (
    <rect
      width={src.width}
      height={src.height}
      x={src.positionX}
      y={src.positionY}
      transform={`rotate(${src.rotate})`}
      fill="none"
      stroke="black"
      strokeWidth="1"
    />
  );
};
