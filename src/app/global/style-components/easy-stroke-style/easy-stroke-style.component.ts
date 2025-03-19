import { Component, Input } from '@angular/core';
import Picker from '../pickers/picker';
import { EasyStrokeStyle, StrokeStyle } from '../../interfaces/canvasStyles/strokeStyle';
import AbstractPickerComponent from '../abstractPickerComponent';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from "../../loading/loading.component";
import { UniversalStrokeStyleComponent } from "../universal-stroke-style/universal-stroke-style.component";

@Component({
  selector: 'app-easy-stroke-style',
  standalone: true,
  imports: [
    LoadingComponent,
    UniversalStrokeStyleComponent
],
  templateUrl: './easy-stroke-style.component.html',
  styleUrl: './easy-stroke-style.component.scss'
})
export class EasyStrokeStyleComponent extends AbstractPickerComponent<Picker<EasyStrokeStyle>, EasyStrokeStyle> {

  @Input({required: true}) public picker?: Picker<EasyStrokeStyle>;

  public strokeStylePicker?: Picker<StrokeStyle | EasyStrokeStyle>;

  public ngAfterViewInit(): void {
      setTimeout(() => {
        this.strokeStylePicker = new Picker<StrokeStyle | EasyStrokeStyle>(() => this.picker?.value, (t: EasyStrokeStyle | StrokeStyle | undefined) => {
          if (this.picker) {
            this.picker.value = t as EasyStrokeStyle | undefined
          }
        }, true, () => this.picker?.isDisabled() ?? true);
        this.strokeStylePicker.onValueChanged.addListener(() => {
          this.onChange();
        })
      }, 0)
  }
}
