import { WhiteboardService } from 'src/app/services/whiteboard.service';
import { Point } from "../../interfaces/point";
import { PointerContext } from "../pointerController";
import { RenderingContext } from '../renderingContext';
import { RibbonTab } from 'src/app/whiteboard/ribbon/ribbon';
import { Mode } from './mode';

export class MoveMode extends Mode {

  public pointerMove(whiteboardService: WhiteboardService, renderingContext: RenderingContext, from: Point, to: Point, pointerContext: PointerContext): void {
    whiteboardService.activePage.translateX += (to.x - from.x) / pointerContext.pointerCount;
    whiteboardService.activePage.translateY += (to.y - from.y) / pointerContext.pointerCount;
  }

  public click(whiteboardService: WhiteboardService, renderingContext: RenderingContext, point: Point, pointerContext: PointerContext): void {
    whiteboardService.activePage.setSelection(point, !pointerContext.ctrlKey);
  }

  public override getExtraRibbons(whiteboardService: WhiteboardService, renderingContext: RenderingContext): RibbonTab[] {
    return [];
  }

  //public transformInvisibleColor: undefined | ((c: Color) => Color);
}
