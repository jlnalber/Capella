import { Point } from "./point";

export type Circle = Point & {
    radius: number
}

export function getCopyOfCircle(circle: Circle): Circle {
    return {
        ...circle
    }
}