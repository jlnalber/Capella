import { Component, Input } from '@angular/core';
import Picker from '../pickers/picker';
import { PenStyle } from 'src/app/whiteboard/global/interfaces/penStyle';
import AbstractPickerComponent from '../abstractPickerComponent';

@Component({
  selector: 'app-pen-style-style',
  standalone: true,
  imports: [],
  templateUrl: './pen-style-style.component.html',
  styleUrl: './pen-style-style.component.scss'
})
export class PenStyleStyleComponent extends AbstractPickerComponent<Picker<PenStyle>, PenStyle> {

  @Input({required: true}) public picker!: Picker<PenStyle>;

}
