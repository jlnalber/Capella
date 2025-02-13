import { Pen } from "src/app/whiteboard/global/interfaces/penStyle";
import Picker from "./picker";

export default class PenPicker extends Picker<number> {
    constructor(getActive: () => number | undefined, setActive: (t?: number) => void, private readonly penList: Pen[], setImmediately?: boolean | undefined, isDisabled: () => boolean = () => false) {
        super(getActive, setActive, setImmediately, isDisabled);
    }
}