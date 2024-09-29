import { PointerContext, PointerController } from '../classes/pointerController';
import { Point } from 'src/app/global/interfaces/point';
import AbstractDrawerService from '../classes/abstract/abstractDrawerService';
import { ElementRef } from '@angular/core';
import AbstractCanvas from './abstractCanvas';

export default abstract class AbstractListenerCanvas extends AbstractCanvas {

  constructor(protected readonly service: AbstractDrawerService) {
    super();
    this.service.canvas = this;
  }

  protected override afterViewInit(canvas: ElementRef, wrapper: ElementRef) {
    // Get the HTMLElements.
    super.afterViewInit(canvas, wrapper);
    
    if (this.wrapperEl !== undefined && this.canvasEl !== undefined) {
      // Listen for resizing
      // window.onresize = () => {
      //   this.whiteboardService.redraw();
      // }
      new ResizeObserver(() => {
        this.service.redraw();
      }).observe(this.wrapperEl)

      // Listen for resizing
      /*new ResizeObserver(() => {
        this.drawerService.redraw();
      }).observe(this.canvasEl);*/

      // Listen for pointer events. They then trigger zoom and translate behaviour on the drawer service
      new PointerController(this.canvasEl, {
        pointerStart: (p: Point, context: PointerContext) => {
          const rtx = this.service.renderingContext;
          const newP = rtx.transformPointFromCanvasToField(p);
          this.service.getModeForPointerType(context.pointerType)?.pointerStart(this.service, rtx, newP, context);
        },
        pointerEnd: (p: Point, context: PointerContext) => {
          const rtx = this.service.renderingContext;
          const newP = rtx.transformPointFromCanvasToField(p);
          this.service.getModeForPointerType(context.pointerType)?.pointerEnd(this.service, rtx, newP, context);
        },
        pointerMove: (from: Point, to: Point, context: PointerContext) => {
          const rtx = this.service.renderingContext;
          const fromNew = rtx.transformPointFromCanvasToField(from);
          const toNew: Point = rtx.transformPointFromCanvasToField(to);
          this.service.getModeForPointerType(context.pointerType)?.pointerMove(this.service, rtx, fromNew, toNew, context);
        },
        click: (p: Point, context: PointerContext) => {
          const rtx = this.service.renderingContext;
          const newP = rtx.transformPointFromCanvasToField(p);
          this.service.getModeForPointerType(context.pointerType)?.click(this.service, rtx, newP, context);
        },
        scroll: (p: Point, delta: number) => {
          if (delta != 0) {
            delta *= -1 / 120;
            delta += Math.sign(delta);
            let factor = delta > 0 ? delta : 1 / -delta;
            this.service.zoomToBy(p, factor);
          }
        },
        pinchZoom: (p: Point, factor: number) => {
          this.service.zoomToBy(p, factor);
      }
      });


      // load from last session
      this.tryLoadFromLastSession();

      // Initial drawing.
      this.service.redraw();
    }
  }

  protected tryLoadFromLastSession(): void { }
}
