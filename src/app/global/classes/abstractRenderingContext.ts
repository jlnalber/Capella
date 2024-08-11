import {Transformations} from "../interfaces/transformations";
import {Point} from "../interfaces/point";
import {Rect} from "../interfaces/rect";
import {BLACK, Color, TRANSPARENT} from "../interfaces/color";
import {CanvasElement} from "./abstract/canvasElement";

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
               public readonly selection: CanvasElement[]
              /* public readonly config?: Config */) { }

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

  protected abstract getRightColor(c: Color): Color;

  public abstract drawPath(points: Point[], lineWidth: number, stroke: Color, fill?: Color, dashed?: boolean): void;

  public abstract drawBezierPath(points: SizePoint[], lineWidth: number, stroke: Color, fill?: Color, dashed?: boolean): void;

  public drawLine(from: Point, to: Point, lineWidth: number, stroke: Color, dashed?: boolean): void {
    this.drawPath([ from, to ], lineWidth, stroke, undefined, dashed);
  }

  public abstract drawText(text: string, p: Point,
                  fontSize: number,
                  fontFamily: string,
                  textAlign: CanvasTextAlign,
                  textBaseline: CanvasTextBaseline,
                  direction: CanvasDirection,
                  color: Color,
                  stroke: Color,
                  lineWidth: number,
                  dashed?: boolean,
                  skipIndex?: boolean): void;


  // TODO: skipping index
  public abstract measureText(text: string,
                  fontSize: number,
                  fontFamily: string,
                  textAlign: CanvasTextAlign,
                  textBaseline: CanvasTextBaseline,
                  direction: CanvasDirection,
                  lineWidth: number): TextMetrics;

  public abstract drawEllipse(center: Point,
                     radiusX: number,
                     radiusY: number,
                     rotation: number,
                     fill: Color,
                     stroke: Color,
                     strokeWidth: number,
                     dashed? : boolean): void;

  public drawCircle(center: Point,
                    radius: number,
                    fill: Color = BLACK,
                    stroke: Color = TRANSPARENT,
                    strokeWidth: number = 0,
                    dashed?: boolean): void {
    this.drawEllipse(center, radius, radius, 0, fill, stroke, strokeWidth, dashed);
  }

  public abstract drawCircleSector(center: Point,
                    radius: number,
                    fill: Color,
                    stroke: Color,
                    strokeWidth: number,
                    startAngle: number,
                    endAngle: number,
                    dashed?: boolean): void;

  public abstract drawRect(rect: Rect,fill: Color, stroke: Color, strokeWidth: number, dashed?: boolean): void;

  public abstract drawImage(image: CanvasImageSource, p: Point, dw: number, dh: number): void;
}
