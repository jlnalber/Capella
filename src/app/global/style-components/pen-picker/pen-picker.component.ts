import { Component, Input } from '@angular/core';
import { getColorAsRgbaFunction } from 'src/app/global/interfaces/color';
import RibbonPenPicker from 'src/app/global/classes/ribbon/ribbonPenPicker';
import { Pen } from 'src/app/whiteboard/global/interfaces/penStyle';
import { WhiteboardService } from 'src/app/whiteboard/services/whiteboard.service';
import AbstractPickerComponent from '../abstractPickerComponent';
import { LoadingComponent } from "../../loading/loading.component";

@Component({
  selector: 'app-pen-picker',
  standalone: true,
  imports: [LoadingComponent],
  templateUrl: './pen-picker.component.html',
  styleUrl: './pen-picker.component.scss'
})
export class PenPickerComponent {
  @Input({required: true}) penPicker?: RibbonPenPicker;

  constructor(private readonly whiteboardService: WhiteboardService) {}


  public getStyle(pen: Pen): string {
    if (this.penPicker) {
      const cols = this.penPicker.getColors(pen);
      if (cols.length === 0) {
        return 'background: transparent;'
      }
      else if (cols.length === 1) {
        return `background: ${getColorAsRgbaFunction(cols[0])}`
      }
      
      const size = Math.floor(360 / cols.length); 
      let conicGradient = `${getColorAsRgbaFunction(cols[0])} 0deg`;
      for (let i = 1; i < cols.length; i++) {
        const angle = size * i;
        conicGradient += `, ${getColorAsRgbaFunction(cols[i - 1])} ${angle}deg, ${getColorAsRgbaFunction(cols[i])} ${angle}deg`;
      }
      conicGradient = `background-image: linear-gradient(white, white), conic-gradient(${conicGradient});`;

      const borderSize = 5;
      const height = 60 - 2 * borderSize;
      return `background-origin: border-box;
    background-clip: content-box, border-box;
    height: ${height}px !important;
    width: ${height}px !important;
    border: double ${borderSize}px transparent; ${conicGradient}`;
    }
    return '';
  }
}
