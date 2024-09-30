import RibbonView from "../../classes/ribbon/ribbonView";

export default class Picker<T> extends RibbonView {
    constructor(public readonly getActive: () => T | undefined,
                public readonly setActive: (t: T) => void,
                public setImmediately?: boolean) {
        super();
        this.value = this.getActive();
    }

    public set value(val: undefined | T) {
        this._value = val;
        if (this.setImmediately && val !== undefined) {
            this.setActive(val);
        }
    }

    public get value(): T | undefined {
        return this._value;
    }
    protected _value?: T;
}