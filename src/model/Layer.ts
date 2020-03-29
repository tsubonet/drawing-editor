type Pixel = number;
type Radian = number;

export interface Layer {
    id: number;
    width: Pixel;
    height: Pixel;
    positionX: Pixel;
    positionY: Pixel;
    rotate: Radian;
}