import * as React from "react";
import { Layer, Pixel, PosX, PosY, Radian } from "../model/layer";

interface RectProps {
  src: Layer;
  onTextChanged: (value: string) => void;
}

export const InputField: React.FC<RectProps> = ({ src, onTextChanged }) => {
  const ref = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <foreignObject
      width={src.width}
      height={src.height}
      x={src.positionX}
      y={src.positionY}
      requiredExtensions="http://www.w3.org/1999/xhtml"
    >
      <input
        value={src.text || ""}
        ref={ref}
        onChange={(e) => onTextChanged(e.currentTarget.value)}
      />
    </foreignObject>
  );
};
