import { Component, Input } from '@angular/core';
import Picker from '../pickers/picker';
import TextStyle from '../../interfaces/canvasStyles/textStyle';
import AbstractPickerComponent from '../abstractPickerComponent';

@Component({
  selector: 'app-text-style',
  standalone: true,
  imports: [],
  templateUrl: './text-style.component.html',
  styleUrl: './text-style.component.scss'
})
export class TextStyleComponent extends AbstractPickerComponent<Picker<TextStyle>, TextStyle> {

  @Input({required: true}) public picker?: Picker<TextStyle>;

}
