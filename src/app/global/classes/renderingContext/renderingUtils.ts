import { Point } from "../../interfaces/point";

export function getPointsForQuadraticFormula(p1: Point, p2: Point): Point {
    return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2
    }
}