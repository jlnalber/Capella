import { ABSOLUTE_UNITS, DEFAULT_FILTERS, DEFAULT_FONTKERNING, DEFAULT_FONTSTRETCH, DEFAULT_FONTSTYLE, DEFAULT_FONTVARIANTCAPS, DEFAULT_FONTWEIGHT, DEFAULT_IMAGESMOOTHINGENABLED, DEFAULT_IMAGESMOOTHINGQUALITY, DEFAULT_LETTERSPACING, DEFAULT_LINECAP, DEFAULT_LINEDASH, DEFAULT_LINEDASHOFFSET, DEFAULT_LINEJOIN, DEFAULT_TEXTALIGN, DEFAULT_TEXTBASELINE, DEFAULT_TEXTDIRECTION, DEFAULT_WORDSPACING, LinearGradient, Measurement, RadialGradient } from './../interfaces/canvasStyles/styleTypes';
import {Transformations} from "../interfaces/transformations";
import {Point} from "../interfaces/point";
import {Rect} from "../interfaces/rect";
import {BLACK, Color, getColorAsRgbaFunction, TRANSPARENT} from "../interfaces/color";
import {CanvasElement} from "./abstract/canvasElement";
import AbstractRenderingContext, { SizePoint } from "./abstractRenderingContext";
import StrokeStyle, { EMPTY_STROKESTYLE } from "../interfaces/canvasStyles/strokeStyle";
import { ColorStyle, DEFAULT_SHADOW, Filter, Pattern, Shadow } from "../interfaces/canvasStyles/styleTypes";
import FillStyle, { EMPTY_FILLSTYLE } from "../interfaces/canvasStyles/fillStyle";
import ObjectStyle, { EMPTY_OBJECTSTYLE } from "../interfaces/canvasStyles/objectStyle";
import TextStyle, { EMPTY_TEXTSTYLE } from "../interfaces/canvasStyles/textStyle";
import ImageStyle, { EMPTY_IMAGESTYLE } from '../interfaces/canvasStyles/imageStyle';

