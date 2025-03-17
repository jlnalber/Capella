import { areEqualObjectStyleFilters, Filter, getCopyOfFilter, isDefaultObjectStyleFilter } from "./filterTypes";
import { areEqualObjectStyleAlpha, areEqualObjectStyleShadows, areEqualObjectStyleUniformSizeOnZoom, DEFAULT_ALPHA, getCopyOfShadow, isDefaultObjectStyleAlpha, isDefaultObjectStyleShadow, isDefaultObjectStyleUniformSizeOnZoom, Shadow } from "./styleTypes";

export interface ObjectStyleWrapper {
    style: ObjectStyle,
    name: string
}

export default interface ObjectStyle {
    filter?: Filter[],
    shadow?: Shadow,
    alpha?: number,
    uniformSizeOnZoom?: boolean
}

export const EMPTY_OBJECTSTYLE: ObjectStyle = {}
export const EMPTY_OBJECTSTYLEWRAPPER: ObjectStyleWrapper = {
    style: EMPTY_OBJECTSTYLE,
    name: 'Objektstil'
};
export function getEmptyObjectStyleForCopy(): ObjectStyle {
    return {};
}
export function getEmptyObjectStyleWrapperForCopy(): ObjectStyleWrapper {
    return getCopyOfObjectStyleWrapper(EMPTY_OBJECTSTYLEWRAPPER);
}

export function getCopyOfObjectStyle(objectStyle: ObjectStyle): ObjectStyle {
    const res = {
        ...objectStyle
    }
    if (res.shadow !== undefined) {
        res.shadow = getCopyOfShadow(res.shadow);
    }
    if (res.filter !== undefined) {
        res.filter = res.filter.map(f => getCopyOfFilter(f));
    }
    return res;
}

export function getCopyOfObjectStyleWrapper(objectStyle: ObjectStyleWrapper): ObjectStyleWrapper {
    return {
        style: getCopyOfObjectStyle(objectStyle.style),
        name: objectStyle.name
    }
}

export function areEqualObjectStyles(o1: ObjectStyle | undefined, o2: ObjectStyle | undefined): boolean {
    return (isDefaultObjectStyle(o1) && isDefaultObjectStyle(o2)) || (areEqualObjectStyleAlpha(o1?.alpha, o2?.alpha) && areEqualObjectStyleFilters(o1?.filter, o2?.filter) && areEqualObjectStyleShadows(o1?.shadow, o2?.shadow) && areEqualObjectStyleUniformSizeOnZoom(o1?.uniformSizeOnZoom, o2?.uniformSizeOnZoom));
}

export function isDefaultObjectStyle(o: ObjectStyle | undefined): boolean {
    return o === undefined || (isDefaultObjectStyleAlpha(o.alpha) && isDefaultObjectStyleFilter(o.filter) && isDefaultObjectStyleShadow(o.shadow) && isDefaultObjectStyleUniformSizeOnZoom(o.uniformSizeOnZoom));
}