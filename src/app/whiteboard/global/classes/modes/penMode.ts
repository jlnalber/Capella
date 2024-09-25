import { Point } from "src/app/global/interfaces/point";
import { PointerContext } from "../../../../global/classes/pointerController";
import { RenderingContext } from '../../../../global/classes/renderingContext';
import { WhiteboardMode } from './whiteboardMode';
import PenElement from '../canvas-elements/penElement';
import { BLACK } from 'src/app/global/interfaces/color';
import { WhiteboardService } from "src/app/whiteboard/services/whiteboard.service";
import { RibbonTab } from "../ribbon/ribbon";
import { DEFAULT_PENS, getPenStyleOfPen, Pen } from "../../interfaces/penStyle";
import RibbonPenPicker from "../ribbon/ribbonPenPicker";

export class PenMode extends WhiteboardMode {
  private penElement: PenElement | undefined;

  public override pointerStart(whiteboardService: WhiteboardService, renderingContext: RenderingContext, point: Point, pointerContext: PointerContext): void {
    this.penElement = new PenElement(getPenStyleOfPen(this.pen));
    this.penElement.addPoint({
      ...point,
      size: 1
    })
    whiteboardService.addCanvasElements(this.penElement);
  }

  public pointerMove(whiteboardService: WhiteboardService, renderingContext: RenderingContext, from: Point, to: Point, pointerContext: PointerContext): void {
    const factor = 3.5;
    const distance = Math.sqrt((from.x - to.x) ** 2 + (to.y - from.y) ** 2) * renderingContext.zoom;
    const pressure = pointerContext.pressure + 0.5;
    const size = Math.max(0.5, Math.min(Math.pow(1 / distance, 1/3) * factor, 2)) * pressure;
    this.penElement?.addPoint({
      ...to,
      size
    })
  }

  public override pointerEnd(whiteboradService: WhiteboardService, renderingContext: RenderingContext, point: Point, pointerContext: PointerContext): void {
    
    this.penElement?.addPoint({
      ...point,
      size: 1
    })

    this.penElement = undefined;
  }

  public click(whiteboardService: WhiteboardService, renderingContext: RenderingContext, point: Point, pointerContext: PointerContext): void {
    this.penElement = new PenElement(getPenStyleOfPen(this.pen));
    this.penElement.addPoint({
      ...point,
      size: 1
    })
    whiteboardService.addCanvasElements(this.penElement);
    this.penElement = undefined;
  }

  public pen: Pen = DEFAULT_PENS[0];

  public override getExtraRibbons(whiteboardService: WhiteboardService, renderingContext: RenderingContext): RibbonTab[] {
    const colors = this.getColorsForExtraRibbons(whiteboardService) ?? [BLACK, BLACK];
    return [{
      name: 'Stift',
      color: colors[0],
      underlineColor: colors[1],
      content: [
        
      ]
    }];
  }

}
