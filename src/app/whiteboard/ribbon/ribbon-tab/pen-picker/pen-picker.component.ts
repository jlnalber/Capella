import { Component, Input } from '@angular/core';
import { getColorAsRgbaFunction } from 'src/app/global/interfaces/color';
import RibbonPenPicker from 'src/app/whiteboard/global/classes/ribbon/ribbonPenPicker';
import { Pen } from 'src/app/whiteboard/global/interfaces/penStyle';
import { WhiteboardService } from 'src/app/whiteboard/services/whiteboard.service';

@Component({
  selector: 'app-pen-picker',
  standalone: true,
  imports: [],
  templateUrl: './pen-picker.component.html',
  styleUrl: './pen-picker.component.scss'
})
export class PenPickerComponent {
  @Input({required: true}) penPicker!: RibbonPenPicker;

  constructor(private readonly whiteboardService: WhiteboardService) {}


  public getColor(pen: Pen): string {
    if (this.penPicker.isActive(pen)) {
      return getColorAsRgbaFunction(this.penPicker.getActiveColor(this.whiteboardService));
    }
    return 'transparent'
  }
}
