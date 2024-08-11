import { WhiteboardService } from 'src/app/services/whiteboard.service';
import { Point } from "../../interfaces/point";
import { PointerContext } from "../pointerController";
import { RenderingContext } from '../renderingContext';
import { RibbonTab } from 'src/app/whiteboard/ribbon/ribbon';
import { Mode } from './mode';
import PenElement from '../canvasElements/penElement';
import { BLACK, darken } from '../../interfaces/color';
import { colors } from '../../interfaces/colors';

export class PenMode extends Mode {
  private pen: PenElement | undefined;

  public override pointerStart(whiteboradService: WhiteboardService, renderingContext: RenderingContext, point: Point, pointerContext: PointerContext): void {
    this.pen = new PenElement(BLACK, 3);
    this.pen.addPoint({
      ...point,
      size: 1
    })
    whiteboradService.addCanvasElements(this.pen);
  }

  public pointerMove(whiteboardService: WhiteboardService, renderingContext: RenderingContext, from: Point, to: Point, pointerContext: PointerContext): void {
    this.pen?.addPoint({
      ...to,
      size: 1
    })
  }

  public override pointerEnd(whiteboradService: WhiteboardService, renderingContext: RenderingContext, point: Point, pointerContext: PointerContext): void {
    
    this.pen?.addPoint({
      ...point,
      size: 1
    })
  }

  public click(whiteboardService: WhiteboardService, renderingContext: RenderingContext, point: Point, pointerContext: PointerContext): void {
    
  }

  public override getExtraRibbons(whiteboardService: WhiteboardService, renderingContext: RenderingContext): RibbonTab[] {
    return [{
      name: 'Stift',
      color: colors[1],
      underlineColor: darken(colors[1], 0.75),
      content: []
    }];
  }

  //public transformInvisibleColor: undefined | ((c: Color) => Color);
}
