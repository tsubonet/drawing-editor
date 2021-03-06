import { Layer, Pixel, PosX, PosY } from "../model/layer";
import { radian2degree, transformRotate } from "../utils/layer";

export const LayerAction = {
  dragStarted: (e: PointerEvent, id?: Layer["id"]) =>
    action("layer/dragStarted", { e, id }),

  dragEnded: () => action("layer/dragEnded", {}),

  moved: (dx: Pixel, dy: Pixel) => action("layer/moved", { dx, dy }),

  resized: (e: PointerEvent, dx: Pixel, dy: Pixel, posX: PosX, posY: PosY) =>
    action("layer/resized", { e, dx, dy, posX, posY }),

  rotated: (id: Layer["id"], x: Pixel, y: Pixel) =>
    action("layer/rotated", { id, x, y }),

  created: () => action("layer/created", {}),

  deleted: () => action("layer/deleted", {}),

  textEditStarted: (id?: Layer["id"]) =>
    action("layer/textEditStarted", { id }),

  textChanged: (value: string) => action("layer/textChanged", { value }),
};

const action = <T extends string, P>(type: T, payload: P) => ({
  type,
  payload,
});

type KnownActions<
  A extends Record<string, (...args: any[]) => any>
> = ReturnType<A[keyof A]>;

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
  layers: [
    {
      id: 1,
      width: 100,
      height: 100,
      positionX: 100,
      positionY: 100,
      rotate: 0,
      text: "hello world",
      isSelected: false,
      isHitted: false,
      isTextEditing: false,
    },
    {
      id: 2,
      width: 200,
      height: 200,
      positionX: 300,
      positionY: 300,
      rotate: 0,
      isSelected: false,
      isHitted: false,
      isTextEditing: false,
    },
  ],
  initialTransforms: {},
  snapGuides: {},
};

