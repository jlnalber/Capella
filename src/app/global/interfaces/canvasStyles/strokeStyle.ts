import { areEqualColorStyles, ColorStyle, DEFAULT_COLORSTYLE, getCopyOfColorStyle, isDefaultColorStyle } from "./colorStyle";
import { areEqualLineCaps, areEqualLineDashOffsets, areEqualLineDashs, areEqualLineJoins, areEqualStrokeStyleUniformSizeOnZoom, isDefaultLineCap, isDefaultLineDashOffset, isDefaultLineDashs, isDefaultLineJoin, isDefaultStrokeStyleUniformSizeOnZoom, LineCap, LineJoin } from "./styleTypes";

export interface EasyStrokeStyle {
    lineDash?: number[],
    lineDashOffset?: number,
    lineJoin?: LineJoin,
    lineCap?: LineCap
}

export const EMPTY_EASYSTROKESTYLE: EasyStrokeStyle = { }
export function getEmptyEasyStrokeStyleForCopy(): EasyStrokeStyle {
    return {};
}

export type StrokeStyle = EasyStrokeStyle & {
    color: ColorStyle,
    uniformSizeOnZoom?: boolean,
    lineWidth: number
}

export interface StrokeStyleWrapper {
    style: StrokeStyle,
    name: string
}

export function getCopyOfStrokeStyleWrapper(strokeStyle: StrokeStyleWrapper): StrokeStyleWrapper {
    return {
        style: getCopyOfStrokeStyle(strokeStyle.style),
        name: strokeStyle.name
    }
}

export const DEFAULT_LINEWIDTH = 0;
export function areEqualLineWidths(f1: number | undefined, f2: number | undefined): boolean {
    return (isDefaultLineWidth(f1) && isDefaultLineWidth(f2)) || (f1 === f2);
}
export function isDefaultLineWidth(o: number | undefined): boolean {
    return o === undefined || o === DEFAULT_LINEWIDTH;
}

export const EMPTY_STROKESTYLE: StrokeStyle = {
    color: DEFAULT_COLORSTYLE,
    lineWidth: DEFAULT_LINEWIDTH
}

export const EMPTY_STROKESTYLEWRAPPER: StrokeStyleWrapper = {
    style: EMPTY_STROKESTYLE,
    name: 'Leerer Strichstil'
};

export function getEmptyStrokeStyleWrapperForCopy(): StrokeStyleWrapper {
    return getCopyOfStrokeStyleWrapper(EMPTY_STROKESTYLEWRAPPER);
}

export function getEmptyStrokeStyleForCopy(): StrokeStyle {
    return getCopyOfStrokeStyle(EMPTY_STROKESTYLE);
}

export function getCopyOfEasyStrokeStyle(ess: EasyStrokeStyle): EasyStrokeStyle {
    const res = {
        ...ess
    }
    if (res.lineDash !== undefined) {
        res.lineDash = [ ...res.lineDash ]
    }
    return res;
}

export function getCopyOfStrokeStyle(stroke: StrokeStyle): StrokeStyle {
    const res = {
        ...stroke
    }
    if (res.lineDash !== undefined) {
        res.lineDash = [ ...res.lineDash ]
    }
    res.color = getCopyOfColorStyle(res.color);
    return res;
}


export function areEqualStrokeStyles(f1: StrokeStyle | undefined, f2: StrokeStyle | undefined): boolean {
    return (isDefaultStrokeStyle(f1) && isDefaultStrokeStyle(f2)) || (areEqualColorStyles(f1?.color, f2?.color) && areEqualLineJoins(f1?.lineJoin, f2?.lineJoin) && areEqualLineCaps(f1?.lineCap, f2?.lineCap) && areEqualLineDashOffsets(f1?.lineDashOffset, f2?.lineDashOffset) && areEqualLineDashs(f1?.lineDash, f2?.lineDash) && areEqualStrokeStyleUniformSizeOnZoom(f1?.uniformSizeOnZoom, f2?.uniformSizeOnZoom) && areEqualLineWidths(f1?.lineWidth, f2?.lineWidth));
}

export function isDefaultStrokeStyle(o: StrokeStyle | undefined): boolean {
    return o === undefined || (isDefaultLineDashs(o.lineDash) && isDefaultLineDashOffset(o.lineDashOffset) && isDefaultColorStyle(o.color) && isDefaultLineCap(o.lineCap) && isDefaultLineJoin(o.lineJoin) && isDefaultLineWidth(o.lineWidth) && isDefaultStrokeStyleUniformSizeOnZoom(o.uniformSizeOnZoom));
}