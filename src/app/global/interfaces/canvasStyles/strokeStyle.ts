import { TRANSPARENT } from "../color";
import { ColorStyle } from "./colorStyle";
import { LineCap, LineJoin } from "./styleTypes";

export interface EasyStrokeStyle {
    lineDash?: number[],
    lineDashOffset?: number,
    lineJoin?: LineJoin,
    lineCap?: LineCap
}

export type StrokeStyle = EasyStrokeStyle & {
    color: ColorStyle,
    uniformSizeOnZoom?: boolean,
    lineWidth: number
}

export const EMPTY_STROKESTYLE: StrokeStyle = {
    color: TRANSPARENT,
    lineWidth: 0
}