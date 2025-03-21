import { Injectable } from '@angular/core';
import { areEqualColors, BLACK, Color, colorAsTransparent, getColorAsRgbaFunction, WHITE } from "src/app/global/interfaces/color";
import { Event } from "src/app/global/essentials/event";
import { RenderingContext } from "src/app/global/classes/renderingContext/renderingContext";
import { getResolution, Transformations } from "src/app/global/interfaces/transformations";
import { Point, Vector } from "src/app/global/interfaces/point";
import { CanvasDrawer } from 'src/app/global/classes/abstract/canvasDrawer';
import { Grid } from "src/app/prokyon/global/classes/grid";
import { Graph, ParseAndValidateProviderGraph } from "../global/classes/canvas-elements/graph";
import { getDistanceToRect, getMinUndef, getNew } from "src/app/global/essentials/utils";
import { FuncProvider } from "../global/classes/func/operations/externalFunction";
import { Func } from "../global/classes/func/func";
import { FuncParser } from "../global/classes/func/funcParser";
import {
  inspect,
  containsVariable,
  countDerivatives,
  funcNameWithoutDerivative,
  isRecursive, inspectOperation
} from "../global/classes/func/funcInspector";
import Cache from "src/app/global/essentials/cache";
import VariableElement from "../global/classes/canvas-elements/variableElement";
import Selection from "src/app/global/essentials/selection";
import PointElement from "../global/classes/canvas-elements/pointElement";
import { colors } from "src/app/global/styles/colors";
import MoveMode from "../global/classes/modes/moveMode";
import { Rect } from "src/app/global/interfaces/rect";
import { loadFrom, serialize, Serialized } from "src/app/prokyon/global/essentials/serializer";
import AngleElement from '../global/classes/canvas-elements/angleElement';
import { Operation } from "../global/classes/func/operations/operation";
import CompiledPointElement from "../global/classes/canvas-elements/compiledPointElement";
import { OperationsParser } from "../global/classes/func/operations/operationsParser";
import CurveElement from "../global/classes/canvas-elements/curveElement";
import AbstractDrawerService from 'src/app/global/classes/abstract/abstractDrawerService';
import { PointerType } from 'src/app/global/classes/pointerController';
import { ProkyonMode } from '../global/classes/modes/prokyonMode';
import { ProkyonCanvasElement } from '../global/classes/abstract/prokyonCanvasElement';
import AbstractRenderingContext from 'src/app/global/classes/renderingContext/abstractRenderingContext';
import { ProkyonCanvasConfig as CanvasConfig } from '../global/classes/prokyonCanvasConfig';

export type MJ = any;

export const STORAGE_CACHE = 'serialized'

declare const MathJax: MJ;

const LABEL_FONT_SIZE = 18;
const LABEL_FONT_FAMILY = ['"Cambria Math"', 'Cambria', '"CMU Serif"', 'serif'];

const PARSER_ERROR = 'Ungültige Eingabe.';
const UNKNOWN_FUNCTION = "Referenz einer unbekannten Funktion."
const RECURSIVE_ERROR = 'Eine Funktion darf nicht auf sich selbst verweisen.'

@Injectable({
  providedIn: 'root'
})
export class DrawerService extends AbstractDrawerService {

  // #region the properties of the canvas --> bgColor, elements in canvas, transformations and config
  private _mode: ProkyonMode | undefined = new MoveMode();

  public get mode(): ProkyonMode | undefined {
    return this._mode;
  }

  public set mode(value: ProkyonMode | undefined) {
    this._mode = value;
    this.onModeChanged.emit(value);
  }

  public getModeForPointerType(pointerType: PointerType): ProkyonMode | undefined {
    return this._mode;
  }

  private _backgroundColor: Color = {
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
  }

  private _canvasElements: ProkyonCanvasElement[] = [];

  public addCanvasElements(...canvasElements: ProkyonCanvasElement[]): void {
    for (let canvasElement of canvasElements) {
      this._canvasElements.push(canvasElement);
      canvasElement.onChange.addListener(this.canvasElementOnChangeListener);
      canvasElement.onAdd.emit(this);
    }
    this.onCanvasElementChanged.emit(canvasElements);
  }

