import { PenStyle } from './../../interfaces/penStyle';
import { Point } from "src/app/global/interfaces/point";
import { WhiteboardCanvasTransformableElement } from "../abstract/whiteboardCanvasTransformableElement";
import AbstractRenderingContext from "../../../../global/classes/abstractRenderingContext";

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

    constructor(penStyle: PenStyle) {
        super();
        this._penStyle = penStyle;
    }

    public addPoint(p: PenPoint): void {
        this._points.push(p);
        this.onChange.emit(p);
    }

    public override draw(ctx: AbstractRenderingContext): void {
        ctx.drawQuadraticPath(this._points, this._penStyle.strokeStyle, this._penStyle.objectStyle);
    }

}