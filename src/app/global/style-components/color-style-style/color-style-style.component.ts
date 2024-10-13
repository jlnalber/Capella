import { Component, Input } from '@angular/core';
import Picker from '../pickers/picker';
import { ColorStyle } from '../../interfaces/canvasStyles/colorStyle';
import AbstractPickerComponent from '../abstractPickerComponent';

@Component({
  selector: 'app-color-style-style',
  standalone: true,
  imports: [],
  templateUrl: './color-style-style.component.html',
  styleUrl: './color-style-style.component.scss'
})
export class ColorStyleStyleComponent extends AbstractPickerComponent<Picker<ColorStyle>, ColorStyle> {

  @Input({required: true}) public picker?: Picker<ColorStyle>;

}
