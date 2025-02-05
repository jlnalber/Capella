import { PenStyle } from './../../interfaces/penStyle';
import AbstractRenderingContext from "../../../../global/classes/renderingContext/abstractRenderingContext";
import { WhiteboardSettings } from 'src/app/whiteboard/services/whiteboardSettings';
import { getStrokePointPathFromPenPointPath, PenPoint } from 'src/app/global/interfaces/penPoint';
import WhiteboardCanvasMinorChangeElement from '../abstract/whiteboardCanvasMinorChangeElement';

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
        this.onMinorChange.emit([this, renderingContext, p]);
        this.onChange.emit(this); // TODO: entfernen
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
        const changeThickness = this._penStyle.useSizes && !this.settings.getGlobalConfig().neverUseSizesForPen;
        
        ctx.drawSmoothPath(this._points, changeThickness, this._penStyle.strokeStyle, this._penStyle.objectStyle);
    }

}