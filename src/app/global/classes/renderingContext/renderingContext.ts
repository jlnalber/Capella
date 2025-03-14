import {
  DEFAULT_ALPHA,
  DEFAULT_FONTKERNING,
  DEFAULT_FONTSTRETCH,
  DEFAULT_FONTSTYLE,
  DEFAULT_FONTVARIANTCAPS,
  DEFAULT_FONTWEIGHT,
  DEFAULT_IMAGESMOOTHINGENABLED,
  DEFAULT_IMAGESMOOTHINGQUALITY,
  DEFAULT_LETTERSPACING,
  DEFAULT_LINECAP,
  DEFAULT_LINEDASH,
  DEFAULT_LINEDASHOFFSET,
  DEFAULT_LINEJOIN,
  DEFAULT_TEXTALIGN,
  DEFAULT_TEXTBASELINE,
  DEFAULT_TEXTDIRECTION,
  DEFAULT_WORDSPACING
} from 'src/app/global/interfaces/canvasStyles/styleTypes';
import {Transformations} from "src/app/global/interfaces/transformations";
import {Point} from "src/app/global/interfaces/point";
import {Rect} from "src/app/global/interfaces/rect";
import {Color, getColorAsRgbaFunction, TRANSPARENT} from "src/app/global/interfaces/color";
import {CanvasIdElement} from "../abstract/canvasIdElement";
import AbstractRenderingContext, { CanvasConfig } from "./abstractRenderingContext";
import { EMPTY_STROKESTYLE, StrokeStyle } from "src/app/global/interfaces/canvasStyles/strokeStyle";
import { DEFAULT_SHADOW, Shadow } from "src/app/global/interfaces/canvasStyles/styleTypes";
import FillStyle, { EMPTY_FILLSTYLE } from "src/app/global/interfaces/canvasStyles/fillStyle";
import ObjectStyle, { EMPTY_OBJECTSTYLE } from "src/app/global/interfaces/canvasStyles/objectStyle";
import TextStyle, { EMPTY_TEXTSTYLE } from "src/app/global/interfaces/canvasStyles/textStyle";
import ImageStyle, { EMPTY_IMAGESTYLE } from 'src/app/global/interfaces/canvasStyles/imageStyle';
import { DEFAULT_FILTERS, filterToCssFunctionString } from '../../interfaces/canvasStyles/filterTypes';
import { measurementToString } from '../../interfaces/canvasStyles/unitTypes';
import { ColorStyle, DEFAULT_ZOOMFACTOR, instanceOfColor, instanceOfLinearGradient, instanceOfPattern, instanceOfRadialGradient } from '../../interfaces/canvasStyles/colorStyle';
import { copyPointToPenPoint, getStrokePointPathFromPenPointPath, Path, PenPoint, StrokePoint, ThicknessSettings } from '../../interfaces/penPoint';
import { getControlPointInQuadraticBezier, getPointInQuadraticBezier, getThicknessSettings, QuadraticBezier } from './renderingUtils';
import { getImageToBase64 } from '../../essentials/imageUtils';

// export interface Config {
//   showGrid?: boolean,
//   gridColor?: Color,
//   showNumbers?: boolean,
//   drawPointsEqually?: boolean,
//   drawNewLabels?: boolean,
//   transformColor?: (c: Color) => Color
// }

export class RenderingContext extends AbstractRenderingContext {
  constructor (private readonly _ctx: CanvasRenderingContext2D,
               transformations: Transformations,
               selection?: CanvasIdElement<any>[],
               canvasConfig?: CanvasConfig,
               getRightColor: (c: Color, config: any) => Color = (c: Color) => c,
               _variables?: any,
               config?: any,
               getStepsForSmoothPathRendering: () => number = () => 1
              /* public readonly config?: Config */) {
    super(transformations, selection, canvasConfig, getRightColor, _variables, config, getStepsForSmoothPathRendering);
  }

  protected get ctx(): CanvasRenderingContext2D {
    return this._ctx;
  }

  public get width(): number {
    return this.ctx.canvas.width;
  }

  public get height(): number {
    return this.ctx.canvas.height;
  }

