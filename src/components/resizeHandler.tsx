import * as React from "react";
import { Pixel, Layer, PosX, PosY } from "../model/layer";
import { useDrag } from "../utils/drag";

interface RectProps {
  posX: PosX;
  posY: PosY;
  src: Layer;
  onDragStart: (e: PointerEvent, layerId: number) => void;
  onDragEnd: () => void;
  onResized: (
    e: PointerEvent,
    dx: Pixel,
    dy: Pixel,
    posX: PosX,
    posY: PosY,
  ) => void;
}
const TOLERANCE = 4 as Pixel;
const HANDLE_SIZE = 10 as Pixel;

export const ResizeHandler: React.FC<RectProps> = ({
  posX,
  posY,
  src,
  onDragStart,
  onDragEnd,
  onResized,
}) => {
  const { id, positionX, positionY, width, height } = src;

  const ref = useDrag<SVGRectElement>(
    (e) => onDragStart(e, id),
    () => onDragEnd(),
    (e, dx, dy, x, y) => onResized(e, dx, dy, posX, posY),
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
        stroke="rgb(36, 136, 253)"
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
