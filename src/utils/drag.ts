import * as React from "react";
import { Layer, Pixel } from "../model/Layer";


class Draggable {

  private lastTouch: { x: Pixel, y: Pixel } | null = null;

  constructor(
    private element: SVGRectElement,
    private layerId: number,
    private onMove: (layerId: number, dx: number, dy: number) => void,
    private onDragStart?: (layerId: number) => void,
    private onDragEnd?: () => void,
  ) {
    element.addEventListener("pointerdown", this._onDragStart);
  }

  destroy() {
    this.element.removeEventListener("pointerdown", this._onDragStart);
  }

  private _onDragStart = (e: PointerEvent) => {
    e.stopPropagation();

    const x = e.clientX;
    const y = e.clientY;
    this.lastTouch = { x, y };
    this.onDragStart?.(this.layerId);
    document.addEventListener("pointermove", this._onMove);
    document.addEventListener("pointerup", this._onDragEnd);
  }

  private _onMove = (e: PointerEvent) => {
    e.stopPropagation();
    if (!this.lastTouch) {
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    this.onMove(this.layerId, x - this.lastTouch.x, y - this.lastTouch.y);
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
  layerId: number,
  onMove: (layerId: number, dx: number, dy: number) => void,
  onDragStart?: (layerId: number) => void,
  onDragEnd?: () => void,
) => {
  const ref = React.useRef<SVGRectElement | null>(null);

  React.useEffect(() => {
    const draggable = new Draggable(
      ref.current!,
      layerId,
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