import * as React from "react";
import { Layer, Pixel } from "../model/Layer";

interface RectProps {
  src: Layer;
  onDragStart: (x: Pixel, y: Pixel, e: PointerEvent) => void;
  onDragEnd: (e) => void;
  onMove: (e) => void;
}

const useDrag = (onDragStart, onDragEnd, onMove) => {
  const ref = React.useRef<SVGRectElement | null>(null);
  const [initialTouch, setInitialTouch] = React.useState<{ x: Pixel, y: Pixel }| null>(null);

  const _onDragStart = (e) => {
    e.stopPropagation();

    const x = e.clientX;
    const y = e.clientY;
    setInitialTouch({x, y});
    onDragStart(x, y, e);
  }

  const _onMove = (e) => {
    e.stopPropagation();

    const x = e.clientX;
    const y = e.clientY;
    onMove(x - initialTouch.x, y - initialTouch.y, e);
  }

  const _onDragEnd = (e) => {
    e.stopPropagation();

    setInitialTouch(null);
    onDragEnd(e);
  }

  React.useEffect(() => {
    ref.current.addEventListener("pointerdown", _onDragStart);
    ref.current.addEventListener("pointermove", _onMove);
    ref.current.addEventListener("pointerup", _onDragEnd);
    return () => {
      ref.current.removeEventListener("pointerdown", _onDragStart);
      ref.current.removeEventListener("pointermove", _onMove);
      ref.current.removeEventListener("pointerup", _onDragEnd);
    }
  }, []);

  return ref;
};

export const Rect: React.FC<RectProps> = ({ src,  onDragStart, onDragEnd, onMove }) => {
  const ref = useDrag(onDragStart, onDragEnd, onMove);
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
      strokeWidth="1"
    />
  );
};