  private colorStyleToCanvasStyle(colorStyle: ColorStyle, uniformSizeOnZoom?: boolean): string | CanvasPattern | CanvasGradient | null {

    if (instanceOfColor(colorStyle)) {
      // just a color
      return getColorAsRgbaFunction(this.getRightColor(colorStyle, this.config));
    }
    else if (instanceOfPattern(colorStyle)) {
      // a pattern
      const base64 = colorStyle.picture;
      const image = getImageToBase64(base64);
      if (image) {
        const pattern = this.ctx.createPattern(image, 'repeat');
        const zoomFactor = colorStyle.zoomFactor ?? DEFAULT_ZOOMFACTOR;
        pattern?.setTransform(new DOMMatrixReadOnly().scale(this.zoom * this.resolutionFactor * zoomFactor).translate(this.transformations.translateX, -this.transformations.translateY))
        return pattern;
      }
      return null;
    }
    else {
      // gradient
      let gradient: CanvasGradient;
      if (instanceOfLinearGradient(colorStyle)) {
        // linear gradient
        const realStartPoint = this.transformPointFromFieldToCanvasWithResolutionFactor(colorStyle.startPoint);
        const realEndPoint = this.transformPointFromFieldToCanvasWithResolutionFactor(colorStyle.endPoint);
        gradient = this.ctx.createLinearGradient(realStartPoint.x, realStartPoint.y, realEndPoint.x, realEndPoint.y);
      }
      else if (instanceOfRadialGradient(colorStyle)) {
        // radial gradient
        const realStartCircle = this.transformCircleFromFieldToCanvasWithResolutionFactor(colorStyle.startCircle)
        const realEndCircle = this.transformCircleFromFieldToCanvasWithResolutionFactor(colorStyle.endCircle)
        gradient = this.ctx.createRadialGradient(realStartCircle.x, realStartCircle.y, realStartCircle.radius, realEndCircle.x, realEndCircle.y, realEndCircle.radius);
      }
      else {
        // conic gradient
        const realCenter = this.transformPointFromFieldToCanvasWithResolutionFactor(colorStyle.center);
        gradient = this.ctx.createConicGradient(colorStyle.startAngle, realCenter.x, realCenter.y);
      }
      
      // add the stops
      for (let stop of colorStyle.stops) {
        gradient.addColorStop(Math.max(0, Math.min(stop[0], 1)), getColorAsRgbaFunction(this.getRightColor(stop[1], this.config)));
      }
      return gradient;
    }

    return null
  }

