import TwoElementsSelectMode from "./twoElementsSelectMode";
import PointElement from "../canvas-elements/pointElement";
import {DrawerService} from "../../../services/drawer.service";
import LineSegmentElement from "../canvas-elements/lineSegmentElement";
import DynamicPointElement from "../canvas-elements/dynamicPointElement";
import { ProkyonCanvasElement } from "../abstract/prokyonCanvasElement";
import { Point } from "src/app/global/interfaces/point";
import { PointerContext } from "src/app/global/classes/pointerController";
import AbstractRenderingContext from "src/app/global/classes/renderingContext/abstractRenderingContext";

export default abstract class TwoPointsOrLineSegmentSelectMode extends TwoElementsSelectMode<PointElement | DynamicPointElement, PointElement | DynamicPointElement> {
  public constructor() {
    super([PointElement, DynamicPointElement], [PointElement, DynamicPointElement]);
  }

  protected abstract addCanvasElementFromLineSegment(drawerService: DrawerService, lineSegment: LineSegmentElement): void;

  override async click(drawerService: DrawerService, renderingContext: AbstractRenderingContext, point: Point, pointerContext: PointerContext): Promise<void> {
    const clickedElement = await drawerService.getSelection(point, (c: ProkyonCanvasElement) => c instanceof LineSegmentElement);
    if (clickedElement !== undefined) {
      this.addCanvasElementFromLineSegment(drawerService, clickedElement as LineSegmentElement);
    }
    else {
      super.click(drawerService, renderingContext, point, pointerContext);
    }
  }
}
