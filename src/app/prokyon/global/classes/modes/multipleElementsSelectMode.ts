import MoveMode from "./moveMode";
import {DrawerService} from "../../../services/drawer.service";
import { Constructor, ofType } from "./twoElementsSelectMode";
import { ProkyonCanvasElement } from "../abstract/prokyonCanvasElement";
import { PointerContext } from "src/app/global/classes/pointerController";
import { Point } from "src/app/global/interfaces/point";
import AbstractRenderingContext from "src/app/global/classes/renderingContext/abstractRenderingContext";

export default abstract class MultipleElementsSelectMode<T extends ProkyonCanvasElement> extends MoveMode {
  
  protected constructor(private types: Constructor<T>[], private minElements: number, private maxElements: number = Number.MAX_VALUE) {
    super();
  }

  protected abstract addCanvasElement(drawerService: DrawerService, elements: T[]): void;

  private clickedElements: T[] = [];

  public override async click(drawerService: DrawerService, renderingContext: AbstractRenderingContext, point: Point, pointerContext: PointerContext) {
    const clickedElement = await drawerService.getSelection(point, (c) => ofType(c, ...this.types)) as T | undefined;

    if (clickedElement !== undefined) {
      if (this.clickedElements.length === 0) {
        // in case, the first element was clicked
        this.clickedElements.push(clickedElement);
        drawerService.selection.set(clickedElement);
      }
      else if (clickedElement === this.clickedElements[this.clickedElements.length - 1]) {
        // in case, the latest one was selected
        this.clickedElements.splice(this.clickedElements.length - 1);
        if (this.clickedElements.indexOf(clickedElement) === -1) {
          // only remove from selection, if it wasn't in there anymore
          drawerService.selection.remove(clickedElement);
        }
      }
      else if (clickedElement === this.clickedElements[0] && this.clickedElements.length + 1 >= this.minElements && this.clickedElements.length + 1 <= this.maxElements) {
        // in case, we're finished
        const elements = [...this.clickedElements];
        this.clickedElements = [];
        drawerService.selection.empty();
        this.addCanvasElement(drawerService, elements);
      }
      else {
        // just add it
        this.clickedElements.push(clickedElement);
        drawerService.selection.add(clickedElement);
      }
    } else {
      // in case, it was clicked in the void
      drawerService.selection.empty();
      this.clickedElements = [];
    }
  }
}
