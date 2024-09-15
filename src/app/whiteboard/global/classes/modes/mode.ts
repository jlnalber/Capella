import { Point } from "../../interfaces/point";
import { PointerContext, pointerTypes } from "../pointerController";
import { RenderingContext } from '../renderingContext';
import { Color, darken } from '../../interfaces/color';
import { colors } from '../../styles/colors';
import { RibbonTab } from 'src/app/whiteboard/whiteboard/ribbon/ribbon';
import { WhiteboardService } from "src/app/whiteboard/services/whiteboard.service";

export abstract class Mode {

  public abstract pointerMove(whiteboardService: WhiteboardService, renderingContext: RenderingContext, from: Point, to: Point, pointerContext: PointerContext): void;

  public pointerStart(whiteboradService: WhiteboardService, renderingContext: RenderingContext, point: Point, pointerContext: PointerContext): void { }

  public pointerEnd(whiteboradService: WhiteboardService, renderingContext: RenderingContext, point: Point, pointerContext: PointerContext): void { }

  public abstract click(whiteboardService: WhiteboardService, renderingContext: RenderingContext, point: Point, pointerContext: PointerContext): void;

  public getExtraRibbons(whiteboardService: WhiteboardService, renderingContext: RenderingContext): RibbonTab[] {
    return [];
  }

  protected getColorsForExtraRibbons(whiteboardService: WhiteboardService, renderingContext: RenderingContext): [Color, Color] | undefined {
    let c: Color | undefined;
    for (let i = 0; i < pointerTypes.length; i++) {
      const type = pointerTypes[i];
      if (this === whiteboardService.getModeForPointerType(type)) {
        c = colors[i];
      }
    }
    if (c) {
      return [c, darken(c, 0.75)];
    }
    return undefined;
  }

  //public transformInvisibleColor: undefined | ((c: Color) => Color);
}
