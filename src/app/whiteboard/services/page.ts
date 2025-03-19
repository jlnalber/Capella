import { CanvasAndCTX } from './../../global/canvas/abstractCanvas';
import { RenderingContext } from "../../global/classes/renderingContext/renderingContext";
import { Point, Vector } from "src/app/global/interfaces/point";
import { DEFAULT_RESOLUTIONFACTOR, getResolution, Resolution, Transformations } from "src/app/global/interfaces/transformations";
import { TemporaryChange, WhiteboardService } from "./whiteboard.service";
import Selection from "../../global/essentials/selection";
import { Event } from "../../global/essentials/event";
import { Rect } from "src/app/global/interfaces/rect";
import { Color, getColorAsRgbaFunction, TRANSPARENT, WHITE } from "src/app/global/interfaces/color";
import { Size } from "src/app/global/interfaces/size";
import { DINA4 } from "../../global/styles/formats";
import TextBox from "../global/classes/textBox";
import { sizeToRect } from "../../global/essentials/utils";
import FillStyle from "src/app/global/interfaces/canvasStyles/fillStyle";
import WhiteboardCanvasClickerElement from '../global/classes/abstract/whiteboardCanvasClickerElement';
import WhiteboardCanvasIdElement from '../global/classes/abstract/whiteboardCanvasIdElement';
import MultiLayerRenderingContext from 'src/app/global/classes/renderingContext/multilayerRenderingContext';
import StrictEvent from 'src/app/global/essentials/strictEvent';

export const PX_PER_MM = 5.2;

export const LOWEST_ELEMENT_LAYER = 1;

export const BACKGROUND_COLOR: Color = {
    r: 240,
    g: 237,
    b: 231
}

export default class Page {

    private _canvasElements: WhiteboardCanvasIdElement[] = [];
    
    public addCanvasElements(silent: boolean, ...canvasElements: WhiteboardCanvasIdElement[]): void {
        // silent means no triggering of change events
        for (let canvasElement of canvasElements) {
            this._canvasElements.push(canvasElement);
            if (!silent) {
                canvasElement.onChange.addListener(this.canvasElementOnChangeListener);
            }
            canvasElement.onAdd.emit(this);
        }
        if (!silent) {
            this.onCanvasElementsChanged.emit(canvasElements);
        }
    }

    public removeCanvasElements(...canvasElements: WhiteboardCanvasIdElement[]): boolean {
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
        this.onCanvasElementsChanged.emit(canvasElements);
        return worked;
    }

    public emptyCanvasElements(): void {
        for (let canvasElement of this._canvasElements) {
            canvasElement.onChange.removeListener(this.canvasElementOnChangeListener);
            canvasElement.onRemove.emit(this);
        }
        const copy = this._canvasElements;
        this._canvasElements = [];
        this.onCanvasElementsChanged.emit(copy);
    }

    public get canvasElements(): WhiteboardCanvasIdElement[] {
        return this._canvasElements.slice();
    }

    private readonly _transformations: Transformations = {
        translateX: 0,
        translateY: 0,
        zoom: 1
    };

