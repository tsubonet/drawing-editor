import * as React from "react";
import { Layer, Pixel, PosX, PosY, Radian } from "../model/layer";
import { ResizeHandler } from "./resizeHandler";
import { RotateHandler } from "./rotateHandler";
import { useDrag } from "../utils/drag";

interface RectProps {
  src: Layer;
  onDragStart: (e: PointerEvent, layerId: number) => void;
  onDragEnd: () => void;
  onMoved: (dx: Pixel, dy: Pixel) => void;
  onResized: (
    e: PointerEvent,
    dx: Pixel,
    dy: Pixel,
    posX: PosX,
    posY: PosY,
  ) => void;
  onRotated: (nextTheta: Radian) => void;
}

export const Rect: React.FC<RectProps> = ({
  src,
  onDragStart,
  onDragEnd,
  onMoved,
  onResized,
  onRotated,
}) => {
  const ref = useDrag(
    (e) => onDragStart(e, src.id),
    () => onDragEnd(),
    (e, dx, dy) => onMoved(dx, dy),
  );

  const ResizeHandlers = (["top", "middle", "bottom"] as const).map((y) =>
    (["left", "center", "right"] as const).map((x) => {
      if (y === "middle" && x === "center") {
        return null;
      }
      return (
        <ResizeHandler
          key={y + x}
          posX={x}
          posY={y}
          src={src}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onResized={onResized}
        />
      );
    }),
  );

  return (
    <g
      transform={`rotate(${src.rotate}, ${src.positionX + src.width / 2}, ${
        src.positionY + src.height / 2
      })`}
    >
      <rect
        ref={ref}
        style={{ pointerEvents: "visible" }}
        width={src.width}
        height={src.height}
        x={src.positionX}
        y={src.positionY}
        fill="none"
        stroke={src.isSelected ? "rgb(36, 136,253)" : "black"}
        strokeWidth="1"
      />
      {src.isSelected && (
        <g>
          {ResizeHandlers}
          <RotateHandler
            src={src}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onRotated={onRotated}
          />
        </g>
      )}
    </g>
  );
};
