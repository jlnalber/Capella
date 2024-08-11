import {Transformations} from "../interfaces/transformations";
import {Point} from "../interfaces/point";
import {Rect} from "../interfaces/rect";
import {BLACK, Color, getColorAsRgbaFunction, TRANSPARENT} from "../interfaces/color";
import {CanvasElement} from "./abstract/canvasElement";
import AbstractRenderingContext, { SizePoint } from "./abstractRenderingContext";

const LINE_DASH = [10, 10]

// export interface Config {
//   showGrid?: boolean,
//   gridColor?: Color,
//   showNumbers?: boolean,
//   drawPointsEqually?: boolean,
//   drawNewLabels?: boolean,
//   transformColor?: (c: Color) => Color
// }

export class RenderingContext extends AbstractRenderingContext {
  constructor (private readonly ctx: CanvasRenderingContext2D,
               transformations: Transformations,
               selection: CanvasElement[]
              /* public readonly config?: Config */) {
    super(transformations, selection)
  }

  public get width(): number {
    return this.ctx.canvas.width;
  }

  public get height(): number {
    return this.ctx.canvas.height;
  }

  protected getRightColor(c: Color): Color {
    return c;
    // if (this.config?.transformColor === undefined) return c;
    // return this.config.transformColor(c);
  }

  public drawPath(points: Point[], lineWidth: number, stroke: Color, fill?: Color, dashed?: boolean): void {
    let realPoints = points.map(p => {
      return this.transformPointFromFieldToCanvasWithResolutionFactor(p);
    });

    /*for (let p of realPoints) {
      this.ctx.fillStyle = getColorAsRgbaFunction(stroke);
      this.ctx.fillRect(p.x, p.y, lineWidth, lineWidth);
    }*/

    this.ctx.beginPath();
    this.ctx.lineWidth = lineWidth * this.resolutionFactor;
    this.ctx.strokeStyle = getColorAsRgbaFunction(this.getRightColor(stroke));

    if (dashed) {
      this.ctx.setLineDash(this.lineDash)
    } else {
      this.ctx.setLineDash([])
    }

    if (realPoints.length != 0) {
      let firstP = realPoints[0];
      this.ctx.moveTo(firstP.x, firstP.y);

      for (let i = 1; i < realPoints.length; i++) {
        let p = realPoints[i];
        this.ctx.lineTo(p.x, p.y);
      }

      this.ctx.stroke();

      if (fill) {
        this.ctx.fillStyle = getColorAsRgbaFunction(this.getRightColor(fill));
        this.ctx.fill();
      }

      this.ctx.closePath();
    }
  }

  public drawBezierPath(points: SizePoint[], lineWidth: number, stroke: Color, fill?: Color, dashed?: boolean): void {
    let realPoints = points.map(p => {
      return this.transformPointFromFieldToCanvasWithResolutionFactor(p);
    });

    /*for (let p of realPoints) {
      this.ctx.fillStyle = getColorAsRgbaFunction(stroke);
      this.ctx.fillRect(p.x, p.y, lineWidth, lineWidth);
    }*/

    if (dashed) {
      this.ctx.setLineDash(this.lineDash)
    } else {
      this.ctx.setLineDash([])
    }
    this.ctx.strokeStyle = getColorAsRgbaFunction(this.getRightColor(stroke));
    this.ctx.lineWidth = lineWidth * this.resolutionFactor;


    if (realPoints.length != 0) {
      
      
      this.ctx.beginPath();
      
      let firstP = realPoints[0];
      this.ctx.moveTo(firstP.x, firstP.y);

      let dx: number | undefined = undefined;
      let dy: number | undefined = undefined;
      
      for (let i = 1; i < realPoints.length; i++) {
        const point = realPoints[i];
        const correct = realPoints.length < 2 || Math.sqrt((point.x - realPoints[realPoints.length - 1].x) ** 2 + (point.y - realPoints[realPoints.length - 1].y) ** 2) > 1;
        if (correct) {

          const lastP = realPoints[i - 1];
          dx = (point.x + lastP.x) / 2;
          dy = (point.y + lastP.y) / 2;

          this.ctx.quadraticCurveTo(lastP.x, lastP.y, dx, dy);
          //this.ctx.quadraticCurveTo(dx, dy, point.x, point.y)
        }
      }

      const lastP = realPoints[realPoints.length - 1];
      if (dx !== undefined && dy !== undefined) {
        this.ctx.quadraticCurveTo(dx, dy, lastP.x, lastP.y);
      }
      else {
        this.ctx.lineTo(lastP.x, lastP.y);
      }
  
      this.ctx.stroke();

      if (fill) {
        this.ctx.fillStyle = getColorAsRgbaFunction(this.getRightColor(fill));
        this.ctx.fill();
      }

    }
  }

