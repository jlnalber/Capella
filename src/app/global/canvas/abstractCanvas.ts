import { ElementRef } from "@angular/core";

export default abstract class AbstractCanvas {
    public canvasEl?: HTMLCanvasElement;
    public ctx?: CanvasRenderingContext2D;

    public wrapperEl?: HTMLDivElement;

    protected afterViewInit(canvas: ElementRef, wrapper: ElementRef) {
        // Get the HTMLElements.
        this.canvasEl = canvas.nativeElement as HTMLCanvasElement;
        this.wrapperEl = wrapper.nativeElement as HTMLDivElement;
        this.ctx = this.canvasEl?.getContext('2d') as CanvasRenderingContext2D | undefined;
    }
}
