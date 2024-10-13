import { Component, Input } from '@angular/core';
import Picker from '../pickers/picker';
import { EasyPenStyle } from 'src/app/whiteboard/global/interfaces/penStyle';
import AbstractPickerComponent from '../abstractPickerComponent';

@Component({
  selector: 'app-easy-pen-style-style',
  standalone: true,
  imports: [],
  templateUrl: './easy-pen-style-style.component.html',
  styleUrl: './easy-pen-style-style.component.scss'
})
export class EasyPenStyleStyleComponent extends AbstractPickerComponent<Picker<EasyPenStyle>, EasyPenStyle> {

  @Input({required: true}) public picker?: Picker<EasyPenStyle>;

}
