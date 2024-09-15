import { TRANSPARENT } from "../color";
import { ColorStyle, LineCap, LineJoin } from "./styleTypes";

export default interface StrokeStyle {
    color: ColorStyle,
    uniformSizeOnZoom?: boolean,
    lineWidth: number,
    lineDash?: number[],
    lineDashOffset?: number,
    lineJoin?: LineJoin,
    lineCap?: LineCap
}

export const EMPTY_STROKESTYLE: StrokeStyle = {
    color: TRANSPARENT,
    lineWidth: 0
}