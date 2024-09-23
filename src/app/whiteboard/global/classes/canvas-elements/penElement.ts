import { Color } from "src/app/global/interfaces/color";
import { Point } from "src/app/global/interfaces/point";
import { WhiteboardCanvasTransformableElement } from "../abstract/whiteboardCanvasTransformableElement";
import AbstractRenderingContext from "../../../../global/classes/abstractRenderingContext";

type PenPoint = Point & {
    size: number
}

export default class PenElement extends WhiteboardCanvasTransformableElement {

    private _color: Color;
    private _lineWidth: number;

    public get color(): Color {
        return this._color;
    }

    public set color(value: Color) {
        this._color = value;
        this.onChange.emit(value);
    }

    public get lineWidth(): number {
        return this._lineWidth;
    }

    public set lineWidth(value: number) {
        this._lineWidth = value;
        this.onChange.emit(value);
    }

    private _points: PenPoint[] = [];

    constructor(color: Color, lineWidth: number) {
        super();
        this._color = color;
        this._lineWidth = lineWidth;
    }

    public addPoint(p: PenPoint): void {
        this._points.push(p);
        this.onChange.emit(p);
    }

    public override draw(ctx: AbstractRenderingContext): void {
        ctx.drawQuadraticPath(this._points, {
            lineWidth: this._lineWidth,
            color: this._color,
            lineCap: 'round'
        });
    }

}