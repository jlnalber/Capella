import TwoElementsSelectMode from "./twoElementsSelectMode";
import PointElement from "../canvas-elements/pointElement";
import LineElement from "../canvas-elements/lineElement";
import {DrawerService} from "../../../services/drawer.service";
import LineSegmentElement from "../canvas-elements/lineSegmentElement";
import DynamicPointElement from "../canvas-elements/dynamicPointElement";
import { ProkyonSettingsService } from "src/app/prokyon/services/prokyon-settings.service";

export default class ParallelMode extends TwoElementsSelectMode<PointElement | DynamicPointElement, LineElement | LineSegmentElement> {
  constructor(settingsService: ProkyonSettingsService) {
    super([PointElement, DynamicPointElement], [LineElement, LineSegmentElement], settingsService);
  }

  protected addCanvasElement(drawerService: DrawerService, e1: PointElement, e2: LineElement | LineSegmentElement): void {
    drawerService.addCanvasElements(LineElement.createParallel(e1, e2));
  }
}
