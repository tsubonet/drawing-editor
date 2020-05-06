import * as React from "react";
import { useWindowSize } from "../utils/windowSize";
import { PosX, PosY } from "../model/layer";
import { Rect } from "./rect";
import { 
  reducer,
  initialState,
  dragStarted,
  dragEnded,
  moved,
  resized,
  rotated,
  deleted,
} from "../modules/layer";

const Editor: React.FC<{}> = () => {
  const windowSize = useWindowSize();
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const onDragStart = (layerId: number) => {
    console.log("onDragStart:", layerId);
    dispatch(dragStarted(layerId));
  };

  const onDragEnd = () => {
    console.log("onDragEnd");
    dispatch(dragEnded());
  };

  const onMoved = (dx: number, dy: number) => {
    console.log("onDragMove", dx, dy);
    dispatch(moved(dx, dy));
  };

  const onResized = (dx: number, dy: number, posX: PosX, posY: PosY, keepAspectRatio: boolean) => {
    console.log("onResize", dx, dy, posX, posY, keepAspectRatio);
    dispatch(resized(dx, dy, posX, posY, keepAspectRatio));
  };

  const onRotated = (nextTheta: number) => {
    console.log("onRotate", nextTheta);
    dispatch(rotated(nextTheta));
  };

  React.useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.keyCode == 8) {
        dispatch(deleted());
      }
    });
  }, []);

  return (
    <div>
      <svg 
        width={windowSize.width}
        height={windowSize.height}
        viewBox={`0 0 ${windowSize.width} ${windowSize.height}`}
      >
        {state.layers.map(layer => (
          <Rect
            key={layer.id}
            src={layer}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onMoved={onMoved}
            onResized={onResized}
            onRotated={onRotated}
          />
        ))}
      </svg>
    </div>
  )
};

export default Editor