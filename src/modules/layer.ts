import { Layer, Pixel, PosX, PosY, Radian } from "../model/layer";
import { radianToDeg } from "../utils/layer";

export const moveStarted = (id: Layer["id"]) =>
  action("layer/moveStarted", { id });

export const moved = (dx: Pixel, dy: Pixel, id: Layer["id"]) =>
  action("layer/moved", { dx, dy, id });

export const moveEnded = () =>
  action("layer/moveEnded", {});

export const resized = (dx: Pixel, dy: Pixel, id: Layer["id"], posX: PosX, posY: PosY) =>
  action("layer/resized", { id, dx, dy, posX, posY });

export const rotated = (id: Layer["id"], nextTheta: Radian) =>
  action("layer/rotated", { id, nextTheta });

const action = <T extends string, P>(type: T, payload: P) => ({ type, payload })

type Actions = (
  | ReturnType<typeof moveStarted>
  | ReturnType<typeof moved>
  | ReturnType<typeof moveEnded>
  | ReturnType<typeof resized>
  | ReturnType<typeof rotated>
);

export const initialState = [{
  id: 1,
  width: 200,
  height: 100,
  positionX: 100,
  positionY: 100,
  rotate: 0,
  isSelected: false,
}, {
  id: 2,
  width: 200,
  height: 100,
  positionX: 400,
  positionY: 400,
  rotate: 0,
  isSelected: false,
}];

export const reducer = (
  state = initialState,
  action: Actions
  ) => {
    switch (action.type) {
      case "layer/moveStarted": {
        const { id } = action.payload;
        const layers = state.map(layer => {
          layer.isSelected = layer.id === id;
          return layer;
        });
        return layers;
      }
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

      case "layer/resized": {
        const {id, posX, posY, dx, dy } = action.payload;
        const layers = state.map(layer => {
          if (layer.id === id) {

            if (posY === "bottom") {
              layer.height += dy;
            } else if (posY === "top") {
              layer.positionY += dy;
              layer.height -= dy;
            }

            if (posX === "right") {
              layer.width += dx;
            } else if (posX === "left") {
              layer.positionX += dx;
              layer.width -= dx;
            }
          }
          return layer;
        });
        return layers;
      }
      case "layer/rotated": {
        const {id, nextTheta } = action.payload;
        const nextDegree = radianToDeg(nextTheta);

        const layers = state.map(layer => {
          if (layer.id === id) {
            layer.rotate = nextDegree + 90;
          }
          return layer;
        });
        return layers;
      }
      default:
        return state;
  }
};
