import { pointerTypes } from "../../../../global/classes/pointerController";
import { RenderingContext } from '../../../../global/classes/renderingContext';
import { Color, darken } from 'src/app/global/interfaces/color';
import { colors } from '../../../../global/styles/colors';
import { WhiteboardService } from "src/app/whiteboard/services/whiteboard.service";
import { Mode } from "src/app/global/classes/modes/mode";
import { RibbonTab } from "../ribbon/ribbon";

export abstract class WhiteboardMode extends Mode<WhiteboardService> {

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
}