  private strokeStyleSet: boolean = true;
  private useStrokeStyle(strokeStyle?: StrokeStyle) {
    if (strokeStyle === undefined) {
      if (!this.strokeStyleSet && !this.canvasConfig?.alwaysSetStyles) {
        return;
      }
      else {
        strokeStyle = EMPTY_STROKESTYLE;
        this.strokeStyleSet = false;
      }
    }
    else {
      this.strokeStyleSet = true;
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

  private fillStyleSet: boolean = false;
  private useFillStyle(fillStyle?: FillStyle) {
    if (fillStyle === undefined) {
      if (!this.fillStyleSet && !this.canvasConfig?.alwaysSetStyles) {
        return;
      }
      else {
        fillStyle = EMPTY_FILLSTYLE;
        this.fillStyleSet = false;
      }
    }
    else {
      this.fillStyleSet = true;
    }

    // color
    const colorStyle = this.colorStyleToCanvasStyle(fillStyle.color, fillStyle.uniformSizeOnZoom);
    if (colorStyle !== null) {
      this.ctx.fillStyle = colorStyle;
    }
  }

  private objectStyleSet: boolean = false;
  private useObjectStyle(objectStyle?: ObjectStyle) {
    if (objectStyle === undefined) {
      if (!this.objectStyleSet && !this.canvasConfig?.alwaysSetStyles) {
        return;
      }
      else {
        objectStyle = EMPTY_OBJECTSTYLE;
        this.objectStyleSet = false;
      }
    }
    else {
      this.objectStyleSet = true;
    }

    const resFactor = this.resolutionFactor;
    const zoom = this.zoom;

    // filter
    const filters = (objectStyle.filter ?? DEFAULT_FILTERS).map(f => filterToCssFunctionString(f, resFactor, zoom, objectStyle.uniformSizeOnZoom));
    const filterStr = filters.length === 0 ? 'none' : filters.join(' ');
    this.ctx.filter = filterStr;

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
    this.ctx.shadowColor = getColorAsRgbaFunction(this.getRightColor(shadow.color, this.config));

    // alpha
    this.ctx.globalAlpha = objectStyle.alpha ?? DEFAULT_ALPHA;

  }

  private textStyleSet: boolean = false;
  private useTextStyle(textStyle?: TextStyle) {
    if (textStyle === undefined) {
      if (!this.textStyleSet && !this.canvasConfig?.alwaysSetStyles) {
        return;
      }
      else {
        textStyle = EMPTY_TEXTSTYLE;
        this.textStyleSet = false;
      }
    }
    else {
      this.textStyleSet = true;
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
    font += `${measurementToString(textStyle.fontSize, resFactor, zoom, textStyle.uniformSizeOnZoom)} `;
    const fontFamilies = textStyle.fontFamily.join(', ');
    font += fontFamilies;
    this.ctx.font = font;

    // font kerning
    this.ctx.fontKerning = textStyle.fontKerning ?? DEFAULT_FONTKERNING;

    // font stretch
    this.ctx.fontStretch = textStyle.fontStretch ?? DEFAULT_FONTSTRETCH;

    // font variant caps
    this.ctx.fontVariantCaps = textStyle.fontVariantCaps ?? DEFAULT_FONTVARIANTCAPS;

    // letter spacing
    this.ctx.letterSpacing = measurementToString(textStyle.letterSpacing ?? DEFAULT_LETTERSPACING, resFactor, zoom, textStyle.uniformSizeOnZoom);

    // text direction
    this.ctx.direction = textStyle.direction ?? DEFAULT_TEXTDIRECTION;

    // text align
    this.ctx.textAlign = textStyle.textAlign ?? DEFAULT_TEXTALIGN;

    // text baseline
    this.ctx.textBaseline = textStyle.textBaseline ?? DEFAULT_TEXTBASELINE;

    // word spacing
    this.ctx.wordSpacing = measurementToString(textStyle.wordSpacing ?? DEFAULT_WORDSPACING, resFactor, zoom, textStyle.uniformSizeOnZoom);
  }

  private imageStyleSet: boolean = false;
  private useImageStyle(imageStyle?: ImageStyle) {
    if (imageStyle === undefined) {
      if (!this.imageStyleSet && !this.canvasConfig?.alwaysSetStyles) {
        return;
      }
      else {
        imageStyle = EMPTY_IMAGESTYLE;
        this.imageStyleSet = false;
      }
    }
    else {
      this.imageStyleSet = true;
    }

    this.ctx.imageSmoothingEnabled = imageStyle.imageSmoothingEnabled ?? DEFAULT_IMAGESMOOTHINGENABLED;
    this.ctx.imageSmoothingQuality = imageStyle.imageSmoothingQuality ?? DEFAULT_IMAGESMOOTHINGQUALITY;
  }

  // path: just lines
  public drawPath(points: Point[], strokeStyle: StrokeStyle, fill?: FillStyle, objectStyle?: ObjectStyle): void {
    const realPoints = points.map(p => {
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

    if (realPoints.length !== 0) {
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

  // smooth path: quadratic beziers
  public override drawSmoothPath(path: PenPoint[], changeThickness: boolean | undefined, strokeStyle: StrokeStyle, objectStyle?: ObjectStyle): void {

    const baseLineWidth = strokeStyle.lineWidth;

    if (path.length === 0) {
      return;
    }
    else if (path.length === 1) {
      this.drawCircle(path[0], getStrokePointPathFromPenPointPath(path)[0].thickness * baseLineWidth / 2, strokeStyle.uniformSizeOnZoom, {
        color: strokeStyle.color
      }, undefined, objectStyle)
    }
    else {
      
      this.useStrokeStyle(strokeStyle);
      this.useObjectStyle(objectStyle);

      const pathStroke = getStrokePointPathFromPenPointPath(path);

      let lastP = pathStroke[0];

      // begin
      const beginAndClosePathIfContinousOnMyOwn = changeThickness !== true;
      if (beginAndClosePathIfContinousOnMyOwn) {
        this.ctx.beginPath();
      }

      for (let i = 1; i < pathStroke.length - 1; i++) {
        const point = pathStroke[i];
        const correct = Math.sqrt((point.x - pathStroke[pathStroke.length - 1].x) ** 2 + (point.y - pathStroke[pathStroke.length - 1].y) ** 2) > 1;
        if (correct) {
  
          const nextP = pathStroke[i + 1];
          const dx = (point.x + nextP.x) / 2;
          const dy = (point.y + nextP.y) / 2;
          const to: StrokePoint = {
            x: dx,
            y: dy,
            thickness: point.thickness
          }

          this.drawSmoothPathSegmentWithoutSettings({
            from: lastP,
            control: point,
            to: to
          }, !beginAndClosePathIfContinousOnMyOwn, getThicknessSettings(lastP, point, baseLineWidth, changeThickness, this))

          lastP = to;
        }
      }

      const endP = pathStroke[pathStroke.length - 1];
      this.drawSmoothPathSegmentWithoutSettings({
        from: lastP,
        control: lastP,
        to: endP
      }, !beginAndClosePathIfContinousOnMyOwn, getThicknessSettings(lastP, lastP, baseLineWidth, changeThickness, this));

      // close path if needed
      if (beginAndClosePathIfContinousOnMyOwn) {
        this.ctx.stroke();
        this.ctx.closePath();
      }
    }
  }

  public override drawSmoothPathSegment(qbz: QuadraticBezier, thicknessSettings: ThicknessSettings | undefined, strokeStyle: StrokeStyle, objectStyle?: ObjectStyle): void {
  
    this.useStrokeStyle(strokeStyle);
    this.useObjectStyle(objectStyle);

    this.drawSmoothPathSegmentWithoutSettings(qbz, true, thicknessSettings);

  }

  private drawSmoothPathSegmentWithoutSettings(qbz: QuadraticBezier, beginAndClosePathIfContinous: boolean, thicknessSettings?: ThicknessSettings): void {
    const realQBZ: QuadraticBezier = {
      from: this.transformPointFromFieldToCanvasWithResolutionFactor(qbz.from),
      control: this.transformPointFromFieldToCanvasWithResolutionFactor(qbz.control),
      to: this.transformPointFromFieldToCanvasWithResolutionFactor(qbz.to)
    }
    
    if (thicknessSettings === undefined) {
      if (beginAndClosePathIfContinous) {
        this.ctx.beginPath();
      }

      this.ctx.moveTo(realQBZ.from.x, realQBZ.from.y);
      this.ctx.quadraticCurveTo(realQBZ.control.x, realQBZ.control.y, realQBZ.to.x, realQBZ.to.y);
      
      if (beginAndClosePathIfContinous) {
        this.ctx.stroke();
        this.ctx.closePath();
      }
    }
    else {
      const zoom = this.zoom;
      const resFactor = this.resolutionFactor;
      const thicknessStart = thicknessSettings.thicknessStart * zoom * resFactor;
      const thicknessEnd = thicknessSettings.thicknessEnd * zoom * resFactor;
      
      let lastP = realQBZ.from;
      for (let i = 1; i <= thicknessSettings.steps; i++) {
        const t = i / thicknessSettings.steps;
        const qbz = getControlPointInQuadraticBezier((i - 1) / thicknessSettings.steps, t, realQBZ);
        const p = qbz.to;
        const th = t * thicknessEnd + (1 - t) * thicknessStart;

        this.ctx.beginPath();
        this.ctx.moveTo(lastP.x, lastP.y);
        this.ctx.quadraticCurveTo(qbz.control.x, qbz.control.y, p.x, p.y);
        
        this.ctx.lineWidth = th;
        this.ctx.stroke();
        this.ctx.closePath();
        
        lastP = p;
      }
    }

  }

  public drawContinousQuadraticPath(points: Point[], stroke: StrokeStyle, fill?: FillStyle, objectStyle?: ObjectStyle): void {
    const realPoints = points.map(p => {
      return this.transformPointFromFieldToCanvasWithResolutionFactor(p);
    });

    this.useStrokeStyle(stroke);
    this.useFillStyle(fill);
    this.useObjectStyle(objectStyle);

    if (realPoints.length !== 0) {
      
      // this.ctx.lineCap = 'round'
      
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

          this.ctx.quadraticCurveTo(point.x, point.y, dx, dy);
          
          // begin the new path
          // this.ctx.beginPath();
          // this.ctx.moveTo(dx, dy);
        }
      }

      const lastP = realPoints[realPoints.length - 1];
      this.ctx.lineTo(lastP.x, lastP.y);

      //this.ctx.strokeStyle = createNoisePattern()
  
      this.ctx.stroke();

    }
  }

  public drawQuadraticPath(points: PenPoint[], stroke: StrokeStyle, objectStyle?: ObjectStyle): void {
    const realPoints: PenPoint[] = points.map(p => copyPointToPenPoint(this.transformPointFromFieldToCanvasWithResolutionFactor(p), p));

    /*for (let p of realPoints) {
      this.ctx.fillStyle = getColorAsRgbaFunction(stroke);
      this.ctx.fillRect(p.x, p.y, lineWidth, lineWidth);
    }*/
    const zoom = this.zoom;

    this.useStrokeStyle(stroke);
    this.useObjectStyle(objectStyle);

    if (realPoints.length !== 0) {
      
      // this.ctx.lineCap = 'round'
      
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


          this.ctx.lineWidth = stroke.lineWidth * point.p;
          if (!stroke.uniformSizeOnZoom) {
            this.ctx.lineWidth *= zoom;
          }
          // const newStrokeStyle = {...stroke};
          // newStrokeStyle.lineWidth = stroke.lineWidth * point.size
          // this.useStrokeStyle(newStrokeStyle);

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
                  fillStyle?: FillStyle,
                  objectStyle?: ObjectStyle): void {
    let realP = this.transformPointFromFieldToCanvasWithResolutionFactor(p);
   
    // set the ctx up
    let ctx = this.ctx;

    // // search for the underlined
    // let strs: string[] = [];
    // let lastStr = ''
    // for (let i = 0; i < text.length; i++) {
    //   if (text.charAt(i) === '_' && i + 1 < text.length && false/*!skipIndex*/) { // remove legacy code
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
    this.useObjectStyle(objectStyle);
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
                     useUniformSize?: boolean,
                     fillStyle?: FillStyle,
                     strokeStyle?: StrokeStyle,
                     objectStyle?: ObjectStyle): void {
    // draw an ellipse around the center point
    const resFactor = this.resolutionFactor;
    const zoom = !useUniformSize ? this.zoom : 1;

    this.useStrokeStyle(strokeStyle);
    this.useFillStyle(fillStyle);
    this.useObjectStyle(objectStyle);
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
                    useUniformSize: boolean,
                    fillStyle?: FillStyle,
                    strokeStyle?: StrokeStyle,
                    objectStyle?: ObjectStyle): void {
    const zoom = !useUniformSize ? this.zoom : 1;

    // draw an ellipse around the center point
    this.useStrokeStyle(strokeStyle);
    this.useFillStyle(fillStyle);
    this.useObjectStyle(objectStyle);
    const realCenter = this.transformPointFromFieldToCanvasWithResolutionFactor(center)
    const realRadius = radius * zoom * this.resolutionFactor;

    this.ctx.closePath();
    this.ctx.beginPath();
    this.ctx.moveTo(realCenter.x, realCenter.y);
    this.ctx.arc(realCenter.x, realCenter.y, realRadius, startAngle, endAngle);
    this.ctx.lineTo(realCenter.x, realCenter.y);
    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.closePath();
  }

  public drawRect(rect: Rect,
      useUniformSize: boolean,
      fillStyle?: FillStyle,
      strokeStyle?: StrokeStyle,
      objectStyle?: ObjectStyle): void {
    const zoom = useUniformSize ? this.zoom : 1;

    this.useStrokeStyle(strokeStyle);
    this.useFillStyle(fillStyle);
    this.useObjectStyle(objectStyle);
    const realRect = this.transformRectFromFieldToCanvasWithResolutionFactor(rect);
    this.ctx.fillRect(realRect.x, realRect.y, realRect.width / zoom, realRect.height / zoom);
    this.ctx.strokeRect(realRect.x, realRect.y, realRect.width / zoom, realRect.height / zoom);
  }

  public drawImage(image: CanvasImageSource,
      p: Point,
      dw: number,
      dh: number,
      useUniformSize: boolean,
      imageStyle?: ImageStyle,
      objectStyle?: ObjectStyle) {
    let realP = this.transformPointFromFieldToCanvasWithResolutionFactor(p);

    // set the ctx up
    this.useImageStyle(imageStyle);
    this.useObjectStyle(objectStyle);
    let ctx = this.ctx;
    const resFactor = this.resolutionFactor;
    const zoom = !useUniformSize ? this.zoom : 1;

    ctx.drawImage(image, realP.x, realP.y, dw * resFactor * zoom, dh * resFactor * zoom)
  }
}
