import * as React from "react";
import { useWindowSize } from "../utils/windowSize";
import { Rect } from "./rect";
import { reducer, initialState } from "../modules/layer";

const Editor: React.FC<{}> = () => {
  const windowSize = useWindowSize();
  const [layers, dispatch] = React.useReducer(reducer, initialState);

  return (
    <div>
      <svg 
        width={windowSize.width}
        height={windowSize.height}
        viewBox={`0 0 ${windowSize.width} ${windowSize.height}`}
      >
        {layers.map(layer => (
          <Rect
            key={layer.id}
            src={layer}
          />
        ))}
      </svg>
    </div>
  )
};

export default Editor