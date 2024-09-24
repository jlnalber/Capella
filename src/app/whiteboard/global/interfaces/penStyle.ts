import { ColorStyle, Gradient, instanceOfColor, Pattern } from "src/app/global/interfaces/canvasStyles/colorStyle"
import ObjectStyle from "src/app/global/interfaces/canvasStyles/objectStyle"
import { EasyStrokeStyle, StrokeStyle } from "src/app/global/interfaces/canvasStyles/strokeStyle"
import { BLACK, BLUE, Color, getColorAsRgbaFunction } from "src/app/global/interfaces/color"

export type PenStyle = {
    objectStyle?: ObjectStyle,
    strokeStyle: StrokeStyle
}

export type EasyPenStyle = {
    objectStyle?: ObjectStyle,
    strokeStyle: EasyStrokeStyle
}

export type Pen = {
    name: string,
    icon?: string,
    penStyle: EasyPenStyle,
    color: Color,
    colorStyle?: Gradient | Pattern | ((c: Color) => ColorStyle),
    lineWidth: number
}

export function getPenStyleOfPen(pen: Pen): PenStyle {
    let color: ColorStyle = pen.color;
    if (typeof pen.colorStyle === 'function') {
        color = pen.colorStyle(pen.color);
    }
    else if (pen.colorStyle !== undefined) {
        color = pen.colorStyle;
    }

    const strokeStyle: StrokeStyle = {
        ...pen.penStyle.strokeStyle,
        lineWidth: pen.lineWidth,
        uniformSizeOnZoom: false,
        color: color
    }

    return {
        objectStyle: pen.penStyle.objectStyle,
        strokeStyle: strokeStyle
    }
}

export const DEFAULT_PENS: Pen[] = [{
    name: 'Kugelschreiber',
    penStyle: {
        strokeStyle: {
            lineCap: 'round'
        }
    },
    color: BLUE,
    lineWidth: 3,
    icon: 'fueller'
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