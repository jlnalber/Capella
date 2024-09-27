import TwoElementsSelectMode, {Constructor} from "./twoElementsSelectMode";
import LineElement from "../canvas-elements/lineElement";
import LineSegmentElement from "../canvas-elements/lineSegmentElement";
import CircleElement from "../canvas-elements/circleElement";
import {DrawerService} from "../../../services/drawer.service";
import DynamicPointElement from "../canvas-elements/dynamicPointElement";
import { ProkyonSettingsService } from "src/app/prokyon/services/prokyon-settings.service";

type Elements = LineElement | LineSegmentElement | CircleElement;

export default class IntersectionMode extends TwoElementsSelectMode<Elements, Elements> {
  constructor(settingsService: ProkyonSettingsService) {
    super([LineElement, LineSegmentElement, CircleElement] as Constructor<Elements>[], [LineElement, LineSegmentElement, CircleElement] as Constructor<Elements>[], settingsService);
  }

  protected addCanvasElement(drawerService: DrawerService, e1: Elements, e2: Elements): void {
    const res = DynamicPointElement.createIntersectionPoints(e1, e2);
    drawerService.addCanvasElements(...res);
  }
}
