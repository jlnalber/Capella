import { Color } from "src/app/global/interfaces/color";

export type Ribbon = {
    ribbonTabs: RibbonTab[]
}

export type RibbonTab = {
    name: string,
    color: Color,
    underlineColor: Color,
    content: Content[]
}

export type Content = RibbonView | Divider;

export type Divider = {
    title: string,
    content: Content[]
}

export abstract class RibbonView { }

export class RibbonText {
    constructor(public text: () => string, public title: string) { }
}

export class RibbonButton extends RibbonView {
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

export class RibbonToggle extends RibbonButton {
    constructor(name: string, icon: string, title: string, click: (event: PointerEvent) => void, public active: () => boolean, enabled?: () => boolean) {
        super(name, icon, title, click, enabled);
    }
}

export class RibbonPointerModeToggle extends RibbonToggle {
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