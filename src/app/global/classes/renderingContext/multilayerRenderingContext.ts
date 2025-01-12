import { Color } from "../../interfaces/color";
import { Transformations } from "../../interfaces/transformations";
import { CanvasIdElement } from "../abstract/canvasIdElement";
import { CanvasConfig } from "./abstractRenderingContext";
import { RenderingContext } from "./renderingContext";

export default class MultiLayerRenderingContext extends RenderingContext {
    constructor (public readonly ctxs: CanvasRenderingContext2D[],
                public activeCanvas: number,
                transformations: Transformations,
                selection?: CanvasIdElement<any>[],
                canvasConfig?: CanvasConfig,
                getRightColor: (c: Color, config: any) => Color = (c: Color) => c,
                _variables?: any,
                config?: any) {
        super(ctxs[0], transformations, selection, canvasConfig, getRightColor, _variables, config);
    }

    protected override get ctx(): CanvasRenderingContext2D {
        return this.ctxs[this.activeCanvas];
    }
}