import { Filter, getCopyOfFilter } from "./filterTypes";
import { getCopyOfShadow, Shadow } from "./styleTypes";

export default interface ObjectStyle {
    filter?: Filter[],
    shadow?: Shadow,
    uniformSizeOnZoom?: boolean,
    alpha?: number
}

export const EMPTY_OBJECTSTYLE: ObjectStyle = {}

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