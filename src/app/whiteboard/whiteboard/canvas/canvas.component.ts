import { Component, ElementRef, ViewChild } from '@angular/core';
import { WhiteboardService } from '../../services/whiteboard.service';
import { PointerContext, PointerController } from '../../global/classes/pointerController';
import { Point } from '../../global/interfaces/point';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent {
  @ViewChild('canvas') canvas!: ElementRef;
  canvasEl?: HTMLCanvasElement;
  ctx?: CanvasRenderingContext2D;

  @ViewChild('wrapper') wrapper!: ElementRef;
  wrapperEl?: HTMLDivElement;

  constructor(private readonly whiteboardService: WhiteboardService) {
    this.whiteboardService.canvas = this;
  }

  ngAfterViewInit() {
    // Get the HTMLElements.
    this.canvasEl = this.canvas.nativeElement as HTMLCanvasElement;
    this.wrapperEl = this.wrapper.nativeElement as HTMLDivElement;
    this.ctx = this.canvasEl?.getContext('2d') as CanvasRenderingContext2D | undefined;

    // Listen for resizing
    // window.onresize = () => {
    //   this.whiteboardService.redraw();
    // }
    new ResizeObserver(() => {
      this.whiteboardService.redraw();
    }).observe(this.wrapperEl)

    // Listen for resizing
    /*new ResizeObserver(() => {
      this.drawerService.redraw();
    }).observe(this.canvasEl);*/

    // Listen for pointer events. They then trigger zoom and translate behaviour on the drawer service
    new PointerController(this.canvasEl, {
      pointerStart: (p: Point, context: PointerContext) => {
        const rtx = this.whiteboardService.renderingContext;
        const newP = rtx.transformPointFromCanvasToField(p);
        this.whiteboardService.getModeForPointerType(context.pointerType)?.pointerStart(this.whiteboardService, rtx, newP, context);
      },
      pointerEnd: (p: Point, context: PointerContext) => {
        const rtx = this.whiteboardService.renderingContext;
        const newP = rtx.transformPointFromCanvasToField(p);
        this.whiteboardService.getModeForPointerType(context.pointerType)?.pointerEnd(this.whiteboardService, rtx, newP, context);
      },
      pointerMove: (from: Point, to: Point, context: PointerContext) => {
        const rtx = this.whiteboardService.renderingContext;
        const fromNew = rtx.transformPointFromCanvasToField(from);
        const toNew: Point = rtx.transformPointFromCanvasToField(to);
        this.whiteboardService.getModeForPointerType(context.pointerType)?.pointerMove(this.whiteboardService, rtx, fromNew, toNew, context);
      },
      click: (p: Point, context: PointerContext) => {
        const rtx = this.whiteboardService.renderingContext;
        const newP = rtx.transformPointFromCanvasToField(p);
        this.whiteboardService.getModeForPointerType(context.pointerType)?.click(this.whiteboardService, rtx, newP, context);
      },
      scroll: (p: Point, delta: number) => {
        if (delta != 0) {
          delta *= -1 / 120;
          delta += Math.sign(delta);
          let factor = delta > 0 ? delta : 1 / -delta;
          this.whiteboardService.zoomToBy(p, factor);
        }
      },
      pinchZoom: (p: Point, factor: number) => {
        this.whiteboardService.zoomToBy(p, factor);
    }
    });


    // load from last session
    //try {
    //  this.drawerService.loadFrom(JSON.parse(localStorage[STORAGE_CACHE]) as Serialized);
    //} catch {}

    // Initial drawing.
    this.whiteboardService.redraw();
  }
}
