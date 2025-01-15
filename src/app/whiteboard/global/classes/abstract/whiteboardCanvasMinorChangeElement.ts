import StrictEvent from "src/app/global/essentials/strictEvent";
import { WhiteboardCanvasTransformableElement } from "./whiteboardCanvasTransformableElement";
import AbstractRenderingContext from "src/app/global/classes/renderingContext/abstractRenderingContext";

export default abstract class WhiteboardCanvasMinorChangeElement<T> extends WhiteboardCanvasTransformableElement {
    public readonly onMinorChange: StrictEvent<[WhiteboardCanvasMinorChangeElement<T>, AbstractRenderingContext, T]> = new StrictEvent<[WhiteboardCanvasMinorChangeElement<T>, AbstractRenderingContext, T]>();
}