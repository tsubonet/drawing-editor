import * as React from "react";
import { Pixel, Layer, PosX, PosY } from "../model/Layer";
import { useDrag } from "../utils/drag";

interface RectProps {
  posX: PosX;
  posY: PosY;
  src: Layer;
  onResized: (dx: Pixel, dy: Pixel, layerId: number, posX: PosX, posY: PosY) => void;
}
const TOLERANCE = 4 as Pixel;
const HANDLE_SIZE = 10 as Pixel;

export const ResizeHandler: React.FC<RectProps> = ({
  posX,
  posY,
  src,
  onResized,
}) => {
  const { id, positionX, positionY, width, height } = src;

  const ref = useDrag(
    (dx, dy) => onResized(dx, dy, id, posX, posY)
  );

  let x = positionX - HANDLE_SIZE / 2;
  if (posX === "center") {
    x += width / 2;
  } else if (posX === "right") {
    x += width;
  }

  let y = positionY - HANDLE_SIZE / 2;
  if (posY === "middle") {
    y += height / 2;
  } else if (posY === "bottom") {
    y += height;
  }

  return (
    <g>
      <rect
        fill="white"
        stroke="rgb(36, 136,253)"
        strokeWidth="1"
        width={HANDLE_SIZE}
        height={HANDLE_SIZE}
        x={x}
        y={y}
      />
      <rect
        ref={ref}
        fillOpacity="0"
        width={HANDLE_SIZE + TOLERANCE * 2}
        height={HANDLE_SIZE + TOLERANCE * 2}
        x={x - TOLERANCE}
        y={y - TOLERANCE}
        style={{ cursor: "pointer" }}
      />
    </g>
  );
};
