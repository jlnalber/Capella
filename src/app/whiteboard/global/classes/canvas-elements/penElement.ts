import { PenStyle } from './../../interfaces/penStyle';
import AbstractRenderingContext from "../../../../global/classes/renderingContext/abstractRenderingContext";
import { WhiteboardSettings } from 'src/app/whiteboard/services/whiteboardSettings';
import { getStrokePointMiddle, PenPoint, StrokePoint, getStrokePointFromPenPoint, getAverageFromLastPoints } from 'src/app/global/interfaces/penPoint';
import WhiteboardCanvasMinorChangeElement from '../abstract/whiteboardCanvasMinorChangeElement';
import { getThicknessSettings } from 'src/app/global/classes/renderingContext/renderingUtils';

export default class PenElement extends WhiteboardCanvasMinorChangeElement<PenPoint> {

    private _penStyle: PenStyle;

    public get penStyle(): PenStyle {
        return this._penStyle;
    }

    public set penStyle(value: PenStyle) {
        this._penStyle = value;
        this.onChange.emit(this);
    }

    private _points: PenPoint[] = [];

    constructor(settings: WhiteboardSettings, penStyle: PenStyle) {
        super(settings, 2); // Drawings in level 2
        this._penStyle = penStyle;
    }

    public addPoint(p: PenPoint, renderingContext: AbstractRenderingContext): void {
        if (this._points.length !== 0 && this._points[this._points.length - 1].v === undefined) {
            if (this._points[this._points.length - 1].v === undefined) {
                this._points[this._points.length - 1].v = p.v;
            }
            if (p.ax === undefined) {
                p.ax = this._points[this._points.length - 1].ax;
            }
            if (p.ay === undefined) {
                p.ay = this._points[this._points.length - 1].ay;
            }
        }
        this._points.push(p);
        renderingContext.requestForeignDrawing(this, () => {
            this.drawNextPoint(renderingContext);
        });
        this.onMinorChange.emit([this, renderingContext, p]);
        // this.onChange.emit(this); // TODO: entfernen
    }

    private drawNextPoint(ctx: AbstractRenderingContext): void {
        if (this._points.length > 2) {
            // try to replicate the rendering in one stroke as precisely as possible
            let lastP: StrokePoint;
            if (this._points.length > 3) {
                // for the end of the stroke
                lastP = getStrokePointMiddle(this._points[this._points.length - 3], this._points[this._points.length - 2], this._points, 3);
            }
            else {
                // for the beginning of the stroke
                lastP = getStrokePointFromPenPoint(this._points[0]);
            }

            // get the other points for the bezier curve
            const thisP = getStrokePointMiddle(this._points[this._points.length - 2], this._points[this._points.length - 1], this._points, 2);
            const control = getStrokePointFromPenPoint(this._points[this._points.length - 2], getAverageFromLastPoints(this._points, 2));

            ctx.drawSmoothPathSegment({
                from: lastP,
                control: control,
                to: thisP
            }, getThicknessSettings(lastP, control, this.penStyle.strokeStyle.lineWidth, this.changeThickness), this._penStyle.strokeStyle, this._penStyle.objectStyle);
        }
    }

    public finish(): void {
        this.onChange.emit(this);
    }

    public getLastPoint(): PenPoint | undefined {
        if (this._points.length === 0) {
            return undefined;
        }
        return this._points[this._points.length - 1];
    }

    public override draw(ctx: AbstractRenderingContext): void {
        ctx.drawSmoothPath(this._points, this.changeThickness, this._penStyle.strokeStyle, this._penStyle.objectStyle);
    }

    private get changeThickness(): boolean | undefined {
        return this._penStyle.useSizes && !this.settings.getGlobalConfig().neverUseSizesForPen;
    }

}
