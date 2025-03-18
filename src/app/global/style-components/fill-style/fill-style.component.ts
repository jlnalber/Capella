import { AfterViewInit, Component, Input } from '@angular/core';
import Picker from '../pickers/picker';
import FillStyle from '../../interfaces/canvasStyles/fillStyle';
import AbstractPickerComponent from '../abstractPickerComponent';
import { LoadingComponent } from "../../loading/loading.component";
import { FormsModule } from '@angular/forms';
import { ColorStyle } from '../../interfaces/canvasStyles/colorStyle';
import { ColorStyleStyleComponent } from "../color-style-style/color-style-style.component";

@Component({
  selector: 'app-fill-style',
  standalone: true,
  imports: [
    LoadingComponent,
    FormsModule,
    ColorStyleStyleComponent
],
  templateUrl: './fill-style.component.html',
  styleUrl: './fill-style.component.scss'
})
export class FillStyleComponent extends AbstractPickerComponent<Picker<FillStyle>, FillStyle> implements AfterViewInit {
  @Input({required: true}) public picker?: Picker<FillStyle>;
  
  public colorStylePicker?: Picker<ColorStyle>;

  ngAfterViewInit() {
    setTimeout(() => {
      this.colorStylePicker = new Picker<ColorStyle>(() => this.picker?.value?.color, (style?: ColorStyle) => {
        if (style && this.picker !== undefined && this.picker.value !== undefined) {
          this.picker.value.color = style;
          this.picker.triggerChange();
        }
      }, true, () => this.picker?.isDisabled() ?? false);
      this.colorStylePicker.onValueChanged.addListener(() => {
        this.onChange();
      })
    }, 0);
  }
  
}
