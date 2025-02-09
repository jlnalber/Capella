import RibbonView from "../../classes/ribbon/ribbonView";
import { Event } from "../../essentials/event";

export default class Picker<T> extends RibbonView {
    constructor(public readonly getActive: () => T | undefined,
                public readonly setActive: (t: T) => void,
                public setImmediately?: boolean,
                public readonly isDisabled: () => boolean = () => false) {
        super();
        this.value = this.getActive();
    }

    public readonly onValueChanged: Event<T> = new Event<T>();

    public set value(val: undefined | T) {
        this._value = val;
        if (this.setImmediately && val !== undefined) {
            this.setActive(val);
        }
        this.onValueChanged.emit(val);
    }

    public get value(): T | undefined {
        return this._value;
    }
    protected _value?: T;
}