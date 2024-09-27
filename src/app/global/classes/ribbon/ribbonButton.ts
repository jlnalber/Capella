import RibbonView from "./ribbonView";

export default class RibbonButton extends RibbonView {
    constructor(public name: string, public icon: string, public title: string, protected click: (event: PointerEvent) => void, protected enabled?: () => boolean) {
        super();
    }

    public isEnabled(): boolean {
        return this.enabled === undefined || this.enabled();
    }

    public onClick(event: PointerEvent) {
        if (this.isEnabled()) {
            this.click(event);
        }
    }
}