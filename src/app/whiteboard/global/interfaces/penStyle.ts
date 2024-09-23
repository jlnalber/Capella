import ObjectStyle from "src/app/global/interfaces/canvasStyles/objectStyle"
import StrokeStyle from "src/app/global/interfaces/canvasStyles/strokeStyle"
import { BLACK, BLUE, Color, GREY } from "src/app/global/interfaces/color"

export type PenStyle = {
    objectStyle?: ObjectStyle,
    strokeStyle: StrokeStyle
}

export type Pen = {
    name: string,
    icon?: string,
    penStyle: PenStyle
}

export const DEFAULT_PENS: Pen[] = [{
    name: 'Bleistift',
    penStyle: {
        strokeStyle: {
            color: {
                picture: createNoisePattern(BLUE)
            },
            uniformSizeOnZoom: false,
            lineWidth: 3,
            lineCap: 'round'
        },
        objectStyle: {
            filter: [
                ['blur', [1, 'px']]
            ]
        }
    }
}]


function createNoisePattern(color: Color): string {
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
              data[i] = (1 - gray) * 255  + gray * color.r;
              data[i + 1] = (1 - gray) * 255  + gray * color.g;
              data[i + 2] = (1 - gray) * 255  + gray * color.b;
              data[i + 3] = (color.a ?? 1) * 255;
          }
  
          noiseCtx.putImageData(imageData, 0, 0);
        }
        return noiseCanvas.toDataURL()
    }