import { Component, Input } from '@angular/core';
import Picker from '../pickers/picker';
import AbstractPickerComponent from '../abstractPickerComponent';
import { GradientColorStop } from '../../interfaces/canvasStyles/colorStyle';

@Component({
  selector: 'app-gradient-stops',
  standalone: true,
  imports: [],
  templateUrl: './gradient-stops.component.html',
  styleUrl: './gradient-stops.component.scss'
})
export class GradientStopsComponent extends AbstractPickerComponent<Picker<GradientColorStop[]>, GradientColorStop[]> {
  @Input({required: true}) public picker?: Picker<GradientColorStop[]>;

}
