import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import AbstractCanvas from '../abstractCanvas';
import AbstractRenderingContext from '../../classes/renderingContext/abstractRenderingContext';
import { RenderingContext } from '../../classes/renderingContext/renderingContext';

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

  public ngAfterViewInit(): void {
    this.afterViewInit(this.canvas, this.wrapper);
    
    if (this.canvasEl !== undefined && this.ctx !== undefined) {
      this.canvasEl.width = this.data.width;
      this.canvasEl.height = this.data.height;
      const ctx = new RenderingContext(this.ctx, {
        translateX: 0,
        translateY: 0,
        zoom: 1
      })
      this.data.draw(ctx);
    }
  }
}

export interface PreviewCanvasData {
  width: number,
  height: number,
  draw: (ctx: AbstractRenderingContext) => void
}
