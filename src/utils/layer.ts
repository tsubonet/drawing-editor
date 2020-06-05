import { Radian, Degree, Pixel } from "../model/layer";

export const radianToDeg = (radian: Radian) => (radian * 180) / Math.PI;

export const degToRadian = (deg: Degree) => (deg * Math.PI) / 180;

export const rotateVector = (
  [x, y]: [Pixel, Pixel],
  theta: Radian,
): [Pixel, Pixel] => {
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);
  return [x * cos - y * sin, x * sin + y * cos];
};

export const transformRotate = (
  degree: Degree,
  [cx, cy]: [Pixel, Pixel],
  [x, y]: [Pixel, Pixel],
) => {
  const radian = degToRadian(degree);
  const [rotatedX, rotatedY] = rotateVector([x - cx, y - cy], radian);
  return [rotatedX + cx, rotatedY + cy];
};
