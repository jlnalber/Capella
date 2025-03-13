import { Filter, getCopyOfFilter } from "./filterTypes";
import { getCopyOfShadow, Shadow } from "./styleTypes";

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