import WhiteboardCanvasIdElement from "src/app/whiteboard/global/classes/abstract/whiteboardCanvasIdElement";
import { Color } from "../../interfaces/color";
import { getResolution, Transformations } from "../../interfaces/transformations";
import { CanvasIdElement } from "../abstract/canvasIdElement";
import { CanvasConfig } from "./abstractRenderingContext";
import { RenderingContext } from "./renderingContext";
import { LOWEST_ELEMENT_LAYER } from "src/app/whiteboard/services/page";

export default class MultiLayerRenderingContext extends RenderingContext {
    constructor (public readonly ctxs: CanvasRenderingContext2D[],
                public activeCanvas: number,
                transformations: Transformations,
                selection?: CanvasIdElement<any>[],
                canvasConfig?: CanvasConfig,
                getRightColor: (c: Color, config: any) => Color = (c: Color) => c,
                _variables?: any,
                config?: any,
                getStepsForSmoothPathRendering: () => number = () => 1) {
        super(ctxs[0], transformations, selection, canvasConfig, getRightColor, _variables, config, getStepsForSmoothPathRendering);
    }

    protected override get ctx(): CanvasRenderingContext2D {
        return this.ctxs[this.activeCanvas];
    }

    public loginElementForLayer(element: WhiteboardCanvasIdElement): void {
        this.activeCanvas = LOWEST_ELEMENT_LAYER + element.level;
    }

    public override requestForeignDrawing(element: WhiteboardCanvasIdElement, drawing: () => void): boolean {
        const activeCanvas = this.activeCanvas;
        this.loginElementForLayer(element)
        drawing();
        this.activeCanvas = activeCanvas;
        return true;
    }

    public override get resolutionFactor(): number {
        return getResolution(this.transformations.resolutionFactor, this.activeCanvas);
    }
}