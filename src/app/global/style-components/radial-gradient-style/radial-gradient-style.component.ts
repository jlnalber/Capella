import { Component, Input } from '@angular/core';
import AbstractPickerComponent from '../abstractPickerComponent';
import Picker from '../pickers/picker';
import { RadialGradient } from '../../interfaces/canvasStyles/colorStyle';

@Component({
  selector: 'app-radial-gradient-style',
  standalone: true,
  imports: [],
  templateUrl: './radial-gradient-style.component.html',
  styleUrl: './radial-gradient-style.component.scss'
})
export class RadialGradientStyleComponent extends AbstractPickerComponent<Picker<RadialGradient>, RadialGradient> {
  @Input({required: true}) public picker?: Picker<RadialGradient>;
}
