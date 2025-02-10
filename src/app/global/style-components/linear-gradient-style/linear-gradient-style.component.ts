import { Component, Input } from '@angular/core';
import Picker from '../pickers/picker';
import AbstractPickerComponent from '../abstractPickerComponent';
import { GradientColorStop, LinearGradient } from '../../interfaces/canvasStyles/colorStyle';
import { GradientStopsComponent } from "../gradient-stops/gradient-stops.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-linear-gradient-style',
  standalone: true,
  imports: [
    GradientStopsComponent,
    FormsModule
  ],
  templateUrl: './linear-gradient-style.component.html',
  styleUrl: './linear-gradient-style.component.scss'
})
export class LinearGradientStyleComponent extends AbstractPickerComponent<Picker<LinearGradient>, LinearGradient> {
  @Input({required: true}) public picker?: Picker<LinearGradient>;

  public gradientStopPicker: Picker<GradientColorStop[]> = new Picker<GradientColorStop[]>(() => this.picker?.value?.stops, (stops: GradientColorStop[]) => {
    if (this.picker !== undefined && this.picker.value !== undefined) {
      this.picker.value.stops = stops;
      this.picker.triggerChange();
    }
  }, true, () => this.picker?.isDisabled() ?? false);


}
