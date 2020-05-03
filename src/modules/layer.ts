import { Layer, Pixel, PosX, PosY, Radian } from "../model/layer";
import { radianToDeg } from "../utils/layer";

export const dragStarted = (id: Layer["id"]) =>
  action("layer/dragStarted", { id });

export const dragEnded = () =>
  action("layer/dragEnded", {});

export const moved = (dx: Pixel, dy: Pixel) =>
  action("layer/moved", { dx, dy });

export const resized = (dx: Pixel, dy: Pixel, posX: PosX, posY: PosY) =>
  action("layer/resized", { dx, dy, posX, posY });

export const rotated = (nextTheta: Radian) =>
  action("layer/rotated", { nextTheta });

const action = <T extends string, P>(type: T, payload: P) => ({ type, payload })

type Actions = (
  | ReturnType<typeof dragStarted>
  | ReturnType<typeof dragEnded>
  | ReturnType<typeof moved>
  | ReturnType<typeof resized>
  | ReturnType<typeof rotated>
);

type Transform = Pick<
  Layer,
  "width" | "height" | "positionX" | "positionY" | "rotate"
>;

interface State {
  layers: Layer[];
  initialTransforms: Record<Layer["id"], Transform>;
}

export const initialState = {
  layers: [{
    id: 1,
    width: 100,
    height: 100,
    positionX: 100,
    positionY: 100,
    rotate: 0,
    isSelected: false,
  }, {
    id: 2,
    width: 200,
    height: 200,
    positionX: 400,
    positionY: 400,
    rotate: 0,
    isSelected: false,
  }],
  initialTransforms: {}
};

export const reducer = (
  state: State = initialState,
  action: Actions
  ): State => {
    switch (action.type) {
      case "layer/dragStarted": {
        const { id } = action.payload;
        const selectedLayer = state.layers.find(layer => layer.id === id);
        if (!selectedLayer) {
          return state;
        }

        const initialTransforms = {
          [id]: {
            width: selectedLayer.width,
            height: selectedLayer.height,
            positionX: selectedLayer.positionX,
            positionY: selectedLayer.positionY,
            rotate: selectedLayer.rotate
          }
        };
        
        const layers = state.layers.map(layer => ({
          ...layer, 
          isSelected: layer.id === id
        }));
        return { ...state, layers, initialTransforms }
      }

      case "layer/dragEnded": {
        const initialTransforms = {};
        return { ...state, initialTransforms }
      }

      case "layer/moved": {
        const { dx, dy } = action.payload;
        const layers = state.layers.map(layer => {
          const transform = state.initialTransforms[layer.id];
          if (transform) {
            const { positionX, positionY } = transform;
            layer.positionX = positionX + dx;
            layer.positionY = positionY + dy;
          }
          return layer;
        });
        return { ...state, layers }
      }

      case "layer/resized": {
        const { posX, posY, dx, dy } = action.payload;
        const layers = state.layers.map(layer => {
          const transform = state.initialTransforms[layer.id];
          if (transform) {
            const { width, height, positionX, positionY } = transform;

            if (posY === "bottom") {
              layer.height = height + dy;
            } else if (posY === "top") {
              layer.positionY = positionY + dy;
              layer.height = positionY - dy;
            }

            if (posX === "right") {
              layer.width = width + dx;
            } else if (posX === "left") {
              layer.positionX = positionX + dx;
              layer.width = width - dx;
            }
          }
          return layer;
        });
        return { ...state, layers }
      }

      case "layer/rotated": {
        const { nextTheta } = action.payload;
        const nextDegree = radianToDeg(nextTheta);

        const layers = state.layers.map(layer => {
          const transform = state.initialTransforms[layer.id];
          if (transform) {
            layer.rotate = nextDegree + 90;
          }
          return layer;
        });
        return { ...state, layers }
      }

      default:
        return state;
  }
};
