import { TRANSPARENT } from "../color";
import { ColorStyle, getCopyOfColorStyle } from "./colorStyle";
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