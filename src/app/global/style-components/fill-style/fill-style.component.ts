import { Component, Input } from '@angular/core';
import Picker from '../pickers/picker';
import FillStyle from '../../interfaces/canvasStyles/fillStyle';
import AbstractPickerComponent from '../abstractPickerComponent';

@Component({
  selector: 'app-fill-style',
  standalone: true,
  imports: [],
  templateUrl: './fill-style.component.html',
  styleUrl: './fill-style.component.scss'
})
export class FillStyleComponent extends AbstractPickerComponent<Picker<FillStyle>, FillStyle> {
  @Input({required: true}) public picker?: Picker<FillStyle>;

}
