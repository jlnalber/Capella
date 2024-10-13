import { Component, Input } from '@angular/core';
import Picker from '../pickers/picker';
import AbstractPickerComponent from '../abstractPickerComponent';
import { Icon } from '../../interfaces/icon';

@Component({
  selector: 'app-icon-picker',
  standalone: true,
  imports: [],
  templateUrl: './icon-picker.component.html',
  styleUrl: './icon-picker.component.scss'
})
export class IconPickerComponent extends AbstractPickerComponent<Picker<Icon>, Icon> {
  @Input({required: true}) public picker?: Picker<Icon>;

}
