import { Component, Input } from '@angular/core';
import AbstractPickerComponent from '../abstractPickerComponent';
import Picker from '../pickers/picker';
import { Pen } from 'src/app/whiteboard/global/interfaces/penStyle';

@Component({
  selector: 'app-pen-style',
  standalone: true,
  imports: [],
  templateUrl: './pen-style.component.html',
  styleUrl: './pen-style.component.scss'
})
export class PenStyleComponent extends AbstractPickerComponent<Picker<Pen>, Pen> {
  @Input({required: true}) public picker!: Picker<Pen>;

}