  public drawText(text: string, p: Point,
                  fontSize: number = 10,
                  fontFamily: string = 'sans-serif',
                  textAlign: CanvasTextAlign = 'start',
                  textBaseline: CanvasTextBaseline = 'alphabetic',
                  direction: CanvasDirection = 'inherit',
                  color: Color = { r: 0, g: 0, b: 0 },
                  stroke: Color = TRANSPARENT,
                  lineWidth: number = 3,
                  dashed?: boolean,
                  skipIndex?: boolean): void {
    let realP = this.transformPointFromFieldToCanvasWithResolutionFactor(p);
    const resFactor = this.resolutionFactor;

    // set the ctx up
    let ctx = this.ctx;

    if (dashed) {
      this.ctx.setLineDash(this.lineDash)
    } else {
      this.ctx.setLineDash([])
    }

    // search for the underlined
    let strs: string[] = [];
    let lastStr = ''
    for (let i = 0; i < text.length; i++) {
      if (text.charAt(i) === '_' && i + 1 < text.length && !skipIndex) {
        strs.push(lastStr);
        lastStr = '';
        strs.push(text.charAt(i + 1));
        i++;
      } else {
        lastStr += text.charAt(i)
      }
    }
    if (lastStr !== '') {
      strs.push(lastStr);
    }

    // set global text properties
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    ctx.direction = direction;
    ctx.fillStyle = getColorAsRgbaFunction(this.getRightColor(color));
    ctx.strokeStyle = getColorAsRgbaFunction(this.getRightColor(stroke));
    ctx.lineWidth = lineWidth * resFactor;

    const padding = 1;

    // write the undersets and the normal text
    let posX = realP.x;
    for (let i = 0; i < strs.length; i++) {
      const t = strs[i];
      let y = realP.y;

      if (i % 2 === 0) {
        ctx.font = `${fontSize * resFactor}px ${fontFamily}`;
      } else {
        ctx.font = `${3 * fontSize / 4 * resFactor}px ${fontFamily}`;
        y += fontSize / 3 * resFactor;
      }

      // draw the text
      ctx.strokeText(t, posX, y);
      ctx.fillText(t, posX, y);

      posX += ctx.measureText(t).width + padding;
    }
  }


  // TODO: skipping index
  public measureText(text: string,
                  fontSize: number = 10,
                  fontFamily: string = 'sans-serif',
                  textAlign: CanvasTextAlign = 'start',
                  textBaseline: CanvasTextBaseline = 'alphabetic',
                  direction: CanvasDirection = 'inherit',
                  lineWidth: number = 3): TextMetrics {
    // set the ctx up
    let ctx = this.ctx;

    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    ctx.direction = direction;
    ctx.lineWidth = lineWidth;

    // draw the text
    return ctx.measureText(text);
  }

  public drawEllipse(center: Point,
                     radiusX: number,
                     radiusY: number,
                     rotation: number,
                     fill: Color = BLACK,
                     stroke: Color = TRANSPARENT,
                     strokeWidth: number = 0,
                     dashed? : boolean): void {
    // draw an ellipse around the center point
    const resFactor = this.resolutionFactor;

    if (dashed) {
      this.ctx.setLineDash(this.lineDash)
    } else {
      this.ctx.setLineDash([])
    }

    this.ctx.lineWidth = strokeWidth * resFactor;
    this.ctx.strokeStyle = getColorAsRgbaFunction(this.getRightColor(stroke));
    this.ctx.fillStyle = getColorAsRgbaFunction(this.getRightColor(fill));
    const realCenter = this.transformPointFromFieldToCanvasWithResolutionFactor(center)
    const realRadiusX = radiusX * this.zoom * resFactor;
    const realRadiusY = radiusY * this.zoom * resFactor;

    this.ctx.beginPath();
    this.ctx.ellipse(realCenter.x, realCenter.y, realRadiusX, realRadiusY, rotation, 0, 2 * Math.PI);
    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.closePath();
  }

  public drawCircleSector(center: Point,
                    radius: number,
                    fill: Color = BLACK,
                    stroke: Color = TRANSPARENT,
                    strokeWidth: number = 0,
                    startAngle: number,
                    endAngle: number,
                    dashed?: boolean): void {
    // draw an ellipse around the center point
    const resFactor = this.resolutionFactor;

    this.ctx.lineWidth = strokeWidth * resFactor;
    this.ctx.strokeStyle = getColorAsRgbaFunction(this.getRightColor(stroke));
    this.ctx.fillStyle = getColorAsRgbaFunction(this.getRightColor(fill));
    const realCenter = this.transformPointFromFieldToCanvasWithResolutionFactor(center)
    const realRadius = radius * this.zoom * resFactor;

    if (dashed) {
      this.ctx.setLineDash(this.lineDash)
    } else {
      this.ctx.setLineDash([])
    }

    this.ctx.closePath();
    this.ctx.beginPath();
    this.ctx.moveTo(realCenter.x, realCenter.y);
    this.ctx.arc(realCenter.x, realCenter.y, realRadius, startAngle, endAngle);
    this.ctx.lineTo(realCenter.x, realCenter.y);
    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.closePath();
  }

  public drawRect(rect: Rect, fill: Color = BLACK, stroke: Color = TRANSPARENT, strokeWidth: number = 0, dashed?: boolean): void {
    const resFactor = this.resolutionFactor;

    if (dashed) {
      this.ctx.setLineDash(this.lineDash)
    } else {
      this.ctx.setLineDash([])
    }

    this.ctx.lineWidth = strokeWidth * resFactor;
    this.ctx.strokeStyle = getColorAsRgbaFunction(this.getRightColor(stroke));
    this.ctx.fillStyle = getColorAsRgbaFunction(this.getRightColor(fill));
    const realRect = this.transformRectFromFieldToCanvasWithResolutionFactor(rect);
    this.ctx.fillRect(realRect.x, realRect.y, realRect.width, realRect.height);
  }

  public drawImage(image: CanvasImageSource, p: Point, dw: number, dh: number) {
    let realP = this.transformPointFromFieldToCanvasWithResolutionFactor(p);

    // set the ctx up
    let ctx = this.ctx;
    const resFactor = this.resolutionFactor;

    ctx.drawImage(image, realP.x, realP.y, dw * resFactor, dh * resFactor)
  }
}