let noise: CanvasPattern | undefined = undefined;

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

  private colorStyleToCanvasStyle(colorStyle: ColorStyle, uniformSizeOnZoom?: boolean): string | CanvasPattern | CanvasGradient | null {
    // TODO: transformations for bg

    function instanceOfColor(colorStyle: ColorStyle): colorStyle is Color {
      return 'r' in colorStyle;
    }
    function instanceOfPattern(colorStyle: ColorStyle): colorStyle is Pattern {
      return 'picture' in colorStyle;
    }
    function instanceOfLinearGradient(colorStyle: ColorStyle): colorStyle is LinearGradient {
      return 'startPoint' in colorStyle;
    }
    function instanceOfRadialGradient(colorStyle: ColorStyle): colorStyle is RadialGradient {
      return 'startCircle' in colorStyle;
    }

    if (instanceOfColor(colorStyle)) {
      // just a color
      return getColorAsRgbaFunction(this.getRightColor(colorStyle));
    }
    else if (instanceOfPattern(colorStyle)) {
      // a pattern
      const base64 = colorStyle.picture;
      const image = new Image();
      image.src = base64;
      const pattern = this.ctx.createPattern(image, 'repeat'); // TODO: transformations
      return pattern;
    }
    else {
      // gradient
      let gradient: CanvasGradient;
      if (instanceOfLinearGradient(colorStyle)) {
        // linear gradient
        gradient = this.ctx.createLinearGradient(colorStyle.startPoint.x, colorStyle.startPoint.y, colorStyle.endPoint.x, colorStyle.endPoint.y);
      }
      else if (instanceOfRadialGradient(colorStyle)) {
        // radial gradient
        gradient = this.ctx.createRadialGradient(colorStyle.startCircle.x, colorStyle.startCircle.y, colorStyle.startCircle.radius, colorStyle.endCircle.x, colorStyle.endCircle.y, colorStyle.endCircle.radius);
      }
      else {
        // conic gradient
        gradient = this.ctx.createConicGradient(colorStyle.startAngle, colorStyle.center.x, colorStyle.center.y);
      }

      // add the stops
      for (let stop of colorStyle.stops) {
        gradient.addColorStop(stop[0], getColorAsRgbaFunction(this.getRightColor(stop[1])));
      }
      return gradient;
    }
  }

  private measurementToString(measurement: Measurement, uniformSizeOnZoom?: boolean): string {
    if (!uniformSizeOnZoom && ABSOLUTE_UNITS.indexOf(measurement[1]) !== -1) {
      // resize, if wanted and in absolute unit
      return `${measurement[0] * this.resolutionFactor * this.zoom}${measurement[1]}`;
    }
    else {
      return `${measurement[0] * this.resolutionFactor}${measurement[1]}`;
    }
  }

  private useStrokeStyle(strokeStyle?: StrokeStyle) {
    if (strokeStyle === undefined) {
      this.useStrokeStyle(EMPTY_STROKESTYLE);
      return;
    }

    const resFactor = this.resolutionFactor;
    const zoom = this.zoom;
    
    // color
    const colorStyle = this.colorStyleToCanvasStyle(strokeStyle.color, strokeStyle.uniformSizeOnZoom);
    if (colorStyle !== null) {
      this.ctx.strokeStyle = colorStyle;
    }
    
    // linewidth
    let lWidth = strokeStyle.lineWidth * resFactor;
    if (!strokeStyle.uniformSizeOnZoom) {
      lWidth *= zoom;
    }
    this.ctx.lineWidth = lWidth;

    // line dash
    let lDash: number[] = strokeStyle.lineDash ?? DEFAULT_LINEDASH;
    lDash = lDash.map(n => n * resFactor)
    if (!strokeStyle.uniformSizeOnZoom) {
      lDash = lDash.map(n => n * zoom);
    }
    this.ctx.setLineDash(lDash)

    // line dash offset
    let ldOffset = (strokeStyle.lineDashOffset ?? DEFAULT_LINEDASHOFFSET) * resFactor;
    if (!strokeStyle.uniformSizeOnZoom) {
      ldOffset *= zoom;
    }
    this.ctx.lineDashOffset = ldOffset;

    // line join
    this.ctx.lineJoin = strokeStyle.lineJoin ?? DEFAULT_LINEJOIN;

    // line cap
    this.ctx.lineCap = strokeStyle.lineCap ?? DEFAULT_LINECAP;
  }

  private useFillStyle(fillStyle?: FillStyle) {
    if (fillStyle === undefined) {
      this.useFillStyle(EMPTY_FILLSTYLE);
      return;
    }

    // color
    const colorStyle = this.colorStyleToCanvasStyle(fillStyle.color, fillStyle.uniformSizeOnZoom);
    if (colorStyle !== null) {
      this.ctx.fillStyle = colorStyle;
    }
  }

  private useObjectStyle(objectStyle?: ObjectStyle) {
    if (objectStyle === undefined) {
      this.useObjectStyle(EMPTY_OBJECTSTYLE);
      return;
    }

    const resFactor = this.resolutionFactor;
    const zoom = this.zoom;
    // filter
    const filters = (objectStyle.filter ?? DEFAULT_FILTERS).map(f => `${f.type}(${this.measurementToString(f.measurement, objectStyle.uniformSizeOnZoom)})`).join(' ');
    this.ctx.filter = filters;

    // shadow
    const shadow: Shadow = objectStyle.shadow ?? DEFAULT_SHADOW;
    let blur = shadow.blur * resFactor;
    let offsetX = shadow.offsetX * resFactor;
    let offsetY = shadow.offsetY * resFactor;
    if (!objectStyle.uniformSizeOnZoom) {
      blur *= zoom;
      offsetX *= zoom;
      offsetY *= zoom;
    }
    this.ctx.shadowBlur = blur;
    this.ctx.shadowOffsetX = offsetX;
    this.ctx.shadowOffsetY = offsetY;
    this.ctx.shadowColor = getColorAsRgbaFunction(this.getRightColor(shadow.color));

  }

  private useTextStyle(textStyle?: TextStyle) {
    if (textStyle === undefined) {
      this.useTextStyle(EMPTY_TEXTSTYLE);
      return;
    }

    const resFactor = this.resolutionFactor;
    const zoom = this.zoom;

    // color
    const colorStyle = this.colorStyleToCanvasStyle(textStyle.color, textStyle.uniformSizeOnZoom);
    if (colorStyle !== null) {
      this.ctx.fillStyle = colorStyle;
    }

    // font property: fontFamily, fontSize, fontWeight, fontStyle
    let font = '';
    if (textStyle.fontStyle !== undefined && textStyle.fontStyle !== DEFAULT_FONTSTYLE) {
      font += textStyle.fontStyle + ' ';
    }
    if (textStyle.fontWeight !== undefined && textStyle.fontWeight !== DEFAULT_FONTWEIGHT) {
      font += textStyle.fontWeight + ' ';
    }
    font += `${this.measurementToString(textStyle.fontSize, textStyle.uniformSizeOnZoom)} `;
    const fontFamilies = textStyle.fontFamily.join(' ');
    font += fontFamilies;
    this.ctx.font = font;

    // font kerning
    this.ctx.fontKerning = textStyle.fontKerning ?? DEFAULT_FONTKERNING;

    // font stretch
    this.ctx.fontStretch = textStyle.fontStretch ?? DEFAULT_FONTSTRETCH;

    // font variant caps
    this.ctx.fontVariantCaps = textStyle.fontVariantCaps ?? DEFAULT_FONTVARIANTCAPS;

    // letter spacing
    this.ctx.letterSpacing = this.measurementToString(textStyle.letterSpacing ?? DEFAULT_LETTERSPACING, textStyle.uniformSizeOnZoom);

    // text direction
    this.ctx.direction = textStyle.direction ?? DEFAULT_TEXTDIRECTION;

    // text align
    this.ctx.textAlign = textStyle.textAlign ?? DEFAULT_TEXTALIGN;

    // text baseline
    this.ctx.textBaseline = textStyle.textBaseline ?? DEFAULT_TEXTBASELINE;

    // word spacing
    this.ctx.wordSpacing = this.measurementToString(textStyle.wordSpacing ?? DEFAULT_WORDSPACING, textStyle.uniformSizeOnZoom);
  }

  private useImageStyle(imageStyle?: ImageStyle) {
    if (imageStyle === undefined) {
      this.useImageStyle(EMPTY_IMAGESTYLE);
      return;
    }

    this.ctx.imageSmoothingEnabled = imageStyle.imageSmoothingEnabled ?? DEFAULT_IMAGESMOOTHINGENABLED;
    this.ctx.imageSmoothingQuality = imageStyle.imageSmoothingQuality ?? DEFAULT_IMAGESMOOTHINGQUALITY;
  }

  public drawPath(points: Point[], strokeStyle: StrokeStyle, objectStyle?: ObjectStyle, fill?: FillStyle): void {
    let realPoints = points.map(p => {
      return this.transformPointFromFieldToCanvasWithResolutionFactor(p);
    });

    /*for (let p of realPoints) {
      this.ctx.fillStyle = getColorAsRgbaFunction(stroke);
      this.ctx.fillRect(p.x, p.y, lineWidth, lineWidth);
    }*/

    this.ctx.beginPath();
    this.useStrokeStyle(strokeStyle);
    this.useObjectStyle(objectStyle);
    this.useFillStyle(fill);

    if (realPoints.length != 0) {
      let firstP = realPoints[0];
      this.ctx.moveTo(firstP.x, firstP.y);

      for (let i = 1; i < realPoints.length; i++) {
        let p = realPoints[i];
        this.ctx.lineTo(p.x, p.y);
      }

      this.ctx.stroke();

      if (fill) {
        this.ctx.fill();
      }

      this.ctx.closePath();
    }
  }

  public drawQuadraticPath(points: SizePoint[], stroke: StrokeStyle): void {
    const realPoints: SizePoint[] = points.map(p => {
      return {
        ...this.transformPointFromFieldToCanvasWithResolutionFactor(p),
        size: p.size
      }
    });

    /*for (let p of realPoints) {
      this.ctx.fillStyle = getColorAsRgbaFunction(stroke);
      this.ctx.fillRect(p.x, p.y, lineWidth, lineWidth);
    }*/
    this.useStrokeStyle(stroke);

    function createNoisePattern(): CanvasPattern {
      if (!noise) {
        const width = 100;
        const height = 100;
        const noiseCanvas = document.createElement('canvas');
        noiseCanvas.width = width;
        noiseCanvas.height = height;
        const noiseCtx = noiseCanvas.getContext('2d') as CanvasRenderingContext2D;
    
        if (noiseCtx) {
            const imageData = noiseCtx.createImageData(width, height);
            const data = imageData.data;
    
            for (let i = 0; i < data.length; i += 4) {
                const gray = Math.sqrt(Math.random()) * 255;
                data[i] = gray;
                data[i + 1] = gray;
                data[i + 2] = gray;
                data[i + 3] = 255;
            }
    
            noiseCtx.putImageData(imageData, 0, 0);
          }
        noise = noiseCtx.createPattern(noiseCanvas, 'repeat')!;
      }
      return noise;
  
    }
  


    if (realPoints.length != 0) {
      
      this.ctx.lineCap = 'round'
      
      this.ctx.beginPath();
      
      let firstP = realPoints[0];
      this.ctx.moveTo(firstP.x, firstP.y);
      
      for (let i = 1; i < realPoints.length - 1; i++) {
        const point = realPoints[i];
        const correct = realPoints.length < 2 || Math.sqrt((point.x - realPoints[realPoints.length - 1].x) ** 2 + (point.y - realPoints[realPoints.length - 1].y) ** 2) > 1;
        if (correct) {
  
          const nextP = realPoints[i + 1];
          const dx = (point.x + nextP.x) / 2;
          const dy = (point.y + nextP.y) / 2;

          const newStrokeStyle = {...stroke};
          newStrokeStyle.lineWidth = stroke.lineWidth * point.size
          this.useStrokeStyle(newStrokeStyle);
          this.ctx.quadraticCurveTo(point.x, point.y, dx, dy);
          this.ctx.stroke();

          // begin the new path
          this.ctx.beginPath();
          this.ctx.moveTo(dx, dy);
        }
      }

      const lastP = realPoints[realPoints.length - 1];
      this.ctx.lineTo(lastP.x, lastP.y);

      //this.ctx.strokeStyle = createNoisePattern()
  
      this.ctx.stroke();

    }
  }

  public drawText(text: string, p: Point,
                  textStyle: TextStyle,
                  strokeStyle?: StrokeStyle,
                  fillStyle?: FillStyle): void {
    let realP = this.transformPointFromFieldToCanvasWithResolutionFactor(p);
   
    // set the ctx up
    let ctx = this.ctx;

    // // search for the underlined
    // let strs: string[] = [];
    // let lastStr = ''
    // for (let i = 0; i < text.length; i++) {
    //   if (text.charAt(i) === '_' && i + 1 < text.length && false/*!skipIndex*/) { // TODO: remove legacy code
    //     strs.push(lastStr);
    //     lastStr = '';
    //     strs.push(text.charAt(i + 1));
    //     i++;
    //   } else {
    //     lastStr += text.charAt(i)
    //   }
    // }
    // if (lastStr !== '') {
    //   strs.push(lastStr);
    // }

    // set global text properties
    this.useStrokeStyle(strokeStyle);
    this.useFillStyle(fillStyle);
    this.useTextStyle(textStyle);

    // draw the text
    ctx.strokeText(text, realP.x, realP.y);
    ctx.fillText(text, realP.x, realP.y);
  }

  public measureText(text: string,
                  textStyle: TextStyle): TextMetrics {
    this.useTextStyle(textStyle);

    // draw the text
    return this.ctx.measureText(text);
  }

  public drawEllipse(center: Point,
                     radiusX: number,
                     radiusY: number,
                     rotation: number,
                     fillStyle?: FillStyle,
                     strokeStyle?: StrokeStyle): void {
    // draw an ellipse around the center point
    const resFactor = this.resolutionFactor;
    const zoom = this.zoom;

    this.useStrokeStyle(strokeStyle);
    this.useFillStyle(fillStyle);
    const realCenter = this.transformPointFromFieldToCanvasWithResolutionFactor(center)
    const realRadiusX = radiusX * zoom * resFactor;
    const realRadiusY = radiusY * zoom * resFactor;

    this.ctx.beginPath();
    this.ctx.ellipse(realCenter.x, realCenter.y, realRadiusX, realRadiusY, rotation, 0, 2 * Math.PI);
    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.closePath();
  }

  public drawCircleSector(center: Point,
                    radius: number,
                    startAngle: number,
                    endAngle: number,
                    fillStyle?: FillStyle,
                    strokeStyle?: StrokeStyle): void {
    // draw an ellipse around the center point
    this.useStrokeStyle(strokeStyle);
    this.useFillStyle(fillStyle);
    const realCenter = this.transformPointFromFieldToCanvasWithResolutionFactor(center)
    const realRadius = radius * this.zoom * this.resolutionFactor;

    this.ctx.closePath();
    this.ctx.beginPath();
    this.ctx.moveTo(realCenter.x, realCenter.y);
    this.ctx.arc(realCenter.x, realCenter.y, realRadius, startAngle, endAngle);
    this.ctx.lineTo(realCenter.x, realCenter.y);
    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.closePath();
  }

  public drawRect(rect: Rect, fillStyle?: FillStyle, strokeStyle?: StrokeStyle): void {
    this.useStrokeStyle(strokeStyle);
    this.useFillStyle(fillStyle);
    const realRect = this.transformRectFromFieldToCanvasWithResolutionFactor(rect);
    this.ctx.fillRect(realRect.x, realRect.y, realRect.width, realRect.height);
    this.ctx.strokeRect(realRect.x, realRect.y, realRect.width, realRect.height);
  }

  public drawImage(image: CanvasImageSource, p: Point, dw: number, dh: number, imageStyle?: ImageStyle) {
    let realP = this.transformPointFromFieldToCanvasWithResolutionFactor(p);

    // set the ctx up
    this.useImageStyle(imageStyle);
    let ctx = this.ctx;
    const resFactor = this.resolutionFactor;

    ctx.drawImage(image, realP.x, realP.y, dw * resFactor, dh * resFactor)
  }
}
