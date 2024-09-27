import { Color } from "src/app/global/interfaces/color";
import { Pen } from "../../../whiteboard/global/interfaces/penStyle";
import RibbonView from "./ribbonView";
import { WhiteboardSettings } from "src/app/whiteboard/services/whiteboard-settings";


export default class RibbonPenPicker extends RibbonView {
    
    constructor(public readonly settings: WhiteboardSettings,
                public readonly getColors: (pen: Pen) => Color[],
                public readonly setActive: (pen: Pen, event: PointerEvent) => void) {
        super();
    }

    public isActive(pen: Pen): boolean {
        return this.getColors(pen).length !== 0;
    }

    public isHyperActive(pen: Pen): boolean {
        return this.getColors(pen).length > 1;
    }
}