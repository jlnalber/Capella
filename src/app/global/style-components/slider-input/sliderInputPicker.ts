import Picker from "../pickers/picker";

export default class SliderInputPicker extends Picker<number> {
    constructor (getActive: () => number | undefined, setActive: (t: number) => void, public readonly minValue: number, public readonly maxValue: number, setImmediately?: boolean | undefined) {
        super(getActive, setActive, setImmediately);
    }
}