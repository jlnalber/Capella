import { Injectable } from '@angular/core';
import { Transformations } from '../global/interfaces/transformations';
import { CanvasComponent } from '../whiteboard/canvas/canvas.component';
import { Event } from '../global/essentials/event';
import { Point, Vector } from '../global/interfaces/point';
import { Rect } from '../global/interfaces/rect';
import { RenderingContext } from '../global/classes/renderingContext';
import { Mode } from '../global/classes/modes/mode';
import Selection from '../global/essentials/selection';
import { CanvasElement } from '../global/classes/abstract/canvasElement';
import { CanvasClickerElement } from '../global/classes/abstract/canvasClickerElement';
import { getColorAsRgbaFunction, WHITE } from '../global/interfaces/color';
import { PenMode } from '../global/classes/modes/penMode';


export const STORAGE_CACHE = 'serialized_whiteboard'

@Injectable({
  providedIn: 'root'
})
export class WhiteboardService {
  // #region the properties of the canvas --> bgColor, elements in canvas, transformations and config
  private _mode: Mode | undefined = new PenMode();// TODO: set default

  public get mode(): Mode | undefined {
    return this._mode;
  }

  public set mode(value: Mode | undefined) {
    this._mode = value;
    this.onModeChanged.emit(value);
  }

  /*private _backgroundColor: Color = {
    r: 255,
    g: 255,
    b: 255
  };
  public get backgroundColor(): Color {
    return this._backgroundColor;
  }

  public set backgroundColor(value: Color) {
    this._backgroundColor = value;
    this.onBackgroundColorChanged.emit(value);
  }*/

  private _canvasElements: CanvasElement[] = [];

  public addCanvasElements(...canvasElements: CanvasElement[]): void {
    for (let canvasElement of canvasElements) {
      this._canvasElements.push(canvasElement);
      canvasElement.onChange.addListener(this.canvasElementOnChangeListener);
      canvasElement.onAdd.emit(this);
    }
    this.onCanvasElementChanged.emit(canvasElements);
  }

  public removeCanvasElements(...canvasElements: CanvasElement[]): boolean {
    // Remove all teh given canvas elements from the canvas.
    let worked = true;
    for (let canvasElement of canvasElements) {
      const index = this._canvasElements.indexOf(canvasElement);
      if (index >= 0) {
        this._canvasElements.splice(index, 1);
        canvasElement.onChange.removeListener(this.canvasElementOnChangeListener);
        canvasElement.onRemove.emit(this);
      } else {
        worked = false;
      }
    }

    // Emit event.
    this.onCanvasElementChanged.emit(canvasElements);
    return worked;
  }

  public emptyCanvasElements(): void {
    for (let canvasElement of this._canvasElements) {
      canvasElement.onChange.removeListener(this.canvasElementOnChangeListener);
      canvasElement.onRemove.emit(this);
    }
    this._canvasElements = [];
    this.onCanvasElementChanged.emit();
  }

  public get canvasElements(): CanvasElement[] {
    return this._canvasElements.slice();
  }

  private readonly _transformations: Transformations = {
    translateX: 0,
    translateY: 0,
    zoom: 1
  };

  public set translateX(value: number) {
    this._transformations.translateX = value;
    this.onTransformationsChanged.emit(value);
  }

  public get translateX(): number {
    return this._transformations.translateX;
  }

  public set translateY(value: number) {
    this._transformations.translateY = value;
    this.onTransformationsChanged.emit(value);
  }

  public get translateY(): number {
    return this._transformations.translateY;
  }

  public set zoom(value: number) {
    this._transformations.zoom = value;
    this.onTransformationsChanged.emit(value);
  }

  public get zoom(): number {
    return this._transformations.zoom;
  }

  public get transformations(): Transformations {
    return {
      translateX: this.translateX,
      translateY: this.translateY,
      zoom: this.zoom
    }
  }

  public set transformations(value: Transformations) {
    this._transformations.zoom = value.zoom;
    this._transformations.translateX = value.translateX;
    this._transformations.translateY = value.translateY;
    this.onTransformationsChanged.emit(value);
  }

