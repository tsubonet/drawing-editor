import * as React from "react";
import { useWindowSize } from "../utils/windowSize";
import { PosX, PosY } from "../model/layer";
import { Rect } from "./rect";
import { reducer, initialState, moveStarted, moved, moveEnded, resized } from "../modules/layer";

const Editor: React.FC<{}> = () => {
  const windowSize = useWindowSize();
  const [layers, dispatch] = React.useReducer(reducer, initialState);

  const onDragStart = (layerId: number) => {
    console.log("onDragStart:", layerId);
    dispatch(moveStarted(layerId));
  };

  const onMove = (dx: number, dy: number, layerId: number) => {
    console.log("onDragMove", dx, dy, layerId);
    dispatch(moved(dx, dy, layerId));
  };

  const onDragEnd = () => {
    console.log("onDragEnd");
    dispatch(moveEnded());
  };

  const onResized = (dx: number, dy: number, layerId: number, posX: PosX, posY: PosY) => {
    console.log("onResize", dx, dy, layerId, posX, posY);
    dispatch(resized(dx, dy, layerId, posX, posY));
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
            onResized={onResized}
          />
        ))}
      </svg>
    </div>
  )
};

export default Editor