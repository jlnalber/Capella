import { Component, Input } from '@angular/core';
import AbstractPickerComponent from '../abstractPickerComponent';
import Picker from '../pickers/picker';
import { ConicGradient, GradientColorStop } from '../../interfaces/canvasStyles/colorStyle';
import { FormsModule } from '@angular/forms';
import { GradientStopsComponent } from '../gradient-stops/gradient-stops.component';

@Component({
  selector: 'app-conic-gradient-style',
  standalone: true,
  imports: [
    FormsModule,
    GradientStopsComponent
  ],
  templateUrl: './conic-gradient-style.component.html',
  styleUrl: './conic-gradient-style.component.scss'
})
export class ConicGradientStyleComponent extends AbstractPickerComponent<Picker<ConicGradient>, ConicGradient> {
  @Input({required: true}) public picker?: Picker<ConicGradient>;

  public gradientStopPicker: Picker<GradientColorStop[]> = new Picker<GradientColorStop[]>(() => this.picker?.value?.stops, (stops: GradientColorStop[]) => {
    if (this.picker !== undefined && this.picker.value !== undefined) {
      this.picker.value.stops = stops;
      this.picker.triggerChange();
    }
  }, true, () => this.picker?.isDisabled() ?? false);
}
