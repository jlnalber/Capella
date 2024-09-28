import { PenStyle } from './../../interfaces/penStyle';
import { Point } from "src/app/global/interfaces/point";
import { WhiteboardCanvasTransformableElement } from "../abstract/whiteboardCanvasTransformableElement";
import AbstractRenderingContext from "../../../../global/classes/renderingContext/abstractRenderingContext";
import { WhiteboardSettings } from 'src/app/whiteboard/services/whiteboardSettings';

export type PenPoint = Point & {
    size: number
}

export default class PenElement extends WhiteboardCanvasTransformableElement {

    private _penStyle: PenStyle;

    public get penStyle(): PenStyle {
        return this._penStyle;
    }

    public set penStyle(value: PenStyle) {
        this._penStyle = value;
        this.onChange.emit(value);
    }

    private _points: PenPoint[] = [];

    constructor(settings: WhiteboardSettings, penStyle: PenStyle) {
        super(settings);
        this._penStyle = penStyle;
    }

    public addPoint(p: PenPoint): void {
        this._points.push(p);
        this.onChange.emit(p);
    }

    public override draw(ctx: AbstractRenderingContext): void {
        if (this._penStyle.useSizes && !this.settings.getGlobalConfig().neverUseSizesForPen) {
            ctx.drawQuadraticPath(this._points, this._penStyle.strokeStyle, this._penStyle.objectStyle);
        }
        else {
            ctx.drawContinousQuadraticPath(this._points, this._penStyle.strokeStyle, undefined, this._penStyle.objectStyle);
        }
    }

}