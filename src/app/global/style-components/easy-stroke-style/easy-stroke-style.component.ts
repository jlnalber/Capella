import { Component, Input } from '@angular/core';
import Picker from '../pickers/picker';
import { EasyStrokeStyle } from '../../interfaces/canvasStyles/strokeStyle';
import AbstractPickerComponent from '../abstractPickerComponent';

@Component({
  selector: 'app-easy-stroke-style',
  standalone: true,
  imports: [],
  templateUrl: './easy-stroke-style.component.html',
  styleUrl: './easy-stroke-style.component.scss'
})
export class EasyStrokeStyleComponent extends AbstractPickerComponent<Picker<EasyStrokeStyle>, EasyStrokeStyle> {

  @Input({required: true}) public picker?: Picker<EasyStrokeStyle>;

}
