import { ResolutionFactorChange, WhiteboardService } from "src/app/whiteboard/services/whiteboard.service";
import { Point } from "src/app/global/interfaces/point";
import { PointerContext } from "../../../../global/classes/pointerController";
import { RenderingContext } from '../../../../global/classes/renderingContext/renderingContext';
import { WhiteboardMode } from './whiteboardMode';
import { RibbonTab } from "../../../../global/classes/ribbon/ribbon";
import AbstractRenderingContext from "src/app/global/classes/renderingContext/abstractRenderingContext";

const SCROLL_RESOLUTIONFACTOR = 0.5; // TODO: setting

export class MoveMode extends WhiteboardMode {

  private _resolutionFactorChange: ResolutionFactorChange | undefined;
  public override pointerStart(service: WhiteboardService, renderingContext: AbstractRenderingContext, point: Point, pointerContext: PointerContext, evt: PointerEvent): void {
      this._resolutionFactorChange = service.requestTemporaryResolutionChange();
      this._resolutionFactorChange.setResolutionFactor([SCROLL_RESOLUTIONFACTOR, SCROLL_RESOLUTIONFACTOR, SCROLL_RESOLUTIONFACTOR, SCROLL_RESOLUTIONFACTOR, 1]);
  }

  public pointerMove(whiteboardService: WhiteboardService, renderingContext: RenderingContext, from: Point, to: Point, pointerContext: PointerContext): void {
    whiteboardService.activePage.setTranslate(
      whiteboardService.activePage.translateX + (to.x - from.x) / pointerContext.pointerCount,
      whiteboardService.activePage.translateY + (to.y - from.y) / pointerContext.pointerCount);
  }

  public override pointerEnd(service: WhiteboardService, renderingContext: AbstractRenderingContext, point: Point, pointerContext: PointerContext, evt: PointerEvent): void {
      this._resolutionFactorChange?.resetResolutionFactor();
      this._resolutionFactorChange = undefined;
  }

  public click(whiteboardService: WhiteboardService, renderingContext: RenderingContext, point: Point, pointerContext: PointerContext): void {
    whiteboardService.activePage.setSelection(point, !pointerContext.ctrlKey);
  }

  public override getExtraRibbons(whiteboardService: WhiteboardService, renderingContext: RenderingContext): RibbonTab[] {
    return [];
  }

  //public transformInvisibleColor: undefined | ((c: Color) => Color);
}
