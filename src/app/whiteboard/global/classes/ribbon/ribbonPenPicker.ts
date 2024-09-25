import { Color } from "src/app/global/interfaces/color";
import { Pen } from "../../interfaces/penStyle";
import RibbonView from "./ribbonView";


export default class RibbonPenPicker extends RibbonView {
    
    private additionalPens: Pen[];
    
    constructor(private readonly pens: Pen[],
                private readonly setAdditionalPens: (pens: Pen[]) => void,
                private readonly getAdditionalPens: () => Pen[],
                public readonly getColors: (pen: Pen) => Color[],
                public readonly setActive: (pen: Pen, event: PointerEvent) => void) {
        super();

        this.additionalPens = this.getAdditionalPens();
    }

    public get allPens(): Pen[] {
        return [...this.pens, ...this.additionalPens];
    }

    public isActive(pen: Pen): boolean {
        return this.getColors(pen).length !== 0;
    }

    public isHyperActive(pen: Pen): boolean {
        return this.getColors(pen).length > 1;
    }
}