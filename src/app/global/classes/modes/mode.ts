import { WhiteboardService } from 'src/app/services/whiteboard.service';
import { Point } from "../../interfaces/point";
import { PointerContext } from "../pointerController";
import { RenderingContext } from '../renderingContext';
import { RibbonTab } from 'src/app/whiteboard/ribbon/ribbon';

export abstract class Mode {

  public abstract pointerMove(whiteboardService: WhiteboardService, renderingContext: RenderingContext, from: Point, to: Point, pointerContext: PointerContext): void;

  public pointerStart(whiteboradService: WhiteboardService, renderingContext: RenderingContext, point: Point, pointerContext: PointerContext): void { }

  public pointerEnd(whiteboradService: WhiteboardService, renderingContext: RenderingContext, point: Point, pointerContext: PointerContext): void { }

  public abstract click(whiteboardService: WhiteboardService, renderingContext: RenderingContext, point: Point, pointerContext: PointerContext): void;

  public getExtraRibbons(whiteboardService: WhiteboardService, renderingContext: RenderingContext): RibbonTab[] {
    return [];
  }

  //public transformInvisibleColor: undefined | ((c: Color) => Color);
}
