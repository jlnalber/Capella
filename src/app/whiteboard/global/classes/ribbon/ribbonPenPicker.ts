import { Color } from "src/app/global/interfaces/color";
import { Pen } from "../../interfaces/penStyle";
import RibbonView from "./ribbonView";


export default class RibbonPenPicker extends RibbonView {
    
    private additionalPens: Pen[];
    
    constructor(private readonly pens: Pen[],
                private readonly setAdditionalPens: (pens: Pen[]) => void,
                private readonly getAdditionalPens: () => Pen[],
                public readonly isActive: (pen: Pen) => boolean,
                public readonly setActive: (pen: Pen) => void,
                public readonly activeColor: Color) {
        super();

        this.additionalPens = this.getAdditionalPens();
    }

    public get allPens(): Pen[] {
        return [...this.pens, ...this.additionalPens];
    }
}