import * as React from "react";
import { Layer, Pixel } from "../model/Layer";

interface RectProps {
  src: Layer;
  onDragStart: (layerId: number) => void;
  onMove: (layerId: number, dx: number, dy: number) => void;
  onDragEnd: () => void;
}

const useDrag = (
  layerId: number,
  onDragStart: (layerId: number) => void,
  onDragEnd: () => void,
  onMove: (layerId: number, dx: number, dy: number) => void
) => {
  const ref = React.useRef<SVGRectElement | null>(null);
  let lastTouch: { x: Pixel, y: Pixel } | null = null;

  const _onDragStart = (e: PointerEvent) => {
    e.stopPropagation();

    const x = e.clientX;
    const y = e.clientY;
    lastTouch = { x, y };
    onDragStart(layerId);
    document.addEventListener("pointermove", _onMove);
    document.addEventListener("pointerup", _onDragEnd);
  }

  const _onMove = (e: PointerEvent) => {
    e.stopPropagation();
    if (!lastTouch) {
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    onMove(layerId, x - lastTouch.x, y - lastTouch.y);
    lastTouch = { x, y };
  }

  const _onDragEnd = (e: PointerEvent) => {
    e.stopPropagation();

    lastTouch = null;
    onDragEnd();
    document.removeEventListener("pointermove", _onMove);
    document.removeEventListener("pointerup", _onDragEnd);
  }

  React.useEffect(() => {
    ref.current?.addEventListener("pointerdown", _onDragStart);
    return () => {
      ref.current?.removeEventListener("pointerdown", _onDragStart);
    }
  }, []);

  return ref;
};

export const Rect: React.FC<RectProps> = ({ src, onDragStart, onDragEnd, onMove }) => {
  const ref = useDrag(src.id, onDragStart, onDragEnd, onMove);
  return (
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
      strokeWidth={src.isSelected ? 3 : 1}
    />
  );
};
