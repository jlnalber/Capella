import {ComponentRef, Directive, Input, OnDestroy, Type, ViewContainerRef} from '@angular/core';
import {HoverMenuComponent} from "./hover-menu/hover-menu.component";
import { Point } from 'src/app/global/interfaces/point';
import { isIn } from 'src/app/global/essentials/utils';

type MenuOpenedType = 'hover' | 'click' | 'context' | 'custom'

@Directive({
  standalone: true,
  selector: '[appHoverMenu]'
})
export class HoverMenuDirective implements OnDestroy {

  private menu?: ComponentRef<HoverMenuComponent>;
  private menuOpenedType?: MenuOpenedType;

  @Input() public appHoverMenu!: HoverConfiguration;
  private readonly element: Element;
  
  // #region The listeners for context menu
  private contextmenuDocumentEventListener = (e: Event) => {
    // listener that closes the context menu when another one is triggered
    this.destroyMenu();
  }

  private keyboardDocumentEventListener = (e: KeyboardEvent) => {
    // this listener closes the context menu when esc is clicked
    if (e instanceof KeyboardEvent && e.key == 'Escape') {
      this.destroyMenu();
    }
  }

  private closeClickContextMenuEventListener = (ev: MouseEvent | PointerEvent) => {
    if (ev !== this.skipEvent && this.menu && !isIn({
      x: ev.clientX,
      y: ev.clientY
    }, this.menu?.instance.getBoundingClientRect())) {
      // this listener destroys the context menu
      this.destroyMenu();
    }
    this.skipEvent = undefined;
  }

  private closeContextMenuEventListener = (ev: Event) => {
    if (ev !== this.skipEvent) {
      // this listener destroys the context menu
      this.destroyMenu();
    }
    this.skipEvent = undefined;
  }

  private contextmenuEventListener = (e: Event) => {
    // this listener opens the custom context menu instead of the usual one of the browser
    if ((e instanceof PointerEvent || e instanceof MouseEvent) && this.allowAsContextMenu()) {
      e.preventDefault();
      
      this.showMenuAt({
        x: e.x,
        y: e.y
      }, 'context');
      
      e.stopImmediatePropagation();
    }
  }

  private clickEventListener = (e: Event) => {
    // Reset the version (hover menu won't directly show up when click is registered).
    this.version = 0;

    // this listener opens the custom context menu instead of the usual one of the browser
    if ((e instanceof PointerEvent || e instanceof MouseEvent) && this.allowAsClickMenu()) {
      this.skipEvent = e;
      e.preventDefault();

      this.showMenuAt({
        x: e.x,
        y: e.y
      }, 'click');
    }
  }

  private skipEvent?: Event;
  private customContextMenuActivateListener = (p?: [Point, Event]) => {
    // this listener tries to open the context menu at a (given) position
    let point: Point | undefined = p ? p[0] : undefined;
    this.skipEvent = p ? p[1] : undefined; // The context menu shouldn't close immediately after creation.
    if (!point) {
      point = this.element.getBoundingClientRect() ?? {
        x: 0,
        y: 0
      };
    }
    this.showMenuAt(point, 'custom');
  }
  // #endregion
  

  constructor(private readonly vc: ViewContainerRef) {
    this.element = vc.element.nativeElement as Element;

    // for hover menu
    this.element.addEventListener('mouseover', this.eventListenerStart);
    this.element.addEventListener('mousemove', this.eventListenerStart);
    this.element.addEventListener('mouseleave', this.eventListenerEnd);

    // register events for context menu
    this.element.addEventListener('contextmenu', this.contextmenuEventListener);
    this.element.addEventListener('click', this.clickEventListener);
    this.registerDocumentEvents();
  }

  ngOnDestroy() {
    // Remove the context menu and its listeners.
    // for hover menu
    this.element.removeEventListener('mouseover', this.eventListenerStart);
    this.element.removeEventListener('mousemove', this.eventListenerStart);
    this.element.removeEventListener('mouseleave', this.eventListenerEnd);

    // register events for context menu
    this.element.removeEventListener('contextmenu', this.contextmenuEventListener);
    this.element.removeEventListener('click', this.clickEventListener);
    this.unregisterDocumentEvents();
  
    this.destroyMenu();
  }

  // time, after which the hover menu should appear in milliseconds
  public hoverTimeMs = 750;

  private version = 0;

  private eventListenerStart = () => {
    if (!this.menu) {
      // thisVersion stores when the event was emitted
      const thisVersion = ++this.version;

      // after 'hoverTimeMs', the hoverMenu should open, but only when the version is still the same, meaning that no mousemove, etc. event was fired
      setTimeout(() => {
        if (this.version === thisVersion) {
          this.openHoverMenu();
        }
      }, this.hoverTimeMs)
    }
  }

  private openHoverMenu(): void {
    if (!this.menu) {
      // open menu
      let rect = this.element.getBoundingClientRect();
      this.showMenuAt({
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2
      }, 'hover');
    }
  }
  
  private showMenuAt(p: Point, menuOpenedType: MenuOpenedType): void {
    this.destroyMenu();
    if (this.appHoverMenu) {
      // create a new context menu and set the position and elements
      this.menu = this.vc.createComponent(HoverMenuComponent);
      this.menu.instance.data = this.appHoverMenu.data;
      this.menu.instance.component = this.appHoverMenu.component;
      this.menu.instance.position = p;
      this.menuOpenedType = menuOpenedType;
      
      // register events
      this.menu.location.nativeElement.addEventListener('mouseleave', this.eventListenerEnd);
      this.registerDocumentEvents();
    }
  }

  private eventListenerEnd = (event: Event | MouseEvent) => {
    // stop hovering when not over it anymore
    if (this.menu && event instanceof MouseEvent && this.menuOpenedType === 'hover') {
      let p: Point = {
        x: event.clientX,
        y: event.clientY
      }
      if ((!isIn(p, this.element.getBoundingClientRect()) || event.target == this.element)
        && (!isIn(p, this.menu.instance.getBoundingClientRect()) || event.target == this.menu.location.nativeElement)) {
          this.destroyMenu();
      }
    }

    // reset the version
    this.version = 0;
  }

  private destroyMenu(): void {
    if (this.menu) {
      // destroy the context menu if open
      this.menu.destroy();
      this.menu = undefined;
      this.menuOpenedType = undefined;

      // unregister events
      this.unregisterDocumentEvents();
    }
  }

  private registerDocumentEvents() {
    document.addEventListener('click', this.closeClickContextMenuEventListener);
    document.addEventListener('wheel', this.closeContextMenuEventListener);
    document.addEventListener('contextmenu', this.contextmenuDocumentEventListener, true);
    document.addEventListener('keydown', this.keyboardDocumentEventListener);
  }

  private unregisterDocumentEvents() {
    document.removeEventListener('click', this.closeClickContextMenuEventListener);
    document.removeEventListener('wheel', this.closeContextMenuEventListener);
    document.removeEventListener('contextmenu', this.contextmenuDocumentEventListener, true);
    document.removeEventListener('keydown', this.keyboardDocumentEventListener);
  }

  private allowAsClickMenu(): boolean {
    return this.appHoverMenu.allowAsClickMenu !== undefined && this.appHoverMenu.allowAsClickMenu();
  }

  private allowAsContextMenu(): boolean {
    return this.appHoverMenu.allowAsContextMenu !== undefined && this.appHoverMenu.allowAsContextMenu();
  }

}

export interface HoverConfiguration {
  component: Type<any>,
  allowAsContextMenu?: () => boolean,
  allowAsClickMenu?: () => boolean,
  data: any
}
