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
  const ref = useDrag(src.id, onDragStart, onDragEnd, onMove);
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
        stroke="black"
        strokeWidth="1"
      />
      {src.isSelected && (
        <ResizeHandler
          layerId={src.id}
          parentSize={[src.width, src.height]}
          positionX={src.positionX}
          positionY={src.positionY}
          onResized={onResized}
        />
      )}
    </g>
  );
};
