import * as React from "react";
import { useWindowSize } from "../utils/windowSize";
import { Rect } from "./rect";

const Editor: React.FC<{}> = () => {
  const windowSize = useWindowSize();
  
  const src = {
    id: 1,
    width: 200,
    height: 100,
    positionX: 300,
    positionY: 300,
    rotate: 20
  };

  return (
    <div>
      <svg 
        width={windowSize.width}
        height={windowSize.height}
        viewBox={`0 0 ${windowSize.width} ${windowSize.height}`}
      >
        <Rect
          src={src}
        />
      </svg>
    </div>
  )
};

export default Editor