import { sameColors } from 'src/app/global/essentials/utils';
import { hasWhereApplies } from 'src/app/global/essentials/utils';
import { Color } from "src/app/global/interfaces/color";
import Picker from './picker';

export default class ColorPicker extends Picker<Color> {
    constructor(private readonly colors: Color[],
                getActiveColor: () => Color | undefined,
                setActiveColor: (color?: Color) => void,
                isDisabled: () => boolean,
                setImmediately?: boolean,
                public whiteBackground?: boolean) {
        super(getActiveColor, setActiveColor, setImmediately, isDisabled);
    }

    public getAllColors(): Color[] {
        const activeColor = this.getActive();
        if (activeColor === undefined || hasWhereApplies(this.colors, c => sameColors(c, activeColor))) {
            return this.colors;
        }
        return [activeColor, ...this.colors];
    }
}