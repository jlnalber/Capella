import { areEqualCircles, Circle, getCopyOfCircle, getDefaultCircleForCopy, isDefaultCircle } from "../circle";
import { areEqualColors, Color, getCopyOfColor } from "../color";
import { areEqualPoints, getCopyOfPoint, getDefaultPointForCopy, isDefaultPoint, Point } from "../point";
import { ColorStyle } from "./colorStyle";

export type Gradient = LinearGradient | RadialGradient | ConicGradient;
export type LinearGradient = {
    startPoint: Point,
    endPoint: Point,
    stops: GradientColorStop[]
};
export const DEFAULT_LINEARGRADIENT: LinearGradient = {
    startPoint: getDefaultPointForCopy(),
    endPoint: getDefaultPointForCopy(),
    stops: getDefaultGradientColorStopsForCopy()
}
export type RadialGradient = {
    startCircle: Circle,
    endCircle: Circle,
    stops: GradientColorStop[]
};
export const DEFAULT_RADIAL_GRADIENT: RadialGradient = {
    startCircle: getDefaultCircleForCopy(),
    endCircle: getDefaultCircleForCopy(),
    stops: getDefaultGradientColorStopsForCopy()
};
export type ConicGradient = {
    center: Point,
    startAngle: number,
    stops: GradientColorStop[]
};
export const DEFAULT_CONIC_GRADIENT_STARTANGLE = 0;
export const DEFAULT_CONIC_GRADIENT: ConicGradient = {
    center: getDefaultPointForCopy(),
    startAngle: DEFAULT_CONIC_GRADIENT_STARTANGLE,
    stops: getDefaultGradientColorStopsForCopy()
};
export type GradientColorStop = [number, Color];

export function getCopyOfGradientColorStop(gcs: GradientColorStop): GradientColorStop {
    return [gcs[0], getCopyOfColor(gcs[1])];
}

export const DEFAULT_GRADIENT_COLOR_STOPS: GradientColorStop[] = [];

export function getDefaultGradientColorStopsForCopy(): GradientColorStop[] {
    return [];
}

export function areEqualGradientColorStops(f1: GradientColorStop[] | undefined, f2: GradientColorStop[] | undefined): boolean {
    if (isDefaultGradientColorStops(f1) && isDefaultGradientColorStops(f2)) {
        return true;
    }
    else if (f1 === undefined || f2 === undefined) {
        return false;
    }
    else if (f1.length !== f2.length) {
        return false;
    }
    for (let i = 0; i < f1.length; i++) {
        if (!areEqualGradientColorStop(f1[i], f2[i])) {
            return false;
        }
    }
    return true;
}

export function isDefaultGradientColorStops(o: GradientColorStop[] | undefined): boolean {
    return o === undefined || (o.length === 0 && o.length === 0);
}

export function areEqualGradientColorStop(f1: GradientColorStop, f2: GradientColorStop): boolean {
    return f1[0] === f2[0] && areEqualColors(f1[1], f2[1]);
}


export function getCopyOfGradient(gradient: Gradient): Gradient {
    if (instanceOfLinearGradient(gradient)) {
        return getCopyOfLinearGradient(gradient);
    }
    else if (instanceOfRadialGradient(gradient)) {
        return getCopyOfRadialGradient(gradient);
    }
    else {
        return getCopyOfConicGradient(gradient);
    }
}

export function areEqualGradients(f1: Gradient | undefined, f2: Gradient | undefined): boolean {
    if (f1 === f2) {
        return true;
    }
    else if (f1 === undefined || f2 === undefined){
        return false;
    }
    else if (instanceOfConicGradient(f1) && instanceOfConicGradient(f2) && areEqualConicGradients(f1, f2)) {
        return true;
    }
    else if (instanceOfLinearGradient(f1) && instanceOfLinearGradient(f2) && areEqualLinearGradients(f1, f2)) {
        return true;
    }
    else if (instanceOfRadialGradient(f1) && instanceOfRadialGradient(f2) && areEqualRadialGradients(f1, f2)) {
        return true;
    }
    return false;
}

