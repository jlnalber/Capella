import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Canvas } from '../../global/canvas/canvas';
import { DrawerService, STORAGE_CACHE } from 'src/app/prokyon/services/drawer.service';
import { Serialized } from '../global/essentials/serializer';

@Component({
  selector: 'prokyon-canvas',
  templateUrl: './prokyonCanvas.component.html',
  styleUrls: ['./prokyonCanvas.component.scss']
})
export class ProkyonCanvasComponent extends Canvas implements AfterViewInit {
  @ViewChild('canvas') canvas!: ElementRef;

  @ViewChild('wrapper') wrapper!: ElementRef;

  constructor(drawerService: DrawerService) {
    super(drawerService);
  }

  ngAfterViewInit() {
    this.afterViewInit(this.canvas, this.wrapper);
  }

  protected override tryLoadFromLastSession(): void {
    if (this.service instanceof DrawerService) {
      try {
        this.service.loadFrom(JSON.parse(localStorage[STORAGE_CACHE]) as Serialized);
      } catch {}
    }
  }
}
