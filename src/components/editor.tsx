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
  created,
  deleted,
  textEditStarted,
  textChanged,
  SnapGuides,
} from "../modules/layer";

const Editor: React.FC<{}> = () => {
  const windowSize = useWindowSize();
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const onDragStart = (e: PointerEvent, layerId: number) => {
    dispatch(dragStarted(e, layerId));
  };

  const onDragEnd = () => {
    dispatch(dragEnded());
  };

  const onMoved = (dx: number, dy: number) => {
    dispatch(moved(dx, dy));
  };

  const onResized = (
    e: PointerEvent,
    dx: number,
    dy: number,
    posX: PosX,
    posY: PosY,
  ) => {
    dispatch(resized(e, dx, dy, posX, posY));
  };

  const onRotated = (nextTheta: number) => {
    dispatch(rotated(nextTheta));
  };

  const onTextEditStarted = (layerId: number) => {
    dispatch(textEditStarted(layerId));
  };

  const onTextChanged = (value: string) => {
    dispatch(textChanged(value));
  };

  React.useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.keyCode == 8) {
        dispatch(deleted());
      }
    });

    document.addEventListener("pointerdown", (e) => {
      dispatch(dragStarted(e));
      dispatch(textEditStarted());
    });
  }, []);

  return (
    <div>
      <button
        onClick={() => dispatch(created())}
        style={{ position: "absolute", top: "10px", left: "10px" }}
      >
        +
      </button>
      <svg
        width={windowSize.width}
        height={windowSize.height}
        viewBox={`0 0 ${windowSize.width} ${windowSize.height}`}
      >
        {state.layers.map((layer) => (
          <Rect
            key={layer.id}
            src={layer}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onMoved={onMoved}
            onResized={onResized}
            onRotated={onRotated}
            onTextEditStarted={onTextEditStarted}
            onTextChanged={onTextChanged}
          />
        ))}
        {Object.keys(state.snapGuides).map((key, i) => (
          <line
            key={i}
            {...state.snapGuides[key as keyof SnapGuides]}
            stroke="rgb(36, 136,253)"
            strokeDasharray="4 4"
          />
        ))}
      </svg>
    </div>
  );
};

export default Editor;
