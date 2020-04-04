import * as React from "react";
import { Layer } from "../model/Layer";

export const initialState = [{
  id: 1,
  width: 200,
  height: 100,
  positionX: 100,
  positionY: 100,
  rotate: 0
}];

const layerMoved = () => ({});

export const reducer = (
  state = initialState,
  action: { type: string; payload: any } // ここの型は後でもう少し安全にします
  ) => {
    switch (action.type) {
      case "layer/moved":
        return state;
      default:
        return state;
  }
};
  