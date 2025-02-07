import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import AbstractCanvas from '../abstractCanvas';
import AbstractRenderingContext from '../../classes/renderingContext/abstractRenderingContext';
import { RenderingContext } from '../../classes/renderingContext/renderingContext';
import { Event } from '../../essentials/event';
import { WhiteboardService } from 'src/app/whiteboard/services/whiteboard.service';

@Component({
  selector: 'app-preview-canvas',
  standalone: true,
  imports: [],
  templateUrl: './preview-canvas.component.html',
  styleUrl: './preview-canvas.component.scss'
})
export class PreviewCanvasComponent extends AbstractCanvas implements AfterViewInit {
  @ViewChild('canvas') public canvas!: ElementRef;

  @ViewChild('wrapper') public wrapper!: ElementRef;

  @Input({ required: true }) data!: PreviewCanvasData;

  constructor(private readonly service: WhiteboardService) {
    super();
  }

  public ngAfterViewInit(): void {
    this.afterViewInit(this.canvas, [this.canvas], this.wrapper);
    
    if (this.canvasAndCTX !== undefined) {
      const canvasEl = this.canvasAndCTX[0].canvas;
      const ctx = this.canvasAndCTX[0].ctx;
      const zoom = this.data.zoom ?? 1;
      const resolutionFactor = this.data.resolutionFactor ?? 1;
      canvasEl.width = this.data.width * zoom * resolutionFactor;
      canvasEl.height = this.data.height * zoom * resolutionFactor;
      const rtx = new RenderingContext(ctx, {
        translateX: 0,
        translateY: 0,
        zoom: zoom,
        resolutionFactor: resolutionFactor
      }, undefined, undefined, undefined, undefined, undefined, () => this.service.settings.getStepsThicknessRendering())
      this.redraw(rtx);

      this.data.redrawEvent.addListener(() => {
        this.redraw(rtx);
      })
    }
  }
  
  private redraw(rtx: RenderingContext) {
    if (this.canvasAndCTX !== undefined) { 
      const ctx = this.canvasAndCTX[0].ctx;
      const zoom = this.data.zoom ?? 1;
      const resolutionFactor = this.data.resolutionFactor ?? 1;
      const width = this.data.width * resolutionFactor * zoom;
      const height = this.data.height * resolutionFactor * zoom;

      // clear everything and then let the data draw in whatever it wants
      ctx.clearRect(0, 0, width, height);

      this.data.redraw(rtx);
    }
  }
}

export interface PreviewCanvasData {
  width: number,
  height: number,
  resolutionFactor?: number,
  zoom?: number
  redraw: (ctx: RenderingContext) => void,
  redrawEvent: Event<any>
}
