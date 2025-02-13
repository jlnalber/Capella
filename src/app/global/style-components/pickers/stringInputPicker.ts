import Picker from "../pickers/picker";

export default class StringInputPicker extends Picker<string> {
    constructor (getActive: () => string | undefined, setActive: (t?: string) => void, public label: string, setImmediately?: boolean | undefined) {
        super(getActive, setActive, setImmediately)
    }
}