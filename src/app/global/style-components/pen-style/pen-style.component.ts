import { Component, Input, AfterViewInit } from '@angular/core';
import AbstractPickerComponent from '../abstractPickerComponent';
import Picker from '../pickers/picker';
import { DEFAULT_MAX_PEN_SIZE, DEFAULT_MIN_PEN_SIZE, EasyPenColorStyle, EasyPenStyle, Pen } from 'src/app/whiteboard/global/interfaces/penStyle';
import { StringInputComponent } from '../string-input/string-input.component';
import StringInputPicker from '../string-input/stringInputPicker';
import { EasyPenStyleStyleComponent } from "../easy-pen-style-style/easy-pen-style-style.component";
import { ColorPickerComponent } from "../color-picker/color-picker.component";
import { Icon } from '../../interfaces/icon';
import { IconPickerComponent } from "../icon-picker/icon-picker.component";
import SliderInputPicker from '../slider-input/sliderInputPicker';
import { SliderInputComponent } from '../slider-input/slider-input.component';
import { EasyPenColorStyleComponent } from "../easy-pen-color-style/easy-pen-color-style.component";
import ColorPicker from '../pickers/colorPicker';
import { WhiteboardService } from 'src/app/whiteboard/services/whiteboard.service';
import { Color } from '../../interfaces/color';
import { PX_PER_MM } from 'src/app/whiteboard/services/page';

@Component({
  selector: 'app-pen-style',
  standalone: true,
  imports: [
    StringInputComponent,
    EasyPenStyleStyleComponent,
    ColorPickerComponent,
    IconPickerComponent,
    SliderInputComponent,
    EasyPenColorStyleComponent
],
  templateUrl: './pen-style.component.html',
  styleUrl: './pen-style.component.scss'
})
export class PenStyleComponent extends AbstractPickerComponent<Picker<Pen>, Pen> implements AfterViewInit {
  @Input({required: true}) public picker?: Picker<Pen>;

  public namePicker?: StringInputPicker;
  public iconPicker?: Picker<Icon>;
  public sliderInputPicker?: SliderInputPicker;
  public colorPicker?: ColorPicker;
  public easyPenColorStylePicker?: Picker<EasyPenColorStyle>;
  public easyPenStylePicker?: Picker<EasyPenStyle>;

  constructor(private readonly whiteboardService: WhiteboardService) {
    super();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.namePicker = new StringInputPicker(() => this.picker?.value?.name ?? '', (t: string) => { if (this.picker?.value) this.picker.value.name = t }, 'Name', true);
      this.iconPicker = new Picker<Icon>(() => this.picker?.value?.icon, (t: Icon) => { if (this.picker?.value) this.picker.value.icon = t }, true);
      // TODO: global max and min (settings)
      this.sliderInputPicker = new SliderInputPicker(() => this.picker?.value?.lineWidth,
                        (t: number) => { if (this.picker?.value) this.picker.value.lineWidth = t },
                        DEFAULT_MIN_PEN_SIZE, 
                        DEFAULT_MAX_PEN_SIZE, 
                        (n: number | undefined) => `${Math.round((n ?? 0) / PX_PER_MM * 100) / 100} mm`,
                        'Stiftgröße:',
                        true);
      // TODO: disable color picker when needed
      this.colorPicker = new ColorPicker(this.whiteboardService.settings.getColors(), () => this.picker?.value?.color, (t: Color) => { if (this.picker?.value) this.picker.value.color = t }, () => false, true);
      this.easyPenColorStylePicker = new Picker<EasyPenColorStyle>(() => this.picker?.value?.colorStyle as EasyPenColorStyle | undefined, (t: EasyPenColorStyle) => { if (this.picker?.value) this.picker.value.colorStyle = t }, true);
      this.easyPenStylePicker = new Picker<EasyPenStyle>(() => this.picker?.value?.penStyle, (t: EasyPenStyle) => { if (this.picker?.value) this.picker.value.penStyle = t }, true);
    }, 0)
  }
}
