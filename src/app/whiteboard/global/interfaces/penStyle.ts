import { ColorStyle, Gradient, instanceOfColor, Pattern } from "src/app/global/interfaces/canvasStyles/colorStyle"
import ObjectStyle from "src/app/global/interfaces/canvasStyles/objectStyle"
import { EasyStrokeStyle, StrokeStyle } from "src/app/global/interfaces/canvasStyles/strokeStyle"
import { BLACK, Color, DEEPBLUE, getColorAsRgbaFunction, YELLOW } from "src/app/global/interfaces/color"

export type PenStyle = {
    objectStyle?: ObjectStyle,
    strokeStyle: StrokeStyle,
    useSizes?: boolean
}

export type EasyPenStyle = {
    objectStyle?: ObjectStyle,
    strokeStyle: EasyStrokeStyle,
    useSizes?: boolean
}

export type Pen = {
    name: string,
    icon?: string,
    penStyle: EasyPenStyle,
    color: Color,
    colorStyle?: Gradient | Pattern | number | ((c: Color) => ColorStyle),
    lineWidth: number
}

function getColorStyleOfPen(p: Pen, pens: Pen[]): ColorStyle {
    if (p.colorStyle === undefined) {
        return p.color;
    }
    else if (typeof p.colorStyle === 'number') {
        return getColorStyleOfPen(pens[p.colorStyle], pens);
    }
    else if (typeof p.colorStyle === 'function') {
        return p.colorStyle(p.color);
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

export const DEFAULT_PENS: Pen[] = [{
    name: 'Füller',
    penStyle: {
        strokeStyle: {
            lineCap: 'round'
        }
    },
    color: DEEPBLUE,
    lineWidth: 3,
    icon: 'fueller'
}, {
    name: 'Kugelschreiber',
    penStyle: {
        strokeStyle: {
            lineCap: 'round'
        }
    },
    color: BLACK,
    lineWidth: 2,
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
    colorStyle: (c: Color) => {
        return {
            picture: createNoisePattern(c)
        }
    },
    lineWidth: 3,
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
    lineWidth: 15,
    icon: 'marker'
}]


function createNoisePattern(color: Color): string {
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
    }
    return dict[rgbStr];
}
const dict: { [c: string]: string; } = {};