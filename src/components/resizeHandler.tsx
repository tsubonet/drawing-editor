import * as React from "react";
import { Pixel } from "../model/Layer";
import { useDrag } from "../utils/drag";

interface RectProps {
  parentSize: [Pixel, Pixel];
  positionX: Pixel;
  positionY: Pixel;
  // onDragStart: (layerId: number) => void;
  // onMove: (layerId: number, dx: number, dy: number) => void;
  // onDragEnd: () => void;
}
const TOLERANCE = 4 as Pixel;
const HANDLE_SIZE = 10 as Pixel;

export const ResizeHandler: React.FC<RectProps> = ({ 
  parentSize,
  positionX,
  positionY,
}) => {
  // const ref = useDrag(src.id, onDragStart, onDragEnd, onMove);

  const [width, height] = parentSize;
  const x = positionX + width - HANDLE_SIZE / 2;
  const y = positionY + height - HANDLE_SIZE / 2;

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
        //ref={ref}
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
