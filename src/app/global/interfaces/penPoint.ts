import { PointerContext } from "../classes/pointerController"
import AbstractRenderingContext from "../classes/renderingContext/abstractRenderingContext";
import { getInRange } from "../essentials/utils";
import { Point } from "./point"
import { getCosineBetweenVectors, getVectorFromPoints, rotateVectorAroundXAxis, rotateVectorAroundYAxis, Vector, vectorProduct } from "./vector";

export type PenPoint = Point & {
    p: number, // pressure
    v?: number, // number of pixels / time -- velocity
    t: number, // time
    ax?: number, // angle x
    ay?: number // angle y
}

export type StrokePoint = Point & {
    thickness: number
}

export type Path = StrokePoint[];

export type ThicknessSettings = {
    thicknessStart: number,
    thicknessEnd: number,
    steps: number
}

// TODO: make all of this settings, so that it can be changed by the user
export const MIN_THICKNESS = 0.6;
export const MAX_THICKNESS = 1 / MIN_THICKNESS;
export const MIN_VELOCITY = 0.7;
export const MAX_VELOCITY = 1 / MIN_VELOCITY;
export const MIN_PRESSURE = 0.5;
export const MAX_PRESSURE = 1.5;
export const MIN_ANGLE = 0.4;
export const MAX_ANGLE = 1 / MIN_ANGLE;
const DEFAULT_VELOCITY = 0.4;

export function getStrokePointFromPenPoint(penPoint: PenPoint, lastPoint?: Point): StrokePoint {

    let velocityFactor = Math.pow(DEFAULT_VELOCITY / (penPoint.v ?? DEFAULT_VELOCITY + 0.1), 1/6);
    if (!isFinite(velocityFactor)) {
        velocityFactor = 1;
    }
    
    const pressureFactor = penPoint.p + 0.5;
    
    let angleFactor = 1;
    if (lastPoint !== undefined && penPoint.ax !== undefined && penPoint.ay !== undefined) {

        const v: Vector = { x: 0, y: 0, z: 1 };

        const realAx = penPoint.ax * Math.PI / 180;
        const realAy = penPoint.ay * Math.PI / 180;

        const directionVector = getVectorFromPoints(lastPoint, penPoint);
        const stylusVector = rotateVectorAroundXAxis(realAx, rotateVectorAroundYAxis(realAy, v));
        const orthVector = vectorProduct(stylusVector, directionVector);
        angleFactor = (0.5 + Math.abs(getCosineBetweenVectors(orthVector, v))) ** (1);

        /*const length = Math.sqrt((penPoint.x - lastPoint.x) ** 2 + (penPoint.y - lastPoint.y) ** 2);
        const angleSineStroke = (penPoint.y - lastPoint.y) / length;
        const angleCosineStroke = (penPoint.x - lastPoint.x) / length;
        
        // angleFactor = (Math.abs(Math.sin(penPoint.ax) * angleSineStroke) + Math.abs(Math.sin(penPoint.ay) * angleCosineStroke) + 0.5) * 2;
        const x = Math.abs(Math.sin(penPoint.ax) ** 2 * angleSineStroke)
        const y = Math.abs(Math.sin(penPoint.ay) ** 2 * angleCosineStroke)*/

        if (!isFinite(angleFactor)) {
            angleFactor = 1;
        }
        //console.log(angleFactor);
    }

    const thickness = getInRange(pressureFactor, MIN_PRESSURE, MAX_PRESSURE) * getInRange(velocityFactor, MIN_VELOCITY, MAX_VELOCITY) * getInRange(angleFactor, MIN_ANGLE, MAX_ANGLE);
    return {
        x: penPoint.x,
        y: penPoint.y,
        thickness: getInRange(Math.sqrt(thickness), MIN_THICKNESS, MAX_THICKNESS)
    }
}

export function getStrokePointPathFromPenPointPath(penPointPath: PenPoint[]): Path {
    const res: Path = [];
    const evalPoints: Point[] = []; // this is just for saving operations and not having to slice penPointPath n times
    for (let i = 0; i < penPointPath.length; i++) {
        if (i === 0) {
            res.push(getStrokePointFromPenPoint(penPointPath[i]));
        }
        else {
            res.push(getStrokePointFromPenPoint(penPointPath[i], getAverageFromLastPoints(evalPoints, 0)));
        }
        evalPoints.push(penPointPath[i]);
    }
    return res;
}

export function getAverageFromLastPoints(penPointPath: Point[], jump: number, maxSteps: number = 3): Point {
    let x = 0;
    let y = 0;
    let count = 0;
    for (let i = penPointPath.length - 1 - jump; i >= 0 && count < maxSteps; i--) {
        x += penPointPath[i].x;
        y += penPointPath[i].y;
        count++;
    }
    return {
        x: x / count,
        y: y / count
    }
}

export function getStrokePointMiddle(p1: PenPoint, p2: Point, penPointPath: Point[], jump: number, maxSteps: number = 3): StrokePoint {
    const sP = getStrokePointFromPenPoint(p1, getAverageFromLastPoints(penPointPath, jump, maxSteps));
    return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
        thickness: sP.thickness
    }
}

export function getPenPointFromPreviousPoint(p: Point, last: PenPoint | undefined, pointerContext: PointerContext, renderingContext: AbstractRenderingContext, isLast?: boolean): PenPoint {
    const time = Date.now();
    const res: PenPoint = {
        x: p.x,
        y: p.y,
        t: time,
        p: pointerContext.pressure,
        ax: isLast ? undefined : pointerContext.tiltX,
        ay: isLast ? undefined : pointerContext.tiltY
    }

    // calculate a velocity if given
    if (last) {
        const v = Math.sqrt((p.x - last.x) ** 2 + (p.y - last.y) ** 2) / (time - last.t) * renderingContext.zoom;
        res.v = v;
    }
    return res;
}

export function copyPointToPenPoint(to: Point, penPoint: PenPoint): PenPoint {
    return {
        x: to.x,
        y: to.y,
        t: penPoint.t,
        v: penPoint.v,
        p: penPoint.p,
        ax: penPoint.ax,
        ay: penPoint.ay
    }
}