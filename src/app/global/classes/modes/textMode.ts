import { WhiteboardService } from 'src/app/services/whiteboard.service';
import { Point } from "../../interfaces/point";
import { PointerContext } from "../pointerController";
import { RenderingContext } from '../renderingContext';
import { RibbonTab } from 'src/app/whiteboard/ribbon/ribbon';
import { Mode } from './mode';

const inp = document.createElement('textarea');
document.body.appendChild(inp);
inp.tabIndex = -1;
//inp.autocomplete = 'off';
inp.spellcheck = false;
inp.cols = 40000;
//inp.autocapitalize = 'off';
//inp.setAttribute('autocorrect', 'off')
//inp.style.position = 'absolute';
//inp.style.top = '-25px';
//inp.style.left = '-25px';
//inp.style.height = '10px';
//inp.style.width = '10px';

export class TextMode extends Mode {

  public override pointerStart(whiteboardService: WhiteboardService, renderingContext: RenderingContext, point: Point, pointerContext: PointerContext): void {
    whiteboardService.activePage.text.click(renderingContext, point, inp, false);    
  }

  public override pointerEnd(whiteboardService: WhiteboardService, renderingContext: RenderingContext, point: Point, pointerContext: PointerContext): void {
    whiteboardService.activePage.text.click(renderingContext, point, inp, true);
  }

  public pointerMove(whiteboardService: WhiteboardService, renderingContext: RenderingContext, from: Point, to: Point, pointerContext: PointerContext): void {
    whiteboardService.activePage.text.click(renderingContext, to, inp, true);
  }

  public click(whiteboardService: WhiteboardService, renderingContext: RenderingContext, point: Point, pointerContext: PointerContext): void {
    whiteboardService.activePage.text.click(renderingContext, point, inp, pointerContext.shiftKey);
    inp.value = whiteboardService.activePage.text.getText();
    inp.onkeyup = (ev: KeyboardEvent) => {
      const val = inp.value;
      //inp.value = '';
      //ev.preventDefault();
      //console.log(ev);
      whiteboardService.activePage.text.setText(val, {
        endSelection: inp.selectionEnd,
        startSelection: inp.selectionStart
      }, renderingContext);
    }
    inp.focus();
  }

  public override getExtraRibbons(whiteboardService: WhiteboardService, renderingContext: RenderingContext): RibbonTab[] {
    return [];
  }

  //public transformInvisibleColor: undefined | ((c: Color) => Color);
}
