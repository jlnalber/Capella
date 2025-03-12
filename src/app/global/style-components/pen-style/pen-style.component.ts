import { Component, Input, AfterViewInit } from '@angular/core';
import AbstractPickerComponent from '../abstractPickerComponent';
import Picker from '../pickers/picker';
import { DEFAULT_MAX_PEN_SIZE, DEFAULT_MIN_PEN_SIZE, EasyPenColorStyle, EasyPenStyle, getCopyOfPen, getPenStyleOfPen, Pen } from 'src/app/whiteboard/global/interfaces/penStyle';
import { StringInputComponent } from '../string-input/string-input.component';
import { EasyPenStyleStyleComponent } from "../easy-pen-style-style/easy-pen-style-style.component";
import { ColorPickerComponent } from "../color-picker/color-picker.component";
import { PenIcon } from '../../interfaces/icon';
import { IconPickerComponent } from "../icon-picker/icon-picker.component";
import { SliderInputComponent } from '../slider-input/slider-input.component';
import { EasyPenColorStyleComponent } from "../easy-pen-color-style/easy-pen-color-style.component";
import ColorPicker from '../pickers/colorPicker';
import { WhiteboardService } from 'src/app/whiteboard/services/whiteboard.service';
import { Color } from '../../interfaces/color';
import { PX_PER_MM } from 'src/app/whiteboard/services/page';
import { PreviewCanvasComponent, PreviewCanvasData } from "../../canvas/preview-canvas/preview-canvas.component";
import AbstractRenderingContext from '../../classes/renderingContext/abstractRenderingContext';
import { Event } from '../../essentials/event';
import PenElement from 'src/app/whiteboard/global/classes/canvas-elements/penElement';
import StringInputPicker from '../pickers/stringInputPicker';
import SliderInputPicker from '../pickers/sliderInputPicker';
import { LoadingComponent } from "../../loading/loading.component";

@Component({
  selector: 'app-pen-style',
  standalone: true,
  imports: [
    StringInputComponent,
    EasyPenStyleStyleComponent,
    ColorPickerComponent,
    IconPickerComponent,
    SliderInputComponent,
    EasyPenColorStyleComponent,
    PreviewCanvasComponent,
    LoadingComponent
],
  templateUrl: './pen-style.component.html',
  styleUrl: './pen-style.component.scss'
})
export class PenStyleComponent extends AbstractPickerComponent<Picker<Pen>, Pen> implements AfterViewInit {
  @Input({required: true}) public set picker(val: Picker<Pen> | undefined) {
    this._picker = val;
    this._picker?.onValueChanged.addListener(this._redrawListener)
  }
  public get picker(): Picker<Pen> | undefined {
    return this._picker;
  }
  private _picker?: Picker<Pen>;
  
  private _redrawListener = () => {
    this.redrawEvent.emit();
  }

  public namePicker?: StringInputPicker;
  public iconPicker?: Picker<PenIcon>;
  public sliderInputPicker?: SliderInputPicker;
  public colorPicker?: ColorPicker;
  public easyPenColorStylePicker?: Picker<EasyPenColorStyle>;
  public easyPenStylePicker?: Picker<EasyPenStyle>;

  constructor(private readonly whiteboardService: WhiteboardService) {
    super();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {

      this.namePicker = new StringInputPicker(() => this.picker?.value?.name ?? '', (t?: string) => { if (t && this.picker?.value) this.picker.value.name = t }, 'Name', true);
      this.iconPicker = new Picker<PenIcon>(() => this.picker?.value?.icon, (t?: PenIcon) => { if (t && this.picker?.value) this.picker.value.icon = t }, true);
      // TODO: global max and min (settings)
      this.sliderInputPicker = new SliderInputPicker(() => this.picker?.value?.lineWidth,
                        (t?: number) => { if (t && this.picker?.value) this.picker.value.lineWidth = t },
                        DEFAULT_MIN_PEN_SIZE, 
                        DEFAULT_MAX_PEN_SIZE, 
                        (n: number | undefined) => `${Math.round((n ?? 0) / PX_PER_MM * 100) / 100} mm`,
                        'Stiftgröße:',
                        true);
      this.sliderInputPicker.onValueChanged.addListener(this._redrawListener);
      // TODO: disable color picker when needed
      this.colorPicker = new ColorPicker(this.whiteboardService.settings.getColors(), () => this.picker?.value?.color, (t?: Color) => { if (t && this.picker?.value) this.picker.value.color = t }, () => false, true);
      this.colorPicker.onValueChanged.addListener(this._redrawListener);
      this.easyPenColorStylePicker = new Picker<EasyPenColorStyle>(() => this.picker?.value?.colorStyle as EasyPenColorStyle | undefined, (t?: EasyPenColorStyle) => { if (this.picker?.value) this.picker.value.colorStyle = t; }, true);
      this.easyPenColorStylePicker.onValueChanged.addListener(this._redrawListener);
      this.easyPenStylePicker = new Picker<EasyPenStyle>(() => this.picker?.value?.penStyle, (t?: EasyPenStyle) => { if (this.picker?.value && t) this.picker.value.penStyle = t }, true);
      this.easyPenStylePicker.onValueChanged.addListener(this._redrawListener);
    }, 0)
  }

  private readonly redrawEvent: Event<any> = new Event<any>();
  private readonly widthPreviewCanvas = 200;
  private readonly heightPreviewCanvas = 100;
  private readonly marginPreviewCanvas = 20;
  private readonly stepsPreviewCanvas = 20;

  public data: PreviewCanvasData = {
    width: this.widthPreviewCanvas,
    height: this.heightPreviewCanvas,
    redraw: (ctx: AbstractRenderingContext) => {
      if (this.picker) {
        const val = this.picker.value;
        if (val) {
          const style = getPenStyleOfPen(val, this.whiteboardService.settings.getPens())
          console.log(style, val, this.whiteboardService.settings.getPens()); // TODO: why is it of the wrong pen
          const penElement = new PenElement(this.whiteboardService.settings, style);

          const funcX = (i: number) => i / (this.stepsPreviewCanvas - 1) * (this.widthPreviewCanvas - 2 * this.marginPreviewCanvas) + this.marginPreviewCanvas;
          const funcY = (i: number) => -(Math.sin(2 * Math.PI / (this.stepsPreviewCanvas - 1) * i) * (this.heightPreviewCanvas / 2 - this.marginPreviewCanvas) + this.heightPreviewCanvas / 2);
          const funcP = (i: number) => Math.sin(2 * Math.PI / (this.stepsPreviewCanvas - 1) * i) ** 2

          for (let i = 0; i < this.stepsPreviewCanvas; i++) {

            penElement.addPoint({
              x: funcX(i),
              y: funcY(i),
              p: funcP(i),
              t: 0
            });
          }

          penElement.draw(ctx);
        }
      }
    },
    redrawEvent: this.redrawEvent
  }
}
