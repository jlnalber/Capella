import { Color } from "../../interfaces/color";
import { Point } from "../../interfaces/point";
import { CanvasTransformableElement } from "../abstract/canvasTransformableElement";
import AbstractRenderingContext from "../abstractRenderingContext";

type PenPoint = Point & {
    size: number
}

export default class PenElement extends CanvasTransformableElement {

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
        ctx.drawBezierPath(this._points, this._lineWidth * ctx.zoom, this._color);
    }

}