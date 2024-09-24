import { TRANSPARENT } from "../color";
import { ColorStyle } from "./colorStyle";

export default interface FillStyle {
    color: ColorStyle,
    uniformSizeOnZoom?: boolean
}

export const EMPTY_FILLSTYLE: FillStyle = {
    color: TRANSPARENT
}