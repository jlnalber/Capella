import { AfterViewChecked, AfterViewInit, Component, Input } from '@angular/core';
import Picker from '../pickers/picker';
import { EasyPenStyle } from 'src/app/whiteboard/global/interfaces/penStyle';
import AbstractPickerComponent from '../abstractPickerComponent';
import { EasyStrokeStyleComponent } from "../easy-stroke-style/easy-stroke-style.component";
import { EasyStrokeStyle } from '../../interfaces/canvasStyles/strokeStyle';
import { ObjectStyleComponent } from "../object-style/object-style.component";
import ObjectStyle from '../../interfaces/canvasStyles/objectStyle';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from "../../loading/loading.component";
import { SelectObjectStyleComponent } from "../select-object-style/select-object-style.component";
import FillStyle from '../../interfaces/canvasStyles/fillStyle';
import { SelectFillStyleComponent } from "../select-fill-style/select-fill-style.component";

@Component({
  selector: 'app-easy-pen-style-style',
  standalone: true,
  imports: [
    EasyStrokeStyleComponent,
    FormsModule,
    LoadingComponent,
    SelectObjectStyleComponent,
    SelectFillStyleComponent
],
  templateUrl: './easy-pen-style-style.component.html',
  styleUrl: './easy-pen-style-style.component.scss'
})
export class EasyPenStyleStyleComponent extends AbstractPickerComponent<Picker<EasyPenStyle>, EasyPenStyle> implements AfterViewInit {

  @Input({required: true}) public picker?: Picker<EasyPenStyle>;

  
  public easyStrokeStylePicker?: Picker<EasyStrokeStyle>;
  public objectStylePicker?: Picker<ObjectStyle>;
  public fillStylePicker?: Picker<FillStyle>;
  
  ngAfterViewInit() {
    setTimeout(() => { // TODO: doesn't load
      this.easyStrokeStylePicker = new Picker<EasyStrokeStyle>(() => this.picker?.value?.strokeStyle, (style?: EasyStrokeStyle) => {
        if (style && this.picker !== undefined && this.picker.value !== undefined) {
          this.picker.value.strokeStyle = style;
          this.picker.triggerChange();
        }
      }, true, () => this.picker?.isDisabled() ?? false);
      this.easyStrokeStylePicker.onValueChanged.addListener(() => {
        this.onChange();
      })
      
      this.objectStylePicker = new Picker<ObjectStyle>(() => this.picker?.value?.objectStyle, (style?: ObjectStyle) => {
        if (style && this.picker !== undefined && this.picker.value !== undefined) {
          this.picker.value.objectStyle = style;
          this.picker.triggerChange();
        }
      }, true, () => this.picker?.isDisabled() ?? false);
      this.objectStylePicker.onValueChanged.addListener(() => {
        this.onChange();
      })
      
      this.fillStylePicker = new Picker<FillStyle>(() => this.picker?.value?.fillStyle, (style?: FillStyle) => {
        if (style && this.picker !== undefined && this.picker.value !== undefined) {
          this.picker.value.fillStyle = style;
          this.picker.triggerChange();
        }
      }, true, () => this.picker?.isDisabled() ?? false);
      this.fillStylePicker.onValueChanged.addListener(() => {
        this.onChange();
      })
    }, 0);
  }

}
