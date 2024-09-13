import { WhiteboardService } from 'src/app/services/whiteboard.service';
import { Point } from "../../interfaces/point";
import { PointerContext } from "../pointerController";
import { RenderingContext } from '../renderingContext';
import { RibbonTab } from 'src/app/whiteboard/ribbon/ribbon';
import { Mode } from './mode';
import TextBox from '../textBox';

const inp = document.createElement('textarea');
document.body.appendChild(inp);
inp.tabIndex = -1;
//inp.autocomplete = 'off';
inp.spellcheck = false;
inp.cols = 40000;
//inp.autocapitalize = 'off';
//inp.setAttribute('autocorrect', 'off')
inp.style.position = 'absolute';
inp.style.top = '-25px';
inp.style.left = '-25px';
inp.style.height = '10px';
inp.style.width = '100%';

export default abstract class AbstractTextMode extends Mode {

    protected abstract getTextBox(whiteBoardService: WhiteboardService): TextBox;

    public override pointerStart(whiteboardService: WhiteboardService, renderingContext: RenderingContext, point: Point, pointerContext: PointerContext): void {
        this.getTextBox(whiteboardService).click(renderingContext, point, inp, false);    
    }

    public override pointerEnd(whiteboardService: WhiteboardService, renderingContext: RenderingContext, point: Point, pointerContext: PointerContext): void {
        this.getTextBox(whiteboardService).click(renderingContext, point, inp, true);
    }

    public pointerMove(whiteboardService: WhiteboardService, renderingContext: RenderingContext, from: Point, to: Point, pointerContext: PointerContext): void {
        this.getTextBox(whiteboardService).click(renderingContext, to, inp, true);
    }

    public click(whiteboardService: WhiteboardService, renderingContext: RenderingContext, point: Point, pointerContext: PointerContext): void {
        const textBox = this.getTextBox(whiteboardService);
        textBox.click(renderingContext, point, inp, pointerContext.shiftKey);
        inp.value = textBox.getText();
        inp.onkeyup = (ev: KeyboardEvent) => {
            textBox.onKey(ev, inp, renderingContext, true);
        }
        inp.onkeydown = (ev: KeyboardEvent) => {
            textBox.onKey(ev, inp, renderingContext, false);
        }
        inp.focus();
    }

    public override getExtraRibbons(whiteboardService: WhiteboardService, renderingContext: RenderingContext): RibbonTab[] {
        return [];
    }
}