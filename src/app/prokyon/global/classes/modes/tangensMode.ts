import TwoElementsSelectMode from "./twoElementsSelectMode";
import PointElement from "../canvas-elements/pointElement";
import DynamicPointElement from "../canvas-elements/dynamicPointElement";
import CircleElement from "../canvas-elements/circleElement";
import {DrawerService} from "../../../services/drawer.service";
import LineElement from "../canvas-elements/lineElement";
import { ProkyonSettingsService } from "src/app/prokyon/services/prokyon-settings.service";

export default class TangensMode extends TwoElementsSelectMode<PointElement | DynamicPointElement, CircleElement> {
  constructor(settingsService: ProkyonSettingsService) {
    super([PointElement, DynamicPointElement], [CircleElement], settingsService);
  }

  protected override addCanvasElement(drawerService: DrawerService, e1: PointElement | DynamicPointElement, e2: CircleElement) {
    drawerService.addCanvasElements(...LineElement.createTangens(e1, e2));
  }

}
