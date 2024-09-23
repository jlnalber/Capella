import RibbonView from "./ribbonView";

export default class RibbonText extends RibbonView {
    constructor(public text: () => string, public title: string) {
        super();
    }
}