import { CanvasClickerElement } from "../../global/classes/abstract/canvasClickerElement";
import { CanvasIdElement } from "../../global/classes/abstract/canvasIdElement";
import { RenderingContext } from "../../global/classes/renderingContext";
import { Point, Vector } from "src/app/global/interfaces/point";
import { Transformations } from "src/app/global/interfaces/transformations";
import { WhiteboardService } from "./whiteboard.service";
import Selection from "../../global/essentials/selection";
import { Event } from "../../global/essentials/event";
import { Rect } from "src/app/global/interfaces/rect";
import { Color, getColorAsRgbaFunction, TRANSPARENT, WHITE } from "src/app/global/interfaces/color";
import { Size } from "src/app/global/interfaces/size";
import { DINA4 } from "../../global/styles/formats";
import TextBox from "../global/classes/textBox";
import { sizeToRect } from "../../global/essentials/utils";
import FillStyle from "src/app/global/interfaces/canvasStyles/fillStyle";

export const PX_PER_MM = 5.2;

export const BACKGROUND_COLOR: Color = {
    r: 236,
    g: 237,
    b: 240
}

export default class Page {

    private _canvasElements: CanvasIdElement[] = [];

    public addCanvasElements(...canvasElements: CanvasIdElement[]): void {
        for (let canvasElement of canvasElements) {
            this._canvasElements.push(canvasElement);
            canvasElement.onChange.addListener(this.canvasElementOnChangeListener);
            canvasElement.onAdd.emit(this);
        }
        this.onCanvasElementChanged.emit(canvasElements);
    }

    public removeCanvasElements(...canvasElements: CanvasIdElement[]): boolean {
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

    public get canvasElements(): CanvasIdElement[] {
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

    public readonly selection: Selection<CanvasIdElement> = new Selection<CanvasIdElement>();

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
    public readonly onCanvasElementChanged: Event<any> = new Event<any>();
    // public readonly onMetaDrawersChanged: Event<CanvasDrawer> = new Event<CanvasDrawer>();
    public readonly onTransformationsChanged: Event<number | Transformations> = new Event<number | Transformations>();
    // public readonly onCanvasConfigChanged: Event<CanvasConfig> = new Event<CanvasConfig>();
    public readonly onBeforeRedraw: Event<undefined> = new Event<undefined>();
    public readonly onBeforeElementsDraw: Event<RenderingContext> = new Event<RenderingContext>();
    public readonly onAfterRedraw: Event<undefined> = new Event<undefined>();
    public readonly onFormatChanged: Event<Size | undefined> = new Event<Size | undefined>();
    public readonly onTextChanged: Event<undefined> = new Event<undefined>();

    private canvasElementOnChangeListener = (val: any) => {
        this.onCanvasElementChanged.emit(val);
    }
    private redrawListener = () => {
        this.redraw();
    }

    constructor(private readonly whiteboardService: WhiteboardService) {
        // first, add listeners to whiteboard
        this.onCanvasElementChanged.addListener((a: any | undefined) => {
            this.whiteboardService.onCanvasElementChanged.emit(a);
        })
        this.onTransformationsChanged.addListener((a: number | Transformations | undefined) => {
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
        this.onCanvasElementChanged.addListener(this.redrawListener);
        this.onTransformationsChanged.addListener(this.redrawListener);
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
    public get renderingContext(): RenderingContext {
        return this.getRenderingContextFor(this.whiteboardService.canvas?.ctx as CanvasRenderingContext2D, this._transformations);
    }

    public getRenderingContextFor(ctx: CanvasRenderingContext2D, transformations: Transformations): RenderingContext {
        return new RenderingContext(ctx, transformations, this.selection.toArray());
    }

    public redraw(): void {
        if (this.whiteboardService.canvas && this.whiteboardService.canvas.canvasEl && this.whiteboardService.canvas.wrapperEl && this.whiteboardService.canvas.ctx) {
            this.onBeforeRedraw.emit();

            // draw to canvas
            this.drawToCanvas(this.whiteboardService.canvas.canvasEl, this.whiteboardService.canvas.wrapperEl.getBoundingClientRect(), this._transformations);

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

    public drawToCanvas(canvas: HTMLCanvasElement, boundingRect: Rect, transformations: Transformations): void {
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
        const renderingContext = this.getRenderingContextFor(ctx, transformations);

        // draw the text
        this.text.draw(renderingContext);

        this.onBeforeElementsDraw.emit(renderingContext);
        /*for (let metaDrawer of this._metaDrawers) {
          metaDrawer.draw(renderingContext);
        }*/

        let cs: CanvasIdElement[] = this._canvasElements;

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

        // draw the format:
        const format = this.getFormatInPX();
        if (format) {
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
                renderingContext.drawRect(rectLeft, true, fillStyle)
            }
            if (rectBottom.height > 0) {
                renderingContext.drawRect(rectBottom, true, fillStyle)
            }
            if (rectTop.height > 0) {
                renderingContext.drawRect(rectTop, true, fillStyle)
            }
            if (rectRight.width > 0) {
                renderingContext.drawRect(rectRight, true, fillStyle)
            }

            renderingContext.drawRect({
                x: 0,
                y: 0,
                height: -format.height,
                width: format.width
            }, true, {
                color: TRANSPARENT
            }, {
                color: {
                    r: 200,
                    g: 200,
                    b: 200
                },
                lineWidth: 1
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

}