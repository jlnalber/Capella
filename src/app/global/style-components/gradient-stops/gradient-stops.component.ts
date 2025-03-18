import { Component, Input } from '@angular/core';
import Picker from '../pickers/picker';
import AbstractPickerComponent from '../abstractPickerComponent';
import { FormsModule } from '@angular/forms';
import { ColorCircleComponent } from 'src/app/prokyon/formula-tab/global/color-circle/color-circle.component';
import { GradientColorStop } from '../../interfaces/canvasStyles/gradientStyle';

@Component({
  selector: 'app-gradient-stops',
  standalone: true,
  imports: [
    FormsModule,
    ColorCircleComponent
  ],
  templateUrl: './gradient-stops.component.html',
  styleUrl: './gradient-stops.component.scss'
})
export class GradientStopsComponent extends AbstractPickerComponent<Picker<GradientColorStop[]>, GradientColorStop[]> {
  @Input({required: true}) public picker?: Picker<GradientColorStop[]>;

  public addStop(): void {
    if (this.picker !== undefined && this.picker.value === undefined) {
      this.picker.value = [];
    }
    if (this.picker !== undefined && this.picker.value !== undefined) {
      this.picker.value.push([0, {r: 0, g: 0, b: 0, a: 1}]);
    }
    this.picker?.triggerChange();
  }

  public removeStop(index: number): void {
    if (this.picker !== undefined && this.picker.value !== undefined) {
      this.picker.value.splice(index, 1);
      this.picker.triggerChange();
    }
  }

}
