import * as React from "react";
import { Layer, Pixel, PosX, PosY, Radian } from "../model/layer";
import { ResizeHandler } from "./resizeHandler";
import { RotateHandler } from "./rotateHandler";
import { InputField } from "./inputField";
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
  onTextEditStarted: (layerId?: number) => void;
  onTextChanged: (value: string) => void;
}

export const Rect: React.FC<RectProps> = ({
  src,
  onDragStart,
  onDragEnd,
  onMoved,
  onResized,
  onRotated,
  onTextEditStarted,
  onTextChanged,
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
      onDoubleClick={() => onTextEditStarted(src.id)}
      ref={ref}
    >
      <rect
        style={{ pointerEvents: "visible" }}
        width={src.width}
        height={src.height}
        x={src.positionX}
        y={src.positionY}
        fill={src.isHitted ? "rgba(36, 136, 253, .1)" : "none"}
        stroke={src.isSelected ? "rgb(36, 136, 253)" : "black"}
        strokeWidth="1"
      />
      {src.text && !src.isTextEditing && (
        <foreignObject
          width={src.width}
          height={src.height}
          x={src.positionX + 10}
          y={src.positionY + 10}
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <span>{src.text}</span>
        </foreignObject>
      )}
      {src.isTextEditing && (
        <InputField
          src={src}
          onTextChanged={onTextChanged}
          onTextEditStarted={onTextEditStarted}
        />
      )}
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