  // #endregion

  // other properties
  public readonly selection: Selection<CanvasElement> = new Selection<CanvasElement>();
  public canvas?: CanvasComponent;

  // Events
  // public readonly onBackgroundColorChanged: Event<Color> = new Event<Color>();
  public readonly onCanvasElementChanged: Event<any> = new Event<any>();
  // public readonly onMetaDrawersChanged: Event<CanvasDrawer> = new Event<CanvasDrawer>();
  public readonly onTransformationsChanged: Event<number | Transformations> = new Event<number | Transformations>();
  // public readonly onCanvasConfigChanged: Event<CanvasConfig> = new Event<CanvasConfig>();
  public readonly onBeforeRedraw: Event<undefined> = new Event<undefined>();
  public readonly onBeforeElementsDraw: Event<RenderingContext> = new Event<RenderingContext>();
  public readonly onAfterRedraw: Event<undefined> = new Event<undefined>();
  public readonly onModeChanged: Event<Mode> = new Event<Mode>();

  // Event listeners
  private redrawListener = () => {
    this.redraw();
  }
  private canvasElementOnChangeListener = (val: any) => {
   this.onCanvasElementChanged.emit(val);
  }

  private saveListener = () => {
    // localStorage[STORAGE_CACHE] = JSON.stringify(this.serialize()); TODO: implement
  }

  constructor() {
    //this.onBackgroundColorChanged.addListener(this.redrawListener);
    this.onCanvasElementChanged.addListener(this.redrawListener);
    this.onTransformationsChanged.addListener(this.redrawListener);
    //this.onMetaDrawersChanged.addListener(this.redrawListener);
    //this.onCanvasConfigChanged.addListener(this.redrawListener);
    this.onModeChanged.addListener(this.redrawListener);
    this.selection.onSelectionChanged.addListener(this.redrawListener);

    this.onAfterRedraw.addListener(this.saveListener);
  }

  // #region fields for rendering
  public get renderingContext(): RenderingContext {
    return this.getRenderingContextFor(this.canvas?.ctx as CanvasRenderingContext2D, this._transformations);
  }

  public getRenderingContextFor(ctx: CanvasRenderingContext2D, transformations: Transformations): RenderingContext {
    return new RenderingContext(ctx, transformations, this.selection.toArray());
  }

  public redraw(): void {
    if (this.canvas && this.canvas.canvasEl && this.canvas.wrapperEl && this.canvas.ctx) {
      this.onBeforeRedraw.emit();

      // draw to canvas
      this.drawToCanvas(this.canvas.canvasEl, this.canvas.wrapperEl.getBoundingClientRect(), this._transformations, true);

      this.onAfterRedraw.emit();
    }
  }

  /*public tex2svg(tex: string, color: Color = BLACK): SVGElement {
    const svg = MathJax.tex2svg(tex).firstElementChild as SVGElement;
    svg.setAttributeNS(null, 'color', getColorAsRgbaFunction(color))
    return svg;
  }*/

  public drawToCanvas(canvas: HTMLCanvasElement, boundingRect: Rect, transformations: Transformations, withTransformColor: boolean = false): void {
    const resolution = transformations.resolutionFactor ?? 1;
    
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    
    // resize canvas
    ctx.canvas.width = boundingRect.width * resolution;
    ctx.canvas.height = boundingRect.height * resolution;

    // first: draw the background
    //ctx.fillStyle = getColorAsRgbaFunction(this.backgroundColor);
    ctx.fillStyle = getColorAsRgbaFunction(WHITE);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // then: draw the elements (first metaDrawers, then canvasElements)
    let renderingContext = this.getRenderingContextFor(ctx, transformations);
    this.onBeforeElementsDraw.emit(renderingContext);
    /*for (let metaDrawer of this._metaDrawers) {
      metaDrawer.draw(renderingContext);
    }*/

    let cs: CanvasElement[] = this._canvasElements;
    
    for (let canvasElement of cs) {
      /*if (renderingContext.config && withTransformColor) {
        if (!canvasElement.visible) {
          renderingContext.config.transformColor = this.mode?.transformInvisibleColor;
        } else {
          renderingContext.config.transformColor = undefined;
        }
      }*/

      //if (canvasElement.visible || renderingContext.config?.transformColor) {
      // draw canvasElement
      canvasElement.draw(renderingContext);

      //}
    }

  }

