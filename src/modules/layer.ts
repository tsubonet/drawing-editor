import { Layer, Pixel, PosX, PosY, Radian } from "../model/layer";
import { radianToDeg } from "../utils/layer";

export const dragStarted = (e: PointerEvent, id?: Layer["id"]) =>
  action("layer/dragStarted", { e, id });

export const dragEnded = () =>
  action("layer/dragEnded", {});

export const moved = (dx: Pixel, dy: Pixel) =>
  action("layer/moved", { dx, dy });

export const resized = (e: PointerEvent, dx: Pixel, dy: Pixel, posX: PosX, posY: PosY) =>
  action("layer/resized", { e, dx, dy, posX, posY });

export const rotated = (nextTheta: Radian) =>
  action("layer/rotated", { nextTheta });

export const created = () =>
  action("layer/created", {});

export const deleted = () =>
  action("layer/deleted", {});

const action = <T extends string, P>(type: T, payload: P) => ({ type, payload });

type Actions = (
  | ReturnType<typeof dragStarted>
  | ReturnType<typeof dragEnded>
  | ReturnType<typeof moved>
  | ReturnType<typeof resized>
  | ReturnType<typeof rotated>
  | ReturnType<typeof created>
  | ReturnType<typeof deleted>
);

type Transform = Pick<
  Layer,
  "width" | "height" | "positionX" | "positionY" | "rotate"
>;

interface LinePath {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

export interface SnapGuides {
  hLine?: LinePath;
  vLine?: LinePath;
}

interface State {
  layers: Layer[];
  initialTransforms: Record<Layer["id"], Transform>;
  snapGuides: SnapGuides;
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
    positionX: 300,
    positionY: 300,
    rotate: 0,
    isSelected: false,
  }],
  initialTransforms: {},
  snapGuides: {},
};

export const reducer = (
  state: State = initialState,
  action: Actions
  ): State => {
    switch (action.type) {
      case "layer/dragStarted": {
        const { e, id } = action.payload;
        
        let layers: Layer[];
        if (e.shiftKey) {
          layers = state.layers.map(layer => {
            if (layer.id === id) {
              return {
                ...layer,
                isSelected: true
              };
            }
            return layer;
          });
        } else {
          layers = state.layers.map(layer => ({
            ...layer,
            isSelected: layer.id === id
          }));
        }
        let initialTransforms: Record<Layer["id"], Transform> = {};
        layers
          .filter(layer => layer.isSelected)
          .forEach((layer) => {
            initialTransforms[layer.id] = {
              width: layer.width,
              height: layer.height,
              positionX: layer.positionX,
              positionY: layer.positionY,
              rotate: layer.rotate
            };
          });
      
        return { ...state, layers, initialTransforms };
      }

      case "layer/dragEnded": {
        const initialTransforms = {};
        return { ...state, initialTransforms };
      }

      case "layer/moved": {
        const { dx, dy } = action.payload;
        const snapGuides: SnapGuides = {};
        const layers = state.layers.map(layer => {
          const transform = state.initialTransforms[layer.id];
          if (transform) {
            const { positionX, positionY } = transform;
            layer.positionX = positionX + dx;
            layer.positionY = positionY + dy;

            state.layers.forEach(_layer => {
              if (_layer.id === layer.id) {
                return;
              }
              const hitPosX = [
                _layer.positionX,
                _layer.positionX + _layer.width,
                _layer.positionX + _layer.width / 2
              ];
              const linePosY = [
                _layer.positionY,
                _layer.positionY + _layer.height,
                layer.positionY,
                layer.positionY + layer.height,
              ];

              const hitPosY = [
                _layer.positionY,
                _layer.positionY + _layer.height,
                _layer.positionY + _layer.height / 2
              ];
              const linePosX = [
                _layer.positionX,
                _layer.positionX + _layer.width,
                layer.positionX,
                layer.positionX + layer.width,
              ];

              if (hitPosX.includes(layer.positionX)) {
                snapGuides.vLine = {
                  x1: layer.positionX,
                  x2: layer.positionX,
                  y1: Math.min(...linePosY) - 40,
                  y2: Math.max(...linePosY) + 40,
                };
              }

              if (hitPosX.includes(layer.positionX + layer.width)) {
                snapGuides.vLine = {
                  x1: layer.positionX + layer.width,
                  x2: layer.positionX + layer.width,
                  y1: Math.min(...linePosY) - 40,
                  y2: Math.max(...linePosY) + 40,
                };
              }

              if (hitPosY.includes(layer.positionY)) {
                snapGuides.hLine = {
                  x1: Math.min(...linePosX) - 40,
                  x2: Math.max(...linePosX) + 40,
                  y1: layer.positionY,
                  y2: layer.positionY,
                };
              }

              if (hitPosY.includes(layer.positionY + layer.height)) {
                snapGuides.hLine = {
                  x1: Math.min(...linePosX) - 40,
                  x2: Math.max(...linePosX) + 40,
                  y1: layer.positionY + layer.height,
                  y2: layer.positionY + layer.height,
                };
              }
            });
          }
          return layer;
        });
        return { ...state, layers, snapGuides };
      }

      case "layer/resized": {
        const { e, posX, posY, dx, dy } = action.payload;
        const keepAspectRatio = e.shiftKey;
        const layers = state.layers.map(layer => {
          const transform = state.initialTransforms[layer.id];
          if (transform) {
            const { width, height, positionX, positionY } = transform;

            if (posY === "bottom") {
              if (keepAspectRatio && posX === "right") {
                layer.height = (width + dx) / width * height;
              } else if (keepAspectRatio && posX === "left") {
                layer.height = (width - dx) / width * height;
              } else {
                layer.height = height + dy;
              }
            } else if (posY === "top") {
              if (keepAspectRatio && posX === "right") {
                layer.height = (width + dx) / width * height;
                layer.positionY = positionY - ( dx / width * height);
              } else if (keepAspectRatio && posX === "left") {
                layer.height = (width - dx) / width * height;
                layer.positionY = positionY - ( - dx / width * height);
              } else {
                layer.height = height - dy;
                layer.positionY = positionY + dy;
              }
            }

            if (posX === "right") {
              layer.width = width + dx;
            } else if (posX === "left") {
              layer.width = width - dx;
              layer.positionX = positionX + dx;
            }
          }
          return layer;
        });
        return { ...state, layers };
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
        return { ...state, layers };
      }

      case "layer/created": {
        const maxId = Math.max(...state.layers.map(layer => layer.id));
        const maxPositionX = Math.max(...state.layers.map(layer => layer.positionX));
        const maxPositionY = Math.max(...state.layers.map(layer => layer.positionY));
        const createdLayer = {
          id: maxId > 0 ? maxId + 1: 1,
          width: 100,
          height: 100,
          positionX: maxPositionX > 0 ? maxPositionX + 30: 30,
          positionY: maxPositionY > 0 ? maxPositionY + 30: 30,
          rotate: 0,
          isSelected: false,
        };
        const layers = [ ...state.layers, createdLayer];
        console.log(layers);
        return { ...state, layers };
      }

      case "layer/deleted": {
        const layers = state.layers.filter(layer => !layer.isSelected);
        return { ...state, layers };
      }

      default:
        return state;
  }
};
