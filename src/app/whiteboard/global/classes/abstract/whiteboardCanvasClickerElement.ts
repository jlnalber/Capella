import { ICanvasClickerElement } from "src/app/global/classes/abstract/canvasClickerElement";
import WhiteboardCanvasIdElement from "./whiteboardCanvasIdElement";
import AbstractRenderingContext from "src/app/global/classes/renderingContext/abstractRenderingContext";
import { Point } from "src/app/global/interfaces/point";

export default abstract class WhiteboardCanvasClickerElement extends WhiteboardCanvasIdElement implements ICanvasClickerElement {
    
    public getDistance(p: Point, ctx: AbstractRenderingContext): number | undefined {
        return undefined;
    }
    
}