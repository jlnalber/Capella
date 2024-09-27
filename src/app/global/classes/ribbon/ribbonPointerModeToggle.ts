import { Color } from "src/app/global/interfaces/color";
import RibbonToggle from "./ribbonToggle";

export default class RibbonPointerModeToggle extends RibbonToggle {
    constructor(name: string, icon: string, title: string, click: (event: PointerEvent) => void, public activePointers: (() => Color | undefined)[], enabled?: () => boolean) {
        super(name, icon, title, click, () => {
            for (let f of this.activePointers) {
                if (f()) {
                    return true;
                }
            }
            return false;
        }, enabled)
    }
}