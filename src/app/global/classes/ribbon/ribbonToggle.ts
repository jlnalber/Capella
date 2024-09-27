import RibbonButton from "./ribbonButton";

export default class RibbonToggle extends RibbonButton {
    constructor(name: string, icon: string, title: string, click: (event: PointerEvent) => void, public active: () => boolean, enabled?: () => boolean) {
        super(name, icon, title, click, enabled);
    }
}