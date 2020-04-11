import * as React from "react";
import { Layer } from "../model/Layer";
import { ResizeHandler } from "./resizeHandler";
import { useDrag } from "../utils/drag";

interface RectProps {
  src: Layer;
  onDragStart: (layerId: number) => void;
  onMove: (layerId: number, dx: number, dy: number) => void;
  onDragEnd: () => void;
  onResized: (layerId: number, dx: number, dy: number) => void;
}

export const Rect: React.FC<RectProps> = ({ src, onDragStart, onDragEnd, onMove, onResized }) => {
  const ref = useDrag(src.id, onMove, onDragStart, onDragEnd);

  const ResizeHandlers =
    (["top", "bottom"] as const).map(y => (
      (["left", "right"] as const).map(x => (
        <ResizeHandler
          key={y+x}
          layerId={src.id}
          posX={x}
          posY={y}
          parentSize={[src.positionX, src.positionY, src.width, src.height]}
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
