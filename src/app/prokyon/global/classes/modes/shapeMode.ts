import PointElement from "../canvas-elements/pointElement";
import MultipleElementsSelectMode from "./multipleElementsSelectMode";
import ShapeElement from "../canvas-elements/shapeElement";
import { DrawerService } from "src/app/prokyon/services/drawer.service";
import { ProkyonSettingsService } from "src/app/prokyon/services/prokyon-settings.service";

export default class ShapeMode extends MultipleElementsSelectMode<PointElement> {

    protected override addCanvasElement(drawerService: DrawerService, elements: PointElement[]): void {
        drawerService.addCanvasElements(new ShapeElement(() => elements.map(e => e.point), elements, () => {
            return {
                points: elements.map(e => e.id)
            }
        }, drawerService.getNewColor(), 'Polygon'))
    }

    constructor(settingsService: ProkyonSettingsService) {
        super([PointElement], settingsService, 3);
    }
}