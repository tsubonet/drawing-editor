import * as React from "react";
import { Layer, Radian } from "../model/layer";
import { useDrag } from "../utils/drag";

interface RectProps {
  src: Layer;
  onDragStart: (e: PointerEvent, layerId: number) => void;
  onDragEnd: () => void;
  onRotated: (nextTheta: Radian) => void;
}

export const RotateHandler: React.FC<RectProps> = ({
  src,
  onDragStart,
  onDragEnd,
  onRotated,
}) => {
  const { id, positionX, positionY, width, height } = src;

  const cx = positionX + width / 2;
  const cy = positionY + height / 2;

  const ref = useDrag(
    (e) => onDragStart(e, id),
    () => onDragEnd(),
    (e, dx, dy, x, y) => {
      const vx = x - cx;
      const vy = y - cy;
      const nextTheta = Math.atan2(vy, vx);
      onRotated(nextTheta);
    }
  );

  return (
    <g transform={`translate(${cx - 9}, ${positionY - 24.5}) scale(1.3333333333)`}>
      <line x1="7" y1="11" x2="7" y2="15" stroke="rgb(36, 136,253)" strokeWidth="0.75"></line>
      <path d="M11.35,7.6A5.06,5.06,0,0,1,1.66,5.86m.42-2.42A5,5,0,0,1,6.72.38a5.1,5.1,0,0,1,5.07,5.13" fill="none" stroke="#2488fd" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75"></path>
      <polyline points="0.38 6.76 1.08 5.86 1.78 4.95 2.48 5.86 3.18 6.76" fill="none" stroke="#2488fd" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75"></polyline>
      <polyline points="13.16 4.45 12.46 5.36 11.76 6.26 11.05 5.36 10.35 4.45" fill="none" stroke="#2488fd" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75"></polyline>
      <rect
        ref={ref}
        fillOpacity="0"
        width={14}
        height={14}
        // x={x - TOLERANCE}
        // y={y - TOLERANCE}
        style={{ cursor: "pointer" }}
      />
    </g>
  );
};
