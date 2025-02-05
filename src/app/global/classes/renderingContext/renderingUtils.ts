import { DEFAULT_STEPS_PATH, StrokePoint, ThicknessSettings } from "../../interfaces/penPoint";
import { Point } from "../../interfaces/point";

export function getPointsForQuadraticFormula(p1: Point, p2: Point): Point {
    return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2
    }
}

export function getPointInQuadraticBezier(t: number, qbz: QuadraticBezier): Point {
    return {
        x: (1 - t) * (1 - t) * qbz.from.x + 2 * (1 - t) * t * qbz.control.x + t * t * qbz.to.x,
        y: (1 - t) * (1 - t) * qbz.from.y + 2 * (1 - t) * t * qbz.control.y + t * t * qbz.to.y
    }
}

export type QuadraticBezier = {
    from: Point,
    control: Point,
    to: Point
}

export function getControlPointInQuadraticBezier(t1: number, t2: number, qbz: QuadraticBezier): QuadraticBezier {
    const cp1: Point = {
        x: qbz.control.x * (1 - t1) + qbz.to.x * t1,
        y: qbz.control.y * (1 - t1) + qbz.to.y * t1
    }

    const tDash = (t2 - t1) / (1 - t1);

    const from = getPointInQuadraticBezier(t1, qbz);
    const to = getPointInQuadraticBezier(t2, qbz);

    return {
        from,
        control: {
            x: from.x * (1 - tDash) + cp1.x * tDash,
            y: from.y * (1 - tDash) + cp1.y * tDash
        },
        to
    }
}

export function getThicknessSettings(a: StrokePoint, b: StrokePoint, lw: number, changeThickness: boolean | undefined): ThicknessSettings | undefined {
    if (changeThickness) {
        return {
            thicknessStart: a.thickness * lw,
            thicknessEnd: b.thickness * lw,
            steps: DEFAULT_STEPS_PATH
        }
    }
    return undefined;
}