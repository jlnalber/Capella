import MoveMode from "./moveMode";
import {DrawerService} from "../../../services/drawer.service";
import PointElement from "../canvas-elements/pointElement";
import { PointerContext } from "src/app/global/classes/pointerController";
import { Point } from "src/app/global/interfaces/point";
import AbstractRenderingContext from "src/app/global/classes/renderingContext/abstractRenderingContext";
import { ProkyonCanvasElement } from "../abstract/prokyonCanvasElement";

export default class MovePointsMode extends MoveMode {

  override pointerMove(drawerService: DrawerService, renderingContext: AbstractRenderingContext, from: Point, to: Point, pointerContext: PointerContext) {
    if (drawerService.selection.size === 0) {
      super.pointerMove(drawerService, renderingContext, from, to, pointerContext);
    }
    else {
      for (let c of drawerService.selection.toArray()) {
        if (c instanceof PointElement && c.x !== undefined && c.y !== undefined && !c.dependent) {
          c.x += to.x - from.x;
          c.y += to.y - from.y;
        }
      }
    }
  }

  override click(drawerService: DrawerService, renderingContext: AbstractRenderingContext, point: Point, pointerContext: PointerContext) {
    drawerService.setSelection(point, !pointerContext.ctrlKey, (c: ProkyonCanvasElement) => {
      return c instanceof PointElement && !c.dependent;
    })
  }
}
