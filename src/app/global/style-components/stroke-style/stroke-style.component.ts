import { Component, Input } from '@angular/core';
import Picker from '../pickers/picker';
import { StrokeStyle } from '../../interfaces/canvasStyles/strokeStyle';
import AbstractPickerComponent from '../abstractPickerComponent';

@Component({
  selector: 'app-stroke-style',
  standalone: true,
  imports: [],
  templateUrl: './stroke-style.component.html',
  styleUrl: './stroke-style.component.scss'
})
export class StrokeStyleComponent extends AbstractPickerComponent<Picker<StrokeStyle>, StrokeStyle> {

  @Input({required: true}) public picker?: Picker<StrokeStyle>;

}
