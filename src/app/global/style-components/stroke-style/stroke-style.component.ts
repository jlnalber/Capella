import { AfterViewInit, Component, Input } from '@angular/core';
import Picker from '../pickers/picker';
import { EasyStrokeStyle, StrokeStyle } from '../../interfaces/canvasStyles/strokeStyle';
import AbstractPickerComponent from '../abstractPickerComponent';
import { LoadingComponent } from "../../loading/loading.component";
import { UniversalStrokeStyleComponent } from "../universal-stroke-style/universal-stroke-style.component";

@Component({
  selector: 'app-stroke-style',
  standalone: true,
  imports: [LoadingComponent, UniversalStrokeStyleComponent],
  templateUrl: './stroke-style.component.html',
  styleUrl: './stroke-style.component.scss'
})
export class StrokeStyleComponent extends AbstractPickerComponent<Picker<StrokeStyle>, StrokeStyle> implements AfterViewInit {

  @Input({required: true}) public picker?: Picker<StrokeStyle>;


  public strokeStylePicker?: Picker<StrokeStyle | EasyStrokeStyle>;

  public ngAfterViewInit(): void {
      setTimeout(() => {
        this.strokeStylePicker = new Picker<StrokeStyle | EasyStrokeStyle>(() => this.picker?.value, (t: EasyStrokeStyle | StrokeStyle | undefined) => {
          if (this.picker) {
            this.picker.value = t as StrokeStyle | undefined
          }
        }, true, () => this.picker?.isDisabled() ?? true);
        this.strokeStylePicker.onValueChanged.addListener(() => {
          this.onChange();
        })
      }, 0)
  }

}
