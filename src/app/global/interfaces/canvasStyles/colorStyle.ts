import { Circle, getCopyOfCircle } from "../circle";
import { Color, getCopyOfColor } from "../color";
import { getCopyOfPoint, Point } from "../point";

export type Pattern = {
    picture: string
}
export const DEFAULT_PATTERN: Pattern = {
    picture: ''
}

export type Gradient = LinearGradient | RadialGradient | ConicGradient;
export type LinearGradient = {
    startPoint: Point,
    endPoint: Point,
    stops: GradientColorStop[]
};
export const DEFAULT_LINEARGRADIENT: LinearGradient = {
    startPoint: {x: 0, y: 0},
    endPoint: {x: 0, y: 0},
    stops: []
}
export type RadialGradient = {
    startCircle: Circle,
    endCircle: Circle,
    stops: GradientColorStop[]
};
export const DEFAULT_RADIAL_GRADIENT: RadialGradient = {
    startCircle: { x: 0, y: 0, radius: 0 },
    endCircle: { x: 0, y: 0, radius: 0 },
    stops: []
};
export type ConicGradient = {
    center: Point,
    startAngle: number,
    stops: GradientColorStop[]
};
export const DEFAULT_CONIC_GRADIENT: ConicGradient = {
    center: { x: 0, y: 0 },
    startAngle: 0,
    stops: []
};
export type GradientColorStop = [number, Color];

export function getCopyOfGradientColorStop(gcs: GradientColorStop): GradientColorStop {
    return [gcs[0], getCopyOfColor(gcs[1])];
}

export type ColorStyle = Color | Pattern | Gradient;

export function getCopyOfColorStyle(colorStyle: ColorStyle): ColorStyle {
    if (instanceOfColor(colorStyle)) {
        return getCopyOfColor(colorStyle);
    }
    else if (instanceOfGradient(colorStyle)) {
        return getCopyOfGradient(colorStyle);
    }
    else {
        return getCopyOfPattern(colorStyle);
    }
}

export function getCopyOfPattern(pattern: Pattern): Pattern {
    return {
        ...pattern
    }
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

export function getCopyOfRadialGradient(g: RadialGradient): RadialGradient {
    const res = {
        ...g
    }
    res.startCircle = getCopyOfCircle(g.startCircle);
    res.endCircle = getCopyOfCircle(g.endCircle);
    res.stops = res.stops.map(gcs => getCopyOfGradientColorStop(gcs));
    return res;
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

export function getCopyOfConicGradient(g: ConicGradient): ConicGradient {
    const res = {
        ...g
    }
    res.center = getCopyOfPoint(g.center);
    res.stops = res.stops.map(gcs => getCopyOfGradientColorStop(gcs));
    return res;
}


export function instanceOfColor(colorStyle: ColorStyle): colorStyle is Color {
    return 'r' in colorStyle;
}

export function instanceOfPattern(colorStyle: ColorStyle): colorStyle is Pattern {
    return 'picture' in colorStyle;
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