export function getCopyOfRadialGradient(g: RadialGradient): RadialGradient {
    const res = {
        ...g
    }
    res.startCircle = getCopyOfCircle(g.startCircle);
    res.endCircle = getCopyOfCircle(g.endCircle);
    res.stops = res.stops.map(gcs => getCopyOfGradientColorStop(gcs));
    return res;
}

export function areEqualRadialGradients(f1: RadialGradient | undefined, f2: RadialGradient | undefined): boolean {
    return (isDefaultRadialGradient(f1) && isDefaultRadialGradient(f2)) || (areEqualGradientColorStops(f1?.stops, f2?.stops) && areEqualCircles(f1?.endCircle, f2?.endCircle) && areEqualCircles(f1?.startCircle, f2?.startCircle));
}

export function isDefaultRadialGradient(o: RadialGradient | undefined): boolean {
    return o === undefined || (isDefaultGradientColorStops(o.stops) && isDefaultCircle(o.endCircle) && isDefaultCircle(o.startCircle));
}

export function getCopyOfLinearGradient(g: LinearGradient): LinearGradient {
    const res = {
        ...g
    }
    res.startPoint = getCopyOfPoint(g.startPoint);
    res.endPoint = getCopyOfPoint(g.endPoint);
    res.stops = res.stops.map(gcs => getCopyOfGradientColorStop(gcs));
    return res;
}

export function areEqualLinearGradients(f1: LinearGradient | undefined, f2: LinearGradient | undefined): boolean {
    return (isDefaultLinearGradient(f1) && isDefaultLinearGradient(f2)) || (areEqualGradientColorStops(f1?.stops, f2?.stops) && areEqualPoints(f1?.endPoint, f2?.endPoint) && areEqualPoints(f1?.startPoint, f2?.startPoint));
}

export function isDefaultLinearGradient(o: LinearGradient | undefined): boolean {
    return o === undefined || (isDefaultGradientColorStops(o.stops) && isDefaultPoint(o.endPoint) && isDefaultPoint(o.startPoint));
}

export function getCopyOfConicGradient(g: ConicGradient): ConicGradient {
    const res = {
        ...g
    }
    res.center = getCopyOfPoint(g.center);
    res.stops = res.stops.map(gcs => getCopyOfGradientColorStop(gcs));
    return res;
}

export function areEqualConicGradients(f1: ConicGradient | undefined, f2: ConicGradient | undefined): boolean {
    return (isDefaultConicGradient(f1) && isDefaultConicGradient(f2)) || (areEqualGradientColorStops(f1?.stops, f2?.stops) && areEqualPoints(f1?.center, f2?.center) && areEqualConicGradientStartAngles(f1?.startAngle, f2?.startAngle));
}

export function isDefaultConicGradient(o: ConicGradient | undefined): boolean {
    return o === undefined || (isDefaultGradientColorStops(o.stops) && isDefaultConicGradientStartAngle(o.startAngle) && isDefaultPoint(o.center));
}

export function areEqualConicGradientStartAngles(f1: number | undefined, f2: number | undefined): boolean {
    return (isDefaultConicGradientStartAngle(f1) && isDefaultConicGradientStartAngle(f2)) || (f1 === f2);
}

export function isDefaultConicGradientStartAngle(o: number | undefined): boolean {
    return o === undefined || o === DEFAULT_CONIC_GRADIENT_STARTANGLE;
}


export function instanceOfLinearGradient(colorStyle: ColorStyle): colorStyle is LinearGradient {
    return 'startPoint' in colorStyle;
}

export function instanceOfRadialGradient(colorStyle: ColorStyle): colorStyle is RadialGradient {
    return 'startCircle' in colorStyle;
}

export function instanceOfConicGradient(colorStyle: ColorStyle): colorStyle is ConicGradient {
    return 'center' in colorStyle;
}

export function instanceOfGradient(colorStyle: ColorStyle): colorStyle is Gradient {
    return 'stops' in colorStyle;
}