import MoveMode from "./moveMode";
import {DrawerService} from "../../../services/drawer.service";
import PointElement from "../canvas-elements/pointElement";
import { PointerContext } from "src/app/global/classes/pointerController";
import { Point } from "src/app/global/interfaces/point";
import AbstractRenderingContext from "src/app/global/classes/abstractRenderingContext";

export default class PointsMode extends MoveMode {
  override click(drawerService: DrawerService, rtx: AbstractRenderingContext, point: Point, context: PointerContext): void {
    drawerService.addCanvasElements(new PointElement(point, drawerService.getNewColor()));
  }
}
