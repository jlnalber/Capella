export type Vector = Point;

export interface Point {
  x: number,
  y: number
}

export function getCopyOfPoint(p: Point): Point {
  return {
    ...p
  }
}
