import { Color } from "src/app/global/interfaces/color"

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

export class RibbonButton extends RibbonView {
    constructor(public name: string, public icon: string, public title: string, public click: (event: PointerEvent) => void) {
        super();
    }
}

export class RibbonToggle extends RibbonButton {
    constructor(name: string, icon: string, title: string, click: (event: PointerEvent) => void, public active: () => boolean) {
        super(name, icon, title, click);
    }
}

export class RibbonPointerModeToggle extends RibbonToggle {
    constructor(name: string, icon: string, title: string, click: (event: PointerEvent) => void, public activePointers: (() => Color | undefined)[]) {
        super(name, icon, title, click, () => {
            for (let f of this.activePointers) {
                if (f()) {
                    return true;
                }
            }
            return false;
        })
    }
}