import { areEqualColors, Color, getCopyOfColor, TRANSPARENT } from "../color";
import { LengthMeasurement } from "./unitTypes";

export type Shadow = {
    color: Color,
    blur: number,
    offsetX: number,
    offsetY: number
}
export const DEFAULT_SHADOW = {
    blur: 0,
    offsetX: 0,
    offsetY: 0,
    color: TRANSPARENT
}
export const DEFAULT_ALPHA: number = 1

export function getCopyOfShadow(shadow: Shadow): Shadow {
    const res = {
        ...shadow
    }
    res.color = getCopyOfColor(res.color);
    return res;
}

export function areEqualObjectStyleShadows(f1: Shadow | undefined, f2: Shadow | undefined): boolean {
    return (isDefaultObjectStyleShadow(f1) && isDefaultObjectStyleShadow(f2)) ||
        (f1?.blur === f2?.blur && f1?.offsetX === f2?.offsetX && f1?.offsetY === f2?.offsetY && areEqualColors(f1?.color, f2?.color));
}

export function isDefaultObjectStyleShadow(o: Shadow | undefined): boolean {
    return o === undefined
}

export function areEqualObjectStyleAlpha(f1: number | undefined, f2: number | undefined): boolean {
    return f1 === f2 || (isDefaultObjectStyleAlpha(f1) && isDefaultObjectStyleAlpha(f2));
}

export function isDefaultObjectStyleAlpha(o: number | undefined): boolean {
    return o === undefined || o === DEFAULT_ALPHA;
}

export function areEqualObjectStyleUniformSizeOnZoom(f1: boolean | undefined, f2: boolean | undefined): boolean {
    return f1 === f2 || (isDefaultObjectStyleUniformSizeOnZoom(f1) && isDefaultObjectStyleUniformSizeOnZoom(f2));
}
export function isDefaultObjectStyleUniformSizeOnZoom(o: boolean | undefined): boolean {
    return o === undefined || o === false;
}
export function areEqualFillStyleUniformSizeOnZoom(f1: boolean | undefined, f2: boolean | undefined): boolean {
    return f1 === f2 || (isDefaultFillStyleUniformSizeOnZoom(f1) && isDefaultFillStyleUniformSizeOnZoom(f2));
}
export function isDefaultFillStyleUniformSizeOnZoom(o: boolean | undefined): boolean {
    return o === undefined || o === false;
}
export function areEqualStrokeStyleUniformSizeOnZoom(f1: boolean | undefined, f2: boolean | undefined): boolean {
    return f1 === f2 || (isDefaultStrokeStyleUniformSizeOnZoom(f1) && isDefaultStrokeStyleUniformSizeOnZoom(f2));
}
export function isDefaultStrokeStyleUniformSizeOnZoom(o: boolean | undefined): boolean {
    return o === undefined || o === false;
}

export type LineCap = CanvasLineCap;
export const DEFAULT_LINECAP: LineCap = 'round';
export const ALL_LINECAP: LineCap[] = ['butt', 'round', 'square']
export function areEqualLineCaps(f1: LineCap | undefined, f2: LineCap | undefined): boolean {
    return (isDefaultLineCap(f1) && isDefaultLineCap(f2)) || (f1 === f2);
}
export function isDefaultLineCap(o: LineCap | undefined): boolean {
    return o === undefined || o === DEFAULT_LINECAP;
}

export const DEFAULT_LINEDASH: number[] = [];
export const REGULAR_LINEDASH: number[] = [10, 10];
export function areEqualLineDashs(f1: number[] | undefined, f2: number[] | undefined): boolean {
    if (isDefaultLineDashs(f1) && isDefaultLineDashs(f2)) {
        return true;
    }
    else if (f1 === undefined || f2 === undefined) {
        return false;
    }
    else if (f1.length !== f2.length) {
        return false;
    }
    for (let i = 0; f1.length; i++) {
        if (f1[i] !== f2[i]) {
            return false;
        }
    }
    return true;
}
export function isDefaultLineDashs(o: number[] | undefined): boolean {
    return o === undefined || o.length === 0;
}

