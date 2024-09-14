import { Injectable } from '@angular/core';
import { Transformations } from '../global/interfaces/transformations';
import { CanvasComponent } from '../whiteboard/canvas/canvas.component';
import { Event } from '../global/essentials/event';
import { Point } from '../global/interfaces/point';
import { RenderingContext } from '../global/classes/renderingContext';
import { Mode } from '../global/classes/modes/mode';
import { CanvasElement } from '../global/classes/abstract/canvasElement';
import { PointerType } from '../global/classes/pointerController';
import Page from './page';


export const STORAGE_CACHE = 'serialized_whiteboard'

@Injectable({
  providedIn: 'root'
})
export class WhiteboardService {
  // #region the properties of the canvas --> bgColor, elements in canvas, transformations and config
  private _mouseMode: Mode | undefined = undefined;// TODO: set default
  private _penMode: Mode | undefined = undefined;// TODO: set default
  private _touchMode: Mode | undefined = undefined;// TODO: set default

  public get mouseMode(): Mode | undefined {
    return this._mouseMode;
  }

  public set mouseMode(value: Mode | undefined) {
    this._mouseMode = value;
    this.onModeChanged.emit(value);
  }

  public get penMode(): Mode | undefined {
    return this._penMode;
  }

  public set penMode(value: Mode | undefined) {
    this._penMode = value;
    this.onModeChanged.emit(value);
  }

  public get touchMode(): Mode | undefined {
    return this._touchMode;
  }

  public set touchMode(value: Mode | undefined) {
    this._touchMode = value;
    this.onModeChanged.emit(value);
  }

  public getModeForPointerType(pointerType: PointerType): Mode | undefined {
    if (pointerType === 'mouse') {
      return this.mouseMode;
    } else if (pointerType === 'touch') {
      return this.touchMode;
    } else if (pointerType === 'pen') {
      return this.penMode;
    }
    return undefined;
  }

  public setModeForPointerType(pointerType: PointerType, mode: Mode | undefined): void {
    if (pointerType === 'mouse') {
      this.mouseMode = mode;
    } else if (pointerType === 'touch') {
      this.touchMode = mode;
    } else if (pointerType === 'pen') {
      this.penMode = mode;
    }
  }

  /*private _backgroundColor: Color = {
    r: 255,
    g: 255,
    b: 255
  };
  public get backgroundColor(): Color {
    return this._backgroundColor;
  }

  public set backgroundColor(value: Color) {
    this._backgroundColor = value;
    this.onBackgroundColorChanged.emit(value);
  }*/


  private _pages: Page[] = [new Page(this)];
  private _activePageIndex: number = 0;

  public get activePage(): Page {
    return this._pages[this._activePageIndex];
  }

  public get activePageIndex(): number {
    return this._activePageIndex;
  }

  public set activePageIndex(value: number) {
    const val = Math.min(this._pages.length - 1, Math.max(0, value));
    this._activePageIndex = val;
    this.onPageChanged.emit(this.activePage);
  }

  public get numberOfPages(): number {
    return this._pages.length;
  }

  public removePage(index: number): boolean {
    try {
      const page = this._pages[index];
      this._pages.splice(index, 1);
      if (this.activePageIndex >= this.numberOfPages - 1) {
        this.activePageIndex = this.numberOfPages - 1;
      }
      this.onPageRemoved.emit(page);
      return true;
    }
    catch {
      return false;
    }
  }

  public addPage(): void {
    const page = new Page(this);
    this._pages.push(page);
    this.onPageAdded.emit(page);
  }

  // #endregion

  // other properties
  public canvas?: CanvasComponent;

  // Events
  // public readonly onBackgroundColorChanged: Event<Color> = new Event<Color>();
  public readonly onCanvasElementChanged: Event<any> = new Event<any>();
  // public readonly onMetaDrawersChanged: Event<CanvasDrawer> = new Event<CanvasDrawer>();
  public readonly onTransformationsChanged: Event<number | Transformations> = new Event<number | Transformations>();
  // public readonly onCanvasConfigChanged: Event<CanvasConfig> = new Event<CanvasConfig>();
  public readonly onBeforeRedraw: Event<undefined> = new Event<undefined>();
  public readonly onBeforeElementsDraw: Event<RenderingContext> = new Event<RenderingContext>();
  public readonly onAfterRedraw: Event<undefined> = new Event<undefined>();
  public readonly onModeChanged: Event<Mode> = new Event<Mode>();
  public readonly onPageChanged: Event<Page> = new Event<Page>();
  public readonly onPageAdded: Event<Page> = new Event<Page>();
  public readonly onPageRemoved: Event<Page> = new Event<Page>();

  // Event listeners
  private redrawListener = () => {
    this.redraw();
  }

  private saveListener = () => {
    // localStorage[STORAGE_CACHE] = JSON.stringify(this.serialize()); TODO: implement
  }

  constructor() {
    this.onPageChanged.addListener(this.redrawListener);
    this.onModeChanged.addListener(this.redrawListener);
    this.onAfterRedraw.addListener(this.saveListener);
  }

  public redraw() {
    this.activePage.redraw();
  }

  public addCanvasElements(...canvasElements: CanvasElement[]) {
    this.activePage.addCanvasElements(...canvasElements);
  }

  public get renderingContext(): RenderingContext {
    return this.activePage.renderingContext;
  }

  public zoomToBy(p: Point, factor: number) {
    this.activePage.zoomToBy(p, factor);
  }



  /*public serialize(): Serialized {
    return serialize(this);
  }*/

  /*public loadFrom(serialized: Serialized): void {
    loadFrom(this, serialized);
  }*/

}
