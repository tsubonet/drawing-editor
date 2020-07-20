import * as React from "react";
import { useWindowSize } from "../utils/windowSize";
import { PosX, PosY, Pixel } from "../model/layer";
import { Rect } from "./Rect";
import {
  reducer,
  initialState,
  LayerAction,
  SnapGuides,
} from "../modules/layer";

const Editor: React.FC<{}> = () => {
  const windowSize = useWindowSize();
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const onDragStart = (e: PointerEvent, layerId: number) => {
    dispatch(LayerAction.dragStarted(e, layerId));
  };

  const onDragEnd = () => {
    dispatch(LayerAction.dragEnded());
  };

  const onMoved = (dx: Pixel, dy: Pixel) => {
    dispatch(LayerAction.moved(dx, dy));
  };

  const onResized = (
    e: PointerEvent,
    dx: Pixel,
    dy: Pixel,
    posX: PosX,
    posY: PosY,
  ) => {
    dispatch(LayerAction.resized(e, dx, dy, posX, posY));
  };

  const onRotated = (layerId: number, x: Pixel, y: Pixel) => {
    dispatch(LayerAction.rotated(layerId, x, y));
  };

  const onTextEditStarted = (layerId: number) => {
    dispatch(LayerAction.textEditStarted(layerId));
  };

  const onTextChanged = (value: string) => {
    dispatch(LayerAction.textChanged(value));
  };

  React.useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.keyCode == 8) {
        dispatch(LayerAction.deleted());
      }
    });

    document.addEventListener("pointerdown", (e) => {
      dispatch(LayerAction.dragStarted(e));
      dispatch(LayerAction.textEditStarted());
    });
  }, []);

  return (
    <div>
      <button
        onClick={() => dispatch(LayerAction.created())}
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
