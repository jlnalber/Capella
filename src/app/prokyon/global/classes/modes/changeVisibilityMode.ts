import MoveMode from "./moveMode";
import {DrawerService} from "../../../services/drawer.service";
import AbstractRenderingContext from "src/app/global/classes/renderingContext/abstractRenderingContext";
import { Point } from "src/app/global/interfaces/point";
import { PointerContext } from "src/app/global/classes/pointerController";
import { Color, colorAsTransparent } from "src/app/global/interfaces/color";

export default class ChangeVisibilityMode extends MoveMode {
  override async click(drawerService: DrawerService, renderingContext: AbstractRenderingContext, point: Point, pointerContext: PointerContext) {
    const clickedElement = await drawerService.getSelection(point, () => true, false);
    if (clickedElement !== undefined) {
      clickedElement.visible = !clickedElement.visible;
    }
  }

  override transformInvisibleColor = (c: Color) => colorAsTransparent(c);
}
