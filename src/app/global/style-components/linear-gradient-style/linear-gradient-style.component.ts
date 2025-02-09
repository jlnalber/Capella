import { Component, Input } from '@angular/core';
import Picker from '../pickers/picker';
import AbstractPickerComponent from '../abstractPickerComponent';
import { LinearGradient } from '../../interfaces/canvasStyles/colorStyle';

@Component({
  selector: 'app-linear-gradient-style',
  standalone: true,
  imports: [],
  templateUrl: './linear-gradient-style.component.html',
  styleUrl: './linear-gradient-style.component.scss'
})
export class LinearGradientStyleComponent extends AbstractPickerComponent<Picker<LinearGradient>, LinearGradient> {
  @Input({required: true}) public picker?: Picker<LinearGradient>;
}
