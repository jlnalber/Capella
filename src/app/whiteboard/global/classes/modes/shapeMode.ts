import { WhiteboardService } from "src/app/whiteboard/services/whiteboard.service";
import { Point } from "src/app/global/interfaces/point";
import { PointerContext } from "../../../../global/classes/pointerController";
import { RenderingContext } from '../../../../global/classes/renderingContext';
import { WhiteboardMode } from './whiteboardMode';
import { RibbonTab } from "../../../../global/classes/ribbon/ribbon";
import { WhiteboardSettingsService } from "src/app/whiteboard/services/whiteboard-settings.service";

export class ShapeMode extends WhiteboardMode {

  public pointerMove(whiteboardService: WhiteboardService, renderingContext: RenderingContext, from: Point, to: Point, pointerContext: PointerContext): void {
    throw 'impl'
  }

  public click(whiteboardService: WhiteboardService, renderingContext: RenderingContext, point: Point, pointerContext: PointerContext): void {
    throw 'impl'
  }

  public override getExtraRibbons(whiteboardService: WhiteboardService, settingService: WhiteboardSettingsService, renderingContext: RenderingContext): RibbonTab[] {
    return [];
  }

  //public transformInvisibleColor: undefined | ((c: Color) => Color);
}