    public setTranslate(x: number, y: number): void {
        this._transformations.translateX = x;
        this._transformations.translateY = y;
        this.onTransformationsChanged.emit(this._transformations);
    }

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
            zoom: this.zoom,
        }
    }

    public set transformations(value: Transformations) {
        this._transformations.zoom = value.zoom;
        this._transformations.translateX = value.translateX;
        this._transformations.translateY = value.translateY;
        this.onTransformationsChanged.emit(value);
    }

    public requestTemporaryResolutionChange(): TemporaryChange<Resolution | undefined> {
        const resFactor = this.transformations.resolutionFactor;
        return {
            setTemporarily: (factor?: Resolution) => {
                this._transformations.resolutionFactor = factor;
                // console.log(factor, activePage.transformations.resolutionFactor);
            },
            reset: () => {
                this._transformations.resolutionFactor = resFactor;
                this.onTransformationsChanged.emit(resFactor);
            }
        }
    }

    private _overriddenStepsThicknessRendering: number | undefined;
    public get stepsThicknessRendering(): number {
        return this._overriddenStepsThicknessRendering ?? this.whiteboardService.settings.getStepsThicknessRendering();
    }

    public requestTemporaryStepsThicknessRenderingChange(): TemporaryChange<number> {
        return {
            setTemporarily: (steps?: number) => {
                this._overriddenStepsThicknessRendering = steps;
            },
            reset: () => {
                this._overriddenStepsThicknessRendering = undefined;
                this.onTransformationsChanged.emit();
            }
        }
    }

    public readonly selection: Selection<WhiteboardCanvasIdElement> = new Selection<WhiteboardCanvasIdElement>();

    private _format: Size | undefined = DINA4;
    
    public set format(value: Size | undefined) {
        this._format = value;
        this.onFormatChanged.emit(value);
    }

    public get format(): Size | undefined {
        if (this._format) {
            return { ...this._format };
        }
        return undefined;
    }

    public getFormatInPX(): Size | undefined {
        const format = this.format;
        if (format) {
            format.width *= PX_PER_MM;
            format.height *= PX_PER_MM;
            return format;
        }
        return undefined;
    }

    private _text: TextBox = new TextBox(sizeToRect(this._format));

    public get text(): TextBox {
        return this._text;
    }

    public set text(value: TextBox) {
        this._text = value;
        this.onTextChanged.emit();
    }

    // Events
    // public readonly onBackgroundColorChanged: Event<Color> = new Event<Color>();
    public readonly onCanvasElementsChanged: StrictEvent<WhiteboardCanvasIdElement[]> = new StrictEvent<WhiteboardCanvasIdElement[]>();
    // public readonly onMetaDrawersChanged: Event<CanvasDrawer> = new Event<CanvasDrawer>();
    public readonly onTransformationsChanged: Event<Resolution | Transformations> = new Event<Resolution | Transformations>();
    // public readonly onCanvasConfigChanged: Event<CanvasConfig> = new Event<CanvasConfig>();
    public readonly onBeforeRedraw: Event<undefined> = new Event<undefined>();
    public readonly onBeforeElementsDraw: Event<RenderingContext> = new Event<RenderingContext>();
    public readonly onAfterRedraw: Event<undefined> = new Event<undefined>();
    public readonly onFormatChanged: Event<Size | undefined> = new Event<Size | undefined>();
    public readonly onTextChanged: Event<undefined> = new Event<undefined>();

    private canvasElementOnChangeListener = (val: WhiteboardCanvasIdElement) => {
        this.onCanvasElementsChanged.emit([val]);
    }
    private redrawListener = () => {
        this.redraw();
    }

    constructor(private readonly whiteboardService: WhiteboardService) {
        // first, add listeners to whiteboard
        this.onTransformationsChanged.addListener((a: Resolution | Transformations | undefined) => {
            this.whiteboardService.onTransformationsChanged.emit(a);
        })
        this.onBeforeRedraw.addListener(() => {
            this.whiteboardService.onBeforeRedraw.emit();
        })
        this.onBeforeElementsDraw.addListener((a: RenderingContext | undefined) => {
            this.whiteboardService.onBeforeElementsDraw.emit(a);
        })
        this.onAfterRedraw.addListener(() => {
            this.whiteboardService.onAfterRedraw.emit();
        })

        // then, add listeners to events
        //this.onBackgroundColorChanged.addListener(this.redrawListener);
        this.onCanvasElementsChanged.addListener((cs: WhiteboardCanvasIdElement[]) => {
            const levels: number[] = [];
            for (let c of cs) {
                if (levels.indexOf(c.level) === -1) {
                    levels.push(c.level);
                }
            }
            this.redrawLevels(levels);
        });
        //this.onTransformationsChanged.addListener(this.redrawListener);
        //this.onMetaDrawersChanged.addListener(this.redrawListener);
        //this.onCanvasConfigChanged.addListener(this.redrawListener);
        this.selection.onSelectionChanged.addListener(this.redrawListener);
        this.onFormatChanged.addListener(this.redrawListener);
        this.onFormatChanged.addListener(() => {
            this.center();
            this.text.setRect(sizeToRect(this.format), this.renderingContext);
        })
        this.onTextChanged.addListener(this.redrawListener);
        this.text.onChange.addListener(() => {
            this.onTextChanged.emit();
        })
    }


    // #region fields for rendering
    public get renderingContext(): MultiLayerRenderingContext {
        return this.getRenderingContextFor(this.whiteboardService.canvas?.canvasAndCTX as CanvasAndCTX[], this._transformations);
    }

    public getRenderingContextFor(canvasAndCTX: CanvasAndCTX[], transformations: Transformations): MultiLayerRenderingContext {
        return new MultiLayerRenderingContext(canvasAndCTX.map(i => i.ctx),
                                              0, 
                                              transformations, 
                                              this.selection.toArray(), 
                                              this.whiteboardService.settings.getCanvasConfig(),
                                              undefined, undefined, undefined,
                                              () => this.stepsThicknessRendering);
    }

    public async redraw(): Promise<void> {
        if (this.whiteboardService.canvas && this.whiteboardService.canvas.canvasAndCTX && this.whiteboardService.canvas.wrapperEl) {
            this.onBeforeRedraw.emit();

            // draw to canvas
            await this.drawToCanvas(this.whiteboardService.canvas.canvasAndCTX, this.whiteboardService.canvas.wrapperEl.getBoundingClientRect(), this._transformations);

            this.onAfterRedraw.emit();
        }
    }

    public center(): void {
        const format = this.getFormatInPX();
        if (format) {
            const renderingContext = this.renderingContext;
            const dy = -(-renderingContext.range.height * this.zoom - format.height) / 2;
            const dx = (renderingContext.range.width * this.zoom - format.width) / 2;
            const t: Transformations = {
                zoom: 1,
                translateY: Math.min(0, dy),
                translateX: Math.max(0, dx)
            }
            this.transformations = t;
        }
    }

    /*public tex2svg(tex: string, color: Color = BLACK): SVGElement {
      const svg = MathJax.tex2svg(tex).firstElementChild as SVGElement;
      svg.setAttributeNS(null, 'color', getColorAsRgbaFunction(color))
      return svg;
    }*/

    public redrawLevels(levels: number[]): void {
        if (this.whiteboardService.canvas && this.whiteboardService.canvas.canvasAndCTX && this.whiteboardService.canvas.wrapperEl) {
            this.onBeforeRedraw.emit();

            const canvasAndCTXs: CanvasAndCTX[] = this.whiteboardService.canvas.canvasAndCTX;
            const boundingRect = this.whiteboardService.canvas.wrapperEl.getBoundingClientRect();
            const renderingContext = this.getRenderingContextFor(canvasAndCTXs, this._transformations);
            const resolution = this._transformations.resolutionFactor ?? DEFAULT_RESOLUTIONFACTOR;
            
            // draw to canvas
            for (let level of levels) {
                const cac = canvasAndCTXs[level + LOWEST_ELEMENT_LAYER];
                this._redrawLevelWithProperties(level, renderingContext, cac, resolution, boundingRect);
            }

            this.onAfterRedraw.emit();
        }
    }

    private _redrawLevelWithProperties(level: number, renderingContext: MultiLayerRenderingContext, cac: CanvasAndCTX, resolution: Resolution, boundingRect: Rect): void {
        // resize canvas and clear
        const rightLevel = level + LOWEST_ELEMENT_LAYER;
        const res = getResolution(resolution, rightLevel);
        this._resizeAndClearLevel(cac, res, boundingRect);

        renderingContext.activeCanvas = rightLevel;

        if (level === 1) {
            // draw the text when level is right
            this.text.draw(renderingContext);
        }

        let cs: WhiteboardCanvasIdElement[] = this._canvasElements.filter(cE => cE.level === level);

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

    private _resizeAndClearLevel(cac: CanvasAndCTX, resolution: number, boundingRect: Rect): void {
        // resize canvas and clear
        cac.canvas.width = boundingRect.width * resolution;
        cac.canvas.height = boundingRect.height * resolution;
        cac.ctx.clearRect(0, 0, cac.canvas.width, cac.canvas.height);
    }

    public drawToCanvas(canvasAndCTX: CanvasAndCTX[], boundingRect: Rect, transformations: Transformations): void {
        
        const resolution = transformations.resolutionFactor ?? DEFAULT_RESOLUTIONFACTOR;

        // resize and clear canvas first
        for (let i = 0; i < canvasAndCTX.length; i++) {
            const res = getResolution(resolution, i);
            this._resizeAndClearLevel(canvasAndCTX[i], res, boundingRect);
        }

        canvasAndCTX[0].ctx.fillStyle = getColorAsRgbaFunction(WHITE);
        canvasAndCTX[0].ctx.fillRect(0, 0, canvasAndCTX[0].canvas.width, canvasAndCTX[0].canvas.height);
        
        // then: draw the elements (first metaDrawers, then canvasElements)
        const renderingContext = this.getRenderingContextFor(canvasAndCTX, transformations);

        this.onBeforeElementsDraw.emit(renderingContext);
        /*for (let metaDrawer of this._metaDrawers) {
          metaDrawer.draw(renderingContext);
        }*/

        for (let i = 0; i < 3; i++) {

            this._redrawLevelWithProperties(i, renderingContext, canvasAndCTX[i + LOWEST_ELEMENT_LAYER], resolution, boundingRect);

        }

        // draw the format:
        const format = this.getFormatInPX();
        if (format) {
            renderingContext.activeCanvas = 4;
            const range = renderingContext.range;
            const rectLeft = {
                y: range.y,
                x: range.x,
                height: range.height,
                width: -range.x
            }
            const rectBottom = {
                x: range.x,
                y: range.y + range.height,
                height: -range.height - range.y - format.height,
                width: range.width
            }
            const rectTop = {
                x: range.x,
                y: 0,
                height: range.y,
                width: range.width
            }
            const rectRight = {
                y: range.y,
                x: format.width,
                height: range.height,
                width: range.width + range.x - format.width
            }
            
            const fillStyle: FillStyle = {
                color: BACKGROUND_COLOR
            }
            if (rectLeft.width > 0) {
                renderingContext.drawRect(rectLeft, false, fillStyle)
            }
            if (rectBottom.height > 0) {
                renderingContext.drawRect(rectBottom, false, fillStyle)
            }
            if (rectTop.height > 0) {
                renderingContext.drawRect(rectTop, false, fillStyle)
            }
            if (rectRight.width > 0) {
                renderingContext.drawRect(rectRight, false, fillStyle)
            }

            renderingContext.drawRect({
                x: 0,
                y: 0,
                height: -format.height,
                width: format.width
            }, false, {
                color: TRANSPARENT
            }, {
                color: {
                    r: 200,
                    g: 200,
                    b: 200
                },
                lineWidth: 1,
                uniformSizeOnZoom: true
            })
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

    public getSelection(p: Point, filter: (cE: WhiteboardCanvasClickerElement) => boolean = () => true): WhiteboardCanvasClickerElement | undefined {
        let ctx = this.renderingContext;
        let minDist: number | undefined = undefined;
        let minCanvasElement: WhiteboardCanvasClickerElement | undefined;

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
            if (canvasElement instanceof WhiteboardCanvasClickerElement) {
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

    public setSelection(p: Point, empty: boolean = true, filter: (cE: WhiteboardCanvasClickerElement) => boolean = () => true) {
        const minCanvasElement = this.getSelection(p, filter);

        // set the selection, or alternate the element, e.g. when ctrl is pressed
        if (empty) {
            this.selection.set(minCanvasElement);
        } else {
            this.selection.alternate(minCanvasElement);
        }
    }

    // #endregion

}