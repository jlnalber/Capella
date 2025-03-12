import { ColorStyle, getCopyOfGradient, getCopyOfPattern, Gradient, instanceOfGradient, instanceOfPattern, Pattern } from "src/app/global/interfaces/canvasStyles/colorStyle"
import ObjectStyle, { getCopyOfObjectStyle } from "src/app/global/interfaces/canvasStyles/objectStyle"
import { EasyStrokeStyle, getCopyOfEasyStrokeStyle, getCopyOfStrokeStyle, StrokeStyle } from "src/app/global/interfaces/canvasStyles/strokeStyle"
import { BLACK, Color, DEEPBLUE, getColorAsRgbaFunction, getCopyOfColor, YELLOW } from "src/app/global/interfaces/color"
import { PenIcon } from "src/app/global/interfaces/icon";
import { PX_PER_MM } from "../../services/page";
import { getImageToBase64 } from "src/app/global/essentials/imageUtils";

export type PenStyle = {
    objectStyle?: ObjectStyle,
    strokeStyle: StrokeStyle,
    useSizes?: boolean
}

export function getCopyOfPenStyle(penStyle: PenStyle): PenStyle {
    const res = {
        ...penStyle
    }
    if (res.objectStyle !== undefined) {
        res.objectStyle = getCopyOfObjectStyle(res.objectStyle);
    }
    res.strokeStyle = getCopyOfStrokeStyle(res.strokeStyle);
    return res;
}

export type EasyPenStyle = {
    objectStyle?: ObjectStyle,
    strokeStyle: EasyStrokeStyle,
    useSizes?: boolean
}

export function getCopyOfEasyPenStyle(penStyle: EasyPenStyle): EasyPenStyle {
    const res = {
        ...penStyle
    }
    if (res.objectStyle !== undefined) {
        res.objectStyle = getCopyOfObjectStyle(res.objectStyle);
    }
    res.strokeStyle = getCopyOfEasyStrokeStyle(res.strokeStyle);
    return res;
}

export type Pen = {
    name: string,
    icon?: PenIcon,
    penStyle: EasyPenStyle,
    color: Color,
    colorStyle?: PenColorStyle,
    lineWidth: number
}

export type PenColorStyle = EasyPenColorStyle | ((c: Color, then?: () => void) => ColorStyle);
export type EasyPenColorStyle = Gradient | Pattern | number;

export function getColorStyleOfPen(p: Pen, pens: Pen[], c?: Color, then?: () => void): ColorStyle {
    if (p.colorStyle === undefined) {
        return p.color;
    }
    else if (typeof p.colorStyle === 'number') {
        return getColorStyleOfPen(pens[p.colorStyle], pens, c ?? p.color, then);
    }
    else if (typeof p.colorStyle === 'function') {
        return p.colorStyle(c ?? p.color, then);
    }
    else {
        return p.colorStyle;
    }
}

export function getPenStyleOfPen(pen: Pen, pens: Pen[]): PenStyle {
    const color: ColorStyle = getColorStyleOfPen(pen, pens);

    const strokeStyle: StrokeStyle = {
        ...pen.penStyle.strokeStyle,
        lineWidth: pen.lineWidth,
        uniformSizeOnZoom: false,
        color: color
    }

    return {
        objectStyle: pen.penStyle.objectStyle,
        strokeStyle: strokeStyle,
        useSizes: pen.penStyle.useSizes
    }
}

export function getCopyOfPen(pen: Pen, index?: number): Pen {
    const p: Pen = {
        ...pen
    }
    p.color = getCopyOfColor(pen.color);
    if (typeof p.colorStyle !== 'undefined' && typeof p.colorStyle !== 'function' && typeof p.colorStyle !== 'number') {
        if (instanceOfPattern(p.colorStyle)) {
            p.colorStyle = getCopyOfPattern(p.colorStyle);
        }
        else if (instanceOfGradient(p.colorStyle)) {
            p.colorStyle = getCopyOfGradient(p.colorStyle);
        }
    }
    else if (typeof p.colorStyle === 'function' && index !== undefined) {
        p.colorStyle = index;
    }
    p.penStyle = getCopyOfEasyPenStyle(p.penStyle);
    return p;
}

export const DEFAULT_PENS: Pen[] = [{
    name: 'Füller',
    penStyle: {
        strokeStyle: {
            lineCap: 'round'
        },
        useSizes: true
    },
    color: DEEPBLUE,
    lineWidth: 0.6 * PX_PER_MM,
    icon: 'fueller'
}, {
    name: 'Kugelschreiber',
    penStyle: {
        strokeStyle: {
            lineCap: 'round'
        },
        useSizes: true
    },
    color: BLACK,
    lineWidth: 0.4 * PX_PER_MM,
    icon: 'ballpoint'
}, {
    name: 'Bleistift',
    penStyle: {
        strokeStyle: {
            lineCap: 'round'
        },
        objectStyle: {
            filter: [
                ['blur', [0.75, 'px']]
            ]
        }
    },
    color: BLACK,
    colorStyle: (c: Color, then?: () => void) => {
        return {
            picture: createNoisePattern(c, then)
        }
    },
    lineWidth: 0.6 * PX_PER_MM,
    icon: 'pencil'
}, {
    name: 'Textmarker',
    penStyle: {
        strokeStyle: {
            lineCap: 'butt'
        },
        objectStyle: {
            alpha: 0.5
        }
    },
    color: YELLOW,
    lineWidth: 4.6 * PX_PER_MM,
    icon: 'marker'
}]

export const DEFAULT_PEN: Pen = {
    name: 'Stift',
    penStyle: {
        strokeStyle: {}
    },
    color: BLACK,
    lineWidth: 3,
    icon: 'pencil'
}

export const DEFAULT_MIN_PEN_SIZE: number = 0.1 * PX_PER_MM;
export const DEFAULT_MAX_PEN_SIZE: number = 8 * PX_PER_MM;


function createNoisePattern(color: Color, then?: () => void): string {
    const rgbStr = getColorAsRgbaFunction(color);
    if (dict[rgbStr] === undefined) {
        const width = 50;
        const height = 50;
        const noiseCanvas = document.createElement('canvas');
        noiseCanvas.width = width;
        noiseCanvas.height = height;
        const noiseCtx = noiseCanvas.getContext('2d') as CanvasRenderingContext2D;

        if (noiseCtx) {
            const imageData = noiseCtx.createImageData(width, height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const gray = 1 - Math.random();
                data[i] = (1 - gray) * 255 + gray * color.r;
                data[i + 1] = (1 - gray) * 255 + gray * color.g;
                data[i + 2] = (1 - gray) * 255 + gray * color.b;
                data[i + 3] = (color.a ?? 1) * 255;
            }

            noiseCtx.putImageData(imageData, 0, 0);
        }
        dict[rgbStr] = noiseCanvas.toDataURL();
        getImageToBase64(dict[rgbStr], then);
    }
    return dict[rgbStr];
}
const dict: { [c: string]: string; } = {};