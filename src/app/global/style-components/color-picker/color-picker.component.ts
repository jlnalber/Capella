import { Component, Input } from '@angular/core';
import ColorPicker from '../pickers/colorPicker';
import { areEqualColors, Color, getColorAsRgbaFunction } from '../../interfaces/color';
import AbstractPickerComponent from '../abstractPickerComponent';
import { LoadingComponent } from "../../loading/loading.component";

@Component({
  selector: 'app-color-picker',
  standalone: true,
  imports: [LoadingComponent],
  templateUrl: './color-picker.component.html',
  styleUrl: './color-picker.component.scss'
})
export class ColorPickerComponent extends AbstractPickerComponent<ColorPicker, Color> {
  @Input({required: true}) public picker?: ColorPicker;


  isActiveColor(c: Color): boolean {
    return areEqualColors(c, this.picker?.getActive());
  }

  getStyleToColor(c: Color): string {
    return getColorAsRgbaFunction(c);
  }

  click(c: Color): void {
    if (this.picker && !this.picker.isDisabled()) {
      this.picker.value = c;
    }
  }
}
