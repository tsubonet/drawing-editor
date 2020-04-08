import * as React from "react";
import { Layer, Pixel } from "../model/Layer";

export const moveStarted = (id: Layer["id"]) => action("layer/moveStarted", { id });
export const moved = (id: number, dx: Pixel, dy: Pixel) => action("layer/moved", { id, dx, dy });
export const moveEnded = () => action("layer/moveEnded", {});

const action = <T extends string, P>(type: T, payload: P) => ({ type, payload })

type Actions = (
  | ReturnType<typeof moveStarted>
  | ReturnType<typeof moved>
  | ReturnType<typeof moveEnded>
);

export const initialState = [{
  id: 1,
  width: 200,
  height: 100,
  positionX: 100,
  positionY: 100,
  rotate: 0
}, {
  id: 2,
  width: 200,
  height: 100,
  positionX: 400,
  positionY: 400,
  rotate: 0
}];

export const reducer = (
  state = initialState,
  action: Actions
  ) => {
    switch (action.type) {
      case "layer/moveStarted":
        return state;
      case "layer/moved": {
        const {id, dx, dy } = action.payload;
        const layers = state.map(layer => {
          if (layer.id === id) {
            layer.positionX += dx;
            layer.positionY += dy;
          }
          return layer;
        });
        return layers;
      }
      case "layer/moveEnded":
        return state;
      default:
        return state;
  }
};
  