  public zoomToBy(p: Point, factor: number): void {
    let vec: Vector = {
      x: p.x / this.zoom * (1 - 1 / factor),
      y: -p.y / this.zoom * (1 - 1 / factor)
    }
    this._transformations.translateX -= vec.x;
    this._transformations.translateY -= vec.y;
    this.zoom *= factor;
  }

  // #endregion


  // #region further fields

  public getSelection(p: Point, filter: (cE: CanvasClickerElement) => boolean = () => true): CanvasClickerElement | undefined {
    let ctx = this.renderingContext;
    let minDist: number | undefined = undefined;
    let minCanvasElement: CanvasClickerElement | undefined;

    // const getDistToLabel = (canvasElement: CanvasElement): number | undefined => {
    //   const labelPoint = this.getLabelPoint(canvasElement, ctx);
    //   if (canvasElement.configuration.label === undefined || labelPoint === undefined) {
    //     return undefined;
    //   }
    //   const labelFactor = canvasElement.configuration.labelSizeFactor ?? 1;
      
    //   let fieldWidth = 0;
    //   let fieldHeight = 0;
    //   if (canvasElement.configuration.dontUseLaTeX || canvasElement.svgLabel === undefined) {
    //     // Bei einem regulären Label
    //     const measureText = ctx.measureText(canvasElement.configuration.label, LABEL_FONT_SIZE, LABEL_FONT_FAMILY);
    //     fieldWidth = measureText.width / ctx.zoom * labelFactor;
    //     fieldHeight = LABEL_FONT_SIZE / ctx.zoom * labelFactor;
    //   }
    //   else {
    //     // ansonsten wäre es ein LaTeX Label
    //     fieldWidth = canvasElement.svgLabel.width / ctx.zoom * labelFactor;
    //     fieldHeight = -canvasElement.svgLabel.height / ctx.zoom * labelFactor; // Weil sich das Rechteck ja in negative y-Richtung streckt, bedarf es ein Minus
    //   }

    //   return getDistanceToRect(p, {
    //     ...labelPoint,
    //     width: fieldWidth,
    //     height: fieldHeight
    //   })
    // }

    // TODO: test with resolution factor

    // find out the element with the minimal distance
    for (let canvasElement of this.canvasElements) {
      if (canvasElement instanceof CanvasClickerElement) {
        const dist = canvasElement.getDistance(p, ctx);
        if (dist !== undefined && dist !== null && isFinite(dist) && filter(canvasElement)) {
          let closer = minDist === undefined;
          closer = closer || dist <= minDist!;
          if (closer) {
            minDist = dist;
            minCanvasElement = canvasElement;
          }
        }
      }
    }

    // if the distance is too high, don't do anything
    const maxDistance = 10;
    if (minDist !== undefined && maxDistance < minDist * this.zoom) {
      minCanvasElement = undefined;
      minDist = undefined;
    }

    return minCanvasElement;
  }

  public setSelection(p: Point, empty: boolean = true, filter: (cE: CanvasClickerElement) => boolean = () => true) {
    const minCanvasElement = this.getSelection(p, filter);

    // set the selection, or alternate the element, e.g. when ctrl is pressed
    if (empty) {
      this.selection.set(minCanvasElement);
    } else {
      this.selection.alternate(minCanvasElement);
    }
  }

  // #endregion

  /*public serialize(): Serialized {
    return serialize(this);
  }*/

  /*public loadFrom(serialized: Serialized): void {
    loadFrom(this, serialized);
  }*/

}
