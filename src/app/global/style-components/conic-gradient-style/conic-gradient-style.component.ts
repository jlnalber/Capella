import { Component, Input } from '@angular/core';
import AbstractPickerComponent from '../abstractPickerComponent';
import Picker from '../pickers/picker';
import { ConicGradient } from '../../interfaces/canvasStyles/colorStyle';

@Component({
  selector: 'app-conic-gradient-style',
  standalone: true,
  imports: [],
  templateUrl: './conic-gradient-style.component.html',
  styleUrl: './conic-gradient-style.component.scss'
})
export class ConicGradientStyleComponent extends AbstractPickerComponent<Picker<ConicGradient>, ConicGradient> {
  @Input({required: true}) public picker?: Picker<ConicGradient>;
}
