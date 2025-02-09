import { Component, Input } from '@angular/core';
import AbstractPickerComponent from '../abstractPickerComponent';
import PenPicker from '../pickers/penPicker';

@Component({
  selector: 'app-choose-pen-style',
  standalone: true,
  imports: [],
  templateUrl: './choose-pen-style.component.html',
  styleUrl: './choose-pen-style.component.scss'
})
export class ChoosePenStyleComponent extends AbstractPickerComponent<PenPicker, number> {
  @Input({required: true}) public picker?: PenPicker;
}
