import PointElement from "../canvas-elements/pointElement";
import MultipleElementsSelectMode from "./multipleElementsSelectMode";
import ShapeElement from "../canvas-elements/shapeElement";
import { DrawerService } from "src/app/prokyon/services/drawer.service";

export default class ShapeMode extends MultipleElementsSelectMode<PointElement> {

    protected override addCanvasElement(drawerService: DrawerService, elements: PointElement[]): void {
        drawerService.addCanvasElements(new ShapeElement(() => elements.map(e => e.point), elements, () => {
            return {
                points: elements.map(e => e.id)
            }
        }, drawerService.getNewColor(), 'Polygon'))
    }

    constructor() {
        super([PointElement], 3);
    }
}