  public removeCanvasElements(...canvasElements: ProkyonCanvasElement[]): boolean {
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

  public get canvasElements(): ProkyonCanvasElement[] {
    return this._canvasElements.slice();
  }

  private _metaDrawers: CanvasDrawer[] = [];

  public addMetaDrawer(canvasElement: CanvasDrawer): void {
    this._metaDrawers.push(canvasElement);
    this.onMetaDrawersChanged.emit(canvasElement);
  }

  public removeMetaDrawer(canvasElement: CanvasDrawer): boolean {
    const index = this._metaDrawers.indexOf(canvasElement);
    if (index >= 0) {
      this._metaDrawers.splice(index, 1);
      this.onMetaDrawersChanged.emit(canvasElement);
      return true;
    }
    return false;
  }

  public emptyMetaDrawers(): void {
    this._metaDrawers = [];
    this.onMetaDrawersChanged.emit();
  }

  public get metaDrawers(): CanvasDrawer[] {
    return this._metaDrawers.slice();
  }

  private readonly _transformations: Transformations = {
    translateX: 7,
    translateY: -5,
    zoom: 100
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

  public get resolutionFactor(): number {
    return getResolution(this._transformations.resolutionFactor);
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

  private _showGrid: boolean = true;
  public get showGrid(): boolean {
    return this._showGrid;
  }

  public set showGrid(value: boolean) {
    this._showGrid = value;
    this.onCanvasConfigChanged.emit(this.canvasConfig);
  }

  private _showGridNumbers: boolean = true;
  public get showGridNumbers(): boolean {
    return this._showGridNumbers;
  }

  public set showGridNumbers(value: boolean) {
    this._showGridNumbers = value;
    this.onCanvasConfigChanged.emit(this.canvasConfig);
  }

  private _drawPointsEqually: boolean = false;
  public get drawPointsEqually(): boolean | undefined {
    return this._drawPointsEqually;
  }

  public set drawPointsEqually(value: boolean | undefined) {
    this._drawPointsEqually = value === true;
    this.onCanvasConfigChanged.emit(this.canvasConfig);
  }

  private _drawNewLabels: boolean = true;
  public get drawNewLabels(): boolean | undefined {
    return this._drawNewLabels;
  }

  public set drawNewLabels(value: boolean) {
    this._drawNewLabels = value;
    this.onCanvasConfigChanged.emit(this.canvasConfig);
  }

  private get canvasConfig(): CanvasConfig {
    return {
      showNumbers: this.showGridNumbers,
      showGrid: this.showGrid,
      drawPointsEqually: this.drawPointsEqually,
      drawNewLabels: this.drawNewLabels
    }
  }

  // #endregion

  // other properties
  public readonly selection: Selection<ProkyonCanvasElement> = new Selection<ProkyonCanvasElement>();

  // Events
  public readonly onBackgroundColorChanged: Event<Color> = new Event<Color>();
  public readonly onCanvasElementChanged: Event<any> = new Event<any>();
  public readonly onMetaDrawersChanged: Event<CanvasDrawer> = new Event<CanvasDrawer>();
  public readonly onTransformationsChanged: Event<number | Transformations> = new Event<number | Transformations>();
  public readonly onCanvasConfigChanged: Event<CanvasConfig> = new Event<CanvasConfig>();
  public readonly onBeforeRedraw: Event<undefined> = new Event<undefined>();
  public readonly onBeforeElementsDraw: Event<AbstractRenderingContext> = new Event<AbstractRenderingContext>();
  public readonly onAfterRedraw: Event<undefined> = new Event<undefined>();
  public readonly onModeChanged: Event<ProkyonMode> = new Event<ProkyonMode>();

  // Event listeners
  private canvasElementOnChangeListener = (val: any) => {
    this.onCanvasElementChanged.emit(val);
  }
  private emptyCacheListener = () => {
    this.funcCache.empty();
  }

  private saveListener = () => {
    localStorage[STORAGE_CACHE] = JSON.stringify(this.serialize());
  }

  constructor() {
    super();

    this.addMetaDrawer(new Grid());

    this.onBackgroundColorChanged.addListener(this.redrawListener);
    this.onCanvasElementChanged.addListener(this.redrawListener);
    this.onTransformationsChanged.addListener(this.redrawListener);
    this.onMetaDrawersChanged.addListener(this.redrawListener);
    this.onCanvasConfigChanged.addListener(this.redrawListener);
    this.onModeChanged.addListener(this.redrawListener);
    this.selection.onSelectionChanged.addListener(this.redrawListener);

    this.onCanvasElementChanged.addListener(this.emptyCacheListener);
    this.onCanvasElementChanged.addListener(this.emptyCacheListener);

    this.onAfterRedraw.addListener(this.saveListener);
  }

  // #region fields for rendering
  public get renderingContext(): AbstractRenderingContext {
    return this.getRenderingContextFor(this.canvas?.canvasAndCTX![0].ctx as CanvasRenderingContext2D, this._transformations);
  }

  public getRenderingContextFor(ctx: CanvasRenderingContext2D, transformations: Transformations): AbstractRenderingContext {
    return new RenderingContext(ctx, transformations, this.selection.toArray(), undefined, (c: Color, config?: CanvasConfig) => {
      if (config?.transformColor === undefined) return c;
      return config.transformColor(c);
    }, this.getVariables(), this.canvasConfig);
  }

  public async redraw(): Promise<void> {
    if (this.canvas && this.canvas.canvasAndCTX && this.canvas.wrapperEl) {
      this.onBeforeRedraw.emit();

      // draw to canvas
      await this.drawToCanvas(this.canvas.canvasAndCTX[0].canvas, this.canvas.wrapperEl.getBoundingClientRect(), this._transformations, true);

      this.onAfterRedraw.emit();
    }
  }

  public tex2svg(tex: string, color: Color = BLACK): SVGElement {
    const svg = MathJax.tex2svg(tex).firstElementChild as SVGElement;
    svg.setAttributeNS(null, 'color', getColorAsRgbaFunction(color))
    return svg;
  }

  public async drawToCanvas(canvas: HTMLCanvasElement, boundingRect: Rect, transformations: Transformations, withTransformColor: boolean = false): Promise<void> {
    const resolution = this.resolutionFactor;

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    // resize canvas
    ctx.canvas.width = boundingRect.width * resolution;
    ctx.canvas.height = boundingRect.height * resolution;

    // first: draw the background
    ctx.fillStyle = getColorAsRgbaFunction(this.backgroundColor);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // then: draw the elements (first metaDrawers, then canvasElements)
    let renderingContext = this.getRenderingContextFor(ctx, transformations);
    this.onBeforeElementsDraw.emit(renderingContext);
    for (let metaDrawer of this._metaDrawers) {
      metaDrawer.draw(renderingContext);
    }

    let cs: ProkyonCanvasElement[];
    if (this.drawPointsEqually) {
      cs = this._canvasElements;
    } else {
      const ps = this._canvasElements.filter(i => (i instanceof PointElement));
      const as = this._canvasElements.filter(i => (i instanceof AngleElement))
      const rest = this._canvasElements.filter(i => !(i instanceof PointElement || i instanceof AngleElement))
      cs = as.concat(rest as any[]).concat(ps as any[])
    }
    for (let canvasElement of cs) {
      if (renderingContext.config && withTransformColor) {
        if (!canvasElement.visible) {
          renderingContext.config.transformColor = this.mode?.transformInvisibleColor;
        } else {
          renderingContext.config.transformColor = undefined;
        }
      }

      if (canvasElement.visible || renderingContext.config?.transformColor) {
        // draw canvasElement
        canvasElement.draw(renderingContext);

        // draw label
        const labelPoint = this.getLabelPoint(canvasElement, renderingContext);
        const label = canvasElement.configuration.label;
        if (labelPoint !== undefined && label !== undefined && label !== '') {
          const color = canvasElement.configuration.displayBlackLabel ? BLACK : canvasElement.color;
          const useLaTeX = !(canvasElement.configuration.dontUseLaTeX ?? false);
          const labelFactor = canvasElement.configuration.labelSizeFactor ?? 1;

          const drawRegularLabel = () => {
            // draw a regular label
            renderingContext.drawText(label, labelPoint, {
              fontSize: [LABEL_FONT_SIZE * labelFactor, 'pt'],
              fontFamily: LABEL_FONT_FAMILY,
              color,
              uniformSizeOnZoom: true
            },
            {
              uniformSizeOnZoom: true,
              color: this.selection.contains(canvasElement) ? colorAsTransparent(color, 0.2) : WHITE,
              lineWidth: 3
            });
          }
          if (MathJax && useLaTeX) {
            try {
              // draw a LaTeX label
              const drawImage = (img: HTMLImageElement) => {
                let tempWidth = img.naturalWidth * labelFactor;
                let tempHeight = img.naturalHeight * labelFactor;
                renderingContext.drawImage(img, labelPoint, tempWidth, tempHeight, true)
              }

              // do I have to reload?
              if (canvasElement.svgLabel === undefined) {
                const svg = this.tex2svg(label, color);

                // Erstelle das Bild
                let img = document.createElement('img');
                
                const imageLoadPromise = new Promise(resolve => {
                  img.onload = resolve;
                  img.src = 'data:image/svg+xml;base64,' + btoa('<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n' + svg.outerHTML);
                });
                await imageLoadPromise;
                
                // then draw image
                canvasElement.svgLabel = img as HTMLImageElement | null ?? undefined;
                if (canvasElement.svgLabel) {
                  drawImage(canvasElement.svgLabel);
                }
                else {
                  drawRegularLabel();
                }
              }
              else {
                // then, draw the label:
                drawImage(canvasElement.svgLabel);
              }

            }
            catch {
              // Falls was schiefläuft, dann nochmal neu, aber mit einem regulären Bild
              canvasElement.svgLabel = undefined;
              drawRegularLabel();
            }
          }
          else {
            drawRegularLabel();
          }
        }
      }
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

  // #region fields for dealing with graphs/functions/points
  public get graphs(): Graph[] {
    return this.canvasElements.filter(el => el instanceof Graph) as Graph[];
  }

  public get points(): PointElement[] {
    return this.canvasElements.filter(el => el instanceof PointElement) as PointElement[];
  }

  private readonly funcCache: Cache<string, Func> = new Cache<string, Func>();

  public readonly funcProvider: FuncProvider = (key: string) => {
    // first, read from cache
    let func = this.funcCache.getItem(key);
    if (func) {
      return func;
    }

    // then look up in the graphs
    for (let graph of this.graphs) {
      if (graph.func !== undefined && funcNameWithoutDerivative(key) === funcNameWithoutDerivative(graph.func.name)) {
        let func = graph.func

        // derive to the requested level
        let derivativeNow = countDerivatives(func.name!);
        let requestedDerivative = countDerivatives(key);
        if (derivativeNow > requestedDerivative) {
          continue;
        }
        for (let i = 0; i < requestedDerivative - derivativeNow; i++) {
          func = func.derive();
        }

        // store in cache
        this.funcCache.setItem(key, func);
        return func;
      }
    }
    return undefined;
  }

  public parseAndValidateOperation(str: string, requestVariables: boolean = true, omitVariables: string[] = []): Operation | string {
    // this function tries to parse a string to an operation
    // if 'requestVariables' is true, the function tries to create a new variable
    try {
      // try to parse the function
      let operation = new OperationsParser(str, this.funcProvider).parse();

      try {
        // analyse the operation, it is not just needed for checking for variables, but also for unknown functions
        let analyserRes = inspectOperation(operation);

        // find the variables
        if (requestVariables) {
          for (let variable of analyserRes.variableNames) {
            if (omitVariables.indexOf(variable) === -1) {
              // if the variable is unknown, add it
              this.addVariable(variable);
            }
          }
        }

        // return function --> everything worked out fine
        return operation;
      } catch {
        // return an unknown function error
        return UNKNOWN_FUNCTION;
      }
    } catch {
      // return a parser error
      return PARSER_ERROR;
    }
  }

  public parseAndValidateFunc(str: string, requestVariables: boolean = true): Func | string {
    // this function tries to parse a string to a func
    // if 'requestVariables' is true, the function tries to create a new variable
    try {
      // try to parse the function
      let func = new FuncParser(str, this.funcProvider).parse();

      try {
        // function can't be recursive, otherwise it would end up in an endless loop
        if (isRecursive(func)) {
          return RECURSIVE_ERROR;
        }

        // analyse the function, it is not just needed for checking for variables, but also for unknown functions
        let analyserRes = inspect(func);

        // find the variables
        if (requestVariables) {
          for (let variable of analyserRes.variableNames) {
            // if the variable is unknown, add it
            if (variable !== func.variable && (func.variable !== undefined || variable !== 'x')) {
              this.addVariable(variable);
            }
          }
        }

        // return function --> everything worked out fine
        return func;
      } catch {
        // return an unknown function error
        return UNKNOWN_FUNCTION;
      }
    } catch {
      // return a parser error
      return PARSER_ERROR;
    }
  }

  public get parseAndValidateProviderGraph(): ParseAndValidateProviderGraph {
    return (t: string) => this.parseAndValidateFunc(t)
  }

  public addVariable(variable: string, installReferenceListeners: boolean = true): VariableElement | undefined {
    // adds a new variable if not yet available
    if (!this.hasVariable(variable)) {
      const variableElement = new VariableElement(variable, 0);

      // listen whether the variable is sill in use, if not remove
      let checkForReferenceListener = () => {
        let hasReference = false;
        for (let cElement of this.canvasElements) {
          if (cElement instanceof Graph) {
            hasReference = hasReference || (cElement.func !== undefined && cElement.func.variable !== variableElement.key
              && (cElement.func.variable !== undefined || variableElement.key !== 'x')
              && containsVariable(cElement.func, variableElement.key));
          } else if (cElement instanceof CompiledPointElement) {
            hasReference = hasReference || containsVariable(cElement.xOperation, variableElement.key) || containsVariable(cElement.yOperation, variableElement.key);
          } else if (cElement instanceof CurveElement) {
            hasReference = hasReference || containsVariable(cElement.topOperation, variableElement.key) || containsVariable(cElement.bottomOperation, variableElement.key);
            hasReference = hasReference || (cElement.parameter !== variableElement.key && containsVariable(cElement.xOperation, variableElement.key));
            hasReference = hasReference || (cElement.parameter !== variableElement.key && containsVariable(cElement.yOperation, variableElement.key));
          }

          if (hasReference) {
            return;
          }
        }
        if (!hasReference) {
          this.onCanvasElementChanged.removeListener(checkForReferenceListener);
          this.removeCanvasElements(variableElement);
        }
      }

      // add the variableElement
      this.addCanvasElements(variableElement);
      if (installReferenceListeners) this.onCanvasElementChanged.addListener(checkForReferenceListener);

      return variableElement;
    }

    return undefined;
  }

  public getNewColor(): Color {
    return getNew(colors,
      this.canvasElements.map(c => c.color),
      (c1, c2) => {
        return areEqualColors(c1, c2)
      })
  }

  public getVariables(): any {
    // collect the data about the variables
    let res: any = {};
    for (let canvasElement of this.canvasElements) {
      if (canvasElement instanceof VariableElement) {
        res[canvasElement.key] = canvasElement.value;
      }
    }
    return res;
  }

  public hasVariable(key: string): boolean {
    // Loop through the canvasElements and search for variableElements.
    for (let canvasElement of this.canvasElements) {
      if (canvasElement instanceof VariableElement && canvasElement.key === key) {
        return true;
      }
    }
    return false;
  }

  // #endregion

  // #region further fields
  private getLabelPoint(canvasElement: ProkyonCanvasElement, ctx: AbstractRenderingContext): Point | undefined {
    const labelPoint = canvasElement.getPositionForLabel(ctx);
    if (labelPoint !== undefined && canvasElement.configuration.label !== undefined && canvasElement.configuration.showLabel) {
      if (ctx.config?.drawNewLabels) {
        const zoom = ctx.zoom;
        const realTranslate: Point = {
          x: canvasElement.labelTranslate.x / zoom,
          y: canvasElement.labelTranslate.y / zoom
        }

        return {
          x: labelPoint.x + realTranslate.x,
          y: labelPoint.y + realTranslate.y
        };
      }
      else {
        const range = ctx.range;
        const realTranslate = {
          x: Math.abs(range.width) * canvasElement.labelTranslate.x,
          y: Math.abs(range.height) * canvasElement.labelTranslate.y
        }

        return {
          x: labelPoint.x + realTranslate.x,
          y: labelPoint.y + realTranslate.y
        };
      }
    }

    return undefined;
  }

  public getSelection(p: Point, filter: (cE: ProkyonCanvasElement) => boolean = () => true, omitInvisible: boolean = true): ProkyonCanvasElement | undefined {
    let ctx = this.renderingContext;
    let minDist: number | undefined = undefined;
    let minCanvasElement: ProkyonCanvasElement | undefined;

    const getDistToLabel = (canvasElement: ProkyonCanvasElement): number | undefined => {
      const labelPoint = this.getLabelPoint(canvasElement, ctx);
      if (canvasElement.configuration.label === undefined || labelPoint === undefined) {
        return undefined;
      }
      const labelFactor = canvasElement.configuration.labelSizeFactor ?? 1;

      let fieldWidth = 0;
      let fieldHeight = 0;
      if (canvasElement.configuration.dontUseLaTeX || canvasElement.svgLabel === undefined) {
        // Bei einem regulären Label
        const measureText = ctx.measureText(canvasElement.configuration.label, {
          fontSize: [ LABEL_FONT_SIZE, 'pt' ],
          fontFamily: LABEL_FONT_FAMILY,
          color: BLACK,
          uniformSizeOnZoom: true
        });
        fieldWidth = measureText.width / ctx.zoom * labelFactor;
        fieldHeight = LABEL_FONT_SIZE / ctx.zoom * labelFactor;
      }
      else {
        // ansonsten wäre es ein LaTeX Label
        fieldWidth = canvasElement.svgLabel.width / ctx.zoom * labelFactor;
        fieldHeight = -canvasElement.svgLabel.height / ctx.zoom * labelFactor; // Weil sich das Rechteck ja in negative y-Richtung streckt, bedarf es ein Minus
      }

      return getDistanceToRect(p, {
        ...labelPoint,
        width: fieldWidth,
        height: fieldHeight
      })
    }

    // find out the element with the minimal distance
    for (let canvasElement of this.canvasElements) {
      const dist = getMinUndef(canvasElement.getDistance(p, ctx), getDistToLabel(canvasElement));
      if (dist !== undefined && dist !== null && isFinite(dist) && filter(canvasElement) && (canvasElement.visible || !omitInvisible)) {
        let closer = minDist === undefined;
        closer = closer || dist <= minDist!;
        if (closer) {
          minDist = dist;
          minCanvasElement = canvasElement;
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

  public setSelection(p: Point, empty: boolean = true, filter: (cE: ProkyonCanvasElement) => boolean = () => true) {
    const minCanvasElement = this.getSelection(p, filter);

    // set the selection, or alternate the element, e.g. when ctrl is pressed
    if (empty) {
      this.selection.set(minCanvasElement);
    } else {
      this.selection.alternate(minCanvasElement);
    }
  }

  // #endregion

  public serialize(): Serialized {
    return serialize(this);
  }

  public loadFrom(serialized: Serialized): void {
    loadFrom(this, serialized);
  }

}
