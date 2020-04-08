import * as React from "react";
import { useWindowSize } from "../utils/windowSize";
import { Rect } from "./rect";
import { reducer, initialState, moveStarted, moved, moveEnded } from "../modules/layer";

const Editor: React.FC<{}> = () => {
  const windowSize = useWindowSize();
  const [layers, dispatch] = React.useReducer(reducer, initialState);

  const onDragStart = (layerId: number) => {
    console.log("onDragStart:", layerId);
    dispatch(moveStarted(layerId));
  };

  const onMove = (layerId: number, dx: number, dy: number) => {
    console.log("onDragMove", layerId, dx, dy);
    dispatch(moved(layerId, dx, dy));
  };

  const onDragEnd = () => {
    console.log("onDragEnd");
    dispatch(moveEnded());
  };

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
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onMove={onMove}
          />
        ))}
      </svg>
    </div>
  )
};

export default Editor