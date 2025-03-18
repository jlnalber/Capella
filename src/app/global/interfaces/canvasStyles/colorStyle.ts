import { areEqualColors, Color, getCopyOfColor, TRANSPARENT } from "../color";
import { areEqualGradients, getCopyOfGradient, Gradient, instanceOfGradient } from "./gradientStyle";

export type Pattern = {
    picture: string,
    zoomFactor?: number
}
export const DEFAULT_PATTERN_PICTURE = '';
export const DEFAULT_PATTERN: Pattern = {
    picture: DEFAULT_PATTERN_PICTURE
}
export const DEFAULT_PATTERN_ZOOMFACTOR = 1;


export const DEFAULT_COLORSTYLE = TRANSPARENT;

export type ColorStyle = Color | Pattern | Gradient;

export function areEqualColorStyles(f1: ColorStyle | undefined, f2: ColorStyle | undefined): boolean {
    if (isDefaultColorStyle(f1) && isDefaultColorStyle(f2)){
        return true;
    }
    else if (f1 === undefined || f2 === undefined) {
        return false;
    }
    else if (instanceOfColor(f1) && instanceOfColor(f2) && areEqualColors(f1, f2)) {
        return true;
    }
    else if (instanceOfPattern(f1) && instanceOfPattern(f2) && areEqualPatterns(f1, f2)) {
        return true;
    }
    else if (instanceOfGradient(f1) && instanceOfGradient(f2) && areEqualGradients(f1, f2)) {
        return true;
    }
    return false;
}

export function isDefaultColorStyle(o: ColorStyle | undefined): boolean {
    return o === undefined || (instanceOfColor(o) && areEqualColors(DEFAULT_COLORSTYLE, o));
}

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

export function areEqualPatterns(f1: Pattern | undefined, f2: Pattern | undefined): boolean {
    return (isDefaultPattern(f1) && isDefaultPattern(f2)) || (areEqualPatternZoomFactors(f1?.zoomFactor, f2?.zoomFactor) && areEqualPatternPictures(f1?.picture, f2?.picture));
}

export function isDefaultPattern(o: Pattern | undefined): boolean {
    return o === undefined || (isDefaultPatternPicture(o.picture) && isDefaultPatternZoomFactor(o.zoomFactor));
}

export function areEqualPatternZoomFactors(f1: number | undefined, f2: number | undefined): boolean {
    return (isDefaultPatternZoomFactor(f1) && isDefaultPatternZoomFactor(f2)) || (f1 === f2);
}

export function isDefaultPatternZoomFactor(o: number | undefined): boolean {
    return o === undefined || o === DEFAULT_PATTERN_ZOOMFACTOR;
}

export function areEqualPatternPictures(f1: string | undefined, f2: string | undefined): boolean {
    return (isDefaultPatternPicture(f1) && isDefaultPatternPicture(f2)) || (f1 === f2);
}

export function isDefaultPatternPicture(o: string | undefined): boolean {
    return o === undefined || o === DEFAULT_PATTERN_PICTURE;
}



export function instanceOfColor(colorStyle: ColorStyle): colorStyle is Color {
    return 'r' in colorStyle;
}

export function instanceOfPattern(colorStyle: ColorStyle): colorStyle is Pattern {
    return 'picture' in colorStyle;
}
