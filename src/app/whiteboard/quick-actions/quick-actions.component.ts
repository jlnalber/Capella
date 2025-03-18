import { Component } from '@angular/core';
import { WhiteboardService } from '../services/whiteboard.service';
import RibbonPenPicker from '../../global/classes/ribbon/ribbonPenPicker';
import { PenMode } from '../global/classes/modes/penMode';
import { Pen } from '../global/interfaces/penStyle';
import { BLACK, Color } from 'src/app/global/interfaces/color';
import { WhiteboardMode } from '../global/classes/modes/whiteboardMode';
import { PointerType } from 'src/app/global/classes/pointerController';
import { PenPickerComponent } from 'src/app/global/style-components/pen-picker/pen-picker.component';

@Component({
  selector: 'app-quick-actions',
  standalone: true,
  imports: [PenPickerComponent],
  templateUrl: './quick-actions.component.html',
  styleUrl: './quick-actions.component.scss'
})
export class QuickActionsComponent {

  private getPenModes(p?: Pen): PenMode[] {
    const res: PenMode[] = [];
    if (this.whiteboardService.mouseMode instanceof PenMode && (p === undefined || this.whiteboardService.mouseMode.pen.style === p.style)) {
      res.push(this.whiteboardService.mouseMode);
    }
    if (this.whiteboardService.penMode instanceof PenMode && (p === undefined || this.whiteboardService.penMode.pen.style === p.style)) {
      res.push(this.whiteboardService.penMode);
    }
    if (this.whiteboardService.touchMode instanceof PenMode && (p === undefined || this.whiteboardService.touchMode.pen.style === p.style)) {
      res.push(this.whiteboardService.touchMode);
    }
    return res;
  }

  public isPenMode(): boolean {
    return this.getPenModes().length !== 0;
  }

  private getColors: (p: Pen) => Color[] = (p: Pen): Color[] => {
    return this.getPenModes(p).map(m => this.getColorForMode(m));
  }

  private getColorForMode(mode: WhiteboardMode): Color {
    const cols = mode.getColorsForExtraRibbons(this.whiteboardService);
    if (cols === undefined) return BLACK;
    return cols[0];
  }

  private setPenStyle: (p: Pen, event: PointerEvent) => void = (p: Pen, event: PointerEvent) => {
    this.setPenStyleForPointerType(p, event.pointerType as PointerType)
  }

  private setPenStyleForPointerType(p: Pen, pointerType: PointerType): void {
    const dict = {
      'touch': 'pen',
      'mouse': 'touch',
      'pen': 'mouse'
    }

    const mode = this.whiteboardService.getModeForPointerType(pointerType);
    if (mode instanceof PenMode) {
      // set the type
      mode.pen = p;
    }
    else {
      // otherwise, try the next type
      const next = dict[pointerType];
      if (next !== undefined && (next === 'pen' || next === 'mouse' || next === 'touch')) {
        this.setPenStyleForPointerType(p, next);
      }
    }
  }

  public penPicker: RibbonPenPicker = new RibbonPenPicker(this.whiteboardService.settings, this.getColors, this.setPenStyle);
   

  constructor(private readonly whiteboardService: WhiteboardService) { }
}
