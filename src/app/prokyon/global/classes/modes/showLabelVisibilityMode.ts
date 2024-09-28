import MoveMode from "./moveMode";
import {DrawerService} from "../../../services/drawer.service";
import { Point } from "src/app/global/interfaces/point";
import AbstractRenderingContext from "src/app/global/classes/renderingContext/abstractRenderingContext";
import { PointerContext } from "src/app/global/classes/pointerController";

export default class ShowLabelVisibilityMode extends MoveMode {
  public override click(drawerService: DrawerService, renderingContext: AbstractRenderingContext, point: Point, pointerContext: PointerContext) {
    const clickedElement = drawerService.getSelection(point);
    if (clickedElement !== undefined) {
      clickedElement.configuration.showLabel = clickedElement.configuration.showLabel !== true;
      drawerService.onCanvasElementChanged.emit(clickedElement);
    }
  }
}
