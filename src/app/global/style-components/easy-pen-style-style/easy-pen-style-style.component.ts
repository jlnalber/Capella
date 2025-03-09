import { AfterViewChecked, AfterViewInit, Component, Input } from '@angular/core';
import Picker from '../pickers/picker';
import { EasyPenStyle } from 'src/app/whiteboard/global/interfaces/penStyle';
import AbstractPickerComponent from '../abstractPickerComponent';
import { EasyStrokeStyleComponent } from "../easy-stroke-style/easy-stroke-style.component";
import { EasyStrokeStyle } from '../../interfaces/canvasStyles/strokeStyle';
import { ObjectStyleComponent } from "../object-style/object-style.component";
import ObjectStyle from '../../interfaces/canvasStyles/objectStyle';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-easy-pen-style-style',
  standalone: true,
  imports: [
    EasyStrokeStyleComponent,
    ObjectStyleComponent,
    FormsModule
  ],
  templateUrl: './easy-pen-style-style.component.html',
  styleUrl: './easy-pen-style-style.component.scss'
})
export class EasyPenStyleStyleComponent extends AbstractPickerComponent<Picker<EasyPenStyle>, EasyPenStyle> implements AfterViewInit {

  @Input({required: true}) public picker?: Picker<EasyPenStyle>;

  
  public easyStrokeStylePicker?: Picker<EasyStrokeStyle>;
  public objectStylePicker?: Picker<ObjectStyle>;
  
  ngAfterViewInit() {
    setTimeout(() => {
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
    }, 0);
  }

}
