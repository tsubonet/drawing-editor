import * as React from "react";
import { Pixel } from "../model/layer";


class Draggable {

  private initialTouch: { x: Pixel, y: Pixel } | null = null;

  constructor(
    private element: SVGRectElement,
    private onDragStart: () => void,
    private onDragEnd: () => void,
    private onMove: (dx: Pixel, dy: Pixel, x: Pixel, y: Pixel) => void,
  ) {
    element.addEventListener("pointerdown", this._onDragStart, { passive: true });
  }

  destroy() {
    this.element.removeEventListener("pointerdown", this._onDragStart);
  }

  private _onDragStart = (e: PointerEvent) => {
    e.stopPropagation();

    const x = Math.round(e.clientX);
    const y = Math.round(e.clientY);
    this.initialTouch = { x, y };
    this.onDragStart();
    document.addEventListener("pointermove", this._onMove, { passive: true });
    document.addEventListener("pointerup", this._onDragEnd, { passive: true });
  }

  private _onMove = (e: PointerEvent) => {
    e.stopPropagation();
    if (!this.initialTouch) {
      return;
    }

    const x = Math.round(e.clientX);
    const y = Math.round(e.clientY);
    this.onMove(x - this.initialTouch.x, y - this.initialTouch.y, x, y);
  }

  private _onDragEnd = (e: PointerEvent) => {
    e.stopPropagation();

    this.initialTouch = null;
    this.onDragEnd();
    document.removeEventListener("pointermove", this._onMove);
    document.removeEventListener("pointerup", this._onDragEnd);
  }
}


export const useDrag = (
  onDragStart: () => void,
  onDragEnd: () => void,
  onMove: (dx: number, dy: number, x: Pixel, y: Pixel) => void,
) => {
  const ref = React.useRef<SVGRectElement | null>(null);

  React.useEffect(() => {
    const draggable = new Draggable(
      ref.current!,
      onDragStart,
      onDragEnd,
      onMove,
    );
    return () => {
      draggable.destroy();
    }
  }, []);

  return ref;
};