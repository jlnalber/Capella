import { Component, Input } from '@angular/core';
import AbstractPickerComponent from '../abstractPickerComponent';
import SliderInputPicker from './sliderInputPicker';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-slider-input',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './slider-input.component.html',
  styleUrl: './slider-input.component.scss'
})
export class SliderInputComponent extends AbstractPickerComponent<SliderInputPicker, number> {
  
  @Input({required: true}) public picker?: SliderInputPicker | undefined;

  public get val(): number {
    return this.picker?.value ?? 0;
  }

  public set val(value: number) {
    if (this.picker) {
      this.picker.value = value;
    }
  }

  public get min(): number {
    return this.picker?.minValue ?? 0;
  }

  public get max(): number {
    return this.picker?.maxValue ?? 0;
  }
}
