import { PointerContext } from "../classes/pointerController"
import AbstractRenderingContext from "../classes/renderingContext/abstractRenderingContext";
import { Point } from "./point"

export type PenPoint = Point & {
    p: number, // pressure
    v?: number, // number of pixels / time -- velocity
    t: number, // time
    ax?: number, // angle x
    ay?: number // angle y
}

export function getPenPointFromPreviousPoint(p: Point, last: PenPoint | undefined, pointerContext: PointerContext, renderingContext: AbstractRenderingContext): PenPoint {
    const time = Date.now();
    const res: PenPoint = {
        x: p.x,
        y: p.y,
        t: time,
        p: pointerContext.pressure,
        ax: pointerContext.tiltX,
        ay: pointerContext.tiltY
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