export type Pixel = number;
export type Radian = number;
export type Degree = number;

export type PosX = "left" | "center" | "right";
export type PosY = "top" | "middle" | "bottom";

export interface Layer {
    id: number;
    width: Pixel;
    height: Pixel;
    positionX: Pixel;
    positionY: Pixel;
    rotate: Degree;
    isSelected: boolean;
}