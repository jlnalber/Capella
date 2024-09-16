import {Transformations} from "src/app/global/interfaces/transformations";
import {Point} from "src/app/global/interfaces/point";
import {Rect} from "src/app/global/interfaces/rect";
import {Color} from "src/app/global/interfaces/color";
import {CanvasIdElement} from "./abstract/canvasIdElement";
import StrokeStyle from "src/app/global/interfaces/canvasStyles/strokeStyle";
import FillStyle from "src/app/global/interfaces/canvasStyles/fillStyle";
import ObjectStyle from "src/app/global/interfaces/canvasStyles/objectStyle";
import TextStyle from "src/app/global/interfaces/canvasStyles/textStyle";
import ImageStyle from "src/app/global/interfaces/canvasStyles/imageStyle";

export const LINE_DASH = [10, 10]

// export interface Config {
//   showGrid?: boolean,
//   gridColor?: Color,
//   showNumbers?: boolean,
//   drawPointsEqually?: boolean,
//   drawNewLabels?: boolean,
//   transformColor?: (c: Color) => Color
// }

export type SizePoint = Point & {
  size: number
}

export default abstract class AbstractRenderingContext {
  constructor (protected readonly transformations: Transformations,
               public readonly selection: CanvasIdElement[],
               protected readonly getRightColor: (c: Color, config: any) => Color = (c: Color) => c,
               protected readonly _variables?: any,
               public readonly config?: any) { }

  // TODO: Test when there is a resolution factor in the regular canvas
  public transformPointFromCanvasToField(p: Point): Point {
    return {
      x: p.x / this.transformations.zoom - this.transformations.translateX,
      y: -p.y / this.transformations.zoom - this.transformations.translateY
    }
  }

  public transformPointFromCanvasToFieldWithResolutionFactor(p: Point): Point {
    return this.transformPointFromCanvasToField({
      x: p.x / this.resolutionFactor,
      y: p.y / this.resolutionFactor
    });
  }

  public transformPointFromFieldToCanvas(p: Point): Point {
    return {
      x: (p.x + this.transformations.translateX) * this.transformations.zoom,
      y: -(p.y + this.transformations.translateY) * this.transformations.zoom
    }
  }

  public transformPointFromFieldToCanvasWithResolutionFactor(p: Point): Point {
    const q = this.transformPointFromFieldToCanvas(p);
    return {
      x: q.x * this.resolutionFactor,
      y: q.y * this.resolutionFactor
    }
  }

  public transformRectFromCanvasToField(rect: Rect): Rect {
    let p = this.transformPointFromCanvasToField(rect);
    return {
      x: p.x,
      y: p.y,
      width: rect.width / this.transformations.zoom,
      height: -rect.height / this.transformations.zoom
    }
  }

  public transformRectFromCanvasToFieldWithResolutionFactor(rect: Rect): Rect {
    return this.transformRectFromCanvasToField({
      x: rect.x / this.resolutionFactor,
      y: rect.y / this.resolutionFactor,
      width: rect.width / this.resolutionFactor,
      height: rect.height / this.resolutionFactor
    });
  }

  public transformRectFromFieldToCanvas(rect: Rect): Rect {
    let p = this.transformPointFromFieldToCanvas(rect);
    return {
      x: p.x,
      y: p.y,
      width: rect.width * this.transformations.zoom,
      height: -rect.height * this.transformations.zoom
    }
  }

  public transformRectFromFieldToCanvasWithResolutionFactor(rect: Rect): Rect {
    let r = this.transformRectFromFieldToCanvas(rect);
    return {
      x: r.x * this.resolutionFactor,
      y: r.y * this.resolutionFactor,
      width: r.width * this.resolutionFactor,
      height: r.height * this.resolutionFactor
    }
  }

  public get zoom(): number {
    return this.transformations.zoom;
  }

  public get step(): number {
    return 1 / this.transformations.zoom;
  }

  public get range(): Rect {
    return this.transformRectFromCanvasToFieldWithResolutionFactor({
      x: 0,
      y: 0,
      width: this.width,
      height: this.height
    })
  }

  public abstract get width(): number;

  public abstract get height(): number;

  public get resolutionFactor(): number {
    return this.transformations.resolutionFactor ?? 1;
  }

  public get lineDash(): number[] {
    const f = this.resolutionFactor;
    return LINE_DASH.map(i => i * f);
  }

  public abstract drawPath(points: Point[], strokeStyle: StrokeStyle, objectStyle?: ObjectStyle, fill?: FillStyle): void;

  public abstract drawQuadraticPath(points: SizePoint[], strokeStyle: StrokeStyle): void;

  public drawLine(from: Point, to: Point, strokeStyle: StrokeStyle): void {
    this.drawPath([ from, to ], strokeStyle);
  }

  public abstract drawText(text: string, p: Point,
                  textStyle: TextStyle,
                  strokeStyle?: StrokeStyle,
                  fillStyle?: FillStyle): void;

  public abstract measureText(text: string,
                  textStyle: TextStyle): TextMetrics;

  public abstract drawEllipse(center: Point,
                     radiusX: number,
                     radiusY: number,
                     rotation: number,
                     fill?: FillStyle,
                     strokeStyle?: StrokeStyle): void;

  public drawCircle(center: Point,
                    radius: number,
                    fill?: FillStyle,
                    strokeStyle?: StrokeStyle): void {
    this.drawEllipse(center, radius, radius, 0, fill, strokeStyle);
  }

  public abstract drawCircleSector(center: Point,
                    radius: number,
                    startAngle: number,
                    endAngle: number,
                    fillStyle?: FillStyle,
                    stroke?: StrokeStyle): void;

  public abstract drawRect(rect: Rect, fillStyle?: FillStyle, strokeStyle?: StrokeStyle): void;

  public abstract drawImage(image: CanvasImageSource, p: Point, dw: number, dh: number, imageStyle?: ImageStyle): void;
}
