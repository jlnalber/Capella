import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { WhiteboardService } from '../services/whiteboard.service';
import AbstractListenerCanvas from '../../global/canvas/abstractListenerCanvas';

@Component({
  selector: 'whiteboard-canvas',
  templateUrl: './whiteboardCanvas.component.html',
  styleUrls: ['./whiteboardCanvas.component.scss']
})
export class WhiteboardCanvasComponent extends AbstractListenerCanvas implements AfterViewInit {
  @ViewChild('canvas0') public canvas0!: ElementRef;
  @ViewChild('canvas1') public canvas1!: ElementRef;
  @ViewChild('canvas2') public canvas2!: ElementRef;
  @ViewChild('canvas3') public canvas3!: ElementRef;
  @ViewChild('canvas4') public canvas4!: ElementRef;
  
  @ViewChild('pointerCatcher') public pointerCatcher!: ElementRef;
  
  @ViewChild('wrapper') public wrapper!: ElementRef;
  
  constructor(whiteboardService: WhiteboardService) {
    super(whiteboardService);
  }

  ngAfterViewInit() {
    this.afterViewInit(this.pointerCatcher, [ this.canvas0, this.canvas1, this.canvas2, this.canvas3, this.canvas4 ], this.wrapper);
  }
}
