import { Point } from "src/app/global/interfaces/point";
import { PointerContext } from "../../../../global/classes/pointerController";
import { RenderingContext } from '../../../../global/classes/renderingContext/renderingContext';
import { WhiteboardMode } from './whiteboardMode';
import PenElement from '../canvas-elements/penElement';
import { BLACK, Color, getColorAsRgbaFunction } from 'src/app/global/interfaces/color';
import { WhiteboardService } from "src/app/whiteboard/services/whiteboard.service";
import { RibbonTab } from "../../../../global/classes/ribbon/ribbon";
import { DEFAULT_PENS, getPenStyleOfPen, Pen, PenStyle } from "../../interfaces/penStyle";
import ColorPicker from "src/app/global/style-components/pickers/colorPicker";
import RibbonButton from "src/app/global/classes/ribbon/ribbonButton";
import { ViewSettingsDialogComponent } from "src/app/whiteboard/dialogs/view-settings-dialog/view-settings-dialog.component";
import { EditPenQuickActionsComponent } from "src/app/whiteboard/settings/edit-pen-quick-actions/edit-pen-quick-actions.component";
import { ViewPensComponent } from "src/app/whiteboard/settings/view-pens/view-pens.component";
import { instanceOfColor } from "src/app/global/interfaces/canvasStyles/colorStyle";
import { getPenPointFromPreviousPoint } from "src/app/global/interfaces/penPoint";

let presenter: any = undefined;

const loadPresenter = async () => {
  try {
    // @ts-ignore
    presenter = await navigator.ink.requestPresenter();
  } catch { }
}

export class PenMode extends WhiteboardMode {
  private penElement: PenElement | undefined;

  constructor() {
    super();
    loadPresenter().then(() => {});
  }

  public override pointerStart(whiteboardService: WhiteboardService, renderingContext: RenderingContext, point: Point, pointerContext: PointerContext): void {
    this.penElement = new PenElement(whiteboardService.settings, this.getStyleOfPen(whiteboardService));
    whiteboardService.addCanvasElements(true, this.penElement); // do not add point before drawing!
    this.penElement.addPoint(getPenPointFromPreviousPoint(point, undefined, pointerContext, renderingContext), renderingContext);
  }

  public pointerMove(whiteboardService: WhiteboardService, renderingContext: RenderingContext, from: Point, to: Point, pointerContext: PointerContext, evt: PointerEvent): void {
    // TODO: calculation
    /* const factor = 3.5;
    const distance = Math.sqrt((from.x - to.x) ** 2 + (to.y - from.y) ** 2) * renderingContext.zoom;
    const pressure = pointerContext.pressure + 0.5;
    const size = Math.max(0.5, Math.min(Math.pow(1 / distance, 1/3) * factor, 2)) * pressure; */
    this.penElement?.addPoint(getPenPointFromPreviousPoint(to, this.penElement?.getLastPoint(), pointerContext, renderingContext), renderingContext);

    if (presenter && this.penElement) {
      try {
        const colorStyle = this.penElement.penStyle.strokeStyle.color;
        let color = getColorAsRgbaFunction(BLACK)
        if (instanceOfColor(colorStyle)) {
          color = getColorAsRgbaFunction(colorStyle);
        }
        presenter.updateInkTrailStartPoint(evt, {
          color,
          diameter: this.penElement.penStyle.strokeStyle.lineWidth * renderingContext.zoom
        });
      } catch { }
    }
  }

  public override pointerEnd(whiteboardService: WhiteboardService, renderingContext: RenderingContext, point: Point, pointerContext: PointerContext): void {
    
    pointerContext.pressure = 0.5;

    this.penElement?.addPoint(getPenPointFromPreviousPoint(point, this.penElement?.getLastPoint(), pointerContext, renderingContext, true), renderingContext);
    this.penElement?.finish();
    this.penElement = undefined;

    if (presenter) {
      try {
        presenter.clearInkTrail();
      } catch { }
    }
  }

  public click(whiteboardService: WhiteboardService, renderingContext: RenderingContext, point: Point, pointerContext: PointerContext): void {
    this.penElement = new PenElement(whiteboardService.settings, this.getStyleOfPen(whiteboardService));
    this.penElement.addPoint(getPenPointFromPreviousPoint(point, undefined, pointerContext, renderingContext), renderingContext);
    whiteboardService.addCanvasElements(false, this.penElement);
    this.penElement.finish();
    this.penElement = undefined;
  }

  private getStyleOfPen(whiteboardService: WhiteboardService): PenStyle {
    return getPenStyleOfPen(this.pen, whiteboardService.settings.getPens());
  }

  public pen: Pen = DEFAULT_PENS[0];

  public override getExtraRibbons(whiteboardService: WhiteboardService, renderingContext: RenderingContext): RibbonTab[] {
    const colors = this.getColorsForExtraRibbons(whiteboardService) ?? [BLACK, BLACK];
    return [{
      name: 'Stift',
      color: colors[0],
      underlineColor: colors[1],
      content: [
        new ColorPicker(whiteboardService.settings.getColors(), () => this.pen.color, (c: Color) => this.pen.color = c, () => false, true),
        {
          title: 'Stifte verwalten',
          content: [
            new RibbonButton('Bearbeiten', 'edit', 'Stifte bearbeiten', () => {
              ViewSettingsDialogComponent.openViewSettingsDialogComponent(whiteboardService.dialogService, EditPenQuickActionsComponent);
            }),
            new RibbonButton('Anzeigen', 'pen', 'Stifte anzeigen', () => {
              ViewSettingsDialogComponent.openViewSettingsDialogComponent(whiteboardService.dialogService, ViewPensComponent);
            })
          ]
        }
      ]
    }];
  }

}
