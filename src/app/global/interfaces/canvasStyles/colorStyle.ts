import { Circle } from "../circle";
import { Color } from "../color";
import { Point } from "../point";

export type Pattern = {
    picture: string
}

export type Gradient = LinearGradient | RadialGradient | ConicGradient;
export type LinearGradient = {
    startPoint: Point,
    endPoint: Point,
    stops: GradientColorStop[]
};
export type RadialGradient = {
    startCircle: Circle,
    endCircle: Circle,
    stops: GradientColorStop[]
};
export type ConicGradient = {
    center: Point,
    startAngle: number,
    stops: GradientColorStop[]
};
export type GradientColorStop = [number, Color];

export type ColorStyle = Color | Pattern | Gradient;


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