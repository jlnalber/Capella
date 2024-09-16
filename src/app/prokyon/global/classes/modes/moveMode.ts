import {ProkyonMode} from "./prokyonMode";
import {PointerContext} from "../pointerController";
import {RenderingContext} from "../renderingContext";
import { DrawerService } from "src/app/prokyon/services/drawer.service";
import { Point } from "src/app/global/interfaces/point";

export default class MoveMode extends ProkyonMode {

  // move the canvas when there is a pointer move
  override pointerMove(drawerService: DrawerService, renderingContext: RenderingContext, from: Point, to: Point, pointerContext: PointerContext) {
    drawerService.translateX += (to.x - from.x) / pointerContext.pointerCount;
    drawerService.translateY += (to.y - from.y) / pointerContext.pointerCount;
  }

  // set a selection on click
  override click(drawerService: DrawerService, renderingContext: RenderingContext, point: Point, pointerContext: PointerContext): void {
    drawerService.setSelection(point, !pointerContext.ctrlKey);
  }
}
