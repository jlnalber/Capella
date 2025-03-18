import { Component, Input } from '@angular/core';
import AbstractPickerComponent from '../abstractPickerComponent';
import Picker from '../pickers/picker';
import ImageStyle from '../../interfaces/canvasStyles/imageStyle';

@Component({
  selector: 'app-image-style',
  standalone: true,
  imports: [],
  templateUrl: './image-style.component.html',
  styleUrl: './image-style.component.scss'
})
export class ImageStyleComponent extends AbstractPickerComponent<Picker<ImageStyle>, ImageStyle> {
  @Input({required: true}) public picker?: Picker<ImageStyle>;

}