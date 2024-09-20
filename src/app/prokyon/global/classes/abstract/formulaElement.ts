import { Point } from "src/app/global/interfaces/point";
import {ContextMenu} from "../../../context-menu/context-menu.directive";
import { ProkyonCanvasElement } from "./prokyonCanvasElement";
import { Event as CustomEvent } from "src/app/global/essentials/event";

export abstract class FormulaElement {
  public abstract canvasElement: ProkyonCanvasElement;

  public get contextMenu(): ContextMenu {
    return {
      elements: () => [],
      additionalEvent: this.threePointsClickedEvent
    }
  }

  // note, for three points functionality, you need to add the event on 'additionalEvent' in 'contextMenu', if you override it
  public readonly threePointsClickedEvent: CustomEvent<[Point, Event]> = new CustomEvent<[Point, Event]>();
  threePointsClicked(ev: MouseEvent) {
    // open the three point menu (instance of contextMenu)
    //ev.stopImmediatePropagation();
    let button: Element = ev.target as Element;
    if (button instanceof HTMLSpanElement) {
      button = button.parentElement!;
    }
    let rect = button.getBoundingClientRect();
    this.threePointsClickedEvent.emit([{
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height / 2
    }, ev]);
  }
}
