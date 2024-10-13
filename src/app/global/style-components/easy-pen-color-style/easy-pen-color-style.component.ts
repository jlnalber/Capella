import { Component, Input } from '@angular/core';
import AbstractPickerComponent from '../abstractPickerComponent';
import { EasyPenColorStyle } from 'src/app/whiteboard/global/interfaces/penStyle';
import Picker from '../pickers/picker';

@Component({
  selector: 'app-easy-pen-color-style',
  standalone: true,
  imports: [],
  templateUrl: './easy-pen-color-style.component.html',
  styleUrl: './easy-pen-color-style.component.scss'
})
export class EasyPenColorStyleComponent extends AbstractPickerComponent<Picker<EasyPenColorStyle>, EasyPenColorStyle> {

  @Input({required: true}) public picker?: Picker<EasyPenColorStyle>;

}

