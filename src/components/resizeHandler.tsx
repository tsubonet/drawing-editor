import * as React from "react";
import { Pixel } from "../model/Layer";
import { useDrag } from "../utils/drag";

interface RectProps {
  layerId: number;
  posX: "left" | "right";
  posY: "top" | "bottom";
  parentSize: [Pixel, Pixel, Pixel, Pixel];
  onResized: (layerId: number, dx: number, dy: number) => void;
}
const TOLERANCE = 4 as Pixel;
const HANDLE_SIZE = 10 as Pixel;

export const ResizeHandler: React.FC<RectProps> = ({
  layerId,
  posX,
  posY,
  parentSize,
  onResized,
}) => {
  const ref = useDrag(layerId, () => {}, () => {}, onResized);
  const [positionX, positionY, width, height] = parentSize;

  let x = positionX - HANDLE_SIZE / 2;
  if (posX === "right") {
    x += width;
  }

  let y = positionY - HANDLE_SIZE / 2;
  if (posY === "bottom") {
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