export const DEFAULT_LINEDASHOFFSET: number = 0.0;
export function areEqualLineDashOffsets(f1: number | undefined, f2: number | undefined): boolean {
    return (isDefaultLineDashOffset(f1) && isDefaultLineDashOffset(f2)) || (f1 === f2);
}
export function isDefaultLineDashOffset(o: number | undefined): boolean {
    return o === undefined || o === DEFAULT_LINEDASHOFFSET;
}

export type LineJoin = CanvasLineJoin;
export const DEFAULT_LINEJOIN: LineJoin = 'miter';
export const ALL_LINEJOIN: LineJoin[] = ['bevel', 'miter', 'round']
export function areEqualLineJoins(f1: LineJoin | undefined, f2: LineJoin | undefined): boolean {
    return (isDefaultLineJoin(f1) && isDefaultLineJoin(f2)) || (f1 === f2);
}
export function isDefaultLineJoin(o: LineJoin | undefined): boolean {
    return o === undefined || o === DEFAULT_LINEJOIN;
}

export type FontSize = LengthMeasurement;
export const DEFAULT_FONTSIZE: FontSize = [0, 'pt']

export type FontWeight = 'normal' | 'bold' | number;
export const DEFAULT_FONTWEIGHT: FontWeight = 'normal'

export type FontStyle = 'normal' | 'italic';
export const DEFAULT_FONTSTYLE: FontStyle = 'normal';

export type FontKerning = CanvasFontKerning;
export const DEFAULT_FONTKERNING: FontKerning = 'auto'

export type FontStretch = CanvasFontStretch;
export const DEFAULT_FONTSTRETCH: FontStretch = 'normal';

export type FontVariantCaps = CanvasFontVariantCaps;
export const DEFAULT_FONTVARIANTCAPS: FontVariantCaps = 'normal';

export type LetterSpacing = LengthMeasurement;
export const DEFAULT_LETTERSPACING: LetterSpacing = [0, 'px'];

export type TextDirection = CanvasDirection;
export const DEFAULT_TEXTDIRECTION: TextDirection = 'inherit';

export type TextAlign = CanvasTextAlign;
export const DEFAULT_TEXTALIGN: TextAlign = 'start';

export type TextBaseline = CanvasTextBaseline;
export const DEFAULT_TEXTBASELINE: TextBaseline = 'alphabetic'

export type WordSpacing = LengthMeasurement;
export const DEFAULT_WORDSPACING: WordSpacing = [0, 'px']

export const DEFAULT_IMAGESMOOTHINGENABLED: boolean = true;
export function areEqualImageStyleImageSmoothingEnabled(f1: boolean | undefined, f2: boolean | undefined): boolean {
    return (isDefaultImageStyleImageSmoothingEnabled(f1) && isDefaultImageStyleImageSmoothingEnabled(f2)) || (f1 === f2);
}
export function isDefaultImageStyleImageSmoothingEnabled(o: boolean | undefined): boolean {
    return o === undefined || o === DEFAULT_IMAGESMOOTHINGENABLED;
}

export const DEFAULT_IMAGESMOOTHINGQUALITY: ImageSmoothingQuality = 'low'
export function areEqualImageStyleImageSmoothingQuality(f1: ImageSmoothingQuality | undefined, f2: ImageSmoothingQuality | undefined): boolean {
    return (isDefaultImageStyleImageSmoothingQuality(f1) && isDefaultImageStyleImageSmoothingQuality(f2)) || (f1 === f2);
}
export function isDefaultImageStyleImageSmoothingQuality(o: ImageSmoothingQuality | undefined): boolean {
    return o === undefined || o === DEFAULT_IMAGESMOOTHINGQUALITY;
}