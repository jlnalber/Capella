import { ElementRef } from "@angular/core";

export type CanvasAndCTX = {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
}

export default abstract class AbstractCanvas {
    public canvasAndCTX?: CanvasAndCTX[];
    public pointerInputEl?: HTMLElement;

    public wrapperEl?: HTMLDivElement;

    protected afterViewInit(pointerInput: ElementRef, canvas: ElementRef[], wrapper: ElementRef) {
        // Get the HTMLElements.
        this.pointerInputEl = pointerInput.nativeElement;
        this.wrapperEl = wrapper.nativeElement as HTMLDivElement;
        this.canvasAndCTX = canvas.map((c) => { 
            const canvasEl = c.nativeElement as HTMLCanvasElement;
            const ctx = canvasEl.getContext('2d') as CanvasRenderingContext2D;
            return { canvas: canvasEl, ctx };
        });
    }
}
