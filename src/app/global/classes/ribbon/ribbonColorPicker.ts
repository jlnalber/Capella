import { sameColors } from 'src/app/global/essentials/utils';
import { hasWhereApplies } from 'src/app/global/essentials/utils';
import { Color } from "src/app/global/interfaces/color";
import RibbonView from "./ribbonView";

export default class RibbonColorPicker extends RibbonView {
    constructor(private readonly colors: Color[],
                public readonly getActiveColor: () => Color | undefined,
                public readonly setActiveColor: (color: Color) => void,
                public readonly isDisabled: () => boolean) {
        super();
    }

    public getAllColors(): Color[] {
        const activeColor = this.getActiveColor();
        if (activeColor === undefined || hasWhereApplies(this.colors, c => sameColors(c, activeColor))) {
            return this.colors;
        }
        return [activeColor, ...this.colors];
    }
}