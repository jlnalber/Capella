import { Component, Input } from '@angular/core';
import ColorPicker from '../pickers/colorPicker';
import { Color, getColorAsRgbaFunction } from '../../interfaces/color';
import { sameColors } from '../../essentials/utils';
import AbstractPickerComponent from '../abstractPickerComponent';

@Component({
  selector: 'app-color-picker',
  standalone: true,
  imports: [],
  templateUrl: './color-picker.component.html',
  styleUrl: './color-picker.component.scss'
})
export class ColorPickerComponent extends AbstractPickerComponent<ColorPicker, Color> {
  @Input({required: true}) public picker?: ColorPicker;


  isActiveColor(c: Color): boolean {
    return sameColors(c, this.picker?.getActive());
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
