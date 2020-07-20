import { Radian, Degree, Pixel, Layer } from "../model/layer";

export const radian2degree = (radian: Radian) => (radian * 180) / Math.PI;

export const degree2radian = (deg: Degree) => (deg * Math.PI) / 180;

export const distanceBetween = (
  [x1, y1]: [Pixel, Pixel],
  [x2, y2]: [Pixel, Pixel],
) => {
  const [width, height] = [x2 - x1, y2 - y1];

  return Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
};

export const getAbsoluteCenter = (layer: Layer): [Pixel, Pixel] => {
  return [
    layer.positionX + layer.width / 2,
    layer.positionY + layer.height / 2,
  ];
};

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
  const radian = degree2radian(degree);
  const [rotatedX, rotatedY] = rotateVector([x - cx, y - cy], radian);
  return [rotatedX + cx, rotatedY + cy];
};
