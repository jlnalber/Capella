import { Filter } from "./filterTypes";
import { Shadow } from "./styleTypes";

export default interface ObjectStyle {
    filter?: Filter[],
    shadow?: Shadow,
    uniformSizeOnZoom?: boolean
}

export const EMPTY_OBJECTSTYLE: ObjectStyle = {}