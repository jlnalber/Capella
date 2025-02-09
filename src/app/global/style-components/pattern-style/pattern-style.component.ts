import { Component, Input } from '@angular/core';
import AbstractPickerComponent from '../abstractPickerComponent';
import Picker from '../pickers/picker';
import { Pattern } from '../../interfaces/canvasStyles/colorStyle';

@Component({
  selector: 'app-pattern-style',
  standalone: true,
  imports: [],
  templateUrl: './pattern-style.component.html',
  styleUrl: './pattern-style.component.scss'
})
export class PatternStyleComponent extends AbstractPickerComponent<Picker<Pattern>, Pattern> {
  @Input({required: true}) public picker?: Picker<Pattern>;
}
