import * as React from "react";
import { Layer, PosX, PosY } from "../model/Layer";
import { ResizeHandler } from "./resizeHandler";
import { useDrag } from "../utils/drag";

interface RectProps {
  src: Layer;
  onDragStart: (layerId: number) => void;
  onMove: (dx: number, dy: number, layerId: number) => void;
  onDragEnd: () => void;
  onResized: (dx: number, dy: number, layerId: number, posX: PosX, posY: PosY) => void;
}

export const Rect: React.FC<RectProps> = ({ src, onDragStart, onDragEnd, onMove, onResized }) => {
  const ref = useDrag(
    (dx, dy) => onMove(dx, dy, src.id),
    () => onDragStart(src.id),
    onDragEnd
  );

  const ResizeHandlers =
    (["top", "bottom"] as const).map(y => (
      (["left", "right"] as const).map(x => (
        <ResizeHandler
          key={y+x}
          posX={x}
          posY={y}
          src={src}
          onResized={onResized}
        />
     ))
  ));

  return (
    <g>
      <rect
        ref={ref}
        style={{pointerEvents: "visible"}}
        width={src.width}
        height={src.height}
        x={src.positionX}
        y={src.positionY}
        transform={`rotate(${src.rotate})`}
        fill="none"
        stroke={src.isSelected ? "rgb(36, 136,253)": "black"}
        strokeWidth="1"
      />
      {src.isSelected && ResizeHandlers}
    </g>
  );
};
