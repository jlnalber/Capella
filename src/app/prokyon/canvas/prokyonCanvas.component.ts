import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import AbstractListenerCanvas from '../../global/canvas/abstractListenerCanvas';
import { DrawerService, STORAGE_CACHE } from 'src/app/prokyon/services/drawer.service';
import { Serialized } from '../global/essentials/serializer';

@Component({
  selector: 'prokyon-canvas',
  templateUrl: './prokyonCanvas.component.html',
  styleUrls: ['./prokyonCanvas.component.scss']
})
export class ProkyonCanvasComponent extends AbstractListenerCanvas implements AfterViewInit {
  @ViewChild('canvas') public canvas!: ElementRef;
  
  @ViewChild('wrapper') public wrapper!: ElementRef;
  
  constructor(drawerService: DrawerService) {
    super(drawerService);
  }

  ngAfterViewInit() {
    this.afterViewInit(this.canvas, [ this.canvas ], this.wrapper);
  }

  protected override tryLoadFromLastSession(): void {
    if (this.service instanceof DrawerService) {
      try {
        this.service.loadFrom(JSON.parse(localStorage[STORAGE_CACHE]) as Serialized);
      } catch {}
    }
  }
}
