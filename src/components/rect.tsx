import * as React from "react";
import { Layer } from "../model/Layer";

interface RectProps {
  src: Layer;
  onDragStart: (e) => void;
  onDragEnd: (e) => void;
  onMove: (e) => void;
}

export const Rect: React.FC<RectProps> = ({ src,  onDragStart, onDragEnd, onMove }) => {
  return (
    <rect
      style={{pointerEvents: "visible"}}
      onPointerDown={(e) => onDragStart(e)}
      onPointerMove={(e) => onMove(e)}
      onPointerUp={(e) => onDragEnd(e)}
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
