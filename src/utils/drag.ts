import * as React from "react";
import { Pixel } from "../model/layer";

class Draggable {
  private initialTouch: { x: Pixel; y: Pixel } | null = null;

  constructor(
    private element: SVGRectElement,
    private onDragStart: (e: PointerEvent) => void,
    private onDragEnd: () => void,
    private onMove: (
      e: PointerEvent,
      dx: Pixel,
      dy: Pixel,
      x: Pixel,
      y: Pixel,
    ) => void,
  ) {
    element.addEventListener("pointerdown", this._onDragStart, {
      passive: true,
    });
  }

  destroy() {
    this.element.removeEventListener("pointerdown", this._onDragStart);
  }

  private _onDragStart = (e: PointerEvent) => {
    e.stopPropagation();

    const x = this.round(e.clientX);
    const y = this.round(e.clientY);
    this.initialTouch = { x, y };
    this.onDragStart(e);
    document.addEventListener("pointermove", this._onMove, { passive: true });
    document.addEventListener("pointerup", this._onDragEnd, { passive: true });
  };

  private _onMove = (e: PointerEvent) => {
    e.stopPropagation();
    if (!this.initialTouch) {
      return;
    }

    const x = this.round(e.clientX);
    const y = this.round(e.clientY);
    this.onMove(e, x - this.initialTouch.x, y - this.initialTouch.y, x, y);
  };

  private _onDragEnd = (e: PointerEvent) => {
    e.stopPropagation();

    this.initialTouch = null;
    this.onDragEnd();
    document.removeEventListener("pointermove", this._onMove);
    document.removeEventListener("pointerup", this._onDragEnd);
  };

  private round = (v: number) => {
    return Math.round(v / 10) * 10;
  };
}

export const useDrag = (
  onDragStart: (e: PointerEvent) => void,
  onDragEnd: () => void,
  onMove: (e: PointerEvent, dx: number, dy: number, x: Pixel, y: Pixel) => void,
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
    };
  }, []);

  return ref;
};
