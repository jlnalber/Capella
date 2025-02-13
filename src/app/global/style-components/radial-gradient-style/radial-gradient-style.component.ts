import { Component, Input } from '@angular/core';
import AbstractPickerComponent from '../abstractPickerComponent';
import Picker from '../pickers/picker';
import { GradientColorStop, RadialGradient } from '../../interfaces/canvasStyles/colorStyle';
import { FormsModule } from '@angular/forms';
import { GradientStopsComponent } from '../gradient-stops/gradient-stops.component';

@Component({
  selector: 'app-radial-gradient-style',
  standalone: true,
  imports: [
    FormsModule,
    GradientStopsComponent
  ],
  templateUrl: './radial-gradient-style.component.html',
  styleUrl: './radial-gradient-style.component.scss'
})
export class RadialGradientStyleComponent extends AbstractPickerComponent<Picker<RadialGradient>, RadialGradient> {
  @Input({required: true}) public picker?: Picker<RadialGradient>;
  
  public gradientStopPicker: Picker<GradientColorStop[]> = new Picker<GradientColorStop[]>(() => this.picker?.value?.stops, (stops?: GradientColorStop[]) => {
    if (stops !== undefined && this.picker !== undefined && this.picker.value !== undefined) {
      this.picker.value.stops = stops;
      this.picker.triggerChange();
    }
  }, true, () => this.picker?.isDisabled() ?? false);

}