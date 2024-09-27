import { Component, Input } from '@angular/core';
import RibbonColorPicker from '../../classes/ribbon/ribbonColorPicker';
import { Color, getColorAsRgbaFunction } from '../../interfaces/color';
import { sameColors } from '../../essentials/utils';

@Component({
  selector: 'app-color-picker',
  standalone: true,
  imports: [],
  templateUrl: './color-picker.component.html',
  styleUrl: './color-picker.component.scss'
})
export class ColorPickerComponent {
  @Input({required: true}) colorPicker!: RibbonColorPicker;


  isActiveColor(c: Color): boolean {
    return sameColors(c, this.colorPicker.getActiveColor());
  }

  getStyleToColor(c: Color): string {
    return getColorAsRgbaFunction(c);
  }
}
