import * as React from "react";
import { Pixel } from "../model/Layer";


class Draggable {

  private lastTouch: { x: Pixel, y: Pixel } | null = null;

  constructor(
    private element: SVGRectElement,
    private onMove: (dx: Pixel, dy: Pixel) => void,
    private onDragStart?: () => void,
    private onDragEnd?: () => void,
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
    this.lastTouch = { x, y };
    this.onDragStart?.();
    document.addEventListener("pointermove", this._onMove, { passive: true });
    document.addEventListener("pointerup", this._onDragEnd, { passive: true });
  }

  private _onMove = (e: PointerEvent) => {
    e.stopPropagation();
    if (!this.lastTouch) {
      return;
    }

    const x = Math.round(e.clientX);
    const y = Math.round(e.clientY);
    this.onMove(x - this.lastTouch.x, y - this.lastTouch.y);
    this.lastTouch = { x, y };
  }

  private _onDragEnd = (e: PointerEvent) => {
    e.stopPropagation();

    this.lastTouch = null;
    this.onDragEnd?.();
    document.removeEventListener("pointermove", this._onMove);
    document.removeEventListener("pointerup", this._onDragEnd);
  }
}


export const useDrag = (
  onMove: (dx: number, dy: number) => void,
  onDragStart?: () => void,
  onDragEnd?: () => void,
) => {
  const ref = React.useRef<SVGRectElement | null>(null);

  React.useEffect(() => {
    const draggable = new Draggable(
      ref.current!,
      onMove,
      onDragStart,
      onDragEnd,
    );
    return () => {
      draggable.destroy();
    }
  }, []);

  return ref;
};