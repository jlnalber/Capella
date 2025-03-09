import { AfterViewInit } from "@angular/core";
import { Gradient, GradientColorStop } from "../../interfaces/canvasStyles/colorStyle";
import AbstractPickerComponent from "../abstractPickerComponent";
import Picker from "../pickers/picker";

export default abstract class GradientStyle<T extends Gradient> extends AbstractPickerComponent<Picker<T>, T> {
    
  public gradientStopPicker?: Picker<GradientColorStop[]>;
  
  protected init() {
    setTimeout(() => {
      this.gradientStopPicker = new Picker<GradientColorStop[]>(() => this.picker?.value?.stops, (stops?: GradientColorStop[]) => {
        if (stops && this.picker !== undefined && this.picker.value !== undefined) {
          this.picker.value.stops = stops;
          this.picker.triggerChange();
        }
      }, true, () => this.picker?.isDisabled() ?? false);
      this.gradientStopPicker.onValueChanged.addListener(() => {
        this.onChange();
      })
    }, 0);
  }

}