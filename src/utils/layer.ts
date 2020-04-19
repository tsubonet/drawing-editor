
import { Radian, Degree } from "../model/Layer";

export const radianToDeg = (radian: Radian) => radian * 180 / Math.PI;

export const degToRadian = (deg: Degree) => deg * Math.PI / 180;
