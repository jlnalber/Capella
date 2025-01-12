import { CanvasIdElement } from "src/app/global/classes/abstract/canvasIdElement";

export default abstract class WhiteboardCanvasIdElement extends CanvasIdElement<WhiteboardCanvasIdElement> {
    constructor(public readonly level: number) {
        super();
    }
}