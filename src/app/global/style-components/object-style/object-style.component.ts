import { Component, Input } from '@angular/core';
import AbstractPickerComponent from '../abstractPickerComponent';
import ObjectStyle from '../../interfaces/canvasStyles/objectStyle';
import Picker from '../pickers/picker';

@Component({
  selector: 'app-object-style',
  standalone: true,
  imports: [],
  templateUrl: './object-style.component.html',
  styleUrl: './object-style.component.scss'
})
export class ObjectStyleComponent extends AbstractPickerComponent<Picker<ObjectStyle>, ObjectStyle> {
  @Input({required: true}) public picker?: Picker<ObjectStyle>;

}
