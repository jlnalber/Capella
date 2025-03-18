import { areEqualColorStyles, ColorStyle, DEFAULT_COLORSTYLE, getCopyOfColorStyle, isDefaultColorStyle } from "./colorStyle";
import { areEqualFillStyleUniformSizeOnZoom, isDefaultFillStyleUniformSizeOnZoom } from "./styleTypes";

export default interface FillStyle {
    color: ColorStyle,
    uniformSizeOnZoom?: boolean
}

export function getCopyOfFillStyle(f: FillStyle): FillStyle {
    const res = {
        ...f
    }
    res.color = getCopyOfColorStyle(res.color);
    return res;
}

export const EMPTY_FILLSTYLE: FillStyle = {
    color: DEFAULT_COLORSTYLE
}

export function areEqualFillStyles(f1: FillStyle | undefined, f2: FillStyle | undefined): boolean {
    return (isDefaultFillStyle(f1) && isDefaultFillStyle(f2)) || (areEqualFillStyleUniformSizeOnZoom(f1?.uniformSizeOnZoom, f2?.uniformSizeOnZoom) && areEqualColorStyles(f1?.color, f2?.color));
}

export function isDefaultFillStyle(o: FillStyle | undefined): boolean {
    return o === undefined || (isDefaultColorStyle(o.color) && isDefaultFillStyleUniformSizeOnZoom(o.uniformSizeOnZoom));
}