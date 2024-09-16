import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { WhiteboardService } from '../../services/whiteboard.service';
import { Canvas } from '../../../global/canvas/canvas';

@Component({
  selector: 'whiteboard-canvas',
  templateUrl: './whiteboardCanvas.component.html',
  styleUrls: ['./whiteboardCanvas.component.scss']
})
export class WhiteboardCanvasComponent extends Canvas implements AfterViewInit {
  @ViewChild('canvas') canvas!: ElementRef;

  @ViewChild('wrapper') wrapper!: ElementRef;

  constructor(whiteboardService: WhiteboardService) {
    super(whiteboardService);
  }

  ngAfterViewInit() {
    this.afterViewInit(this.canvas, this.wrapper);
  }
}