export const reducer = (
  state: State = initialState,
  action: KnownActions<typeof LayerAction>,
): State => {
  switch (action.type) {
    case "layer/dragStarted": {
      const { e, id } = action.payload;
      const initialTransforms: Record<Layer["id"], Transform> = {};

      const layers = state.layers.map((layer) => {
        layer.isTextEditing = false;
        if (e.shiftKey) {
          if (layer.id === id) {
            return {
              ...layer,
              isSelected: true,
            };
          }
          return layer;
        } else {
          return {
            ...layer,
            isSelected: layer.id === id,
          };
        }
      });

      layers
        .filter((layer) => layer.isSelected)
        .forEach((layer) => {
          initialTransforms[layer.id] = {
            width: layer.width,
            height: layer.height,
            positionX: layer.positionX,
            positionY: layer.positionY,
            rotate: layer.rotate,
          };
        });

      return { ...state, layers, initialTransforms };
    }

    case "layer/dragEnded": {
      const initialTransforms = {};
      const snapGuides = {};

      state.layers.forEach((layer) => {
        layer.isHitted = false;
      });

      return { ...state, initialTransforms, snapGuides };
    }

    case "layer/moved": {
      const { dx, dy } = action.payload;
      const snapGuides: SnapGuides = {};
      const layers = state.layers.map((layer) => {
        const transform = state.initialTransforms[layer.id];
        if (transform) {
          const { positionX, positionY } = transform;
          layer.positionX = positionX + dx;
          layer.positionY = positionY + dy;

          state.layers.forEach((_layer) => {
            if (_layer.id === layer.id) {
              return;
            }
            const hitPosX = [
              _layer.positionX,
              _layer.positionX + _layer.width,
              _layer.positionX + _layer.width / 2,
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
              _layer.positionY + _layer.height / 2,
            ];
            const linePosX = [
              _layer.positionX,
              _layer.positionX + _layer.width,
              layer.positionX,
              layer.positionX + layer.width,
            ];
            _layer.isHitted = false;

            if (hitPosX.includes(layer.positionX)) {
              snapGuides.vLine = {
                x1: layer.positionX,
                x2: layer.positionX,
                y1: Math.min(...linePosY) - 40,
                y2: Math.max(...linePosY) + 40,
              };
              _layer.isHitted = true;
            }

            if (hitPosX.includes(layer.positionX + layer.width)) {
              snapGuides.vLine = {
                x1: layer.positionX + layer.width,
                x2: layer.positionX + layer.width,
                y1: Math.min(...linePosY) - 40,
                y2: Math.max(...linePosY) + 40,
              };
              _layer.isHitted = true;
            }

            if (hitPosX.includes(layer.positionX + layer.width / 2)) {
              snapGuides.vLine = {
                x1: layer.positionX + layer.width / 2,
                x2: layer.positionX + layer.width / 2,
                y1: Math.min(...linePosY) - 40,
                y2: Math.max(...linePosY) + 40,
              };
              _layer.isHitted = true;
            }

            if (hitPosY.includes(layer.positionY)) {
              snapGuides.hLine = {
                x1: Math.min(...linePosX) - 40,
                x2: Math.max(...linePosX) + 40,
                y1: layer.positionY,
                y2: layer.positionY,
              };
              _layer.isHitted = true;
            }

            if (hitPosY.includes(layer.positionY + layer.height)) {
              snapGuides.hLine = {
                x1: Math.min(...linePosX) - 40,
                x2: Math.max(...linePosX) + 40,
                y1: layer.positionY + layer.height,
                y2: layer.positionY + layer.height,
              };
              _layer.isHitted = true;
            }

            if (hitPosY.includes(layer.positionY + layer.height / 2)) {
              snapGuides.hLine = {
                x1: Math.min(...linePosX) - 40,
                x2: Math.max(...linePosX) + 40,
                y1: layer.positionY + layer.height / 2,
                y2: layer.positionY + layer.height / 2,
              };
              _layer.isHitted = true;
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
      const layers = state.layers.map((layer) => {
        const transform = state.initialTransforms[layer.id];
        if (transform) {
          const { width, height, positionX, positionY, rotate } = transform;

          const cx = positionX + width / 2;
          const cy = positionY + height / 2;
          const [_dx, _dy] = transformRotate(rotate, [cx, cy], [dx, dy]);
          // console.log("aaaaa", rotate, _dx, _dy);

          if (posY === "bottom") {
            if (keepAspectRatio && posX === "right") {
              layer.height = ((width + _dx) / width) * height;
            } else if (keepAspectRatio && posX === "left") {
              layer.height = ((width - _dx) / width) * height;
            } else {
              layer.height = height + _dy;
            }
          } else if (posY === "top") {
            if (keepAspectRatio && posX === "right") {
              layer.height = ((width + _dx) / width) * height;
              layer.positionY = positionY - (_dx / width) * height;
            } else if (keepAspectRatio && posX === "left") {
              layer.height = ((width - _dx) / width) * height;
              layer.positionY = positionY - (-_dx / width) * height;
            } else {
              layer.height = height - _dy;
              layer.positionY = positionY + _dy;
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
      const { id, x, y } = action.payload;

      const layers = state.layers.map((layer) => {
        const transform = state.initialTransforms[layer.id];
        if (transform) {
          const cx = transform.positionX + transform.width / 2;
          const cy = transform.positionY + transform.height / 2;

          /** θ の隣辺の長さ( x 方向) */
          const vx = x - cx;
          /** θ の対辺の長さ( y 方向) */
          const vy = y - cy;
          /** θ: 回転角(ラジアン) */
          const nextTheta = Math.atan2(vy, vx);

          layer.rotate = radian2degree(nextTheta) + 90;
        }
        return layer;
      });
      return { ...state, layers };
    }

    case "layer/created": {
      const maxId = Math.max(...state.layers.map((layer) => layer.id));
      const maxPositionX = Math.max(
        ...state.layers.map((layer) => layer.positionX),
      );
      const maxPositionY = Math.max(
        ...state.layers.map((layer) => layer.positionY),
      );
      const createdLayer = {
        id: maxId > 0 ? maxId + 1 : 1,
        width: 100,
        height: 100,
        positionX: maxPositionX > 0 ? maxPositionX + 30 : 30,
        positionY: maxPositionY > 0 ? maxPositionY + 30 : 30,
        rotate: 0,
        isSelected: false,
        isHitted: false,
        isTextEditing: false,
      };
      const layers = [...state.layers, createdLayer];
      return { ...state, layers };
    }

    case "layer/deleted": {
      const layers = state.layers.filter((layer) => !layer.isSelected);
      return { ...state, layers };
    }

    case "layer/textEditStarted": {
      const { id } = action.payload;

      const layers = state.layers.map((layer) => {
        layer.isTextEditing = false;
        if (layer.id === id) {
          layer.isTextEditing = true;
          layer.isSelected = false;
        }
        return layer;
      });
      return { ...state, layers };
    }

    case "layer/textChanged": {
      const { value } = action.payload;

      const layers = state.layers.map((layer) => {
        if (layer.isTextEditing) {
          layer.text = value;
        }
        return layer;
      });
      return { ...state, layers };
    }

    default:
      return state;
  }
};
