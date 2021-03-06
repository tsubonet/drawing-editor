import * as React from "react";
import { Layer, Pixel, PosX, PosY, Radian } from "../model/layer";

interface RectProps {
  src: Layer;
  onTextChanged: (value: string) => void;
  onTextEditStarted: () => void;
}

export const InputField: React.FC<RectProps> = ({
  src,
  onTextChanged,
  onTextEditStarted,
}) => {
  const ref = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    ref.current?.focus();
  }, []);
  const PADDING = 10;
  return (
    <foreignObject
      width={src.width - PADDING}
      height={src.height - PADDING}
      x={PADDING}
      y={PADDING}
      requiredExtensions="http://www.w3.org/1999/xhtml"
    >
      <input
        value={src.text || ""}
        ref={ref}
        onChange={(e) => onTextChanged(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.keyCode === 9 || e.keyCode === 13 || e.keyCode === 27) {
            onTextEditStarted();
          }
        }}
      />
    </foreignObject>
  );
};
