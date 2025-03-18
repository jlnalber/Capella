import { areEqualColorStyles, ColorStyle, DEFAULT_COLORSTYLE, getCopyOfColorStyle, isDefaultColorStyle } from "./colorStyle";
import { areEqualFillStyleUniformSizeOnZoom, isDefaultFillStyleUniformSizeOnZoom } from "./styleTypes";

export default interface FillStyle {
    color: ColorStyle,
    uniformSizeOnZoom?: boolean
}

export interface FillStyleWrapper {
    style: FillStyle,
    name: string
}

export function getCopyOfFillStyle(f: FillStyle): FillStyle {
    const res = {
        ...f
    }
    res.color = getCopyOfColorStyle(res.color);
    return res;
}

export function getCopyOfFillStyleWrapper(fillStyle: FillStyleWrapper): FillStyleWrapper {
    return {
        style: getCopyOfFillStyle(fillStyle.style),
        name: fillStyle.name
    }
}

export const EMPTY_FILLSTYLE: FillStyle = {
    color: DEFAULT_COLORSTYLE
}

export const EMPTY_FILLSTYLEWRAPPER: FillStyleWrapper = {
    style: EMPTY_FILLSTYLE,
    name: 'Leerer Füllungsstil'
};

export function getEmptyFillStyleWrapperForCopy(): FillStyleWrapper {
    return getCopyOfFillStyleWrapper(EMPTY_FILLSTYLEWRAPPER);
}

export function getEmptyFillStyleForCopy(): FillStyle {
    return getCopyOfFillStyle(EMPTY_FILLSTYLE);
}

export function areEqualFillStyles(f1: FillStyle | undefined, f2: FillStyle | undefined): boolean {
    return (isDefaultFillStyle(f1) && isDefaultFillStyle(f2)) || (areEqualFillStyleUniformSizeOnZoom(f1?.uniformSizeOnZoom, f2?.uniformSizeOnZoom) && areEqualColorStyles(f1?.color, f2?.color));
}

export function isDefaultFillStyle(o: FillStyle | undefined): boolean {
    return o === undefined || (isDefaultColorStyle(o.color) && isDefaultFillStyleUniformSizeOnZoom(o.uniformSizeOnZoom));
}