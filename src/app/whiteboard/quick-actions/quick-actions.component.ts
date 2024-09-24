import { Component } from '@angular/core';
import { PenPickerComponent } from "../ribbon/ribbon-tab/pen-picker/pen-picker.component";
import { WhiteboardService } from '../services/whiteboard.service';
import RibbonPenPicker from '../global/classes/ribbon/ribbonPenPicker';
import { PenMode } from '../global/classes/modes/penMode';

@Component({
  selector: 'app-quick-actions',
  standalone: true,
  imports: [PenPickerComponent],
  templateUrl: './quick-actions.component.html',
  styleUrl: './quick-actions.component.scss'
})
export class QuickActionsComponent {

  private getPenModes(): PenMode[] {
    const res: PenMode[] = [];
    if (this.whiteboardService.mouseMode instanceof PenMode) {
      res.push(this.whiteboardService.mouseMode);
    }
    if (this.whiteboardService.penMode instanceof PenMode) {
      res.push(this.whiteboardService.penMode);
    }
    if (this.whiteboardService.touchMode instanceof PenMode) {
      res.push(this.whiteboardService.touchMode);
    }
    return res;
  }

  public isPenMode(): boolean {
    return this.getPenModes().length !== 0;
  }

  public getPenPicker(): RibbonPenPicker {
    return this.getPenModes()[0].penPicker;
  }

  constructor(private readonly whiteboardService: WhiteboardService) { }
}
