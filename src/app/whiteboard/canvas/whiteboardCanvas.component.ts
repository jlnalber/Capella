import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { WhiteboardService } from '../services/whiteboard.service';
import AbstractListenerCanvas from '../../global/canvas/abstractListenerCanvas';

@Component({
  selector: 'whiteboard-canvas',
  templateUrl: './whiteboardCanvas.component.html',
  styleUrls: ['./whiteboardCanvas.component.scss']
})
export class WhiteboardCanvasComponent extends AbstractListenerCanvas implements AfterViewInit {
  @ViewChild('canvas') public canvas!: ElementRef;

  @ViewChild('wrapper') public wrapper!: ElementRef;

  constructor(whiteboardService: WhiteboardService) {
    super(whiteboardService);
  }

  ngAfterViewInit() {
    this.afterViewInit(this.canvas, this.wrapper);
  }
}
